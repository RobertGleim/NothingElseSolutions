# Nothing Else Solutions - E-Commerce Platform

A modern dropshipping e-commerce platform built with React (Frontend) and Flask (Backend).

## 🏗️ Project Structure

```
Nothing else Solutions/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── styles/
│   └── public/
├── backend/           # Flask Python backend
│   ├── app/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── services/
│   │   └── utils/
│   └── tests/
└── assets/           # Shared assets (logo, etc.)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- npm or yarn

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
python run.py
```

## 🔐 Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Backend (.env)
```
FLASK_ENV=development
SECRET_KEY=your_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
N8N_WEBHOOK_URL=your_n8n_webhook_url
CONTACT_EMAIL=nothingelsestore@nothingelsesolutions.com
```

## 🎨 Features

### Customer Features
- Guest checkout
- Member registration & login
- Product browsing & search
- Shopping cart
- Wishlist (shareable)
- Order history
- Product reviews
- Digital product downloads

### Admin Features
- Product management (CRUD)
- Order tracking
- Analytics dashboard
- Social media posting (Facebook, TikTok, Instagram)
- Promo code management
- Multi-admin support

### Integrations
- Stripe payments (sandbox mode)
- n8n automation workflows
- Prepared for: Digital24, Meta APIs, TikTok API

## 📦 Deployment

- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Pinecone

## 🔒 Security
- JWT token authentication
- Auth0 ready (prepared for future integration)
- Environment variable protection
- CORS configuration
- Input validation & sanitization

## 📧 Contact
nothingelsestore@nothingelsesolutions.com
