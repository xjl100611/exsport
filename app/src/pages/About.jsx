import { Link } from 'react-router-dom'
import GeometryBackdrop from '../components/GeometryBackdrop'
import Reveal from '../components/Reveal'
import { DISCLAIMER } from '../data/sports'

export default function About() {
  return (
    <main className="light-sheet pb-8">
      <section className="px-4 pt-8">
        <div className="glass relative overflow-hidden rounded-[32px] px-6 py-12 text-center sm:px-10">
          <GeometryBackdrop variant="page" />
          <p className="section-eyebrow relative">关于</p>
          <h1 className="relative mt-2 text-4xl text-ink">exsport</h1>
          <p className="relative mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            名字由 expert 和 sport 组合而成，想做的事很具体：把「专家级的运动常识」讲成普通人能直接用的东西，
            并且从一个最常被忽略的问题切入——哪里痛，该练什么。
          </p>
        </div>
      </section>

      <section className="wrap mt-10 grid gap-4 lg:grid-cols-2">
        <Reveal>
          <div className="glass h-full rounded-3xl p-6">
            <p className="section-eyebrow">首页为什么是人体</p>
            <h2 className="mt-2 text-2xl text-ink">从身体出发，而不是从项目出发</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              大多数运动网站先列出项目，再让人自己挑。但真正让人开始运动的原因，往往是一处具体的酸痛：
              久坐的腰、跑完疼的膝盖、一直紧张的肩。所以 exsport 把可以旋转的解剖人体放在首页，
              点身体上的部位，直接看到成因和可以尝试的运动。
            </p>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="glass h-full rounded-3xl p-6">
            <p className="section-eyebrow">内容是怎么来的</p>
            <h2 className="mt-2 text-2xl text-ink">AI 生成底稿，人工审校</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              运动与创伤相关的内容先由 AI 生成底稿，再逐条人工核对事实与表述，避免出现夸大或误导性的说法。
              当前版本仍是演示版，内容用于展示结构与交互。
            </p>
            <p className="mt-3 rounded-2xl border border-[rgba(226,104,79,0.3)] bg-[rgba(226,104,79,0.08)] p-3 text-xs leading-relaxed text-muted">
              {DISCLAIMER}
            </p>
          </div>
        </Reveal>
      </section>

      <section className="wrap mt-4">
        <Reveal>
          <div className="glass rounded-3xl p-6">
            <p className="section-eyebrow">素材与授权</p>
            <h2 className="mt-2 text-2xl text-ink">3D 人体模型来自开源基础网格</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
              <li>
                人体模型使用 MakeHuman 项目的基础网格（base mesh），该资源由作者在 2020 年明确以 CC0 1.0
                协议发布，可自由使用与商用，不要求署名。
              </li>
              <li>我们仍然在页面上标注来源，方便你追溯素材出处。</li>
              <li>其余图片素材目前全部为占位素材，正式版上线前会替换为自有或有授权的图片。</li>
              <li>
                痛点位坐标由项目内的 scripts/build-anchors.mjs 从模型表面离线计算得到，新增痛点只需追加一条坐标。
              </li>
            </ul>
          </div>
        </Reveal>
      </section>

      <section className="wrap mt-4">
        <Reveal>
          <div className="glass rounded-3xl p-6">
            <p className="section-eyebrow">联系方式</p>
            <h2 className="mt-2 text-2xl text-ink">想提建议或纠正内容</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              演示版暂未开放表单提交，正式版会在这里放联系邮箱与内容纠错入口。你也可以先
              <Link to="/sports" className="mx-1 text-teal-deep hover:underline">
                浏览全部运动
              </Link>
              看看内容结构。
            </p>
          </div>
        </Reveal>
      </section>
    </main>
  )
}
