import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'Tümü' },
    { id: 'classroom', name: 'Sınıf Etkinlikleri' },
    { id: 'outdoor', name: 'Bahçe Aktiviteleri' },
    { id: 'art', name: 'Sanat Çalışmaları' },
    { id: 'events', name: 'Özel Etkinlikler' },
    { id: 'facility', name: 'Okul Binası' }
  ]

  const galleryImages = [
    { id: 1, src: '/images/hero/hero1.jpg', category: 'classroom', title: 'Sınıf İçi Etkinlik', description: 'Çocuklarımız sınıfta eğlenceli aktiviteler yapıyor' },
    { id: 2, src: '/images/hero/hero2.png', category: 'outdoor', title: 'Bahçe Zamanı', description: 'Doğa ile iç içe öğrenme deneyimi' },
    { id: 3, src: '/images/hero/hero3.jpg', category: 'facility', title: 'Modern Sınıfımız', description: 'Renkli ve ferah eğitim ortamımız' },
    { id: 4, src: '/images/subjects/art.jpg', category: 'art', title: 'Sanat Atölyesi', description: 'Yaratıcı sanat çalışmalarımız' },
    { id: 5, src: '/images/subjects/music.jpg', category: 'events', title: 'Müzik Etkinliği', description: 'Müzik ve dans gösterilerimiz' },
    { id: 6, src: '/images/subjects/drama.jpg', category: 'events', title: 'Drama Gösterisi', description: 'Çocuklarımızın drama performansları' },
    { id: 7, src: '/images/subjects/ballet.jpg', category: 'events', title: 'Bale Gösterisi', description: 'Zarif bale gösterilerimiz' },
    { id: 8, src: '/images/subjects/gymnastics.jpeg', category: 'outdoor', title: 'Jimnastik', description: 'Fiziksel gelişim aktiviteleri' },
    { id: 9, src: '/images/subjects/chess.jpeg', category: 'classroom', title: 'Satranç Dersi', description: 'Strateji geliştirme oyunları' },
    { id: 10, src: '/images/age-groups/baby.jpg', category: 'classroom', title: 'Bebek Bakımı', description: '0-2 yaş bebek bakım hizmetimiz' },
    { id: 11, src: '/images/age-groups/kindergarten.jpg', category: 'outdoor', title: 'Grup Aktivitesi', description: 'Sosyalleşme etkinliklerimiz' },
    { id: 12, src: '/images/age-groups/preschool.jpg', category: 'classroom', title: 'Anasınıfı', description: 'İlkokula hazırlık çalışmaları' }
  ]

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory)

  const openLightbox = (index: number) => {
    setSelectedImage(index)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % filteredImages.length)
    }
  }

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + filteredImages.length) % filteredImages.length)
    }
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
              Galeri
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-green-100"
            >
              Çocuklarımızın mutlu anlarından kareler
            </motion.p>
          </div>
        </div>
      </section>

      {/* Kategori Filtreleri */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700'
                }`}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Galeri Grid */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                onClick={() => openLightbox(index)}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <div 
                  className="h-64 bg-cover bg-center relative overflow-hidden"
                  style={{ backgroundImage: `url(${image.src})` }}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {image.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {image.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-4xl max-h-full">
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={filteredImages[selectedImage].src}
              alt={filteredImages[selectedImage].title}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
            
            {/* Navigation Buttons */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <FiChevronRight className="w-6 h-6" />
            </button>
            
            {/* Image Info */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm text-white p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">
                {filteredImages[selectedImage].title}
              </h3>
              <p className="text-gray-200">
                {filteredImages[selectedImage].description}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Video Bölümü */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16"
          >
            Tanıtım Videoları
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center"
            >
              <div className="w-full h-48 bg-green-200 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-green-600">
                  <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Okul Tanıtımı
              </h3>
              <p className="text-gray-600">
                Okulumuzun genel tanıtımı ve eğitim anlayışımız
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-8 text-center"
            >
              <div className="w-full h-48 bg-yellow-200 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-yellow-600">
                  <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Günlük Aktiviteler
              </h3>
              <p className="text-gray-600">
                Çocuklarımızın günlük yaşamından kareler
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Gallery
