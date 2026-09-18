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
    users: EffectUser[]      // 이 효과를 쓰는 캐릭터
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
        users: src.usedBy.map(u => ({ kind: u.kind, name: u.name, iconUrl: u.iconUrl })),
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

// 툴팁에 같이 띄울 사용자 (캐릭터 얼굴 · 공용 옵션이면 무기)
export interface EffectUser {
    kind: 'character' | 'weapon'
    name: string
    iconUrl: string | null
}

// 버프 이름 → 사용자 목록. 버프/디버프 메뉴에서는 버프마다 다르게 넘기면 된다
type UserLookup = (buffName: string) => EffectUser[]

interface EffectDictValue {
    dict: Dict
    usersOf: UserLookup
}

const EffectDictContext = createContext<EffectDictValue | null>(null)

export const useEffectEntry = (label: string): EffectEntry | null => {
    const ctx = useContext(EffectDictContext)
    if (!ctx) return null
    const direct = ctx.dict.get(label)
    if (direct) return direct
    // "이름 5" 형태인데 그 레벨이 없으면 본체라도
    const m = label.match(/^(.+?)\s*\d+$/)
    return (m && ctx.dict.get(m[1])) ?? null
}

// 화면에서 따로 넘긴 사용자가 있으면 그걸, 없으면 버프 자체의 사용자를 쓴다
export const useEffectUsers = (buffName: string): EffectUser[] => {
    const ctx = useContext(EffectDictContext)
    if (!ctx) return []
    const override = ctx.usersOf(buffName)
    return override.length > 0 ? override : (ctx.dict.get(buffName)?.users ?? [])
}

// 버프/디버프 전체 목록을 한 번만 받아서 사전으로 제공
// users: 이 화면 안의 효과를 쓰는 캐릭터 (캐릭터 페이지면 그 캐릭터 하나)
export const EffectDictProvider = ({ users, usersOf, children }: { users?: EffectUser[]; usersOf?: UserLookup; children: React.ReactNode }) => {
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

    const value = useMemo(() => {
        const map: Dict = new Map()
        buffs.forEach(b => buildEntries(b, 'buff').forEach(([k, v]) => map.set(k, v)))
        debuffs.forEach(d => buildEntries(d, 'debuff').forEach(([k, v]) => map.set(k, v)))
        return { dict: map, usersOf: usersOf ?? (() => users ?? []) }
    }, [buffs, debuffs, users, usersOf])

    return <EffectDictContext.Provider value={value}>{children}</EffectDictContext.Provider>
}
