from flask import Blueprint, request, jsonify
import json
from flask import Blueprint, request, jsonify
import json
import os
import requests

tax_bp = Blueprint('tax', __name__)

# Load local tax rates (fallback)
TAX_RATES_PATH = os.path.join(os.path.dirname(__file__), '..', 'tax_rates.json')
try:
    with open(TAX_RATES_PATH, 'r', encoding='utf-8') as f:
        TAX_RATES = json.load(f)
except Exception:
    TAX_RATES = {}


def get_rate_for_state(state_code: str) -> float:
    if not state_code:
        try:
            return float(os.getenv('TAX_RATE', 0)) / 100.0
        except Exception:
            return 0.0
    rate = TAX_RATES.get(state_code.upper())
    if rate is None:
        # fallback to env TAX_RATE (stored as percent, e.g., 8.25)
        try:
            return float(os.getenv('TAX_RATE', 0)) / 100.0
        except Exception:
            return 0.0
    return float(rate)


@tax_bp.route('/calculate', methods=['POST'])
def calculate_tax():
    """Calculate tax.

    Accepts JSON body with any of:
      - subtotal: number (dollars)
      - items: [{ price: number, quantity: int, reference?: str }, ...]
      - state or stateCode: 'WA'
      - shipping_cost: number (dollars)
      - shipping_tax_code: string (e.g. 'txcd_92010001')
      - shipping_rate: string (shipping_rate id to reference existing rate)
      - shippingAddress: { line1, city, state, postal_code, country }
      - shippingTaxable: bool (fallback behaviour)

    Behavior:
      - If `STRIPE_SECRET_KEY` is set, call Stripe Tax Calculations API and return its result.
      - Otherwise, fallback to local per-state rate and (optionally) include shipping in taxable base.
    """
    data = request.get_json() or {}

    # Basic numeric parsing
    try:
        subtotal = float(data.get('subtotal', 0) or 0)
    except Exception:
        subtotal = 0.0

    try:
        shipping = float(data.get('shipping_cost', data.get('shipping', 0) or 0) or 0)
    except Exception:
        shipping = 0.0

    state = (data.get('state') or data.get('stateCode') or '')
    shipping_taxable = bool(data.get('shippingTaxable', True))

    # If Stripe key configured, prefer Stripe Tax Calculations API for accuracy (includes shipping)
    stripe_key = os.getenv('STRIPE_SECRET_KEY')
    if stripe_key:
        try:
            payload = {'currency': 'usd'}

            # Build line_items for Stripe call. Prefer explicit items array if provided.
            items = data.get('items') or []
            if items and isinstance(items, list):
                for idx, it in enumerate(items):
                    try:
                        unit = float(it.get('price') or it.get('salePrice') or 0) or 0
                        qty = int(it.get('quantity', 1) or 1)
                    except Exception:
                        unit = 0
                        qty = 1
                    # Stripe expects amount per line item (cents)
                    payload[f'line_items[{idx}][amount]'] = str(int(round(unit * qty * 100)))
                    # Reference or description
                    ref = it.get('reference') or it.get('id') or it.get('name') or f'item{idx+1}'
                    payload[f'line_items[{idx}][reference]'] = str(ref)
            else:
                # Single-line subtotal fallback
                payload['line_items[0][amount]'] = str(int(round(subtotal * 100)))
                payload['line_items[0][reference]'] = 'subtotal'

            # Customer/shipping address
            addr = data.get('shippingAddress') or data.get('customer_details') or {}
            if addr:
                if addr.get('line1'):
                    payload['customer_details[address][line1]'] = addr.get('line1')
                if addr.get('city'):
                    payload['customer_details[address][city]'] = addr.get('city')
                if addr.get('state'):
                    payload['customer_details[address][state]'] = addr.get('state')
                if addr.get('postal_code'):
                    payload['customer_details[address][postal_code]'] = addr.get('postal_code')
                if addr.get('country'):
                    payload['customer_details[address][country]'] = addr.get('country')
                # Indicate the address source is shipping for correct tax treatment
                payload['customer_details[address_source]'] = 'shipping'

            # Shipping cost support: either a ShippingRate id or an explicit amount (+ optional tax code)
            shipping_rate = data.get('shipping_rate') or data.get('shippingRate') or data.get('shippingRateId') or data.get('shipping_rate_id')
            shipping_tax_code = data.get('shipping_tax_code') or data.get('shippingTaxCode') or data.get('shipping_tax_code')
            if shipping_rate:
                payload['shipping_cost[shipping_rate]'] = shipping_rate
            elif shipping > 0:
                payload['shipping_cost[amount]'] = str(int(round(shipping * 100)))
                if shipping_tax_code:
                    payload['shipping_cost[tax_code]'] = shipping_tax_code

            # Call Stripe Tax Calculations endpoint directly using HTTP (avoids SDK compatibility issues)
            resp = requests.post(
                'https://api.stripe.com/v1/tax/calculations',
                auth=(stripe_key, ''),
                data=payload,
                timeout=10
            )
            resp.raise_for_status()
            return jsonify(resp.json())
        except Exception as e:
            # If Stripe call fails, fall through to local fallback but include error details
            print('Stripe tax calculation error:', e)

    # Local fallback: simple per-state rate applied to subtotal (+ shipping if taxable)
    rate = get_rate_for_state(state)
    taxable_base = subtotal + (shipping if shipping_taxable else 0)
    tax_amount = round(taxable_base * rate, 2)

    return jsonify({
        'tax': tax_amount,
        'rate': rate,
        'taxable_base': taxable_base,
        'note': 'fallback-rate' if not stripe_key else 'stripe-failed-fallback'
    })
