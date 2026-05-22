import type { Theme } from '../../App'

interface HeaderProps {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const THEMES: { key: Theme; label: string }[] = [
    { key: 'seopoong', label: '서풍의광시곡' },
    { key: 'light', label: '라이트블링거' },
]

const Header = ({ theme, setTheme }: HeaderProps) => {
    return (
        <header className="sticky top-0 z-50 border-b border-[var(--card-border)] bg-[var(--card-header-bg)]">
            <div className="mx-auto flex h-15 max-w-screen-2xl items-center gap-6 px-6">
                {/* 로고 */}
                <div className="flex items-baseline gap-2 whitespace-nowrap">
          <span className="font-cinzel text-lg font-bold tracking-wider text-[var(--accent)] drop-shadow-[0_0_20px_rgba(201,168,76,0.4)]">
            GENESIS
          </span>
                    <span className="text-xs font-light tracking-widest text-[var(--text-secondary)]">
            창세기전 모바일 위키
          </span>
                </div>

                {/* 검색 */}
                <div className="relative flex-1 max-w-lg">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="캐릭터, 아이템, 스킬 검색..."
                        className="theme-input w-full rounded py-2 pl-9 pr-4 text-sm"
                    />
                </div>

                {/* 테마 전환 */}
                <div className="flex gap-1">
                    {THEMES.map(t => (
                        <button
                            key={t.key}
                            onClick={() => setTheme(t.key)}
                            className={`px-3 py-1.5 rounded font-cinzel text-[10px] tracking-widest ${
                                theme === t.key
                                    ? 'bg-[var(--accent-hover)] border border-[var(--accent)] text-[var(--accent)]'
                                    : 'border border-[var(--card-border)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* 로그인 */}
                <button className="whitespace-nowrap rounded border border-[var(--card-border)] px-4 py-1.5 font-cinzel text-xs tracking-widest text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--accent-hover)]">
                    LOGIN
                </button>
            </div>
        </header>
    )
}

export default Header