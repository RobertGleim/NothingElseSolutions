import { Routes, Route } from 'react-router-dom'
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
import BoroughlinePrivacyPolicy from './pages/BoroughlinePrivacyPolicy'
import FAQ from './pages/FAQ'
import Terms from './pages/Terms'

// Auth Pages
import AdminLogin from './pages/auth/AdminLogin'

// Admin Pages
import AdminSocialPost from './pages/admin/SocialPost'
import AdminSettings from './pages/admin/Settings'
import AdminContacts from './pages/admin/Contacts'

// Protected Route Components
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
          <Route path="contact" element={<Contact />} />
          <Route path="about" element={<About />} />
          <Route path="inquiry" element={<CustomInquiry />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="boroughline/privacy-policy" element={<BoroughlinePrivacyPolicy />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="terms" element={<Terms />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminContacts />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="social-post" element={<AdminSocialPost />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
      <SpeedInsights />
    </>
  )
}

export default App
