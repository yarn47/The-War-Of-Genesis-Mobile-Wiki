import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getWeaponDetail } from '../api/itemApi'
import type { ExclusiveWeaponDto } from '../api/itemApi'
import WeaponInfo, { type Palette } from '../components/common/WeaponInfo'

const GRADE_PALETTES: Record<string, Palette> = {
    rare:   { primary: '#3B82F6', bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.35)',  text: '#93C5FD' },
    hero:   { primary: '#9333EA', bg: 'rgba(147,51,234,0.08)',  border: 'rgba(147,51,234,0.35)',  text: '#C4B5FD' },
    legend: { primary: '#F59E0B', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.35)',  text: '#FCD34D' },
}

const WeaponDetail = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [weapon, setWeapon] = useState<ExclusiveWeaponDto | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        if (!id) return
        getWeaponDetail(Number(id))
            .then(setWeapon)
            .catch(() => setError(true))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return (
        <div className="flex flex-1 items-center justify-center py-20">
            <div className="text-stone-500 font-cinzel tracking-widest text-sm">LOADING...</div>
        </div>
    )

    if (error || !weapon) return (
        <div className="flex flex-1 items-center justify-center py-20">
            <div className="text-center">
                <div className="text-stone-500 mb-3">무기를 찾을 수 없습니다</div>
                <button onClick={() => navigate('/items')} className="text-xs text-stone-600 hover:text-stone-400">← 아이템 목록</button>
            </div>
        </div>
    )

    const color = GRADE_PALETTES[weapon.grade] ?? GRADE_PALETTES['legend']

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="max-w-screen-lg mx-auto px-8 py-6">
                <button onClick={() => navigate('/items')} className="mb-4 text-xs text-stone-600 hover:text-stone-400">← 아이템 목록</button>
                <div className="rounded p-5" style={{ border: `1px solid ${color.border}`, background: 'rgba(0,0,0,0.3)' }}>
                    <WeaponInfo weapon={weapon} color={color} />
                </div>
            </div>
        </div>
    )
}

export default WeaponDetail
