import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Theme } from '../../App'
import { login, logout } from '../../api/authApi'

interface HeaderProps {
    theme: Theme
    setTheme: (theme: Theme) => void
    isAdmin: boolean | null
    setIsAdmin: (v: boolean) => void
}

const THEMES: { key: Theme; label: string }[] = [
    { key: 'seopoong', label: '서풍의광시곡' },
    { key: 'light', label: '라이트블링거' },
]

const Header = ({ theme, setTheme, isAdmin, setIsAdmin }: HeaderProps) => {
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        if (!username.trim() || !password.trim()) return
        setLoading(true)
        setError('')
        try {
            const res = await login(username, password)
            if (res.success) {
                setIsAdmin(true)
                setShowModal(false)
                setUsername('')
                setPassword('')
                navigate('/admin')
            } else {
                setError(res.message)
            }
        } catch {
            setError('서버 연결에 실패했습니다')
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        await logout()
        setIsAdmin(false)
        navigate('/')
    }

    const handleClose = () => {
        setShowModal(false)
        setUsername('')
        setPassword('')
        setError('')
    }

    return (
        <>
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
                        <input type="text" placeholder="캐릭터, 아이템, 스킬 검색..." className="theme-input w-full rounded py-2 pl-9 pr-4 text-sm" />
                    </div>

                    {/* 테마 전환 */}
                    <div className="flex gap-1">
                        {THEMES.map(t => (
                            <button key={t.key} onClick={() => setTheme(t.key)}
                                    className={`px-3 py-1.5 rounded font-cinzel text-[10px] tracking-widest ${
                                        theme === t.key
                                            ? 'bg-[var(--accent-hover)] border border-[var(--accent)] text-[var(--accent)]'
                                            : 'border border-[var(--card-border)] text-[var(--text-muted)]'
                                    }`}
                            >{t.label}</button>
                        ))}
                    </div>

                    {/* 로그인/로그아웃 */}
                    {isAdmin ? (
                        <div className="flex items-center gap-2">
                            <button onClick={() => navigate('/admin')}
                                    className="whitespace-nowrap rounded border border-[var(--card-border)] px-4 py-1.5 font-cinzel text-xs tracking-widest text-[var(--accent)]">
                                ADMIN
                            </button>
                            <button onClick={handleLogout}
                                    className="whitespace-nowrap rounded border border-[var(--card-border)] px-4 py-1.5 font-cinzel text-xs tracking-widest text-stone-500">
                                LOGOUT
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setShowModal(true)}
                                className="whitespace-nowrap rounded border border-[var(--card-border)] px-4 py-1.5 font-cinzel text-xs tracking-widest text-[var(--accent)]">
                            LOGIN
                        </button>
                    )}
                </div>
            </header>

            {/* 로그인 모달 */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    {/* 배경 */}
                    <div className="absolute inset-0 bg-black/60" onClick={handleClose} />

                    {/* 팝업 */}
                    <div className="relative w-80 rounded" style={{ border: '1px solid var(--card-border)', background: 'rgba(15,12,8,0.97)' }}>
                        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--card-border)' }}>
                            <span className="font-cinzel text-xs tracking-widest text-[var(--accent)]">ADMIN LOGIN</span>
                            <button onClick={handleClose} className="text-stone-600 hover:text-stone-400 text-lg leading-none">×</button>
                        </div>

                        <div className="px-6 py-5 space-y-4">
                            <div>
                                <label className="block text-xs text-stone-500 mb-1.5">아이디</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                                    className="w-full rounded border bg-black/30 px-3 py-2 text-sm text-stone-200 outline-none"
                                    style={{ borderColor: 'var(--card-border)' }}
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-stone-500 mb-1.5">비밀번호</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                                    className="w-full rounded border bg-black/30 px-3 py-2 text-sm text-stone-200 outline-none"
                                    style={{ borderColor: 'var(--card-border)' }}
                                />
                            </div>
                            {error && <p className="text-xs text-red-400">{error}</p>}
                            <button
                                onClick={handleLogin}
                                disabled={loading}
                                className="w-full rounded py-2 text-sm font-semibold"
                                style={{ background: 'var(--accent)', color: '#000', opacity: loading ? 0.6 : 1 }}
                            >
                                {loading ? '로그인 중...' : '로그인'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Header