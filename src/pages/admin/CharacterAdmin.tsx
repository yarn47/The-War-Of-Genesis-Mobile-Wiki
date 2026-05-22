import { useState, useEffect, useCallback, memo } from 'react'
import {
    Section, Field, Input, Select, Textarea,
    AddBtn, RemoveBtn, ItemBox, Grid, CancelBtn, SaveBtn
} from '../../components/common/AdminComponents'
import { useToast } from '../../components/common/Toast'
import {
    getAdminCharacterList, getAdminCharacterDetail,
    createCharacter, updateCharacter, deleteCharacter,
    type CharacterSummaryDto, type CharacterDetailDto,
    type CharacterRequest, type ClassTreeNodeRequest
} from '../../api/characterApi'
import { searchWeapons, type ExclusiveWeaponDto } from '../../api/itemApi'
import { getAllClasses, type ClassSummaryDto } from '../../api/classApi'

// ─── 상수 ──────────────────────────────────────────────────

const GRADES = [{ value: 'rare', label: '희귀' }, { value: 'hero', label: '영웅' }, { value: 'legend', label: '전설' }, { value: 'outer', label: '아우터원' }]
const FACTIONS = [{ value: 'geysir', label: '게이시르' }, { value: 'pendragon', label: '팬드래건' }, { value: 'independent', label: '무소속' }, { value: 'astania', label: '아스타니아' }, { value: 'zephyrfalcon', label: '제피르팰컨' }, { value: 'dagal', label: '다갈' }]
const ELEMENTS = [{ value: 'light', label: '신념의빛' }, { value: 'dark', label: '욕망의그림자' }, { value: 'fire', label: '자유의불꽃' }, { value: 'crystal', label: '지성의결정체' }, { value: 'nature', label: '활력의나무' }]
const PASSIVE_LEVELS = [
    { type: 'awaken', step: 3, label: '각성 3' }, { type: 'awaken', step: 4, label: '각성 4' },
    { type: 'awaken', step: 5, label: '각성 5' }, { type: 'awaken', step: 6, label: '각성 6' },
    { type: 'manifest', step: 2, label: '발현 2' }, { type: 'manifest', step: 4, label: '발현 4' },
    { type: 'manifest', step: 6, label: '발현 6' },
]
const ULTIMATE_STEPS = [0, 1, 3, 5]
const ARTIFACT_STEPS = [3, 4, 5, 6]

// ─── 섹션별 state 타입 ─────────────────────────────────────

interface BasicState {
    name: string; grade: string; faction: string; element: string
    exclusiveWeaponId: string; exclusiveWeaponName: string
    birthYear: string; height: string; cv: string; profileText: string
    thumbnailUrl: string; portraitUrl: string; fullImageUrl: string
    isPublished: boolean
}

interface StatsState {
    hp: string; attack: string; defense: string
    critRate: string; critDamage: string
    physPen: string; magicPen: string; effectResist: string
}

interface PassiveState {
    name: string; iconUrl: string
    levels: { [key: string]: string }
}

interface UltimateLevelState {
    tpCost: string; rangeMin: string; rangeMax: string; cooldown: string; effectText: string
}

interface UltimateState {
    name: string; iconUrl: string
    levels: { [step: number]: UltimateLevelState }
}

interface ArtifactForm {
    _key: number; name: string; iconUrl: string
    levels: { [step: number]: string }
}

// ─── 기본값 ────────────────────────────────────────────────

const emptyBasic = (): BasicState => ({
    name: '', grade: 'legend', faction: 'geysir', element: 'light',
    exclusiveWeaponId: '', exclusiveWeaponName: '',
    birthYear: '', height: '', cv: '', profileText: '',
    thumbnailUrl: '', portraitUrl: '', fullImageUrl: '',
    isPublished: false
})

const emptyStats = (): StatsState => ({
    hp: '', attack: '', defense: '', critRate: '', critDamage: '',
    physPen: '', magicPen: '', effectResist: ''
})

const emptyPassive = (): PassiveState => ({
    name: '', iconUrl: '',
    levels: Object.fromEntries(PASSIVE_LEVELS.map(l => [`${l.type}_${l.step}`, '']))
})

