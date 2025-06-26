import { motion } from 'framer-motion'
import { FiMail, FiPhone, FiAward, FiBookOpen } from 'react-icons/fi'
import { FaGraduationCap, FaHeart, FaStar } from 'react-icons/fa'

const Teachers = () => {
  const teachers = [
    {
      name: 'Ayşe Demir',
      title: 'Müdür ve Okul Öncesi Öğretmeni',
      image: '/images/teachers/teacher1.jpg',
      experience: '15 Yıl',
      education: 'Gazi Üniversitesi - Okul Öncesi Eğitimi',
      specialties: ['Çocuk Gelişimi', 'Eğitim Yönetimi', 'Aile Danışmanlığı'],
      description: 'Çocuk sevgisi ve deneyimi ile okulumuzun eğitim kalitesini yönlendiren, çocuklarımızın gelişimini yakından takip eden değerli müdürümüz.',
      phone: '0532 123 45 67',
      email: 'ayse.demir@cekirdekanokulu.com'
    },
    {
      name: 'Zeynep Kaya',
      title: 'Anaokulu Öğretmeni',
      image: '/images/teachers/teacher2.jpg',
      experience: '12 Yıl',
      education: 'Hacettepe Üniversitesi - Çocuk Gelişimi',
      specialties: ['Montessori Eğitimi', 'Yaratıcı Drama', 'Sanat Eğitimi'],
      description: 'Yaratıcı ve eğlenceli öğretim yöntemleri ile çocuklarımızın hayal gücünü geliştiren, sabırlı ve sevecen öğretmenimiz.',
      phone: '0532 123 45 68',
      email: 'zeynep.kaya@cekirdekanokulu.com'
    },
    {
      name: 'Elif Özkan',
      title: 'İngilizce Öğretmeni',
      image: '/images/teachers/teacher3.jpg',
      experience: '8 Yıl',
      education: 'Boğaziçi Üniversitesi - İngiliz Dili ve Edebiyatı',
      specialties: ['Erken Yaş İngilizce', 'Oyunla Öğrenme', 'Dil Gelişimi'],
      description: 'İngilizceyi eğlenceli hale getiren, çocuklarımızın dil gelişimini oyunlarla destekleyen deneyimli öğretmenimiz.',
      phone: '0532 123 45 69',
      email: 'elif.ozkan@cekirdekanokulu.com'
    },
    {
      name: 'Fatma Yılmaz',
      title: 'Müzik ve Bale Öğretmeni',
      image: '/images/teachers/teacher1.jpg',
      experience: '10 Yıl',
      education: 'Ankara Devlet Konservatuvarı - Müzik Eğitimi',
      specialties: ['Müzik Eğitimi', 'Bale', 'Ritim ve Hareket'],
      description: 'Müzik ve dans alanındaki uzmanlığı ile çocuklarımızın sanatsal yetilerini keşfetmelerine yardımcı olan öğretmenimiz.',
      phone: '0532 123 45 70',
      email: 'fatma.yilmaz@cekirdekanokulu.com'
    },
    {
      name: 'Mehmet Ali Şen',
      title: 'Beden Eğitimi ve Spor Öğretmeni',
      image: '/images/teachers/teacher2.jpg',
      experience: '7 Yıl',
      education: 'Gazi Üniversitesi - Beden Eğitimi ve Spor',
      specialties: ['Jimnastik', 'Koordinasyon', 'Takım Oyunları'],
      description: 'Çocuklarımızın fiziksel gelişimini destekleyen, eğlenceli spor aktiviteleri düzenleyen enerjik öğretmenimiz.',
      phone: '0532 123 45 71',
      email: 'mehmet.sen@cekirdekanokulu.com'
    },
    {
      name: 'Dr. Pınar Akgül',
      title: 'Çocuk Psikoloğu',
      image: '/images/teachers/teacher3.jpg',
      experience: '13 Yıl',
      education: 'İstanbul Üniversitesi - Klinik Psikoloji Doktora',
      specialties: ['Çocuk Psikolojisi', 'Gelişimsel Değerlendirme', 'Aile Terapisi'],
      description: 'Çocuklarımızın ruh sağlığını koruyan, gelişimsel değerlendirmeler yapan ve ailelere rehberlik eden uzman psikoloğumuz.',
      phone: '0532 123 45 72',
      email: 'pinar.akgul@cekirdekanokulu.com'
    }
  ]

  const values = [
    {
      icon: <FaHeart className="w-8 h-8" />,
      title: 'Çocuk Sevgisi',
      description: 'Tüm öğretmenlerimiz çocukları gerçekten sever ve onların mutluluğunu ön planda tutar.'
    },
    {
      icon: <FaGraduationCap className="w-8 h-8" />,
      title: 'Profesyonel Eğitim',
      description: 'Alanında uzman, sürekli kendini geliştiren deneyimli eğitim kadromuz.'
    },
    {
      icon: <FaStar className="w-8 h-8" />,
      title: 'Kaliteli Hizmet',
      description: 'Her çocuğa özel ilgi gösteren, bireysel gelişimi destekleyen yaklaşımımız.'
    }
  ]

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
              Öğretmenlerimiz
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-green-100 mb-8"
            >
              Çocuklarınızın geleceğini şekillendiren değerli eğitimcilerimiz
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center"
            >
              <p className="text-lg leading-relaxed">
                "Biz, çocukları gerçekten seven ve eğitimin her anından mutlu olan öğretmenleriz. 
                Her çocuğun benzersiz olduğuna inanıyor, onların potansiyellerini keşfetmelerine 
                yardımcı olmaktan büyük keyif alıyoruz."
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Öğretmen Değerleri */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16"
          >
            Öğretmen Değerlerimiz
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-gradient-to-br from-green-50 to-yellow-50 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-green-600 mb-4 flex justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Öğretmenler */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16"
          >
            Eğitim Kadromuz
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teachers.map((teacher, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div 
                  className="h-64 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${teacher.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{teacher.name}</h3>
                    <p className="text-green-200">{teacher.title}</p>
                  </div>
                  <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {teacher.experience}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <FaGraduationCap className="w-4 h-4 mr-2 text-green-600" />
                      <span>{teacher.education}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {teacher.description}
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <FiAward className="w-4 h-4 mr-2 text-green-600" />
                      Uzmanlık Alanları:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {teacher.specialties.map((specialty, specialtyIndex) => (
                        <span 
                          key={specialtyIndex}
                          className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <FiPhone className="w-4 h-4 mr-2 text-green-600" />
                      <span>{teacher.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiMail className="w-4 h-4 mr-2 text-green-600" />
                      <span className="break-all">{teacher.email}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Öğretmen Gelişimi */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16"
            >
              Sürekli Gelişim ve Eğitim
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8"
              >
                <div className="flex items-center mb-4">
                  <FiBookOpen className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-2xl font-bold text-blue-800">
                    Sürekli Eğitim
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Öğretmenlerimiz düzenli olarak çocuk gelişimi, eğitim teknolojileri 
                  ve yeni öğretim yöntemleri konularında eğitimler alarak kendilerini 
                  geliştirmektedirler.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8"
              >
                <div className="flex items-center mb-4">
                  <FiAward className="w-8 h-8 text-purple-600 mr-3" />
                  <h3 className="text-2xl font-bold text-purple-800">
                    Sertifikasyon
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Tüm öğretmenlerimiz alanlarında sertifikalı olup, uluslararası 
                  standartlara uygun eğitim yaklaşımlarını uygulamaktadırlar.
                </p>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl p-8 text-center"
            >
              <h3 className="text-2xl font-bold mb-4">
                Ekibimize Katılmak İster misiniz?
              </h3>
              <p className="text-green-100 mb-6">
                Çocuk sevgisi olan, alanında uzman öğretmenlerimizi arıyoruz. 
                Bizimle birlikte geleceğin mimarlarını yetiştirmek için bize katılın.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-green-700 px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all"
              >
                CV Gönder
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Teachers
