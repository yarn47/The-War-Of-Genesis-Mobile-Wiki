import { useNavigate } from 'react-router-dom'

const adminMenus = [
    {
        title: '캐릭터 관리',
        description: '캐릭터 등록, 수정, 발현/스킬/클래스 데이터 입력',
        icon: '⚔️',
        href: '/admin/character',
    },
    {
        title: '아이템 관리',
        description: '장비, 전용무기 등록 및 수정',
        icon: '🛡️',
        href: '/admin/item',
    },
    {
        title: '버프/디버프 관리',
        description: '버프, 디버프 등록 및 출처 연결',
        icon: '✨',
        href: '/admin/buff',
    },
]

const AdminHome = () => {
    const navigate = useNavigate()

    return (
        <main className="min-w-0 flex-1 px-8 py-7">
            {/* 헤더 */}
            <div className="relative mb-8 overflow-hidden rounded border border-amber-900/25 bg-stone-950/40 px-8 py-6 backdrop-blur-sm">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
                <h1 className="font-cinzel text-xl font-bold tracking-widest text-amber-400">
                    ADMIN
                </h1>
                <p className="mt-1 text-sm text-stone-500">관리자 페이지</p>
            </div>

            {/* 메뉴 그리드 */}
            <div className="grid grid-cols-3 gap-4">
                {adminMenus.map((menu) => (
                    <div
                        key={menu.title}
                        onClick={() => navigate(menu.href)}
                        className="group relative cursor-pointer overflow-hidden rounded border border-amber-900/25 bg-stone-950/40 p-6-[transform,border-color,background-color] hover:-translate-y-0.5 hover:border-amber-700/50 hover:bg-amber-900/6"
                    >
                        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-800/40 to-transparent opacity-0 group-hover:opacity-100" />
                        <div className="mb-3 text-3xl">{menu.icon}</div>
                        <div className="mb-1 font-cinzel text-sm tracking-wider text-amber-400">
                            {menu.title}
                        </div>
                        <div className="text-xs text-stone-500">{menu.description}</div>
                    </div>
                ))}
            </div>
        </main>
    )
}

export default AdminHome