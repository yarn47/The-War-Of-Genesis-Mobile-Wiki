import { useState } from 'react'
import type { ExclusiveWeaponDto } from '../../api/itemApi'
import EffectText from './EffectText'

// 캐릭터 상세와 아이템 상세에서 같이 쓰는 전용무기 표시

export type Palette = { primary: string; bg: string; border: string; text: string }

const GRADE_LABELS: Record<string, string> = { rare: '희귀', hero: '영웅', legend: '전설', outer: '아우터원' }

// baseStats: [{ step, maxHp, attack, critRate, physPen }] 형태의 JSON 문자열
type WeaponStep = { step: number; maxHp?: number; attack?: number; critRate?: number; physPen?: number }

const parseWeaponStats = (json: string | null): WeaponStep[] => {
    if (!json) return []
    try {
        const parsed: unknown = JSON.parse(json)
        return Array.isArray(parsed) ? (parsed as WeaponStep[]).filter(s => typeof s?.step === 'number') : []
    } catch {
        return []
    }
}

const Collapsible = ({ title, color, children }: { title: string; color: Palette; children: React.ReactNode }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className="mb-2 overflow-hidden rounded" style={{ border: `1px solid ${color.border}` }}>
            <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-2 text-left" style={{ background: color.bg }}>
                <span className="text-base font-semibold" style={{ color: color.text }}>{title}</span>
                <span className="text-sm" style={{ color: color.primary }}>{open ? '▲' : '▼'}</span>
            </button>
            {open && <div className="p-4 border-t" style={{ borderColor: color.border }}>{children}</div>}
        </div>
    )
}

const WeaponInfo = ({ weapon, color }: { weapon: ExclusiveWeaponDto; color: Palette }) => {
    const steps = parseWeaponStats(weapon.baseStats)
    // 무기마다 붙는 수치가 달라서 값이 있는 칸만 표로 보여준다
    const columns = ([
        { key: 'maxHp', label: '최대 체력', fmt: (v: number) => v.toLocaleString() },
        { key: 'attack', label: '공격력', fmt: (v: number) => v.toLocaleString() },
        { key: 'critRate', label: '치명타 확률', fmt: (v: number) => `+${v}%` },
        { key: 'physPen', label: '물리 관통', fmt: (v: number) => `+${v}%` },
    ] as const).filter(col => steps.some(s => s[col.key] != null))
    return (
        <div className="flex items-start gap-4">
            {weapon.iconUrl && (
                <img src={weapon.iconUrl} alt="" className="w-24 h-24 rounded object-cover shrink-0" style={{ border: `1px solid ${color.border}` }} />
            )}
            <div className="flex-1 min-w-0">
                <div className="font-semibold text-lg mb-1" style={{ color: color.text }}>{weapon.name}</div>
                <div className="text-sm text-stone-500 mb-2">{weapon.weaponType} · {GRADE_LABELS[weapon.grade] ?? weapon.grade}</div>
                {weapon.description && <div className="text-sm text-stone-100 mb-3 whitespace-pre-line leading-relaxed">{weapon.description}</div>}
                {weapon.extraStats && (
                    <div className="text-sm mb-3"><span className="text-stone-500">추가 능력치 </span><span className="text-stone-300">{weapon.extraStats}</span></div>
                )}

                {steps.length > 0 && (
                    <div className="mb-3 overflow-x-auto">
                        <table className="text-sm text-stone-400">
                            <thead>
                                <tr style={{ color: color.text }}>
                                    <th className="pr-3 py-0.5 text-left font-medium">각성</th>
                                    {columns.map(col => (
                                        <th key={col.key} className="pr-3 py-0.5 text-left font-medium">{col.label}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {steps.map(s => (
                                    <tr key={s.step}>
                                        <td className="pr-3 py-0.5">{s.step}단</td>
                                        {columns.map(col => (
                                            <td key={col.key} className="pr-3 py-0.5 text-stone-300">
                                                {s[col.key] != null ? col.fmt(s[col.key] as number) : '-'}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {weapon.effects.map(effect => (
                    <Collapsible key={effect.effectId} title={`${effect.effectName}${effect.effectType === 'exclusive' ? ' (캐릭터 전용)' : ''}`} color={color}>
                        {effect.baseEffect && <div className="text-sm text-stone-400 mb-2"><EffectText text={effect.baseEffect} /></div>}
                        <div className="space-y-1">
                            {effect.levels.map(lvl => (
                                <div key={lvl.breakthroughStep} className="flex gap-2 text-sm">
                                    <span className="shrink-0 rounded px-1.5 py-0.5 font-bold" style={{ background: color.bg, color: color.text }}>
                                        각성 {lvl.breakthroughStep}단
                                    </span>
                                    <EffectText text={lvl.effectText} className="text-stone-300 leading-relaxed" />
                                </div>
                            ))}
                        </div>
                    </Collapsible>
                ))}
            </div>
        </div>
    )
}

export default WeaponInfo
