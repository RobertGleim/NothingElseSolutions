"""Security regression checks. Run: python backend/tests/test_security.py"""
import os
import sys

# Set before importing app; load_dotenv won't override these
os.environ.update({'DATABASE_URL': 'sqlite://', 'ADMIN_EMAIL': 'admin@test.local',
                   'ADMIN_PASSWORD': 'correct-horse'})
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
    # Shop endpoints are gone
    for path in ('/api/webhooks/stripe', '/api/orders/create-checkout-session', '/api/products/', '/api/auth/register', '/api/auth/login', '/api/tax/calculate'):
        assert c.post(path, json={}).status_code in (404, 405), path
    # Newsletter validates email
    assert c.post('/api/webhooks/newsletter', json={'email': 'not-an-email'}).status_code == 400

    # Contact spam filter: bots get a fake 201 but nothing is saved
    import routes.contact as contact
    contact.send_contact_email = contact.send_contact_webhook = lambda *a, **k: False
    auth = {'Authorization': f'Bearer {token}'}
    count = lambda: c.get('/api/contact/', headers=auth).get_json()['total']
    form = {'name': 'Jo', 'email': 'jo@example.com', 'subject': 'Hi', 'message': 'Hello'}
    for bot in ({**form, 'elapsed_ms': 9000, 'nickname': 'x'}, {**form, 'elapsed_ms': 500}, form):
        assert c.post('/api/contact/', json=bot).status_code == 201
    assert count() == 0
    assert c.post('/api/contact/', json={**form, 'elapsed_ms': 9000, 'nickname': ''}).status_code == 201
    assert count() == 1
    print('security checks passed')


if __name__ == '__main__':
    demo()
