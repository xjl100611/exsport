// 顶部只有两件东西：居中的白色搜索框（蓝色搜索按钮在框内）+ 搜索框右侧的「所有运动」按钮
export default function SearchHeader({ query, onQueryChange, onSubmit, onShowAll }) {
  return (
    <header className="relative z-20 flex shrink-0 justify-center px-4 pt-5 pb-4 sm:pt-7">
      <div className="relative">
        <form
          className="search-pill"
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit()
          }}
          role="search"
        >
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="搜索运动，例如：跑步、瑜伽、游泳"
            aria-label="搜索运动"
            style={{ paddingRight: '96px' }}
          />
          <button
            type="submit"
            className="search-submit"
            aria-label="搜索"
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="2" />
              <path d="M13 13l4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            搜索
          </button>
        </form>

        <button
          type="button"
          onClick={onShowAll}
          className="all-sports-btn"
        >
          所有运动
        </button>
      </div>
    </header>
  )
}
