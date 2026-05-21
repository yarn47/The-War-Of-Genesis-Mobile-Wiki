import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import AdminHome from './pages/admin/AdminHome'
import CharacterAdmin from './pages/admin/CharacterAdmin'
import ClassAdmin from './pages/admin/ClassAdmin'
import ItemAdmin from './pages/admin/ItemAdmin'
import BuffAdmin from './pages/admin/BuffAdmin'

export type Theme = 'seopoong' | 'light'

function App() {
    const [theme, setTheme] = useState<Theme>('light')

    return (
        <BrowserRouter>
            <div className="relative min-h-screen" data-theme={theme}>
                {/* 배경 이미지 */}
                <div
                    className="bg-theme fixed inset-0 z-0"
                    style={{ filter: 'var(--bg-filter)' }}
                />
                {/* 배경 오버레이 */}
                <div
                    className="fixed inset-0 z-0"
                    style={{ background: 'var(--overlay-gradient)' }}
                />

                {/* 컨텐츠 */}
                <div className="relative z-10 flex min-h-screen flex-col">
                    <Header theme={theme} setTheme={setTheme} />
                    <div className="flex flex-1">
                        <Sidebar />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/admin" element={<AdminHome />} />
                            <Route path="/admin/character" element={<CharacterAdmin />} />
                            <Route path="/admin/class" element={<ClassAdmin />} />
                            <Route path="/admin/item" element={<ItemAdmin />} />
                            <Route path="/admin/buff" element={<BuffAdmin />} />
                        </Routes>
                    </div>
                    <Footer />
                </div>
            </div>
        </BrowserRouter>
    )
}

export default App