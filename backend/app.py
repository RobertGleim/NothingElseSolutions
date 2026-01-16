from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 3600))

# Initialize extensions
# CORS configuration for production
allowed_origins = [
    os.getenv('FRONTEND_URL', 'http://localhost:3000'),
    'http://localhost:5173',
    'http://localhost:3000',
]
# Add Vercel preview URLs support
if os.getenv('VERCEL_PREVIEW_URL'):
    allowed_origins.append(os.getenv('VERCEL_PREVIEW_URL'))
cors = CORS(app, origins=allowed_origins, supports_credentials=True)
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

# Import routes
from routes.auth import auth_bp
from routes.products import products_bp
from routes.orders import orders_bp
from routes.admin import admin_bp
from routes.webhooks import webhooks_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(products_bp, url_prefix='/api/products')
app.register_blueprint(orders_bp, url_prefix='/api/orders')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(webhooks_bp, url_prefix='/api/webhooks')

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
