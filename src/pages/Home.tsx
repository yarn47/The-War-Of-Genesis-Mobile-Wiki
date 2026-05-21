const newsItems = [
    { title: '신규 전설 캐릭터 "흑태자" 출시', date: '2025.01.10' },
    { title: '서풍의 광시곡 업데이트 완료', date: '2025.01.08' },
    { title: '템페스트 이벤트 종료 안내', date: '2025.01.05' },
]

const popularItems = [
    { rank: 1, name: '흑태자', category: '캐릭터 · 전설', views: '1.2k' },
    { rank: 2, name: '아수라', category: '캐릭터 · 전설', views: '980' },
    { rank: 3, name: '발현 시스템', category: '시스템', views: '742' },
]

const categories = [
    { icon: '⚔️', name: '캐릭터', count: '156개' },
    { icon: '📖', name: '스토리', count: '48개' },
    { icon: '⚙️', name: '시스템', count: '32개' },
    { icon: '🛡️', name: '장비', count: '89개' },
]

const recentUpdates = [
    { name: '흑태자', time: '2시간 전' },
    { name: '아수라', time: '1일 전' },
    { name: '발현 시스템', time: '3일 전' },
]

const stats = [
    { label: '전체 문서', value: '325' },
    { label: '편집 횟수', value: '1,247' },
    { label: '기여자', value: '42' },
]

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`theme-card overflow-hidden rounded mb-5 ${className}`}>
        {children}
    </div>
)

const CardHeader = ({ title }: { title: string }) => (
    <div className="theme-card-header flex items-center gap-2.5 px-4 py-3">
        <div className="h-3.5 w-0.5 rounded bg-amber-500" />
        <span className="font-cinzel text-[11px] tracking-[0.15em] text-amber-500 uppercase">{title}</span>
    </div>
)

const Home = () => {
    return (
        <div className="flex flex-1">
            <main className="min-w-0 flex-1 px-8 py-7">
                {/* 히어로 */}
                <div className="theme-card relative mb-6 overflow-hidden rounded px-9 py-8">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
                    <h1 className="mb-2 font-serif-kr text-2xl font-bold text-amber-300 drop-shadow-[0_0_30px_rgba(201,168,76,0.3)]">
                        창세기전 모바일 위키
                    </h1>
                    <p className="text-sm tracking-wider text-[var(--text-secondary)]">
                        서풍의 광시곡 · 비공식 팬 위키 · 90년대 국산 SRPG의 귀환
                    </p>
                </div>

                {/* 최신 소식 */}
                <Card>
                    <CardHeader title="최신 소식" />
                    <div className="px-2 py-2">
                        {newsItems.map((item) => (
                            <div key={item.title} className="flex cursor-pointer items-center justify-between rounded border-l-2 border-transparent px-3 py-2.5 transition-all hover:border-amber-700 hover:bg-[var(--accent-hover)]">
                                <span className="text-sm text-[var(--text-primary)]">{item.title}</span>
                                <span className="ml-3 whitespace-nowrap text-xs text-[var(--text-muted)]">{item.date}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* 인기 문서 */}
                <Card>
                    <CardHeader title="인기 문서" />
                    <div className="px-2 py-2">
                        {popularItems.map((item) => (
                            <div key={item.rank} className="flex cursor-pointer items-center gap-3 rounded px-3 py-2 transition hover:bg-[var(--accent-hover)]">
                                <span className="w-6 text-center font-cinzel text-lg font-bold text-amber-800">{item.rank}</span>
                                <div className="flex-1">
                                    <div className="text-sm text-[var(--text-primary)]">{item.name}</div>
                                    <div className="text-xs text-[var(--text-muted)]">{item.category}</div>
                                </div>
                                <span className="text-xs text-[var(--text-muted)]">{item.views}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* 카테고리 */}
                <Card>
                    <CardHeader title="카테고리" />
                    <div className="grid grid-cols-4 gap-2.5 p-4">
                        {categories.map((cat) => (
                            <div key={cat.name} className="group relative cursor-pointer overflow-hidden rounded border border-[var(--card-border)] bg-white/[0.03] p-5 text-center transition-all hover:-translate-y-0.5 hover:border-amber-700/50 hover:bg-[var(--accent-hover)]">
                                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-800/40 to-transparent opacity-0 transition group-hover:opacity-100" />
                                <div className="mb-2 text-2xl">{cat.icon}</div>
                                <div className="mb-1 font-serif-kr text-sm text-[var(--text-primary)]">{cat.name}</div>
                                <div className="text-xs text-[var(--text-muted)]">{cat.count}</div>
                            </div>
                        ))}
                    </div>
                </Card>
            </main>

            {/* 오른쪽 사이드바 */}
            <aside className="sticky top-[60px] h-[calc(100vh-60px)] w-48 flex-shrink-0 overflow-y-auto border-l border-[var(--card-border)] theme-sidebar">
                <div className="border-b border-[var(--card-border)] p-4">
                    <div className="mb-3 font-cinzel text-[10px] tracking-[0.15em] text-amber-800 uppercase">최근 업데이트</div>
                    {recentUpdates.map((item) => (
                        <div key={item.name} className="group cursor-pointer border-b border-[var(--card-border)] py-1.5 last:border-0">
                            <div className="text-xs text-[var(--text-secondary)] transition group-hover:text-amber-300">{item.name}</div>
                            <div className="text-[10px] text-[var(--text-muted)]">{item.time}</div>
                        </div>
                    ))}
                </div>

                <div className="m-4 flex h-48 flex-col items-center justify-center rounded border border-dashed border-[var(--card-border)] bg-white/[0.01]">
                    <span className="text-[10px] text-[var(--text-muted)]">광고</span>
                    <span className="mt-1 text-[10px] text-[var(--text-muted)] opacity-50">160 × 200</span>
                </div>

                <div className="p-4">
                    <div className="mb-3 font-cinzel text-[10px] tracking-[0.15em] text-amber-800 uppercase">위키 통계</div>
                    {stats.map((stat) => (
                        <div key={stat.label} className="flex justify-between border-b border-[var(--card-border)] py-1.5 last:border-0">
                            <span className="text-xs text-[var(--text-secondary)]">{stat.label}</span>
                            <span className="text-xs font-semibold text-amber-500">{stat.value}</span>
                        </div>
                    ))}
                </div>
            </aside>
        </div>
    )
}

export default Home