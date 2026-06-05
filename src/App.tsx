import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import CharacterDetail from './pages/CharacterDetail'
import CharacterList from './pages/CharacterList'
import AdminHome from './pages/admin/AdminHome'
import CharacterAdmin from './pages/admin/CharacterAdmin'
import ClassAdmin from './pages/admin/ClassAdmin'
import ItemAdmin from './pages/admin/ItemAdmin'
import BuffAdmin from './pages/admin/BuffAdmin'
import { checkAuth } from './api/authApi'

export type Theme = 'seopoong' | 'light'

// 관리자 라우트 보호
const AdminRoute = ({ isAdmin, children }: { isAdmin: boolean | null; children: React.ReactNode }) => {
    if (isAdmin === null) return null // 체크 중
    if (!isAdmin) return <Navigate to="/login" replace />
    return <>{children}</>
}

function App() {
    const [theme, setTheme] = useState<Theme>('light')
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

    useEffect(() => {
        checkAuth()
            .then(res => setIsAdmin(res.success))
            .catch(() => setIsAdmin(false))
    }, [])

    return (
        <BrowserRouter>
            <div className="relative min-h-screen" data-theme={theme}>
                <div className="bg-theme fixed inset-0 z-0" style={{ filter: 'var(--bg-filter)' }} />
                <div className="fixed inset-0 z-0" style={{ background: 'var(--overlay-gradient)' }} />

                <div className="relative z-10 flex min-h-screen flex-col">
                    <Header theme={theme} setTheme={setTheme} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
                    <div className="flex flex-1">
                        <Sidebar />
                        <Routes>
                            {/* 공개 */}
                            <Route path="/" element={<Home />} />
                            <Route path="/characters" element={<CharacterList />} />
                            <Route path="/characters/:id" element={<CharacterDetail />} />

                            {/* 관리자 */}
                            <Route path="/admin" element={<AdminRoute isAdmin={isAdmin}><AdminHome /></AdminRoute>} />
                            <Route path="/admin/character" element={<AdminRoute isAdmin={isAdmin}><CharacterAdmin /></AdminRoute>} />
                            <Route path="/admin/class" element={<AdminRoute isAdmin={isAdmin}><ClassAdmin /></AdminRoute>} />
                            <Route path="/admin/item" element={<AdminRoute isAdmin={isAdmin}><ItemAdmin /></AdminRoute>} />
                            <Route path="/admin/buff" element={<AdminRoute isAdmin={isAdmin}><BuffAdmin /></AdminRoute>} />
                        </Routes>
                    </div>
                    <Footer />
                </div>
            </div>
        </BrowserRouter>
    )
}

export default App