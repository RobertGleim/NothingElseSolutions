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
VITE_WEB3FORMS_KEY=your_web3forms_access_key
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

### Post-Deployment Checklist
- [ ] Update `VITE_API_URL` in Vercel to point to your Render backend URL
- [ ] Add your Vercel frontend URL to CORS allowed origins in backend
- [ ] Test Stripe webhook endpoints
- [ ] Verify all API endpoints are working

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
- The Web3Forms access key should be set in Vercel as `VITE_WEB3FORMS_KEY` and not committed to the repository. If the key was previously committed, rotate the key in Web3Forms immediately and remove it from the git history.
- Ensure `SECRET_KEY` and `JWT_SECRET_KEY` are set in production; the backend will refuse to start if these are missing.

## 📧 Contact
nothingelsestore@nothingelsesolutions.com
