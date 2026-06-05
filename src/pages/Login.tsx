import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/authApi'

const Login = () => {
    const navigate = useNavigate()
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

    return (
        <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-sm rounded" style={{ border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.4)' }}>
                <div className="px-8 py-6 border-b" style={{ borderColor: 'var(--card-border)' }}>
                    <h1 className="font-cinzel text-base tracking-widest text-[var(--accent)]">ADMIN LOGIN</h1>
                    <p className="mt-1 text-xs text-stone-500">창세기전 모바일 위키 관리자</p>
                </div>
                <div className="px-8 py-6 space-y-4">
                    <div>
                        <label className="block text-xs text-stone-500 mb-1.5">아이디</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleLogin()}
                            className="w-full rounded border bg-black/30 px-3 py-2 text-sm text-stone-200 outline-none"
                            style={{ borderColor: 'var(--card-border)' }}
                            autoComplete="username"
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
                            autoComplete="current-password"
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
    )
}

export default Login