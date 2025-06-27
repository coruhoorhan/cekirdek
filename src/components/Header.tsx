import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiPhone, FiMenu, FiX } from 'react-icons/fi'
import { motion } from 'framer-motion'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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
              <h1 className="text-xs md:text-sm font-bold text-gray-800">
                Çekirdek Anaokulu Gündüz Bakımevi
              </h1>
              <p className="text-xs md:text-sm text-green-600 font-medium">
                🌻 Çocuk merak ettiğinde, keşif doğar.
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

          {/* CTA Button & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:block bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
            >
              Ön Kayıt
            </motion.button>
            
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
              <div className="pt-4 border-t border-green-100">
                <div className="flex items-center justify-center space-x-2 text-green-600 mb-3">
                  <FiPhone className="w-4 h-4" />
                  <span className="font-medium">0532 123 45 67</span>
                </div>
                <button className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-3 rounded-lg font-bold shadow-lg">
                  Ön Kayıt
                </button>
              </div>
            </div>
          </motion.nav>
        )}
      </div>
    </header>
  )
}

export default Header
