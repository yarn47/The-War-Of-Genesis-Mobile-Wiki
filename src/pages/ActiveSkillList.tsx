import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getActiveSkills } from '../api/skillApi'
import type { ActiveSkillDto } from '../api/skillApi'
import ElementBadge from '../components/common/ElementBadge'
import EffectText from '../components/common/EffectText'
import { EffectDictProvider } from '../components/common/EffectDict'
import { getTagColorClass } from '../constants/tagColors'

const weapons = (value: string | null) => value?.split(/[,、]/).map(s => s.trim()).filter(Boolean) ?? []
const types = (row: ActiveSkillDto) => row.attackTypes
const allowedWeapons = (row: ActiveSkillDto) => weapons(row.skill.allowedWeapon).length ? weapons(row.skill.allowedWeapon) : ['미등록']

function SkillRow({ row }: { row: ActiveSkillDto }) {
    const [open, setOpen] = useState(false)
    const { skill, usedBy } = row
    const range = skill.rangeMin == null ? '미등록' : skill.rangeMin === 0 && skill.rangeMax === 0 ? '자신' :
        skill.rangeMax == null || skill.rangeMin === skill.rangeMax ? `${skill.rangeMin}` : `${skill.rangeMin}–${skill.rangeMax}`
    return (
        <article className="overflow-hidden rounded border border-[var(--card-border)]" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <button type="button" aria-expanded={open} aria-controls={`skill-${skill.skillId}`} onClick={() => setOpen(!open)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[var(--accent-hover)]">
                {skill.iconUrl && <img src={skill.iconUrl} alt="" loading="lazy" className="h-10 w-10 shrink-0 rounded object-contain" />}
                <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-[var(--accent)]">{skill.name}</span>
                        <ElementBadge element={skill.element} />
                        {skill.tags.map(tag => <span key={tag.tagId} className={`rounded px-1.5 py-0.5 text-[11px] ${getTagColorClass(tag.color)}`}>{tag.name}</span>)}
                    </span>
                    <span className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--text-secondary)]">
                        <span>허용 무기: {skill.allowedWeapon || '미등록'}</span>
                        <span>공격 타입: {types(row).join(' · ')}</span>
                    </span>
                </span>
                <span className="text-xs text-[var(--accent)]" aria-hidden>{open ? '▲' : '▼'}</span>
            </button>
            <div className="flex flex-wrap items-center gap-2 px-4 pb-3 text-xs text-[var(--text-secondary)]">
                <span>사용 캐릭터</span>
                {usedBy.length === 0 ? <span>등록된 캐릭터 없음</span> : usedBy.map(owner => (
                    <Link key={owner.id} to={`/characters/${owner.id}`} className="inline-flex items-center gap-1.5 rounded border border-[var(--card-border)] px-2 py-1 hover:bg-[var(--accent-hover)] hover:text-[var(--accent)]">
                        {owner.iconUrl && <img src={owner.iconUrl} alt="" loading="lazy" className="h-6 w-6 rounded-full object-cover" />}
                        {owner.name}
                    </Link>
                ))}
            </div>
            {open && <div id={`skill-${skill.skillId}`} className="space-y-3 border-t border-[var(--card-border)] px-4 py-3 text-sm text-[var(--text-secondary)]">
                <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs">
                    <span>TP {skill.tpCost ?? '미등록'}</span><span>사거리 {range}</span>
                    <span>범위 {skill.area || '미등록'}</span><span>쿨타임 {skill.cooldown == null ? '미등록' : `${skill.cooldown}턴`}</span>
                </div>
                <div className="whitespace-pre-line leading-relaxed"><EffectText text={skill.effectText || '등록된 효과 설명이 없습니다.'} /></div>
                <p className="text-xs">습득 클래스: {row.classes.map(c => c.name).join(' · ') || '미등록'}</p>
            </div>}
        </article>
    )
}

export default function ActiveSkillList() {
    const [rows, setRows] = useState<ActiveSkillDto[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [retry, setRetry] = useState(0)
    const [query, setQuery] = useState('')
    const [weapon, setWeapon] = useState('')
    const [attackType, setAttackType] = useState('')
    useEffect(() => {
        const controller = new AbortController()
        getActiveSkills(controller.signal).then(data => {
            if (!controller.signal.aborted) setRows(data)
        }).catch(() => {
            if (!controller.signal.aborted) setError(true)
        }).finally(() => {
            if (!controller.signal.aborted) setLoading(false)
        })
        return () => controller.abort()
    }, [retry])
    const weaponOptions = useMemo(() => [...new Set(rows.flatMap(allowedWeapons))].sort(), [rows])
    const typeOptions = useMemo(() => [...new Set(rows.flatMap(types))].sort(), [rows])
    const filtered = useMemo(() => rows.filter(row =>
        (!query.trim() || [row.skill.name, ...row.usedBy.map(c => c.name)].some(name => name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))) &&
        (!weapon || allowedWeapons(row).includes(weapon)) && (!attackType || types(row).includes(attackType))
    ), [rows, query, weapon, attackType])
    const controlStyle = 'rounded border border-[var(--card-border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text-primary)]'
    return <EffectDictProvider><main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-screen-lg px-4 py-6 sm:px-8">
            <h1 className="font-cinzel text-2xl font-bold tracking-widest text-[var(--accent)]">액티브 스킬</h1>
            <p className="mt-2 mb-6 text-xs text-[var(--text-secondary)]">허용 무기 · 공격 타입 · 사용 캐릭터{!loading && !error && ` / ${filtered.length}개 (전체 ${rows.length}개)`}</p>
            <div className="mb-5 flex flex-wrap gap-2">
                <input aria-label="스킬 또는 캐릭터 검색" placeholder="스킬 또는 캐릭터 이름 검색" value={query} onChange={e => setQuery(e.target.value)} className={`${controlStyle} min-w-0 flex-1 basis-full sm:basis-48`} />
                <select aria-label="허용 무기" value={weapon} onChange={e => setWeapon(e.target.value)} className={controlStyle}>
                    <option value="">허용 무기 전체</option>{weaponOptions.map(v => <option key={v}>{v}</option>)}
                </select>
                <select aria-label="공격 타입" value={attackType} onChange={e => setAttackType(e.target.value)} className={controlStyle}>
                    <option value="">공격 타입 전체</option>{typeOptions.map(v => <option key={v}>{v}</option>)}
                </select>
                {(query || weapon || attackType) && <button type="button" onClick={() => { setQuery(''); setWeapon(''); setAttackType('') }} className={controlStyle}>초기화</button>}
            </div>
            {loading ? <p role="status" className="py-12 text-center text-[var(--text-secondary)]">스킬을 불러오는 중입니다.</p> : error ?
                <div role="alert" className="py-12 text-center text-[var(--text-secondary)]">스킬을 불러오지 못했습니다. <button type="button" className="text-[var(--accent)] underline" onClick={() => { setLoading(true); setError(false); setRetry(n => n + 1) }}>다시 시도</button></div> :
                filtered.length ? <div className="space-y-2">{filtered.map(row => <SkillRow key={row.skill.skillId} row={row} />)}</div> :
                    <p className="py-12 text-center text-[var(--text-secondary)]">검색 결과가 없습니다.</p>}
        </div>
    </main></EffectDictProvider>
}
