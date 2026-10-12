import { Link, useParams } from 'react-router-dom'
import SportDetailView from '../components/SportDetailView'
import { getSport } from '../data/sports'

// 直接访问 /sports/:slug 时的页面版本（首页里的原地跳转不经过这个路由）
export default function Detail() {
  const { slug } = useParams()
  const sport = getSport(slug)

  if (!sport) {
    return (
      <main className="wrap py-20">
        <div className="glass rounded-3xl p-10 text-center">
          <h1 className="text-2xl text-ink">没有找到这项运动</h1>
          <p className="mt-3 text-sm text-muted">可能链接有误，先回到全部运动看看。</p>
          <Link to="/" className="btn btn-primary mt-6">
            回到首页
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="light-sheet pb-6">
      <SportDetailView sport={sport} />
    </main>
  )
}
