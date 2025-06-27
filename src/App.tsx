import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from './contexts/AuthContext'; // AuthProvider import edildi
import Home from './pages/Home';
import About from './pages/About';
import Education from './pages/Education';
import Teachers from './pages/Teachers';
import Gallery from './pages/Gallery';
import News from './pages/News';
import Contact from './pages/Contact';
import './App.css';

// Auth pages
import LoginPage from './pages/auth/LoginPage'; // Yeni yol
import SignUpPage from './pages/auth/SignUpPage'; // Yeni sayfa

// Admin components
import AdminLayout from './components/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import HomePageSettings from './pages/admin/HomePageSettings'; // HomePageSettings import edildi
import AboutPageSettings from './pages/admin/AboutPageSettings'; // AboutPageSettings import edildi
import EducationPageSettings from './pages/admin/EducationPageSettings';
import GalleryPageSettings from './pages/admin/GalleryPageSettings';
import NewsPageSettings from './pages/admin/NewsPageSettings';
import TeachersPageSettings from './pages/admin/TeachersPageSettings';
import ContactPageSettings from './pages/admin/ContactPageSettings';

// Artık gerçek component'ler kullanıldığı için eski placeholder tanımlarına gerek yok.

// Site Layout (Header ve Footer'ı içerir)
const SiteLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
    <Header />
    <main>{children}</main>
    <Footer />
  </div>
);

import ProtectedRoute from './components/auth/ProtectedRoute';
import { Navigate } from 'react-router-dom';

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

        {/* Admin Routes - Protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
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
