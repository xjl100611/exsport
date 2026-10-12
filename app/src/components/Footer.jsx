import { Link } from 'react-router-dom'
import { DISCLAIMER } from '../data/sports'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/60 bg-white/40 px-4 py-10 backdrop-blur">
      <div className="wrap grid gap-8 md:grid-cols-3">
        <div>
          <p className="text-lg font-semibold text-ink">exsport</p>
          <p className="mt-1 text-sm text-muted">哪里痛，练什么。运动科普站点演示版。</p>
        </div>
        <div className="text-sm text-muted">
          <p className="font-medium text-ink">站点导航</p>
          <ul className="mt-2 space-y-1">
            <li>
              <Link to="/" className="hover:text-teal-deep">
                人体伤痛地图
              </Link>
            </li>
            <li>
              <Link to="/sports" className="hover:text-teal-deep">
                全部运动
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-teal-deep">
                关于与免责声明
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-xs leading-relaxed text-muted">
          <p className="font-medium text-ink">模型与内容署名</p>
          <p className="mt-2">
            3D 人体模型使用 MakeHuman 基础网格，该资源以 CC0 1.0 协议发布，可自由商用。
          </p>
          <p className="mt-2">{DISCLAIMER}</p>
        </div>
      </div>
    </footer>
  )
}