const emptyUltimate = (): UltimateState => ({
    name: '', iconUrl: '',
    levels: Object.fromEntries(ULTIMATE_STEPS.map(s => [s, { tpCost: '', rangeMin: '', rangeMax: '', cooldown: '', effectText: '' }]))
})

const emptyArtifact = (): ArtifactForm => ({
    _key: Date.now() + Math.random(), name: '', iconUrl: '',
    levels: Object.fromEntries(ARTIFACT_STEPS.map(s => [s, '']))
})

// ─── 헬퍼 ──────────────────────────────────────────────────

const toStr = (v: string) => v.trim() === '' ? null : v.trim()
const toInt = (v: string) => v.trim() === '' ? null : parseInt(v)

const detailToStates = (d: CharacterDetailDto) => ({
    basic: {
        name: d.name, grade: d.grade, faction: d.faction, element: d.element,
        exclusiveWeaponId: d.exclusiveWeapon ? String(d.exclusiveWeapon.weaponId) : '',
        exclusiveWeaponName: d.exclusiveWeapon?.name ?? '',
        birthYear: d.birthYear ?? '', height: d.height ?? '',
        cv: d.cv ?? '', profileText: d.profileText ?? '',
        thumbnailUrl: d.thumbnailUrl ?? '', portraitUrl: d.portraitUrl ?? '',
        fullImageUrl: d.fullImageUrl ?? '', isPublished: false
    } as BasicState,
    stats: {
        hp: d.stats?.hp != null ? String(d.stats.hp) : '',
        attack: d.stats?.attack != null ? String(d.stats.attack) : '',
        defense: d.stats?.defense != null ? String(d.stats.defense) : '',
        critRate: d.stats?.critRate != null ? String(d.stats.critRate) : '',
        critDamage: d.stats?.critDamage != null ? String(d.stats.critDamage) : '',
        physPen: d.stats?.physPen != null ? String(d.stats.physPen) : '',
        magicPen: d.stats?.magicPen != null ? String(d.stats.magicPen) : '',
        effectResist: d.stats?.effectResist != null ? String(d.stats.effectResist) : '',
    } as StatsState,
    classTreeIds: d.classTree.map(ct => ({ classId: ct.classId, orderInTier: ct.orderInTier })) as ClassTreeNodeRequest[],
    passive: {
        name: d.passive?.name ?? '', iconUrl: d.passive?.iconUrl ?? '',
        levels: Object.fromEntries(PASSIVE_LEVELS.map(l => [
            `${l.type}_${l.step}`,
            d.passive?.levels.find(pl => pl.unlockType === l.type && pl.unlockStep === l.step)?.effectText ?? ''
        ]))
    } as PassiveState,
    ultimate: {
        name: d.ultimateSkill?.name ?? '', iconUrl: d.ultimateSkill?.iconUrl ?? '',
        levels: Object.fromEntries(ULTIMATE_STEPS.map(s => {
            const lvl = d.ultimateSkill?.levels.find(l => l.manifestStep === s)
            return [s, {
                tpCost: lvl?.tpCost != null ? String(lvl.tpCost) : '',
                rangeMin: lvl?.rangeMin != null ? String(lvl.rangeMin) : '',
                rangeMax: lvl?.rangeMax != null ? String(lvl.rangeMax) : '',
                cooldown: lvl?.cooldown != null ? String(lvl.cooldown) : '',
                effectText: lvl?.effectText ?? ''
            }]
        }))
    } as UltimateState,
    artifacts: d.artifacts.map(art => ({
        _key: art.artifactId, name: art.name, iconUrl: art.iconUrl ?? '',
        levels: Object.fromEntries(ARTIFACT_STEPS.map(s => [s, art.levels.find(l => l.manifestStep === s)?.effectText ?? '']))
    })) as ArtifactForm[]
})

