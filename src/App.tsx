import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Education from './pages/Education'
import Teachers from './pages/Teachers'
import Gallery from './pages/Gallery'
import News from './pages/News'
import Contact from './pages/Contact'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hakkimizda" element={<About />} />
            <Route path="/egitimler" element={<Education />} />
            <Route path="/ogretmenlerimiz" element={<Teachers />} />
            <Route path="/galeri" element={<Gallery />} />
            <Route path="/duyurular" element={<News />} />
            <Route path="/iletisim" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
