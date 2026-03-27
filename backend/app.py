from flask import Flask, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configuration
secret_key = os.getenv('SECRET_KEY')
jwt_secret = os.getenv('JWT_SECRET_KEY')
# In production require explicit secrets
if os.getenv('FLASK_ENV') == 'production' and (not secret_key or not jwt_secret):
    raise RuntimeError('SECRET_KEY and JWT_SECRET_KEY must be set in production')

app.config['SECRET_KEY'] = secret_key or 'dev-secret-key'
app.config['JWT_SECRET_KEY'] = jwt_secret or 'jwt-secret-key'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 3600))

# Database configuration - use SQLite for simplicity, stores in persistent disk on Render
database_url = os.getenv('DATABASE_URL')
if not database_url:
    # Default to SQLite - use relative path that works on both Windows and Linux
    database_url = 'sqlite:///contacts.db'
app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
# CORS configuration for production
allowed_origins = [
    os.getenv('FRONTEND_URL', 'http://localhost:3000'),
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3001',
    'https://nothing-else-solutions.vercel.app',
    'https://nothingelsesolutions.com',
    'https://www.nothingelsesolutions.com',
]
# Add any Vercel preview URLs (they use different subdomains)
frontend_url = os.getenv('FRONTEND_URL', '')
if frontend_url and frontend_url not in allowed_origins:
    allowed_origins.append(frontend_url)

cors = CORS(app, resources={r"/api/*": {"origins": allowed_origins}}, supports_credentials=False,
            methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allow_headers=["Content-Type", "Authorization", "X-Requested-With"])

# Rate limiting
# Provide `app=` as a keyword to avoid multiple-values error with some flask-limiter versions
limiter = Limiter(key_func=get_remote_address, app=app, default_limits=["60 per minute"])
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

# Initialize database
from models import db, Contact
db.init_app(app)

# Create tables on startup
with app.app_context():
    db.create_all()
    print("[DB] Database tables created/verified")

# Import routes
try:
    from routes.auth import auth_bp
    print("[ROUTES] auth loaded")
    from routes.products import products_bp
    print("[ROUTES] products loaded")
    from routes.orders import orders_bp
    print("[ROUTES] orders loaded")
    from routes.admin import admin_bp
    print("[ROUTES] admin loaded")
    from routes.webhooks import webhooks_bp
    print("[ROUTES] webhooks loaded")
    from routes.contact import contact_bp
    print("[ROUTES] contact loaded")
    from routes.tax import tax_bp
    print("[ROUTES] tax loaded")
except Exception as e:
    print(f"[ROUTES ERROR] Failed to import routes: {e}")
    import traceback
    traceback.print_exc()

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(products_bp, url_prefix='/api/products')
app.register_blueprint(orders_bp, url_prefix='/api/orders')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(webhooks_bp, url_prefix='/api/webhooks')
app.register_blueprint(contact_bp, url_prefix='/api/contact')
app.register_blueprint(tax_bp, url_prefix='/api/tax')
print("[ROUTES] All blueprints registered")

# Apply rate limit to contact submit endpoint to avoid importing limiter from routes (prevents circular import)
try:
    # view function key is '<blueprint_name>.<function_name>'
    submit_fn = app.view_functions.get('contact.submit_contact')
    if submit_fn:
        limiter.limit("10 per minute")(submit_fn)
except Exception as _:
    pass

# Note: after_request CORS echo removed to avoid insecure origin reflection.

@app.route('/')
def index():
    return {'message': 'Nothing Else Solutions API', 'version': '1.0.0'}

@app.route('/health')
def health():
    return {'status': 'healthy'}

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV') != 'production'
    app.run(debug=debug, host='0.0.0.0', port=port)
# ....