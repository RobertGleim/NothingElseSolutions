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

Local frontend runs at `http://localhost:3000`.

### Backend Setup
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

Local backend runs at `http://localhost:5000`.

## 🔐 Environment Variables

### Frontend env files
```
frontend/.env.development  -> local dev values
frontend/.env.production   -> production build values
frontend/.env              -> shared non-secret defaults only
```

Recommended values:

```env
# frontend/.env.development
VITE_API_URL=http://localhost:5000/api

# frontend/.env.production
VITE_API_URL=https://nothingelsesolutions.onrender.com/api
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
FRONTEND_URL=http://localhost:3000
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

### Frontend Deployment (Vercel)

1. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "Add New" → "Project"
   - Import your GitHub repository

2. **Configure Build Settings** (auto-detected from vercel.json):
   - Framework Preset: Vite
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `cd frontend && npm install`

3. **Set Environment Variables** in Vercel Dashboard:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
   ```

4. Click **Deploy**!

### Backend Deployment (Render)

1. Go to [render.com](https://render.com) and create a new Web Service
2. Connect your GitHub repository
3. Set the root directory to `backend`
4. Configure environment variables from `backend/.env.example`
5. Deploy!

Recommended Render environment variables:
```
FRONTEND_URL=https://nothing-else-solutions.vercel.app
```

### Post-Deployment Checklist
- [ ] Update `VITE_API_URL` in Vercel to point to your Render backend URL
- [ ] Add your Vercel frontend URL to CORS allowed origins in backend
- [ ] Test Stripe webhook endpoints
- [ ] Verify all API endpoints are working

## Local Tasks

VS Code tasks available in [.vscode/tasks.json](.vscode/tasks.json):
- `dev: frontend`
- `dev: backend`

Use both tasks together for full local testing.

- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Pinecone

## 🔒 Security
- JWT token authentication
- Auth0 ready (prepared for future integration)
- Environment variable protection
- CORS configuration
- Input validation & sanitization
 
Notes and immediate actions:
- Ensure `SECRET_KEY` and `JWT_SECRET_KEY` are set in production; the backend will refuse to start if these are missing.

## 📧 Contact
customerservice@nothingelsesolutions.com
..
