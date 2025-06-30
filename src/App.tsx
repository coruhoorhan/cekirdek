import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { ErrorBoundary } from './components/ErrorBoundary';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import PasswordResetPage from './pages/auth/PasswordResetPage';
import SetPasswordPage from './pages/auth/SetPasswordPage';

// Public pages
import Home from './pages/Home';
import About from './pages/About';
import Education from './pages/Education';
import Gallery from './pages/Gallery';
import News from './pages/News';
import Teachers from './pages/Teachers';
import Contact from './pages/Contact';

// Admin Components
import AdminLayout from './components/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import HomePageSettings from './pages/admin/HomePageSettings';
import AboutPageSettings from './pages/admin/AboutPageSettings';
import EducationPageSettings from './pages/admin/EducationPageSettings';
import GalleryPageSettings from './pages/admin/GalleryPageSettings';
import NewsPageSettings from './pages/admin/NewsPageSettings';
import TeachersPageSettings from './pages/admin/TeachersPageSettings';
import ContactPageSettings from './pages/admin/ContactPageSettings';

// Auth components
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Site Layout (Header ve Footer'ı içerir)
const SiteLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
    <Header />
    <main>{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider> {/* AuthProvider ile tüm uygulamayı sarmala */}
        <Routes>
          {/* Site Routes */}
          <Route
          path="/*"
          element={
            <SiteLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/hakkimizda" element={<About />} />
                <Route path="/egitimler" element={<Education />} />
                <Route path="/ogretmenlerimiz" element={<Teachers />} />
                <Route path="/galeri" element={<Gallery />} />
                <Route path="/duyurular" element={<News />} />
                <Route path="/iletisim" element={<Contact />} />
                {/* Diğer site sayfaları buraya eklenebilir */}
              </Routes>
            </SiteLayout>
          }
        />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/kayit-ol" element={<SignUpPage />} />
        <Route path="/velisifre" element={<SetPasswordPage />} />
        <Route path="/sifremi-unuttum" element={<PasswordResetPage />} />
        <Route path="/sifreyenileme" element={<SetPasswordPage />} />

        {/* Admin Routes - Protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ErrorBoundary>
                <AdminLayout />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} /> {/* /admin için varsayılan */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="home-settings" element={<HomePageSettings />} />
          <Route path="about-settings" element={<AboutPageSettings />} />
          <Route path="education-settings" element={<EducationPageSettings />} />
          <Route path="gallery-settings" element={<GalleryPageSettings />} />
          <Route path="news-settings" element={<NewsPageSettings />} />
          <Route path="teachers-settings" element={<TeachersPageSettings />} />
          <Route path="contact-settings" element={<ContactPageSettings />} />
        </Route>
      </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
