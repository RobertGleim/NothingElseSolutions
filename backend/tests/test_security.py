"""Security regression checks. Run: python backend/tests/test_security.py"""
import os
import sys

# Set before importing app; load_dotenv won't override these
os.environ.update({'DATABASE_URL': 'sqlite://', 'ADMIN_EMAIL': 'admin@test.local',
                   'ADMIN_PASSWORD': 'correct-horse', 'STRIPE_WEBHOOK_SECRET': ''})
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from app import app  # noqa: E402


def demo():
    c = app.test_client()
    # Contact submissions are admin-only
    for method in ('get', 'put', 'delete'):
        path = '/api/contact/' if method == 'get' else '/api/contact/1'
        assert getattr(c, method)(path).status_code == 401, method
    # Wrong or empty credentials are rejected
    for creds in ({'email': 'admin@test.local', 'password': 'wrong'}, {'email': '', 'password': ''}):
        assert c.post('/api/auth/admin/login', json=creds).status_code == 401
    r = c.post('/api/auth/admin/login', json={'email': 'admin@test.local', 'password': 'correct-horse'})
    assert r.status_code == 200
    token = r.get_json()['token']
    assert c.get('/api/contact/', headers={'Authorization': f'Bearer {token}'}).status_code == 200
    # Unsigned Stripe events are rejected
    assert c.post('/api/webhooks/stripe', json={'type': 'payment_intent.succeeded'}).status_code == 503
    # Client-priced Stripe endpoints are gone
    assert c.post('/api/orders/create-checkout-session', json={}).status_code in (404, 405)
    assert c.post('/api/orders/create-payment-intent', json={}).status_code in (404, 405)
    print('security checks passed')


if __name__ == '__main__':
    demo()
