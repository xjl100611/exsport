import { useState } from 'react'
import BodyStage from '../components/BodyStage'
import SearchHeader from '../components/SearchHeader'
import SportDetailView from '../components/SportDetailView'
import SportsListView from '../components/SportsListView'
import { getSport, SPORTS } from '../data/sports'
import { INJURY_MAP } from '../data/injuries'
import { getTcm, TCM_DISCLAIMER } from '../data/tcm'
import { getMed, MED_SOURCES, MED_DISCLAIMER } from '../data/med'

// 首页只有两段：顶部搜索栏 + 下面一整块人体。所有跳转都在这一页里完成，不新增页面。
export default function Home() {
  const [view, setView] = useState({ name: 'body' })
  const [query, setQuery] = useState('')

  const openSport = (slug) => setView({ name: 'sport', slug })
  const openSports = (keyword = '') => setView({ name: 'sports', query: keyword })
  const openInjury = (partId) => setView({ name: 'injury', partId })
  const backToBody = () => setView({ name: 'body' })

  const submitSearch = () => {
    const keyword = query.trim()
    if (!keyword) return openSports()
    const matched = SPORTS.find(
      (sport) => sport.name === keyword || sport.en.toLowerCase() === keyword.toLowerCase(),
    )
    if (matched) return openSport(matched.slug)
    return openSports(keyword)
  }

  const renderView = () => {
    if (view.name === 'sports') {
      return (
        <SportsListView
          title="所有运动"
          subtitle="十项最常见的运动，点卡片看它的规则、入门步骤与装备"
          initialQuery={view.query ?? ''}
          onOpenSport={openSport}
          onBack={backToBody}
        />
      )
    }

    if (view.name === 'sport') {
      return (
        <div className="h-full overflow-y-auto px-2 pb-10">
          <div className="mx-auto max-w-[1180px] px-2 pt-1">
            <button type="button" onClick={backToBody} className="btn btn-glass btn-sm mb-3 ml-2">
              ← 回到人体
            </button>
          </div>
          <div className="light-sheet pb-6">
            <SportDetailView sport={getSport(view.slug)} onBack={backToBody} onOpenSport={openSport} />
          </div>
        </div>
      )
    }

    if (view.name === 'injury') {
      const part = INJURY_MAP[view.partId]
      const tcm = getTcm(view.partId)
      const med = getMed(view.partId)
      return (
        <div className="h-full overflow-y-auto px-4 pb-10 sm:px-6">
          <div className="mx-auto max-w-[1180px]">
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8ff3df]">{part.en}</p>
                <h2 className="mt-1 text-3xl text-white">与「{part.name}」有关的运动</h2>
                <p className="mt-2 max-w-2xl text-sm text-white/75">{part.brief}</p>
              </div>
              <button type="button" onClick={backToBody} className="btn btn-glass btn-sm">
                ← 回到人体
              </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="glass rounded-3xl p-6">
                <p className="section-eyebrow">主要原因</p>
                <ul className="mt-3 space-y-2">
                  {part.causes.map((cause) => (
                    <li key={cause} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0fa9a0]" aria-hidden="true" />
                      {cause}
                    </li>
                  ))}
                </ul>
                <p className="section-eyebrow mt-5">日常预防</p>
                <ul className="mt-3 space-y-2">
                  {part.prevention.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                      <span className="mt-1 text-[#0fa9a0]" aria-hidden="true">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 rounded-2xl border border-[rgba(74,124,255,0.25)] bg-[rgba(74,124,255,0.07)] p-3 text-xs leading-relaxed text-muted">
                  {part.note}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {part.helpful.map(({ slug, why }) => {
                  const sport = getSport(slug)
                  if (!sport) return null
                  return (
                    <button
                      key={slug}
                      type="button"
                      onClick={() => openSport(slug)}
                      className="glass card-hover flex h-full flex-col gap-2 rounded-3xl p-5 text-left"
                    >
                      <span className="text-3xl" aria-hidden="true">
                        {sport.icon}
                      </span>
                      <span className="text-lg font-medium text-ink">{sport.name}</span>
                      <span className="text-xs leading-relaxed text-muted">{why}</span>
                      <span className="mt-auto pt-2 text-sm font-medium text-teal-deep">看这项运动 →</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {tcm && (
              <div className="glass mt-4 rounded-3xl p-6">
                <p className="section-eyebrow">中医辨证与穴位参考</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="tag tag-teal">{tcm.pattern}</span>
                  <span className="text-sm text-muted">{tcm.patternNote}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">{tcm.classic}</p>

                <h3 className="mt-5 text-sm font-semibold text-ink">可自我按揉的穴位</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {tcm.points.map((point) => (
                    <div key={point.name} className="glass-soft rounded-2xl p-4">
                      <p className="text-sm font-medium text-ink">
                        {point.name}
                        <span className="ml-2 text-xs text-muted">{point.meridian}</span>
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted">{point.method}</p>
                      {point.caution && (
                        <p className="mt-1 text-xs text-[#b03a2e]">注意：{point.caution}</p>
                      )}
                    </div>
                  ))}
                </div>

                <h3 className="mt-5 text-sm font-semibold text-ink">经典方剂参考</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {tcm.formula.name}（{tcm.formula.source}）——适用于{tcm.formula.indication}。
                  {tcm.formula.note ? `${tcm.formula.note}。` : ''}
                </p>
                <p className="mt-3 rounded-2xl border border-[rgba(176,58,46,0.28)] bg-[rgba(176,58,46,0.06)] p-3 text-xs leading-relaxed text-muted">
                  {TCM_DISCLAIMER}
                </p>
              </div>
            )}

            {med && (
              <div className="glass mt-4 rounded-3xl p-6">
                <p className="section-eyebrow">现代医学视角</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  按解剖、生理、病理、生化、药理、免疫、微生物、诊断、内科与外科十个维度整理，用于理解机制与识别风险。
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {MED_SOURCES.map(({ key, book, role }) => (
                    <div key={key} className="glass-soft rounded-2xl p-4">
                      <p className="text-xs text-muted">
                        {book} · {role}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-ink">{med[key]}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-3 rounded-2xl border border-[rgba(176,58,46,0.28)] bg-[rgba(176,58,46,0.06)] p-3 text-xs leading-relaxed text-muted">
                  {MED_DISCLAIMER}
                </p>
              </div>
            )}
          </div>
        </div>
      )
    }

    return <BodyStage onShowRelated={openInjury} />
  }

  return (
    <div className="flex h-[100svh] flex-col overflow-hidden">
      <SearchHeader
        query={query}
        onQueryChange={setQuery}
        onSubmit={submitSearch}
        onShowAll={() => openSports()}
      />
      <div className="relative min-h-0 flex-1">{renderView()}</div>
    </div>
  )
}
