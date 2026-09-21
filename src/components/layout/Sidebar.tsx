import { Link, useLocation } from 'react-router-dom'

const navItems = [
    {
        label: '메뉴',
        items: [
            { name: '홈', href: '/' },
            { name: '캐릭터', href: '/characters' },
            { name: '스토리', href: '/story' },
            { name: '시스템', href: '/system' },
            { name: '장비', href: '/equipment' },
            { name: '공략', href: '/guide' },
        ]
    },
    {
        label: '컨텐츠',
        items: [
            { name: '버프/디버프', href: '/buff' },
            { name: '아이템', href: '/items' },
            { name: '업데이트', href: '/update' },
        ]
    },
    {
        label: '관리자',
        adminOnly: true,
        items: [
            { name: '캐릭터 관리', href: '/admin/character' },
            { name: '클래스 관리', href: '/admin/class' },
            { name: '아이템 관리', href: '/admin/item' },
            { name: '버프/디버프 관리', href: '/admin/buff' },
        ]
    }
]

const Sidebar = ({ isAdmin }: { isAdmin: boolean | null }) => {
    const location = useLocation()

    return (
        <aside className="sticky top-[60px] hidden h-[calc(100vh-60px)] w-48 flex-shrink-0 overflow-y-auto border-r border-[var(--card-border)] theme-sidebar py-5 md:block">
            {navItems.filter(section => !section.adminOnly || isAdmin).map((section) => (
                <div key={section.label} className="mb-5">
                    <div className="mb-1.5 flex items-center gap-2 px-4">
                        <div className="h-px flex-1 bg-[var(--card-border)]" />
                        <span className="font-cinzel text-[9px] tracking-[0.2em] text-[var(--accent)] uppercase">
              {section.label}
            </span>
                        <div className="h-px flex-1 bg-[var(--card-border)]" />
                    </div>
                    {section.items.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`block border-l-2 px-4 py-2 text-[13px] tracking-wide
                ${location.pathname === item.href
                                ? 'border-amber-500 bg-[var(--accent-hover)] text-amber-400'
                                : 'border-transparent text-[var(--text-secondary)] hover:border-amber-700 hover:bg-[var(--accent-hover)] hover:text-amber-200'
                            }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            ))}
        </aside>
    )
}

// 좁은 화면용 가로 메뉴 (사이드바 대신)
export const MobileNav = ({ isAdmin }: { isAdmin: boolean | null }) => {
    const location = useLocation()
    const items = navItems.filter(section => !section.adminOnly || isAdmin).flatMap(s => s.items)

    return (
        <nav className="sticky top-[60px] z-30 flex gap-1 overflow-x-auto border-b border-[var(--card-border)] theme-sidebar px-3 py-2 md:hidden">
            {items.map(item => (
                <Link
                    key={item.name}
                    to={item.href}
                    className={`shrink-0 rounded px-3 py-1.5 text-xs tracking-wide ${
                        location.pathname === item.href
                            ? 'bg-[var(--accent-hover)] text-amber-400'
                            : 'text-[var(--text-secondary)]'
                    }`}
                >
                    {item.name}
                </Link>
            ))}
        </nav>
    )
}

export default Sidebar