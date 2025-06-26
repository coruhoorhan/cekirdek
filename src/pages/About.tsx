import { motion } from 'framer-motion'
import { FiUsers, FiAward, FiHeart, FiTarget, FiEye, FiStar } from 'react-icons/fi'
import { FaLeaf, FaGraduationCap, FaHandsHelping, FaLightbulb } from 'react-icons/fa'

const About = () => {
  const stats = [
    { icon: <FiUsers />, number: '150+', label: 'Mutlu Çocuk' },
    { icon: <FiAward />, number: '15+', label: 'Yıllık Deneyim' },
    { icon: <FiHeart />, number: '25+', label: 'Uzman Personel' },
    { icon: <FiStar />, number: '100%', label: 'Memnuniyet' }
  ]

  const principles = [
    {
      icon: <FaLeaf className="w-8 h-8" />,
      title: 'Doğal Gelişim',
      description: 'Her çocuğun kendi hızında ve doğal sürecinde gelişmesini destekliyoruz.'
    },
    {
      icon: <FaGraduationCap className="w-8 h-8" />,
      title: 'Kaliteli Eğitim',
      description: 'Güncel eğitim yöntemleri ve bilimsel yaklaşımlarla kaliteli eğitim sunuyoruz.'
    },
    {
      icon: <FaHandsHelping className="w-8 h-8" />,
      title: 'Aile İşbirliği',
      description: 'Ailelerle güçlü işbirliği içinde çocuklarımızın gelişimini destekliyoruz.'
    },
    {
      icon: <FaLightbulb className="w-8 h-8" />,
      title: 'Yaratıcılık',
      description: 'Çocuklarımızın yaratıcı potansiyellerini keşfetmelerine olanak sağlıyoruz.'
    }
  ]

  const timeline = [
    {
      year: '2008',
      title: 'Kuruluş',
      description: 'Çekirdek Anaokulu\'nun temelleri atıldı'
    },
    {
      year: '2012',
      title: 'Genişleme',
      description: 'Yeni binaya taşınarak kapasitemizi artırdık'
    },
    {
      year: '2018',
      title: 'Akreditasyon',
      description: 'Uluslararası kalite standartlarını elde ettik'
    },
    {
      year: '2025',
      title: 'Modern Yaklaşım',
      description: 'Teknoloji entegrasyonu ve çağdaş eğitim yöntemleri'
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
              Hakkımızda
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-green-100"
            >
              Çocuklarımızın geleceğini şekillendiren değerler ve ilkeler
            </motion.p>
          </div>
        </div>
      </section>

      {/* İstatistikler */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Misyon & Vizyon */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Misyon */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white mr-4">
                  <FiTarget className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Misyonumuz</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Çocuklarımızın mutlu, sağlıklı, özgüvenli ve yaratıcı bireyler olarak 
                yetişmeleri için sevgi dolu, güvenli ve eğlenceli bir öğrenme ortamı 
                sunmak. Her çocuğun bireysel farklılıklarını gözetarak, potansiyellerini 
                keşfetmelerine ve geliştirmelerine destek olmak.
              </p>
            </motion.div>

            {/* Vizyon */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white mr-4">
                  <FiEye className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Vizyonumuz</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Türkiye'nin önde gelen anaokulu markası olarak, çağdaş eğitim 
                anlayışı ile donatılmış, doğa dostu ve sürdürülebilir eğitim 
                modeliyle örnek bir kurum olmak. Gelecek nesillerin sağlıklı 
                gelişimi için yenilikçi yaklaşımlarla öncülük etmek.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Eğitim İlkelerimiz */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16"
          >
            Eğitim İlkelerimiz
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {principles.map((principle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-gradient-to-br from-green-50 to-yellow-50 rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="text-green-600 mb-4 flex justify-center">
                  {principle.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {principle.title}
                </h3>
                <p className="text-gray-600">
                  {principle.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tarihçemiz */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16"
          >
            Tarihçemiz
          </motion.h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-green-400 to-green-600 hidden md:block" />
              
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className={`flex items-center mb-12 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className="w-full md:w-5/12">
                    <div className={`bg-white rounded-2xl p-6 shadow-lg ${
                      index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'
                    }`}>
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        {item.year}
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Timeline Node */}
                  <div className="hidden md:block w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-lg" />
                  
                  <div className="hidden md:block w-5/12" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Neden Bizi Seçmelisiniz */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16"
          >
            Neden Çekirdek Anaokulu?
          </motion.h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      Deneyimli Eğitim Kadrosu
                    </h4>
                    <p className="text-gray-600">
                      15+ yıllık deneyime sahip, çocuk gelişimi konusunda uzman öğretmenlerimiz
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      Modern Eğitim Yaklaşımı
                    </h4>
                    <p className="text-gray-600">
                      Montessori, Reggio Emilia gibi çağdaş eğitim yöntemlerini uyguluyoruz
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      Doğa İle İç İçe Ortam
                    </h4>
                    <p className="text-gray-600">
                      Geniş bahçe alanımızda doğa ile iç içe öğrenme deneyimi
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      Bireysel Gelişim Odaklı
                    </h4>
                    <p className="text-gray-600">
                      Her çocuğun bireysel özelliklerini gözetip özel programlar geliştiriyoruz
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      Güvenli ve Hijyenik Ortam
                    </h4>
                    <p className="text-gray-600">
                      Yüksek güvenlik ve hijyen standartları ile çocuklarınızın sağlığını koruyoruz
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      Aile İletişimi
                    </h4>
                    <p className="text-gray-600">
                      Düzenli aile toplantıları ve bireysel görüşmelerle sürekli iletişim halindeyiz
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
