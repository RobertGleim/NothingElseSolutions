import { Routes, Route } from 'react-router-dom'
// Stripe removed — no client-side payment integration
import { SpeedInsights } from '@vercel/speed-insights/react'

// Layouts
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'

// Public Pages
import Home from './pages/Home'
import Contact from './pages/Contact'
import About from './pages/About'
import CustomInquiry from './pages/CustomInquiry'
import Privacy from './pages/Privacy'
import FAQ from './pages/FAQ'
import Terms from './pages/Terms'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import AdminLogin from './pages/auth/AdminLogin'

// Member Pages
import MemberDashboard from './pages/member/Dashboard'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminAddProduct from './pages/admin/AddProduct'
import AdminEditProduct from './pages/admin/EditProduct'
import AdminOrders from './pages/admin/Orders'
import AdminAnalytics from './pages/admin/Analytics'
import AdminSocialPost from './pages/admin/SocialPost'
import AdminPromos from './pages/admin/Promos'
import AdminSettings from './pages/admin/Settings'
import AdminContacts from './pages/admin/Contacts'

// Protected Route Components
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          {/* FUTURE VERSION - Products & Shop */}
          {/* <Route path="products" element={<DigitalProducts />} />
          <Route path="products/:category" element={<DigitalProducts />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="digital" element={<DigitalProducts />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="wishlist/shared/:shareId" element={<SharedWishlist />} /> */}
          <Route path="contact" element={<Contact />} />
          <Route path="about" element={<About />} />
          <Route path="inquiry" element={<CustomInquiry />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="terms" element={<Terms />} />
          
          {/* Auth Routes */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          
          {/* Member Routes */}
          <Route path="member" element={<ProtectedRoute />}>
            <Route path="dashboard" element={<MemberDashboard />} />
            {/* FUTURE VERSION - Orders & Wishlist */}
            {/* <Route path="orders" element={<OrderHistory />} />
            <Route path="wishlist" element={<Wishlist />} /> */}
          </Route>
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/add" element={<AdminAddProduct />} />
          <Route path="products/edit/:id" element={<AdminEditProduct />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="promos" element={<AdminPromos />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="social-post" element={<AdminSocialPost />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
      <SpeedInsights />
    </>
  )
}

export default App
