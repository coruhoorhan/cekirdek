import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight, FiUsers, FiAward, FiHeart, FiPlay } from 'react-icons/fi'
import { 
  FaGraduationCap, 
  FaCogs, 
  FaLeaf, 
  FaGamepad,
  FaLanguage,
  FaPalette,
  FaTheaterMasks,
  FaMusic,
  FaDumbbell,
  FaChess
} from 'react-icons/fa'


const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const heroSlides = [
    {
      image: '/images/hero/hero1.jpg',
      title: 'Seçkin Eğitimle Büyüyoruz',
      subtitle: 'Çekirdek Anaokulu\'na Hoşgeldiniz',
      description: 'Çocuklarınız için sevgi dolu, güvenli ve eğlenceli bir öğrenme ortamı'
    },
    {
      image: '/images/hero/hero2.png',
      title: 'Doğa ile İç İçe Eğitim',
      subtitle: 'Keşfederek Öğreniyoruz',
      description: 'Doğal çevrede oyun temelli öğrenme deneyimi'
    },
    {
      image: '/images/hero/hero3.jpg',
      title: 'Modern Eğitim Anlayışı',
      subtitle: 'Geleceğe Hazırlanıyoruz',
      description: 'Çağdaş eğitim yöntemleri ile çocuklarınızın potansiyelini keşfediyoruz'
    }
  ]

  const values = [
    {
      icon: <FaGraduationCap className="w-8 h-8" />,
      title: 'Profesyonel Eğitim',
      description: 'Deneyimli ve uzman eğitim kadromuz ile kaliteli eğitim hizmeti sunuyoruz.'
    },
    {
      icon: <FaCogs className="w-8 h-8" />,
      title: 'Tam Donanımlı',
      description: 'Modern teknoloji ve eğitim materyalleri ile donatılmış sınıflarımız.'
    },
    {
      icon: <FaLeaf className="w-8 h-8" />,
      title: 'Doğa Dostu',
      description: 'Çevreye duyarlı, sürdürülebilir yaşam bilinci kazandırıyoruz.'
    },
    {
      icon: <FaGamepad className="w-8 h-8" />,
      title: 'Oyunla Öğreniyorum',
      description: 'Eğlenceli oyunlar ve aktivitelerle öğrenmeyi sevdiriyoruz.'
    }
  ]

  const subjects = [
    { icon: <FaLanguage />, name: 'İngilizce', image: '/images/subjects/english.jpg' },
    { icon: <FaPalette />, name: 'Sanat', image: '/images/subjects/art.jpg' },
    { icon: <FaTheaterMasks />, name: 'Drama/Zerafet/Kil', image: '/images/subjects/drama.jpg' },
    { icon: <FaMusic />, name: 'Bale', image: '/images/subjects/ballet.jpg' },
    { icon: <FaMusic />, name: 'Müzik/Dans/Oyun', image: '/images/subjects/music.jpg' },
    { icon: <FaDumbbell />, name: 'Jimnastik', image: '/images/subjects/gymnastics.jpeg' },
    { icon: <FaChess />, name: 'Satranç', image: '/images/subjects/chess.jpeg' }
  ]

  const ageGroups = [
    {
      title: '0-2 Yaş Bebek',
      description: 'Sevgi dolu bakım ve erken gelişim programları',
      image: '/images/age-groups/baby.jpg',
      features: ['Bireysel bakım', 'Erken uyarım', 'Güvenli oyun alanı']
    },
    {
      title: '2-5 Yaş Anaokulu',
      description: 'Sosyalleşme ve temel beceri geliştirme',
      image: '/images/age-groups/kindergarten.jpg',
      features: ['Grup etkinlikleri', 'Yaratıcı oyunlar', 'Temel kavramlar']
    },
    {
      title: '5-6 Yaş Anasınıfı',
      description: 'İlkokula hazırlık ve akademik temeller',
      image: '/images/age-groups/preschool.jpg',
      features: ['Okul öncesi hazırlık', 'Okuma yazma temeli', 'Matematik kavramları']
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <section className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black/40" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white max-w-4xl px-4">
                <motion.h1
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-6xl font-bold mb-4"
                >
                  {slide.title}
                </motion.h1>
                <motion.h2
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl md:text-3xl font-light mb-6 text-yellow-300"
                >
                  {slide.subtitle}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-lg md:text-xl mb-8 max-w-2xl mx-auto"
                >
                  {slide.description}
                </motion.p>
                <motion.button
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  Detayları Keşfet
                </motion.button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all"
        >
          <FiChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all"
        >
          <FiChevronRight className="w-6 h-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Kuruluş Amacı */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-8"
            >
              Kuruluş Amacımız
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600 leading-relaxed space-y-6"
            >
              <p>
                Gelecek, yaşamdan ne istediğimize bağlıdır. Çocuklarımızın mutlu, sağlıklı, 
                yaratıcı ve özgüven sahibi bireyler olarak yetişmeleri için en uygun ortamı 
                hazırlayarak, onları hayata hazırlamak temel amacımızdır.
              </p>
              <p>
                Çekirdek Anaokulu olarak, çocuklarımızın doğal gelişim süreçlerini destekleyerek, 
                onların potansiyellerini keşfetmelerine yardımcı oluyoruz. Sevgi, saygı ve 
                güven temelinde şekillenen eğitim anlayışımızla, her çocuğun bireysel 
                farklılıklarını gözetiyoruz.
              </p>
              <p>
                Doğa ile iç içe eğitim ortamımızda, çocuklarımız oyun temelli öğrenme 
                deneyimleri yaşayarak, hem akademik hem de sosyal-duygusal gelişimlerini 
                sağlıklı bir şekilde tamamlıyorlar.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Değerlerimiz */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16"
          >
            Değerlerimiz
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-green-600 mb-4 flex justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Branş Dersleri */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16"
          >
            Branş Derslerimiz
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {subjects.map((subject, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group cursor-pointer"
              >
                <div className="bg-gradient-to-br from-green-100 to-yellow-100 rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-all duration-300">
                  <div 
                    className="w-20 h-20 mx-auto mb-4 rounded-xl bg-cover bg-center shadow-lg"
                    style={{ backgroundImage: `url(${subject.image})` }}
                  >
                    <div className="w-full h-full bg-green-600/80 rounded-xl flex items-center justify-center text-white text-2xl">
                      {subject.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                    {subject.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Psikolojik Danışmanlık */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-8"
            >
              Psikolojik Danışmanlık Hizmetimiz
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                  <FiHeart className="w-8 h-8" />
                </div>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Çocuklarımızın sağlıklı gelişimi için uzman psikolog desteği sağlıyoruz. 
                Bireysel değerlendirmeler, aile danışmanlığı ve gelişimsel destek programları 
                ile çocuklarınızın duygusal ve sosyal gelişimlerini destekliyoruz.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Bireysel Değerlendirme</h4>
                  <p className="text-blue-600">Her çocuk için özel gelişim planları</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Aile Danışmanlığı</h4>
                  <p className="text-purple-600">Ebeveynler için destek ve rehberlik</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-indigo-800 mb-2">Grup Etkinlikleri</h4>
                  <p className="text-indigo-600">Sosyal beceri geliştirme programları</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Yaş Grupları */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16"
          >
            Yaş Gruplarımız
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ageGroups.map((group, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="bg-gradient-to-br from-white to-green-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div 
                  className="h-48 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${group.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{group.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{group.description}</p>
                  <ul className="space-y-2">
                    {group.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-green-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ön Kayıt CTA */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-8"
          >
            Çocuğunuzu Okulumuza Nasıl Kaydedebilirsiniz?
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <p className="text-xl mb-8 text-green-100">
              Kayıt süreci çok basit! Önce ön kayıt formunu doldurun, 
              sonra okulumuzı ziyaret ederek detayları görüşelim.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-800 font-bold text-xl">1</span>
                </div>
                <h3 className="font-semibold mb-2">Ön Kayıt</h3>
                <p className="text-green-100 text-sm">Form doldurarak ön kaydınızı yapın</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-800 font-bold text-xl">2</span>
                </div>
                <h3 className="font-semibold mb-2">Okul Ziyareti</h3>
                <p className="text-green-100 text-sm">Okulumuzı ziyaret edin ve tanışalım</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-800 font-bold text-xl">3</span>
                </div>
                <h3 className="font-semibold mb-2">Kesin Kayıt</h3>
                <p className="text-green-100 text-sm">Evrakları tamamlayın ve kaydı kesinleştirin</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-800 px-12 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all"
            >
              Hemen Ön Kayıt Ol
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