const buildRequest = (
    basic: BasicState, stats: StatsState,
    classTreeIds: ClassTreeNodeRequest[],
    passive: PassiveState, ultimate: UltimateState,
    artifacts: ArtifactForm[]
): CharacterRequest => ({
    name: basic.name, grade: basic.grade, faction: basic.faction, element: basic.element,
    exclusiveWeaponId: toInt(basic.exclusiveWeaponId),
    birthYear: toStr(basic.birthYear), height: toStr(basic.height),
    cv: toStr(basic.cv), profileText: toStr(basic.profileText),
    thumbnailUrl: toStr(basic.thumbnailUrl), portraitUrl: toStr(basic.portraitUrl),
    fullImageUrl: toStr(basic.fullImageUrl), isPublished: basic.isPublished,
    stats: {
        hp: toInt(stats.hp), attack: toInt(stats.attack), defense: toInt(stats.defense),
        critRate: toInt(stats.critRate), critDamage: toInt(stats.critDamage),
        physPen: toInt(stats.physPen), magicPen: toInt(stats.magicPen), effectResist: toInt(stats.effectResist)
    },
    classTreeIds,
    passive: passive.name.trim() ? {
        name: passive.name, iconUrl: toStr(passive.iconUrl),
        levels: PASSIVE_LEVELS
            .filter(l => passive.levels[`${l.type}_${l.step}`]?.trim())
            .map(l => ({ unlockType: l.type, unlockStep: l.step, effectText: passive.levels[`${l.type}_${l.step}`] }))
    } : null,
    ultimate: ultimate.name.trim() ? {
        name: ultimate.name, iconUrl: toStr(ultimate.iconUrl),
        levels: ULTIMATE_STEPS
            .filter(s => ultimate.levels[s]?.effectText?.trim())
            .map(s => ({
                manifestStep: s,
                tpCost: toInt(ultimate.levels[s].tpCost),
                rangeMin: toInt(ultimate.levels[s].rangeMin),
                rangeMax: toInt(ultimate.levels[s].rangeMax),
                cooldown: toInt(ultimate.levels[s].cooldown),
                effectText: toStr(ultimate.levels[s].effectText)
            }))
    } : null,
    artifacts: artifacts
        .filter(a => a.name.trim())
        .map((art, idx) => ({
            name: art.name, artifactOrder: idx + 1, iconUrl: toStr(art.iconUrl),
            levels: ARTIFACT_STEPS
                .filter(s => art.levels[s]?.trim())
                .map(s => ({ manifestStep: s, effectText: art.levels[s] }))
        }))
})

// ─── 섹션 컴포넌트 (memo로 격리) ───────────────────────────

