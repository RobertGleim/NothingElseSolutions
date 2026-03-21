from flask import Blueprint, request, jsonify
import json
import os

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
        return float(os.getenv('TAX_RATE', 0)) / 100.0
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
    """Calculate tax based on subtotal and US state code.

    Request JSON: { subtotal: number, state: 'CA' }
    Response JSON: { tax: number, rate: 0.0825 }
    """
    data = request.get_json() or {}
    try:
        subtotal = float(data.get('subtotal', 0) or 0)
    except Exception:
        subtotal = 0.0

    state = (data.get('state') or data.get('stateCode') or '')
    rate = get_rate_for_state(state)
    tax_amount = round(subtotal * rate, 2)

    return jsonify({
        'tax': tax_amount,
        'rate': rate
    })
