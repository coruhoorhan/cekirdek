import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiHome, FiArrowLeft } from 'react-icons/fi';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-8"
        >
          <h1
            className="text-9xl md:text-[12rem] font-extrabold bg-gradient-to-br from-green-500 via-emerald-500 to-yellow-400 bg-clip-text text-transparent leading-none"
            aria-label="404"
          >
            404
          </h1>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-2xl md:text-3xl font-bold text-gray-800 mb-4"
        >
          Sayfa Bulunamadı
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-gray-600 text-base md:text-lg mb-8 max-w-md mx-auto"
        >
          Aradığınız sayfa kaldırılmış, taşınmış ya da hiç var olmamış olabilir.
          Endişelenmeyin, birlikte doğru yolu bulalım.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
        >
          <Button asChild size="lg">
            <Link to="/">
              <FiHome className="mr-2" />
              Anasayfaya Dön
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" onClick={() => window.history.back()}>
            <Link to="#" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
              <FiArrowLeft className="mr-2" />
              Önceki Sayfa
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-sm text-gray-500"
          role="contentinfo"
        >
          Bir hata olduğunu düşünüyorsanız{' '}
          <Link to="/iletisim" className="text-emerald-600 hover:text-emerald-700 underline">
            bizimle iletişime geçebilirsiniz
          </Link>
          .
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
