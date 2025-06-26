import { motion } from 'framer-motion'
import { 
  FaLanguage, 
  FaPalette, 
  FaTheaterMasks, 
  FaMusic, 
  FaDumbbell, 
  FaChess,
  FaBookReader,
  FaCalculator,
  FaFlask,
  FaGlobe
} from 'react-icons/fa'

import { FiClock, FiUsers, FiTarget } from 'react-icons/fi'

const Education = () => {
  const subjects = [
    {
      icon: <FaLanguage className="w-8 h-8" />,
      name: 'İngilizce',
      description: 'Erken yaşta ikinci dil öğrenimi ile küresel vatandaşlık bilinci kazandırıyoruz.',
      image: '/images/subjects/english.jpg',
      details: [
        'Oyunlarla İngilizce öğrenme',
        'Şarkı ve dramalarla dil gelişimi',
        'Günlük yaşamda İngilizce kullanımı',
        'Uluslararası sertifikalı öğretmenler'
      ],
      ageGroup: '3-6 yaş',
      duration: '3 saat/hafta'
    },
    {
      icon: <FaPalette className="w-8 h-8" />,
      name: 'Sanat',
      description: 'Yaratıcılığı geliştiren sanat etkinlikleri ile çocuklarımızın estetik algılarını güçlendiriyoruz.',
      image: '/images/subjects/art.jpg',
      details: [
        'Resim ve boyama teknikleri',
        'Çeşitli malzemelerle yaratıcı çalışmalar',
        'El becerilerini geliştirici aktiviteler',
        'Kişisel ifade becerilerinin gelişimi'
      ],
      ageGroup: '2-6 yaş',
      duration: '4 saat/hafta'
    },
    {
      icon: <FaTheaterMasks className="w-8 h-8" />,
      name: 'Drama/Zerafet/Kil',
      description: 'Sosyal becerilerin gelişimini destekleyen drama etkinlikleri ve el becerilerini güçlendiren kil çalışmaları.',
      image: '/images/subjects/drama.jpg',
      details: [
        'Yaratıcı drama etkinlikleri',
        'Sosyal iletişim becerilerinin gelişimi',
        'Kil ile motor beceri geliştirme',
        'Özgüven artırıcı etkinlikler'
      ],
      ageGroup: '3-6 yaş',
      duration: '3 saat/hafta'
    },
    {
      icon: <FaMusic className="w-8 h-8" />,
      name: 'Bale',
      description: 'Zarif hareketler ve ritim duygusu geliştiren bale eğitimi ile çocuklarımızın fiziksel koordinasyonlarını güçlendiriyoruz.',
      image: '/images/subjects/ballet.jpg',
      details: [
        'Temel bale pozisyonları',
        'Ritim ve koordinasyon geliştirme',
        'Esneklik ve denge egzersizleri',
        'Sahneleme ve performans becerisi'
      ],
      ageGroup: '4-6 yaş',
      duration: '2 saat/hafta'
    },
    {
      icon: <FaMusic className="w-8 h-8" />,
      name: 'Müzik/Dans/Oyun',
      description: 'Müzikal zeka gelişimi için çeşitli enstrümanlar ve dans etkinlikleri ile ritim duygusu kazandırıyoruz.',
      image: '/images/subjects/music.jpg',
      details: [
        'Çeşitli müzik aletleri tanıma',
        'Ritim ve melodi çalışmaları',
        'Grup müziği etkinlikleri',
        'Hareket ve dans koordinasyonu'
      ],
      ageGroup: '2-6 yaş',
      duration: '3 saat/hafta'
    },
    {
      icon: <FaDumbbell className="w-8 h-8" />,
      name: 'Jimnastik',
      description: 'Fiziksel gelişimi destekleyen jimnastik hareketleri ile çocuklarımızın motor becerilerini güçlendiriyoruz.',
      image: '/images/subjects/gymnastics.jpeg',
      details: [
        'Temel jimnastik hareketleri',
        'Koordinasyon ve denge geliştirme',
        'Kas gücü ve esneklik çalışmaları',
        'Takım çalışması ve disiplin'
      ],
      ageGroup: '3-6 yaş',
      duration: '2 saat/hafta'
    },
    {
      icon: <FaChess className="w-8 h-8" />,
      name: 'Satranç',
      description: 'Stratejik düşünme ve problem çözme becerilerini geliştiren satranç eğitimi ile zihinsel gelişimi destekliyoruz.',
      image: '/images/subjects/chess.jpeg',
      details: [
        'Temel satranç kuralları',
        'Stratejik düşünme becerileri',
        'Problem çözme yetenekleri',
        'Sabır ve odaklanma geliştirme'
      ],
      ageGroup: '5-6 yaş',
      duration: '2 saat/hafta'
    }
  ]

  const programs = [
    {
      title: 'Erken Çocukluk Programı',
      ageGroup: '0-3 Yaş',
      icon: <FaBookReader className="w-6 h-6" />,
      features: [
        'Bireysel bakım ve gelişim takibi',
        'Duyusal gelişim etkinlikleri',
        'Temel motor beceri geliştirme',
        'Ana-baba eğitimi desteği'
      ],
      color: 'from-pink-400 to-purple-400'
    },
    {
      title: 'Anaokulu Programı',
      ageGroup: '3-5 Yaş',
      icon: <FaCalculator className="w-6 h-6" />,
      features: [
        'Sosyalleşme etkinlikleri',
        'Temel akademik hazırlık',
        'Yaratıcı oyun ve keşif',
        'Grup etkinlikleri'
      ],
      color: 'from-green-400 to-blue-400'
    },
    {
      title: 'Anasınıfı Programı',
      ageGroup: '5-6 Yaş',
      icon: <FaGlobe className="w-6 h-6" />,
      features: [
        'İlkokula hazırlık çalışmaları',
        'Okuma yazma ön becerilerí',
        'Matematik kavramları',
        'Bilimsel düşünme'
      ],
      color: 'from-yellow-400 to-orange-400'
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
              Eğitim Programlarımız
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-green-100"
            >
              Çocuklarımızın gelişimini destekleyen kapsamlı eğitim programları
            </motion.p>
          </div>
        </div>
      </section>

      {/* Yaş Grupları Programları */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16"
          >
            Yaş Gruplarına Göre Programlar
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className={`h-24 bg-gradient-to-r ${program.color} flex items-center justify-center text-white`}>
                  <div className="text-center">
                    {program.icon}
                    <div className="font-semibold mt-2">{program.ageGroup}</div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {program.title}
                  </h3>
                  <ul className="space-y-2">
                    {program.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-sm text-gray-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
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

      {/* Branş Dersler Detayı */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16"
          >
            Branş Derslerimiz
          </motion.h2>
          <div className="space-y-12">
            {subjects.map((subject, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className="w-full lg:w-1/2">
                  <div 
                    className="h-64 md:h-80 rounded-2xl bg-cover bg-center shadow-lg"
                    style={{ backgroundImage: `url(${subject.image})` }}
                  >
                    <div className="w-full h-full bg-gradient-to-t from-black/50 to-transparent rounded-2xl flex items-end">
                      <div className="p-6 text-white">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="text-yellow-300">
                            {subject.icon}
                          </div>
                          <h3 className="text-2xl font-bold">{subject.name}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="w-full lg:w-1/2">
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {subject.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FiUsers className="w-4 h-4 text-green-600" />
                        <span>{subject.ageGroup}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FiClock className="w-4 h-4 text-green-600" />
                        <span>{subject.duration}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800 flex items-center">
                        <FiTarget className="w-4 h-4 mr-2 text-green-600" />
                        Program İçeriği:
                      </h4>
                      <ul className="space-y-2">
                        {subject.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start text-sm text-gray-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Eğitim Yaklaşımımız */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16"
          >
            Eğitim Yaklaşımımız
          </motion.h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8"
              >
                <h3 className="text-2xl font-bold text-green-800 mb-4">
                  Oyun Temelli Öğrenme
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Çocukların doğal öğrenme yöntemi olan oyun aracılığıyla tüm 
                  gelişim alanlarını destekliyoruz. Eğlenceli aktivitelerle 
                  bilgiyi kalıcı hale getiriyoruz.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-8"
              >
                <h3 className="text-2xl font-bold text-yellow-800 mb-4">
                  Bireysel Gelişim
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Her çocuğun benzersiz olduğunu bilerek, bireysel gelişim 
                  planları hazırlıyoruz. Çocuğun ilgi ve yeteneklerini 
                  keşfetmesine yardımcı oluyoruz.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8"
              >
                <h3 className="text-2xl font-bold text-blue-800 mb-4">
                  Çoklu Zeka Teorisi
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Gardner'ın çoklu zeka teorisine dayalı olarak çocukların 
                  farklı zeka alanlarını keşfetmelerine ve geliştirmelerine 
                  imkan sağlıyoruz.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8"
              >
                <h3 className="text-2xl font-bold text-purple-800 mb-4">
                  Doğa Eğitimi
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Doğa ile iç içe eğitim anlayışımızla çocukların çevre 
                  bilincini geliştirirken, doğanın sunduğu öğrenme 
                  fırsatlarından yararlanıyoruz.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Education
