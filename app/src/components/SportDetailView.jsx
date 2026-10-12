import { Link } from 'react-router-dom'
import FavoriteButton from './FavoriteButton'
import GeometryBackdrop from './GeometryBackdrop'
import Reveal from './Reveal'
import SportCard from './SportCard'
import { DISCLAIMER, getSport } from '../data/sports'
import { INJURIES } from '../data/injuries'

const DEMO_COMMENTS = [
  { name: '小林', text: '按入门五步练了两周，膝盖没有之前那种酸胀了。', time: '3 天前' },
  { name: '阿哲', text: '装备清单很实用，之前一直穿跑鞋打羽毛球。', time: '1 周前' },
  { name: '若若', text: '想知道每周练几次比较合适，希望以后能加上训练计划。', time: '2 周前' },
]

// 运动详情内容。用于 /sports/:slug 路由，也用于首页「原地跳转」的详情视图
export default function SportDetailView({ sport, onBack, onOpenSport }) {
  if (!sport) return null

  const related = sport.related.map(getSport).filter(Boolean)
  const relatedInjuries = INJURIES.filter((injury) => injury.helpful.some((item) => item.slug === sport.slug))

  const BackOrLink = onBack ? (
    <button type="button" className="btn btn-ghost" onClick={onBack}>
      回到人体找痛点
    </button>
  ) : (
    <Link to="/" className="btn btn-ghost">
      回到人体找痛点
    </Link>
  )

  return (
    <>
      <section className="px-4 pt-2">
        <div className="glass relative overflow-hidden rounded-[32px] px-6 py-8 sm:px-10">
          <GeometryBackdrop variant="hero" />
          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="tag tag-teal">{sport.group}</span>
                <span className="tag">{sport.difficulty}</span>
              </div>
              <h1 className="mt-4 text-4xl text-ink sm:text-5xl">{sport.name}</h1>
              <p className="mt-1 text-sm uppercase tracking-[0.2em] text-muted">{sport.en}</p>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">{sport.intro}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <FavoriteButton slug={sport.slug} />
                {BackOrLink}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="glass-soft flex h-40 w-full max-w-[280px] flex-col items-center justify-center gap-2 rounded-3xl">
                <span className="text-5xl" aria-hidden="true">
                  {sport.icon}
                </span>
                <span className="text-xs text-muted">封面图为占位素材</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap mt-10">
        <Reveal>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: '难度', value: sport.difficulty },
              { label: '场地', value: sport.venue },
              { label: '花费', value: sport.cost },
              { label: '每次时长', value: sport.duration },
            ].map((item) => (
              <div key={item.label} className="glass rounded-2xl p-4">
                <p className="text-xs text-muted">{item.label}</p>
                <p className="mt-1 text-sm font-medium text-ink">{item.value}</p>
              </div>
            ))}
          </div>
          <p className="glass mt-3 rounded-2xl p-4 text-sm text-muted">适合人群：{sport.audience}</p>
        </Reveal>
      </section>

      <section className="wrap mt-12">
        <Reveal>
          <p className="section-eyebrow">规则说明</p>
          <h2 className="mt-2 text-2xl text-ink">先弄清规则，再上场</h2>
          <ul className="mt-5 grid gap-3 md:grid-cols-2">
            {sport.rules.map((rule) => (
              <li key={rule} className="glass rounded-2xl p-4 text-sm leading-relaxed text-muted">
                {rule}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="wrap mt-12">
        <Reveal>
          <p className="section-eyebrow">入门步骤</p>
          <h2 className="mt-2 text-2xl text-ink">新手五步走</h2>
          <ol className="mt-6 space-y-4">
            {sport.steps.map((step, index) => (
              <li key={step} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0fa9a0] to-[#4a7cff] text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <p className="glass flex-1 rounded-2xl p-4 text-sm leading-relaxed text-muted">{step}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <section className="wrap mt-12">
        <Reveal>
          <p className="section-eyebrow">装备清单</p>
          <h2 className="mt-2 text-2xl text-ink">要买什么，不必买什么</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {sport.gear.map((item) => (
              <div key={item.name} className="glass card-hover rounded-2xl p-4">
                <p className="text-sm font-medium text-ink">{item.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{item.note}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="wrap mt-12 grid gap-4 lg:grid-cols-2">
        <Reveal>
          <div className="glass h-full rounded-3xl p-6">
            <p className="section-eyebrow">训练要点</p>
            <ul className="mt-4 space-y-3">
              {sport.tips.map((tip) => (
                <li key={tip} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                  <span className="mt-1 text-[#0fa9a0]" aria-hidden="true">
                    ✓
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="glass h-full rounded-3xl p-6">
            <p className="section-eyebrow">常见错误</p>
            <ul className="mt-4 space-y-3">
              {sport.mistakes.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                  <span className="mt-1 text-[#e2684f]" aria-hidden="true">
                    ✕
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      <section className="wrap mt-12">
        <Reveal>
          <p className="section-eyebrow">评论</p>
          <h2 className="mt-2 text-2xl text-ink">练习者的经验</h2>
          <div className="mt-5 space-y-3">
            {DEMO_COMMENTS.map((comment) => (
              <div key={comment.name} className="glass rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-ink">{comment.name}</p>
                  <p className="text-xs text-muted">{comment.time}</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{comment.text}</p>
              </div>
            ))}
          </div>
          <div className="glass mt-4 rounded-2xl p-4">
            <textarea
              rows={3}
              placeholder="演示版不提交评论：正式版接入账号后即可发布"
              className="w-full resize-none rounded-xl border border-white/70 bg-white/70 p-3 text-sm text-ink outline-none placeholder:text-muted"
            />
            <div className="mt-3 flex justify-end">
              <button type="button" className="btn btn-ghost" disabled aria-disabled="true">
                发布（演示版未开放）
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      {relatedInjuries.length > 0 && (
        <section className="wrap mt-12">
          <Reveal>
            <div className="glass rounded-3xl p-6">
              <p className="section-eyebrow">与伤痛地图的关联</p>
              <h2 className="mt-2 text-2xl text-ink">{sport.name}常被推荐给这些部位</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {relatedInjuries.map((injury) => (
                  <span
                    key={injury.id}
                    className="rounded-full border border-[rgba(15,169,160,0.28)] bg-white/70 px-3.5 py-1.5 text-sm text-teal-deep"
                  >
                    {injury.name}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted">
                回到首页，在 3D 人体上点对应部位，可以看到完整成因与建议。
              </p>
            </div>
          </Reveal>
        </section>
      )}

      <section className="wrap mt-12">
        <Reveal>
          <p className="section-eyebrow">相关运动</p>
          <h2 className="mt-2 text-2xl text-ink">也值得试试</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <SportCard key={item.slug} sport={item} compact onOpen={onOpenSport} />
            ))}
          </div>
        </Reveal>
      </section>

      <section className="wrap mt-10">
        <p className="text-xs leading-relaxed text-muted">{DISCLAIMER}</p>
      </section>
    </>
  )
}