const BasicSection = memo(({ state, onChange, weaponSearch, setWeaponSearch, weaponResults, onWeaponSearch, onSelectWeapon, onClearWeapon }: {
    state: BasicState
    onChange: (s: BasicState) => void
    weaponSearch: string
    setWeaponSearch: (v: string) => void
    weaponResults: ExclusiveWeaponDto[]
    onWeaponSearch: () => void
    onSelectWeapon: (w: ExclusiveWeaponDto) => void
    onClearWeapon: () => void
}) => {
    const set = (k: keyof BasicState, v: string | boolean) => onChange({ ...state, [k]: v })
    return (
        <Section title="① 기본 정보">
            <Grid cols={2}>
                <Field label="캐릭터 이름" required>
                    <Input value={state.name} onChange={e => set('name', e.target.value)} placeholder="예: 조안 카트라이트" />
                </Field>
                <Field label="등급" required>
                    <Select value={state.grade} onChange={e => set('grade', e.target.value)}>
                        {GRADES.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                    </Select>
                </Field>
            </Grid>
            <div className="mt-3">
                <Grid cols={2}>
                    <Field label="진영" required>
                        <Select value={state.faction} onChange={e => set('faction', e.target.value)}>
                            {FACTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                        </Select>
                    </Field>
                    <Field label="속성" required>
                        <Select value={state.element} onChange={e => set('element', e.target.value)}>
                            {ELEMENTS.map(el => <option key={el.value} value={el.value}>{el.label}</option>)}
                        </Select>
                    </Field>
                </Grid>
            </div>
            <div className="mt-3">
                <Grid cols={3}>
                    <Field label="출생연도"><Input value={state.birthYear} onChange={e => set('birthYear', e.target.value)} placeholder="예: SS 425" /></Field>
                    <Field label="신장"><Input value={state.height} onChange={e => set('height', e.target.value)} placeholder="예: 183cm" /></Field>
                    <Field label="CV"><Input value={state.cv} onChange={e => set('cv', e.target.value)} placeholder="성우 이름" /></Field>
                </Grid>
            </div>
            <div className="mt-3">
                <Field label="전용무기">
                    <div className="flex gap-2">
                        <Input value={weaponSearch} onChange={e => setWeaponSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && onWeaponSearch()} placeholder="무기 이름 검색..." />
                        <button onClick={onWeaponSearch} className="shrink-0 rounded border border-[var(--accent)]/30 px-3 py-2 text-xs text-[var(--accent)] hover:border-[var(--accent)]">검색</button>
                    </div>
                    {state.exclusiveWeaponName && (
                        <div className="mt-1 flex items-center gap-2">
                            <span className="text-xs text-[var(--accent)]">✓ {state.exclusiveWeaponName}</span>
                            <button onClick={onClearWeapon} className="text-xs text-stone-600 hover:text-red-400">제거</button>
                        </div>
                    )}
                    {weaponResults.length > 0 && (
                        <div className="mt-1 rounded border border-[var(--card-border)] bg-stone-900 py-1">
                            {weaponResults.map(w => (
                                <div key={w.weaponId} onClick={() => onSelectWeapon(w)} className="cursor-pointer px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-white/5">
                                    {w.name} <span className="text-xs text-[var(--text-muted)]">({w.grade})</span>
                                </div>
                            ))}
                        </div>
                    )}
                </Field>
            </div>
            <div className="mt-3">
                <Field label="소개 텍스트">
                    <Textarea rows={4} value={state.profileText} onChange={e => set('profileText', e.target.value)} placeholder="캐릭터 소개..." />
                </Field>
            </div>
            <div className="mt-3">
                <Grid cols={3}>
                    <Field label="썸네일 URL"><Input value={state.thumbnailUrl} onChange={e => set('thumbnailUrl', e.target.value)} placeholder="https://..." /></Field>
                    <Field label="초상화 URL"><Input value={state.portraitUrl} onChange={e => set('portraitUrl', e.target.value)} placeholder="https://..." /></Field>
                    <Field label="풀이미지 URL"><Input value={state.fullImageUrl} onChange={e => set('fullImageUrl', e.target.value)} placeholder="https://..." /></Field>
                </Grid>
            </div>
        </Section>
    )
})

const StatsSection = memo(({ state, onChange }: { state: StatsState; onChange: (s: StatsState) => void }) => {
    const set = (k: keyof StatsState, v: string) => onChange({ ...state, [k]: v })
    return (
        <Section title="② 기본 스탯">
            <Grid cols={4}>
                <Field label="최대 체력"><Input type="number" value={state.hp} onChange={e => set('hp', e.target.value)} /></Field>
                <Field label="공격력"><Input type="number" value={state.attack} onChange={e => set('attack', e.target.value)} /></Field>
                <Field label="방어력"><Input type="number" value={state.defense} onChange={e => set('defense', e.target.value)} /></Field>
                <Field label="치명타율 (%)"><Input type="number" value={state.critRate} onChange={e => set('critRate', e.target.value)} /></Field>
                <Field label="치명타 피해 (%)"><Input type="number" value={state.critDamage} onChange={e => set('critDamage', e.target.value)} /></Field>
                <Field label="물리 관통 (%)"><Input type="number" value={state.physPen} onChange={e => set('physPen', e.target.value)} /></Field>
                <Field label="마법 관통 (%)"><Input type="number" value={state.magicPen} onChange={e => set('magicPen', e.target.value)} /></Field>
                <Field label="효과 저항 (%)"><Input type="number" value={state.effectResist} onChange={e => set('effectResist', e.target.value)} /></Field>
            </Grid>
        </Section>
    )
})

const ClassSection = memo(({ classTreeIds, allClasses, onChange }: {
    classTreeIds: ClassTreeNodeRequest[]
    allClasses: ClassSummaryDto[]
    onChange: (ids: ClassTreeNodeRequest[]) => void
}) => {
    const toggle = (classId: number) => {
        const exists = classTreeIds.find(c => c.classId === classId)
        onChange(exists ? classTreeIds.filter(c => c.classId !== classId) : [...classTreeIds, { classId, orderInTier: null }])
    }
    return (
        <Section title="③ 클래스 트리">
            <p className="mb-3 text-xs text-[var(--text-muted)]">클릭해서 추가/제거</p>
            {[1, 2, 3].map(tier => (
                <div key={tier} className="mb-4">
                    <div className="mb-2 text-xs font-semibold text-[var(--text-muted)]">Tier {tier}</div>
                    <div className="flex flex-wrap gap-2">
                        {allClasses.filter(c => c.tier === tier).map(c => {
                            const selected = classTreeIds.some(ct => ct.classId === c.classId)
                            return (
                                <button key={c.classId} onClick={() => toggle(c.classId)}
                                        className={`rounded border px-3 py-1.5 text-xs ${selected ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]' : 'border-stone-700 text-stone-400 hover:border-stone-500'}`}
                                >{c.name}</button>
                            )
                        })}
                        {allClasses.filter(c => c.tier === tier).length === 0 && <span className="text-xs text-stone-700">클래스 없음</span>}
                    </div>
                </div>
            ))}
            {classTreeIds.length > 0 && (
                <div className="mt-2 text-xs text-[var(--accent)]">
                    선택됨: {classTreeIds.map(ct => allClasses.find(c => c.classId === ct.classId)?.name ?? ct.classId).join(', ')}
                </div>
            )}
        </Section>
    )
})

const PassiveSection = memo(({ state, onChange }: { state: PassiveState; onChange: (s: PassiveState) => void }) => {
    const set = (k: keyof PassiveState, v: string) => onChange({ ...state, [k]: v })
    const setLevel = (key: string, v: string) => onChange({ ...state, levels: { ...state.levels, [key]: v } })
    return (
        <Section title="④ 고유 패시브">
            <Grid cols={2}>
                <Field label="패시브 이름" required><Input value={state.name} onChange={e => set('name', e.target.value)} placeholder="패시브 스킬 이름" /></Field>
                <Field label="아이콘 URL"><Input value={state.iconUrl} onChange={e => set('iconUrl', e.target.value)} placeholder="https://..." /></Field>
            </Grid>
            <div className="mt-4 space-y-3">
                {PASSIVE_LEVELS.map(l => {
                    const key = `${l.type}_${l.step}`
                    return (
                        <div key={key} className="flex items-start gap-3">
                            <span className={`mt-2 shrink-0 rounded px-2 py-0.5 text-xs font-bold ${l.type === 'awaken' ? 'bg-blue-900/20 text-blue-400' : 'bg-amber-900/20 text-amber-500'}`}>
                                {l.label}
                            </span>
                            <Textarea rows={2} value={state.levels[key]} onChange={e => setLevel(key, e.target.value)} placeholder={`${l.label} 효과...`} />
                        </div>
                    )
                })}
            </div>
        </Section>
    )
})

const UltimateSection = memo(({ state, onChange }: { state: UltimateState; onChange: (s: UltimateState) => void }) => {
    const set = (k: keyof UltimateState, v: string) => onChange({ ...state, [k]: v })
    const setLevel = (step: number, k: keyof UltimateLevelState, v: string) =>
        onChange({ ...state, levels: { ...state.levels, [step]: { ...state.levels[step], [k]: v } } })
    return (
        <Section title="⑤ 필살기 (발현)">
            <Grid cols={2}>
                <Field label="필살기 이름" required><Input value={state.name} onChange={e => set('name', e.target.value)} placeholder="필살기 이름" /></Field>
                <Field label="아이콘 URL"><Input value={state.iconUrl} onChange={e => set('iconUrl', e.target.value)} placeholder="https://..." /></Field>
            </Grid>
            <div className="mt-4 space-y-4">
                {ULTIMATE_STEPS.map(step => (
                    <ItemBox key={step}>
                        <div className="mb-3">
                            <span className="rounded bg-purple-900/20 px-2 py-0.5 text-xs font-bold text-purple-400">발현 {step}단</span>
                        </div>
                        <Grid cols={4}>
                            <Field label="TP 소모"><Input type="number" value={state.levels[step].tpCost} onChange={e => setLevel(step, 'tpCost', e.target.value)} /></Field>
                            <Field label="사거리 최소"><Input type="number" value={state.levels[step].rangeMin} onChange={e => setLevel(step, 'rangeMin', e.target.value)} /></Field>
                            <Field label="사거리 최대"><Input type="number" value={state.levels[step].rangeMax} onChange={e => setLevel(step, 'rangeMax', e.target.value)} /></Field>
                            <Field label="쿨타임"><Input type="number" value={state.levels[step].cooldown} onChange={e => setLevel(step, 'cooldown', e.target.value)} /></Field>
                        </Grid>
                        <div className="mt-3">
                            <Field label="효과 설명">
                                <Textarea rows={3} value={state.levels[step].effectText} onChange={e => setLevel(step, 'effectText', e.target.value)} placeholder="효과 설명..." />
                            </Field>
                        </div>
                    </ItemBox>
                ))}
            </div>
        </Section>
    )
})

const ArtifactSection = memo(({ artifacts, onChange }: { artifacts: ArtifactForm[]; onChange: (a: ArtifactForm[]) => void }) => {
    const updateArt = (key: number, field: keyof ArtifactForm, val: string) =>
        onChange(artifacts.map(a => a._key === key ? { ...a, [field]: val } : a))
    const updateLevel = (key: number, step: number, val: string) =>
        onChange(artifacts.map(a => a._key === key ? { ...a, levels: { ...a.levels, [step]: val } } : a))
    return (
        <Section title="⑥ 아티팩트">
            <div className="space-y-4">
                {artifacts.map((art, idx) => (
                    <ItemBox key={art._key}>
                        <div className="mb-3 flex items-center justify-between">
                            <span className="text-xs font-bold text-[var(--accent)]">아티팩트 {idx + 1}</span>
                            {artifacts.length > 1 && <RemoveBtn onClick={() => onChange(artifacts.filter(a => a._key !== art._key))} />}
                        </div>
                        <Grid cols={2}>
                            <Field label="아티팩트 이름" required>
                                <Input value={art.name} onChange={e => updateArt(art._key, 'name', e.target.value)} placeholder="예: 불사의 맹약" />
                            </Field>
                            <Field label="아이콘 URL">
                                <Input value={art.iconUrl} onChange={e => updateArt(art._key, 'iconUrl', e.target.value)} placeholder="https://..." />
                            </Field>
                        </Grid>
                        <div className="mt-3 space-y-2">
                            {ARTIFACT_STEPS.map(step => (
                                <div key={step} className="flex items-start gap-3">
                                    <span className={`mt-2 shrink-0 rounded px-2 py-0.5 text-xs font-bold ${step <= 4 ? 'bg-blue-900/20 text-blue-400' : 'bg-amber-900/20 text-amber-500'}`}>
                                        발현 {step}단
                                    </span>
                                    <Textarea rows={2} value={art.levels[step]} onChange={e => updateLevel(art._key, step, e.target.value)} placeholder={`발현 ${step}단 효과...`} />
                                </div>
                            ))}
                        </div>
                    </ItemBox>
                ))}
            </div>
            {artifacts.length < 4 && (
                <AddBtn onClick={() => onChange([...artifacts, emptyArtifact()])} label="아티팩트 추가 (최대 4개)" />
            )}
        </Section>
    )
})

// ─── 메인 컴포넌트 ─────────────────────────────────────────

const CharacterAdmin = () => {
    const { show, ToastContainer } = useToast()
    const [charList, setCharList] = useState<CharacterSummaryDto[]>([])
    const [editingId, setEditingId] = useState<number | null>(null)
    const [loading, setLoading] = useState(false)
    const [activeSection, setActiveSection] = useState('basic')

    // 섹션별 state 분리
    const [basic, setBasic] = useState<BasicState>(emptyBasic())
    const [stats, setStats] = useState<StatsState>(emptyStats())
    const [classTreeIds, setClassTreeIds] = useState<ClassTreeNodeRequest[]>([])
    const [passive, setPassive] = useState<PassiveState>(emptyPassive())
    const [ultimate, setUltimate] = useState<UltimateState>(emptyUltimate())
    const [artifacts, setArtifacts] = useState<ArtifactForm[]>([emptyArtifact(), emptyArtifact(), emptyArtifact()])

    const [weaponSearch, setWeaponSearch] = useState('')
    const [weaponResults, setWeaponResults] = useState<ExclusiveWeaponDto[]>([])
    const [allClasses, setAllClasses] = useState<ClassSummaryDto[]>([])

    const loadList = useCallback(() => {
        getAdminCharacterList().then(setCharList).catch(() => show('목록 로드 실패', 'error'))
    }, [])

    useEffect(() => {
        loadList()
        getAllClasses().then(setAllClasses).catch(() => {})
    }, [])

    const resetAll = useCallback(() => {
        setEditingId(null)
        setBasic(emptyBasic()); setStats(emptyStats())
        setClassTreeIds([]); setPassive(emptyPassive())
        setUltimate(emptyUltimate())
        setArtifacts([emptyArtifact(), emptyArtifact(), emptyArtifact()])
        setActiveSection('basic')
    }, [])

    const handleEdit = useCallback(async (id: number) => {
        try {
            const d = await getAdminCharacterDetail(id)
            const s = detailToStates(d)
            setBasic(s.basic); setStats(s.stats)
            setClassTreeIds(s.classTreeIds); setPassive(s.passive)
            setUltimate(s.ultimate); setArtifacts(s.artifacts)
            setEditingId(id); setActiveSection('basic')
        } catch { show('불러오기 실패', 'error') }
    }, [])

    const handleDelete = useCallback(async (id: number, name: string) => {
        if (!confirm(`"${name}" 캐릭터를 삭제할까요?`)) return
        try {
            await deleteCharacter(id)
            show('삭제 완료'); loadList()
            if (editingId === id) resetAll()
        } catch { show('삭제 실패', 'error') }
    }, [editingId])

    const handleSave = useCallback(async () => {
        if (!basic.name.trim()) { show('캐릭터 이름을 입력해주세요', 'error'); return }
        setLoading(true)
        try {
            const req = buildRequest(basic, stats, classTreeIds, passive, ultimate, artifacts)
            if (editingId !== null) {
                await updateCharacter(editingId, req); show('수정 완료!')
            } else {
                await createCharacter(req); show('등록 완료!'); resetAll()
            }
            loadList()
        } catch { show('저장 실패', 'error') }
        finally { setLoading(false) }
    }, [basic, stats, classTreeIds, passive, ultimate, artifacts, editingId])

    const handleWeaponSearch = useCallback(async () => {
        if (!weaponSearch.trim()) return
        try { setWeaponResults(await searchWeapons(weaponSearch)) }
        catch { show('검색 실패', 'error') }
    }, [weaponSearch])

    const handleSelectWeapon = useCallback((w: ExclusiveWeaponDto) => {
        setBasic(b => ({ ...b, exclusiveWeaponId: String(w.weaponId), exclusiveWeaponName: w.name }))
        setWeaponResults([]); setWeaponSearch('')
    }, [])

    const handleClearWeapon = useCallback(() => {
        setBasic(b => ({ ...b, exclusiveWeaponId: '', exclusiveWeaponName: '' }))
    }, [])

    const sections = ['basic', 'stats', 'class', 'passive', 'ultimate', 'artifact']
    const sectionLabels: { [k: string]: string } = {
        basic: '① 기본', stats: '② 스탯', class: '③ 클래스',
        passive: '④ 패시브', ultimate: '⑤ 필살기', artifact: '⑥ 아티팩트'
    }

    return (
        <div className="flex min-w-0 flex-1 gap-0 overflow-hidden">
            <ToastContainer />

            {/* 좌측 목록 */}
            <aside className="flex w-56 flex-col border-r border-[var(--card-border)] bg-black/20">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--card-border)]">
                    <span className="text-xs font-cinzel tracking-widest text-[var(--accent)]">캐릭터</span>
                    <button onClick={resetAll} className="rounded bg-[var(--accent)]/10 border border-[var(--accent)]/30 px-2 py-1 text-xs text-[var(--accent)] hover:bg-[var(--accent)]/20">+ 신규</button>
                </div>
                <div className="flex-1 overflow-y-auto py-1">
                    {charList.length === 0 && <p className="px-4 py-3 text-xs text-[var(--text-muted)]">등록된 캐릭터 없음</p>}
                    {charList.map(c => (
                        <div key={c.characterId} onClick={() => handleEdit(c.characterId)}
                             className={`group flex cursor-pointer items-center justify-between px-4 py-2.5 hover:bg-white/5 ${editingId === c.characterId ? 'bg-[var(--accent)]/10' : ''}`}
                        >
                            <div>
                                <div className={`text-sm font-medium ${editingId === c.characterId ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>{c.name}</div>
                                <div className="text-xs text-[var(--text-muted)]">{c.grade} · {c.element}</div>
                            </div>
                            <button onClick={e => { e.stopPropagation(); handleDelete(c.characterId, c.name) }}
                                    className="hidden rounded px-1.5 py-0.5 text-xs text-[var(--text-muted)] hover:bg-red-900/30 hover:text-red-400 group-hover:block"
                            >삭제</button>
                        </div>
                    ))}
                </div>
            </aside>

            {/* 우측 편집 */}
            <main className="min-w-0 flex-1 overflow-y-auto px-8 py-7">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h1 className="font-cinzel text-lg tracking-widest text-[var(--accent)]">
                            {editingId !== null ? '캐릭터 수정' : '캐릭터 등록'}
                        </h1>
                        <p className="mt-0.5 text-xs text-stone-600">{editingId !== null ? `ID: ${editingId}` : '* 필수 입력'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <span className="text-xs text-[var(--text-muted)]">발행</span>
                            <div onClick={() => setBasic(b => ({ ...b, isPublished: !b.isPublished }))}
                                 className={`w-10 h-5 rounded-full relative cursor-pointer ${basic.isPublished ? 'bg-[var(--accent)]' : 'bg-stone-700'}`}
                            >
                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white ${basic.isPublished ? 'left-5' : 'left-0.5'}`} />
                            </div>
                        </label>
                        <CancelBtn onClick={resetAll} />
                        <SaveBtn label={loading ? '저장 중...' : editingId !== null ? '수정 저장' : '저장 및 게시'} onClick={handleSave} />
                    </div>
                </div>

                {/* 섹션 탭 */}
                <div className="mb-5 flex gap-1 border-b border-[var(--card-border)] overflow-x-auto">
                    {sections.map(s => (
                        <button key={s} onClick={() => setActiveSection(s)}
                                className={`shrink-0 px-4 py-2 font-cinzel text-xs tracking-wider border-b-2 -mb-px ${activeSection === s ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-transparent text-stone-500 hover:text-stone-300'}`}
                        >{sectionLabels[s]}</button>
                    ))}
                </div>

                {activeSection === 'basic' && (
                    <BasicSection
                        state={basic} onChange={setBasic}
                        weaponSearch={weaponSearch} setWeaponSearch={setWeaponSearch}
                        weaponResults={weaponResults}
                        onWeaponSearch={handleWeaponSearch}
                        onSelectWeapon={handleSelectWeapon}
                        onClearWeapon={handleClearWeapon}
                    />
                )}
                {activeSection === 'stats' && <StatsSection state={stats} onChange={setStats} />}
                {activeSection === 'class' && <ClassSection classTreeIds={classTreeIds} allClasses={allClasses} onChange={setClassTreeIds} />}
                {activeSection === 'passive' && <PassiveSection state={passive} onChange={setPassive} />}
                {activeSection === 'ultimate' && <UltimateSection state={ultimate} onChange={setUltimate} />}
                {activeSection === 'artifact' && <ArtifactSection artifacts={artifacts} onChange={setArtifacts} />}

                <div className="mb-8 flex justify-end gap-2">
                    <CancelBtn onClick={resetAll} />
                    <SaveBtn label={loading ? '저장 중...' : editingId !== null ? '수정 저장' : '저장 및 게시'} onClick={handleSave} />
                </div>
            </main>
        </div>
    )
}

export default CharacterAdmin