import { useMemo, useState } from 'react'
import SportCard from './SportCard'
import { SPORTS, SPORT_GROUPS } from '../data/sports'

// 在同一个页面里展示运动列表，点卡片直接切到详情视图
export default function SportsListView({ title, subtitle, initialQuery = '', onOpenSport, onBack }) {
  const [group, setGroup] = useState('全部')
  const [query, setQuery] = useState(initialQuery)

  const list = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return SPORTS.filter((sport) => {
      const inGroup = group === '全部' || sport.group === group
      const inQuery =
        !keyword ||
        sport.name.toLowerCase().includes(keyword) ||
        sport.en.toLowerCase().includes(keyword) ||
        sport.intro.toLowerCase().includes(keyword)
      return inGroup && inQuery
    })
  }, [group, query])

  return (
    <div className="h-full overflow-y-auto px-4 pb-10 sm:px-6">
      <div className="mx-auto max-w-[1180px]">
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 pb-4">
          <div>
            <h2 className="text-2xl text-white sm:text-3xl">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-white/70">{subtitle}</p>}
          </div>
          {onBack && (
            <button type="button" onClick={onBack} className="btn btn-glass btn-sm">
              ← 回到人体
            </button>
          )}
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-2">
          {['全部', ...SPORT_GROUPS].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setGroup(item)}
              className={`rounded-full px-4 py-1.5 text-sm transition ${
                group === item ? 'btn-blue' : 'btn-glass'
              }`}
            >
              {item}
            </button>
          ))}
          <label className="ml-auto flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm text-white/85 backdrop-blur">
            <span className="text-white/60">筛选</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="输入关键词"
              className="w-32 bg-transparent text-sm text-white outline-none placeholder:text-white/50"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((sport) => (
            <SportCard key={sport.slug} sport={sport} onOpen={onOpenSport} />
          ))}
        </div>

        {list.length === 0 && (
          <p className="mt-6 rounded-2xl bg-white/15 p-6 text-center text-sm text-white/80">
            没有找到匹配的运动，换个关键词或分类看看。
          </p>
        )}
      </div>
    </div>
  )
}
