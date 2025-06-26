import { motion } from 'framer-motion'
import { FiCalendar, FiClock, FiUser, FiChevronRight } from 'react-icons/fi'
import { FaBullhorn, FaNewspaper, FaHeart, FaGraduationCap } from 'react-icons/fa'

const News = () => {
  const newsCategories = [
    { id: 'all', name: 'Tümü', icon: <FaNewspaper /> },
    { id: 'announcements', name: 'Duyurular', icon: <FaBullhorn /> },
    { id: 'events', name: 'Etkinlikler', icon: <FaHeart /> },
    { id: 'education', name: 'Eğitim', icon: <FaGraduationCap /> }
  ]

  const newsItems = [
    {
      id: 1,
      category: 'announcements',
      title: '2025-2026 Eğitim Öğretim Yılı Kayıtları Başladı',
      summary: 'Yeni eğitim öğretim yılı için ön kayıtlarımız başlamıştır. Erken kayıt fırsatlarından yararlanabilirsiniz.',
      content: 'Sevgili velilerimiz, 2025-2026 eğitim öğretim yılı için kayıtlarımız başlamıştır. Erken kayıt yaptıran ailelerimize %15 indirim fırsatı sunmaktayız. Kayıt için gerekli evraklar: Nüfus cüzdanı sureti, sağlık raporu, aşı karnesi ve 2 adet fotoğraf.',
      image: '/images/hero/hero1.jpg',
      date: '2025-01-15',
      time: '09:00',
      author: 'Ayşe Demir'
    },
    {
      id: 2,
      category: 'events',
      title: 'Bahar Şenliği Etkinliği',
      summary: 'Bahar mevsimini karşılamak için düzenlediğimiz şenlikte çocuklarımız eğlenceli aktiviteler yaşayacak.',
      content: 'Bahar mevsiminin gelişini kutlamak için 25 Mart\'ta düzenleyeceğimiz Bahar Şenliğinde çocuklarımız doğa ile iç içe eğlenceli aktiviteler yaşayacaklar. Programa dahil olan etkinlikler: Bahçe temizliği, çiçek dikimi, doğa yürüyüşü ve piknik.',
      image: '/images/hero/hero2.png',
      date: '2025-03-20',
      time: '10:00',
      author: 'Zeynep Kaya'
    },
    {
      id: 3,
      category: 'education',
      title: 'Yeni İngilizce Programımız',
      summary: 'Cambridge sertifikalı yeni İngilizce programımız ile çocuklarımız erken yaşta ikinci dil öğrenecek.',
      content: 'Okulumuzda Cambridge sertifikalı yeni İngilizce programımızı başlatıyoruz. Bu program kapsamında çocuklarımız oyunlar, şarkılar ve dramalar eşliğinde İngilizce öğrenecekler. Program 3 yaş ve üzeri tüm öğrencilerimiz için uygulanacaktır.',
      image: '/images/subjects/english.jpg',
      date: '2025-02-01',
      time: '14:30',
      author: 'Elif Özkan'
    },
    {
      id: 4,
      category: 'announcements',
      title: 'Hijyen ve Güvenlik Önlemlerimiz',
      summary: 'Çocuklarımızın sağlığı için aldığımız hijyen ve güvenlik önlemlerimiz hakkında bilgilendirme.',
      content: 'Çocuklarımızın sağlığını korumak için alınan önlemler: Günlük dezenfektan uygulaması, hava temizleme cihazları, düzenli sağlık kontrolleri ve hijyen eğitimleri. Tüm personelimiz düzenli sağlık kontrolünden geçmektedir.',
      image: '/images/hero/hero3.jpg',
      date: '2025-01-20',
      time: '11:00',
      author: 'Dr. Pınar Akgül'
    },
    {
      id: 5,
      category: 'events',
      title: 'Anneler Günü Özel Programı',
      summary: 'Anneler Günü\'nde sevgili annelerimiz için özel bir program düzenliyoruz.',
      content: 'Anneler Günü\'nde sevgili annelerimizi onurlandırmak için özel bir program düzenliyoruz. Çocuklarımız anneleri için özel şarkılar söyleyecek, dans gösterileri yapacak ve el yapımı hediyeler sunacaklar. Program 14 Mayıs Çarşamba günü saat 10:00\'da başlayacak.',
      image: '/images/subjects/music.jpg',
      date: '2025-05-10',
      time: '10:00',
      author: 'Fatma Yılmaz'
    },
    {
      id: 6,
      category: 'education',
      title: 'Montessori Eğitim Yaklaşımı',
      summary: 'Okulumuzda uygulanan Montessori eğitim yaklaşımı ve faydaları hakkında bilgi.',
      content: 'Montessori eğitim yaklaşımı ile çocuklarımızın bireysel gelişimlerini destekliyoruz. Bu yaklaşım sayesinde çocuklar kendi hızlarında öğrenir, bağımsızlık kazanır ve yaratıcılıklarını geliştirir. Özel hazırlanmış materyallerle çocukların doğal merakları desteklenir.',
      image: '/images/subjects/art.jpg',
      date: '2025-02-15',
      time: '13:00',
      author: 'Ayşe Demir'
    }
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Haberler ve Duyurular
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-green-100"
            >
              Okulumuzdan son haberler ve önemli duyurular
            </motion.p>
          </div>
        </div>
      </section>

      {/* Öne Çıkan Haber */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16"
          >
            Öne Çıkan Haber
          </motion.h2>
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-green-50 to-yellow-50 rounded-2xl overflow-hidden shadow-xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div 
                  className="h-64 lg:h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${newsItems[0].image})` }}
                />
                <div className="p-8 lg:p-12">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      ÖNEMLİ
                    </span>
                    <div className="flex items-center text-gray-600 text-sm">
                      <FiCalendar className="w-4 h-4 mr-1" />
                      {formatDate(newsItems[0].date)}
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    {newsItems[0].title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {newsItems[0].content}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-600 text-sm">
                      <FiUser className="w-4 h-4" />
                      <span>{newsItems[0].author}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-green-600 text-white px-6 py-2 rounded-full font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <span>Devamını Oku</span>
                      <FiChevronRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tüm Haberler */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16"
          >
            Tüm Haberler
          </motion.h2>
          
          {/* Kategori Filtreleri */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {newsCategories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 bg-white px-6 py-3 rounded-full font-medium text-gray-700 hover:bg-green-100 hover:text-green-700 transition-all shadow-md"
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.name}</span>
              </motion.button>
            ))}
          </div>

          {/* Haber Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.slice(1).map((news, index) => (
              <motion.article
                key={news.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div 
                  className="h-48 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${news.image})` }}
                >
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                      news.category === 'announcements' ? 'bg-blue-500' :
                      news.category === 'events' ? 'bg-purple-500' :
                      'bg-green-500'
                    }`}>
                      {newsCategories.find(cat => cat.id === news.category)?.name}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <FiCalendar className="w-4 h-4" />
                      <span>{formatDate(news.date)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiClock className="w-4 h-4" />
                      <span>{news.time}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                    {news.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {news.summary}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-600 text-sm">
                      <FiUser className="w-4 h-4" />
                      <span>{news.author}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center space-x-1"
                    >
                      <span>Devamını Oku</span>
                      <FiChevronRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Kayıt */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-8"
            >
              Haberlerden Haberdar Olun
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-green-100 mb-8"
            >
              Okulumuzdan son haberleri e-posta ile almak için kaydolun
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="E-posta adresinizi girin"
                className="flex-1 px-6 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-8 py-3 rounded-full font-bold transition-colors"
              >
                Kaydol
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default News
