import { useEffect } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import About from './pages/About'
import Detail from './pages/Detail'
import Home from './pages/Home'
import PreviewBody from './pages/PreviewBody'
import Sports from './pages/Sports'
import { FavoritesProvider } from './state/FavoritesContext'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])
  return null
}

function NotFound() {
  return (
    <main className="wrap py-20">
      <div className="glass rounded-3xl p-10 text-center">
        <h1 className="text-2xl text-ink">页面不存在</h1>
        <p className="mt-3 text-sm text-muted">链接可能已经变动，回到首页从人体伤痛地图开始。</p>
        <Link to="/" className="btn btn-primary mt-6">
          回到首页
        </Link>
      </div>
    </main>
  )
}

export default function App() {
  return (
    <FavoritesProvider>
      <ScrollToTop />
      <Routes>
        {/* 首页：只有搜索栏 + 人体，跳转都在页内完成 */}
        <Route path="/" element={<Home />} />
        {/* 以下页面保留原样，供直接访问链接使用 */}
        <Route path="/sports" element={<LegacyLayout><Sports /></LegacyLayout>} />
        <Route path="/sports/:slug" element={<LegacyLayout><Detail /></LegacyLayout>} />
        <Route path="/about" element={<LegacyLayout><About /></LegacyLayout>} />
        {/* 开发用模型预览页 */}
        <Route path="/preview" element={<PreviewBody />} />
        <Route path="*" element={<LegacyLayout><NotFound /></LegacyLayout>} />
      </Routes>
    </FavoritesProvider>
  )
}

function LegacyLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  )
}
