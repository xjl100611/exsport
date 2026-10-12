import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import GeometryBackdrop from '../components/GeometryBackdrop'
import Reveal from '../components/Reveal'
import SportCard from '../components/SportCard'
import { SPORTS, SPORT_GROUPS } from '../data/sports'
import { useFavorites } from '../state/useFavorites'

export default function Sports() {
  const [group, setGroup] = useState('全部')
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const { favorites } = useFavorites()

  const list = useMemo(() => {
    let result = SPORTS
    if (group !== '全部') result = result.filter((sport) => sport.group === group)
    if (onlyFavorites) result = result.filter((sport) => favorites.includes(sport.slug))
    return result
  }, [group, onlyFavorites, favorites])

  return (
    <main className="light-sheet pb-8">
      <section className="relative overflow-hidden px-4 pt-8">
        <div className="glass wrap relative overflow-hidden rounded-[32px] px-6 py-10">
          <GeometryBackdrop variant="page" />
          <p className="section-eyebrow relative">全部运动</p>
          <h1 className="relative mt-2 text-3xl text-ink sm:text-4xl">十项最常见的运动</h1>
          <p className="relative mt-3 max-w-2xl text-sm leading-relaxed text-muted">
            每项运动都包含规则、入门五步、装备清单、训练要点和常见错误。想按身体部位找，可以从
            <Link to="/" className="mx-1 text-teal-deep hover:underline">
              人体伤痛地图
            </Link>
            进去。
          </p>
        </div>
      </section>

      <section className="wrap mt-8">
        <Reveal>
          <div className="flex flex-wrap items-center gap-2">
            {['全部', ...SPORT_GROUPS].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setGroup(item)}
                className={`rounded-full px-4 py-1.5 text-sm transition ${
                  group === item
                    ? 'bg-[#0fa9a0] text-white shadow-[0_12px_24px_-14px_rgba(15,169,160,0.9)]'
                    : 'glass text-muted hover:text-ink'
                }`}
              >
                {item}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setOnlyFavorites((v) => !v)}
              className={`rounded-full px-4 py-1.5 text-sm transition ${
                onlyFavorites ? 'bg-[#4a7cff] text-white' : 'glass text-muted hover:text-ink'
              }`}
            >
              只看已收藏 {favorites.length ? `(${favorites.length})` : ''}
            </button>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((sport, index) => (
            <Reveal key={sport.slug} delay={index * 40}>
              <SportCard sport={sport} />
            </Reveal>
          ))}
        </div>

        {list.length === 0 && (
          <p className="glass mt-6 rounded-2xl p-6 text-center text-sm text-muted">
            这个筛选下还没有内容，换一个分类看看。
          </p>
        )}
      </section>
    </main>
  )
}
