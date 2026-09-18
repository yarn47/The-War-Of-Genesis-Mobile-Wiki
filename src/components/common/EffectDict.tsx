import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getBuffList, getDebuffList } from '../../api/buffApi'
import type { BuffDto, DebuffDto, TagDto } from '../../api/buffApi'

// ─── 효과 텍스트 안의 버프/디버프 이름 → 상세 정보 사전 ──────────
// [관능의 아라베스크 5]{green} 처럼 레벨이 붙은 이름도 찾을 수 있게
// 버프 이름 · 레벨명 · "이름 N" 을 모두 키로 넣는다.

export interface EffectEntry {
    kind: 'buff' | 'debuff'
    name: string            // 버프 본체 이름
    level: number | null    // 레벨이 있는 버프면 해당 레벨
    duration: number | null
    maxStack: number | null
    effectText: string | null
    iconUrl: string | null
    tags: TagDto[]
}

export const PERMANENT_DURATION = -1

type Dict = Map<string, EffectEntry>

const buildEntries = (src: BuffDto | DebuffDto, kind: 'buff' | 'debuff'): [string, EffectEntry][] => {
    const base: EffectEntry = {
        kind,
        name: src.name,
        level: null,
        duration: src.duration,
        maxStack: src.maxStack,
        effectText: src.description,
        iconUrl: src.iconUrl,
        tags: src.tags,
    }

    const entries: [string, EffectEntry][] = [[src.name, base]]

    src.levels.forEach(lvl => {
        const entry: EffectEntry = {
            ...base,
            level: lvl.level,
            duration: lvl.duration ?? src.duration,
            maxStack: lvl.maxStack ?? src.maxStack,
            effectText: lvl.effectText ?? src.description,
        }
        // "관능의 아라베스크 5" / 레벨명이 따로 있으면 그것도
        entries.push([`${src.name} ${lvl.level}`, entry])
        if (lvl.levelName) entries.push([lvl.levelName, entry])
    })

    // 레벨만 있고 본체 설명이 없는 버프는 1레벨을 대표로
    if (!src.description && src.levels.length > 0) {
        const first = src.levels[0]
        entries[0] = [src.name, { ...base, effectText: first.effectText, duration: first.duration ?? src.duration, maxStack: first.maxStack ?? src.maxStack }]
    }

    return entries
}

const EffectDictContext = createContext<Dict | null>(null)

export const useEffectEntry = (label: string): EffectEntry | null => {
    const dict = useContext(EffectDictContext)
    if (!dict) return null
    const direct = dict.get(label)
    if (direct) return direct
    // "이름 5" 형태인데 그 레벨이 없으면 본체라도
    const m = label.match(/^(.+?)\s*\d+$/)
    return (m && dict.get(m[1])) ?? null
}

// 버프/디버프 전체 목록을 한 번만 받아서 사전으로 제공
export const EffectDictProvider = ({ children }: { children: React.ReactNode }) => {
    const [buffs, setBuffs] = useState<BuffDto[]>([])
    const [debuffs, setDebuffs] = useState<DebuffDto[]>([])

    useEffect(() => {
        let alive = true
        Promise.all([getBuffList().catch(() => []), getDebuffList().catch(() => [])])
            .then(([b, d]) => {
                if (!alive) return
                setBuffs(b)
                setDebuffs(d)
            })
        return () => { alive = false }
    }, [])

    const dict = useMemo(() => {
        const map: Dict = new Map()
        buffs.forEach(b => buildEntries(b, 'buff').forEach(([k, v]) => map.set(k, v)))
        debuffs.forEach(d => buildEntries(d, 'debuff').forEach(([k, v]) => map.set(k, v)))
        return map
    }, [buffs, debuffs])

    return <EffectDictContext.Provider value={dict}>{children}</EffectDictContext.Provider>
}
