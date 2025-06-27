import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiPhone, FiMenu, FiX } from 'react-icons/fi'; // Sadece Fi ikonları burada kalacak
import { LogIn, UserPlus, LogOut, User } from 'lucide-react'; // Auth ikonları lucide-react'ten
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext'; // AuthContext import
import { Button } from '@/components/ui/button'; // Shadcn Button

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut, loading } = useAuth(); // AuthContext'ten kullanıcı bilgilerini al
  const navigate = useNavigate();
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Anasayfa' },
    { path: '/hakkimizda', label: 'Hakkımızda' },
    { path: '/egitimler', label: 'Eğitimler' },
    { path: '/ogretmenlerimiz', label: 'Öğretmenlerimiz' },
    { path: '/galeri', label: 'Galeri' },
    { path: '/duyurular', label: 'Duyurular' },
    { path: '/iletisim', label: 'İletişim' }
  ]

  const isActivePath = (path: string) => location.pathname === path

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="py-2 border-b border-green-100 hidden md:block">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4 text-gray-600">
              <span>🌱 Doğa ile iç içe eğitim</span>
              <span>📚 Seçkin eğitim kadrosu</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-green-600">
                <FiPhone className="w-4 h-4" />
                <span className="font-medium">0532 123 45 67</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:shadow-md transition-all"
              >
                WhatsApp İletişim
              </motion.button>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/logo.jpg" 
              alt="Çekirdek Anaokulu" 
              className="w-12 h-12 md:w-16 md:h-16 rounded-full shadow-md"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                Çekirdek Anaokulu
              </h1>
              <p className="text-xs md:text-sm text-green-600 font-medium">
                Seçkin Eğitimle Büyüyoruz
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3 py-2 rounded-lg transition-all duration-300 font-medium ${
                  isActivePath(item.path)
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                {item.label}
                {isActivePath(item.path) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-green-500"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA Button, Auth Links & Mobile Menu */}
          <div className="flex items-center space-x-3">
            {!loading && user ? (
              <div className="hidden lg:flex items-center space-x-3">
                <span className="text-sm text-gray-700 flex items-center">
                  <User className="w-4 h-4 mr-1 text-green-600" />
                  {profile?.name || user.email}
                </span>
                <Button variant="outline" size="sm" onClick={async () => {
                  await signOut();
                  navigate('/'); // Anasayfaya yönlendir
                }}>
                  <LogOut className="w-4 h-4 mr-1" />
                  Çıkış Yap
                </Button>
              </div>
            ) : !loading ? (
              <div className="hidden lg:flex items-center space-x-3">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/login">
                    <LogIn className="w-4 h-4 mr-1" />
                    Giriş Yap
                  </Link>
                </Button>
                <Button size="sm" asChild className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
                  <Link to="/kayit-ol">
                    <UserPlus className="w-4 h-4 mr-1" />
                    Kayıt Ol
                  </Link>
                </Button>
              </div>
            ) : null}
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
            >
              {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-green-100 py-4"
          >
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                    isActivePath(item.path)
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 mt-2 border-t border-green-100 space-y-3">
                {!loading && user ? (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-700">
                      Merhaba, {profile?.name || user.email}
                    </div>
                    <Button variant="outline" className="w-full" onClick={async () => {
                      await signOut();
                      setIsMenuOpen(false);
                      navigate('/');
                    }}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Çıkış Yap
                    </Button>
                  </>
                ) : !loading ? (
                  <>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                        <LogIn className="w-4 h-4 mr-2" />
                        Giriş Yap
                      </Link>
                    </Button>
                    <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white" asChild>
                      <Link to="/kayit-ol" onClick={() => setIsMenuOpen(false)}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Kayıt Ol
                      </Link>
                    </Button>
                  </>
                ) : null}
                <div className="pt-4 border-t border-green-100">
                  <div className="flex items-center justify-center space-x-2 text-green-600 mb-3">
                    <FiPhone className="w-4 h-4" />
                    <span className="font-medium">0532 123 45 67</span>
                  </div>
                  {/* Ön Kayıt butonu mobil menüde kalabilir veya kaldırılabilir, auth linkleri daha öncelikli. */}
                  {/* <button className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-3 rounded-lg font-bold shadow-lg">
                    Ön Kayıt
                  </button> */}
                </div>
              </div>
            </div>
          </motion.nav>
        )}
      </div>
    </header>
  )
}

export default Header
