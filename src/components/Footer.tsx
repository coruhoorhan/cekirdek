import { Link } from 'react-router-dom'
import { FiPhone, FiMail, FiMapPin, FiClock, FiHeart } from 'react-icons/fi'
import { FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-green-800 to-green-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo ve Hakkında */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.jpg" 
                alt="Çekirdek Anaokulu" 
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="text-xl font-bold">Çekirdek Gündüz Bakım Evi</h3>
                <p className="text-green-200 text-sm">🌻 Çocuk merak ettiğinde, keşif doğar.</p>
              </div>
            </div>
            <p className="text-green-100 text-sm leading-relaxed">
              Çocuklarımızın mutlu, sağlıklı ve yaratıcı bireyler olarak yetişmeleri için 
              doğa ile iç içe, sevgi dolu bir eğitim ortamı sunuyoruz.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="bg-green-700 p-2 rounded-full hover:bg-green-600 transition-colors">
                <FaWhatsapp className="w-5 h-5" />
              </a>
              <a href="#" className="bg-green-700 p-2 rounded-full hover:bg-green-600 transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="bg-green-700 p-2 rounded-full hover:bg-green-600 transition-colors">
                <FaFacebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Hızlı Linkler */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-yellow-300">Hızlı Linkler</h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-green-100 hover:text-yellow-300 transition-colors text-sm">
                Anasayfa
              </Link>
              <Link to="/hakkimizda" className="text-green-100 hover:text-yellow-300 transition-colors text-sm">
                Hakkımızda
              </Link>
              <Link to="/egitimler" className="text-green-100 hover:text-yellow-300 transition-colors text-sm">
                Eğitimler
              </Link>
              <Link to="/ogretmenlerimiz" className="text-green-100 hover:text-yellow-300 transition-colors text-sm">
                Öğretmenlerimiz
              </Link>
              <Link to="/galeri" className="text-green-100 hover:text-yellow-300 transition-colors text-sm">
                Galeri
              </Link>
              <Link to="/duyurular" className="text-green-100 hover:text-yellow-300 transition-colors text-sm">
                Duyurular
              </Link>
              <Link to="/iletisim" className="text-green-100 hover:text-yellow-300 transition-colors text-sm">
                İletişim
              </Link>
            </nav>
          </div>

          {/* İletişim Bilgileri */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-yellow-300">İletişim</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FiMapPin className="w-5 h-5 text-yellow-300 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-green-100 text-sm">
                    Merkez Mahallesi, Eğitim Sokak No:15
                  </p>
                  <p className="text-green-100 text-sm">
                    Çankaya/Ankara
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FiPhone className="w-5 h-5 text-yellow-300 flex-shrink-0" />
                <span className="text-green-100 text-sm">0532 123 45 67</span>
              </div>
              <div className="flex items-center space-x-3">
                <FiMail className="w-5 h-5 text-yellow-300 flex-shrink-0" />
                <span className="text-green-100 text-sm">info@cekirdekanokulu.com</span>
              </div>
            </div>
          </div>

          {/* Çalışma Saatleri */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-yellow-300">Çalışma Saatleri</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FiClock className="w-5 h-5 text-yellow-300 mt-0.5 flex-shrink-0" />
                <div className="text-green-100 text-sm">
                  <p className="font-medium">Pazartesi - Cuma</p>
                  <p>07:30 - 18:00</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FiClock className="w-5 h-5 text-yellow-300 mt-0.5 flex-shrink-0" />
                <div className="text-green-100 text-sm">
                  <p className="font-medium">Cumartesi</p>
                  <p>09:00 - 16:00</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FiClock className="w-5 h-5 text-yellow-300 mt-0.5 flex-shrink-0" />
                <div className="text-green-100 text-sm">
                  <p className="font-medium">Pazar</p>
                  <p>Kapalı</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alt Çizgi */}
        <div className="border-t border-green-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-green-200 text-sm text-center md:text-left">
              © 2025 Çekirdek Anaokulu. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center space-x-2 text-green-200 text-sm">
              <span>Sevgiyle yapıldı</span>
              <FiHeart className="w-4 h-4 text-red-400" />
              <span>çocuklarımız için</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
