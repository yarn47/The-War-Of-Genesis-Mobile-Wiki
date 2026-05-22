import { useState, useEffect } from 'react'
import {
    Section, Field, Input, Select, Textarea,
    AddBtn, RemoveBtn, ItemBox, Grid, CancelBtn, SaveBtn
} from '../../components/common/AdminComponents'
import { useToast } from '../../components/common/Toast'
import {
    getEquipmentList, getEquipmentDetail, createEquipment, updateEquipment, deleteEquipment,
    getWeaponList, getWeaponDetail, createWeapon, updateWeapon, deleteWeapon,
    type EquipmentSummaryDto, type ExclusiveWeaponDto,
    type EquipmentRequest, type ExclusiveWeaponRequest,
    type EquipmentEffectRequest, type WeaponEffectRequest, type EffectLevelRequest
} from '../../api/itemApi'

// ─── 상수 ──────────────────────────────────────────────────

const EQUIPMENT_TYPES = [
    { value: 'helmet', label: '투구' },
    { value: 'armor', label: '갑옷' },
    { value: 'gloves', label: '장갑' },
    { value: 'boots', label: '신발' },
    { value: 'accessory', label: '악세서리' },
]
const DEFENSE_TYPES = [
    { value: 'light', label: '라이트' },
    { value: 'medium', label: '미디엄' },
    { value: 'heavy', label: '헤비' },
]
const GRADES = [
    { value: 'rare', label: '희귀' },
    { value: 'hero', label: '영웅' },
    { value: 'legend', label: '전설' },
]
const BREAKTHROUGH_STEPS = [1, 2, 3, 4, 5, 6]
const ARMOR_TYPES = ['helmet', 'armor', 'gloves', 'boots']

// ─── 타입 ──────────────────────────────────────────────────

interface EffectForm {
    _key: number
    effectName: string
    iconUrl: string
    normalBaseEffect: string
    normalLevels: { [step: number]: string }
    hasExclusive: boolean
    exclusiveBaseEffect: string
    exclusiveLevels: { [step: number]: string }
}

interface EquipmentForm {
    name: string
    type: string
    defenseType: string
    grade: string
    baseStats: string
    extraStats: string
    setName: string
    setEffect2: string
    setEffect4: string
    description: string
    iconUrl: string
    effects: EffectForm[]
}

interface WeaponForm {
    name: string
    weaponType: string
    grade: string
    baseStats: string
    extraStats: string
    description: string
    iconUrl: string
    effects: EffectForm[]
}

// ─── 기본값 ────────────────────────────────────────────────

const emptyEffect = (): EffectForm => ({
    _key: Date.now() + Math.random(),
    effectName: '', iconUrl: '',
    normalBaseEffect: '',
    normalLevels: { 1: '', 2: '', 3: '', 4: '', 5: '', 6: '' },
    hasExclusive: false,
    exclusiveBaseEffect: '',
    exclusiveLevels: { 1: '', 2: '', 3: '', 4: '', 5: '', 6: '' }
})

const emptyEquipmentForm = (): EquipmentForm => ({
    name: '', type: 'helmet', defenseType: 'light', grade: 'rare',
    baseStats: '', extraStats: '',
    setName: '', setEffect2: '', setEffect4: '',
    description: '', iconUrl: '',
    effects: [emptyEffect()]
})

const emptyWeaponForm = (): WeaponForm => ({
    name: '', weaponType: '', grade: 'rare',
    baseStats: '', extraStats: '',
    description: '', iconUrl: '',
    effects: [emptyEffect()]
})

// ─── 헬퍼 ──────────────────────────────────────────────────

const toStr = (v: string) => v.trim() === '' ? null : v.trim()

const effectFormToRequests = (e: EffectForm): (EquipmentEffectRequest | WeaponEffectRequest)[] => {
    const results: (EquipmentEffectRequest | WeaponEffectRequest)[] = []
    // 일반 효과
    results.push({
        effectName: e.effectName,
        effectType: 'normal',
        baseEffect: toStr(e.normalBaseEffect),
        iconUrl: toStr(e.iconUrl),
        levels: BREAKTHROUGH_STEPS
            .filter(s => e.normalLevels[s]?.trim())
            .map((s): EffectLevelRequest => ({ breakthroughStep: s, effectText: e.normalLevels[s] }))
    })
    // 전용 효과 (체크된 경우만)
    if (e.hasExclusive) {
        results.push({
            effectName: e.effectName,
            effectType: 'exclusive',
            baseEffect: toStr(e.exclusiveBaseEffect),
            iconUrl: toStr(e.iconUrl),
            levels: BREAKTHROUGH_STEPS
                .filter(s => e.exclusiveLevels[s]?.trim())
                .map((s): EffectLevelRequest => ({ breakthroughStep: s, effectText: e.exclusiveLevels[s] }))
        })
    }
    return results
}

const effectDtoToForm = (effects: { effectName: string; effectType: string; baseEffect: string | null; iconUrl: string | null; levels: { breakthroughStep: number; effectText: string | null }[] }[]): EffectForm[] => {
    // effectName 기준으로 normal/exclusive 묶기
    const grouped = new Map<string, { normal?: typeof effects[0]; exclusive?: typeof effects[0] }>()
    effects.forEach(e => {
        const g = grouped.get(e.effectName) ?? {}
        if (e.effectType === 'exclusive') g.exclusive = e
        else g.normal = e
        grouped.set(e.effectName, g)
    })
    return Array.from(grouped.entries()).map(([name, g]) => ({
        _key: Date.now() + Math.random(),
        effectName: name,
        iconUrl: g.normal?.iconUrl ?? g.exclusive?.iconUrl ?? '',
        normalBaseEffect: g.normal?.baseEffect ?? '',
        normalLevels: Object.fromEntries(
            BREAKTHROUGH_STEPS.map(s => [s, g.normal?.levels.find(l => l.breakthroughStep === s)?.effectText ?? ''])
        ),
        hasExclusive: !!g.exclusive,
        exclusiveBaseEffect: g.exclusive?.baseEffect ?? '',
        exclusiveLevels: Object.fromEntries(
            BREAKTHROUGH_STEPS.map(s => [s, g.exclusive?.levels.find(l => l.breakthroughStep === s)?.effectText ?? ''])
        )
    }))
}

// ─── 서브 컴포넌트 ─────────────────────────────────────────

const EffectSection = ({
                           effects, onChange
                       }: {
    effects: EffectForm[]
    onChange: (effects: EffectForm[]) => void
}) => {
    const [effectTabs, setEffectTabs] = useState<{ [key: number]: 'normal' | 'exclusive' }>({})

    const update = (key: number, field: keyof EffectForm, val: string | boolean) =>
        onChange(effects.map(e => e._key === key ? { ...e, [field]: val } : e))

    const updateLevel = (key: number, type: 'normal' | 'exclusive', step: number, val: string) =>
        onChange(effects.map(e => e._key === key ? {
            ...e,
            normalLevels: type === 'normal' ? { ...e.normalLevels, [step]: val } : e.normalLevels,
            exclusiveLevels: type === 'exclusive' ? { ...e.exclusiveLevels, [step]: val } : e.exclusiveLevels
        } : e))

    const getTab = (key: number) => effectTabs[key] ?? 'normal'
    const setTab = (key: number, tab: 'normal' | 'exclusive') =>
        setEffectTabs(prev => ({ ...prev, [key]: tab }))

    const LevelInputs = ({ effectKey, type, levels }: { effectKey: number; type: 'normal' | 'exclusive'; levels: { [step: number]: string } }) => (
        <div className="space-y-2">
            {BREAKTHROUGH_STEPS.map(step => (
                <div key={step} className="flex items-start gap-3">
                    <span className={`mt-2 shrink-0 rounded px-2 py-0.5 text-xs font-bold ${step <= 3 ? 'bg-blue-900/20 text-blue-400' : 'bg-amber-900/20 text-amber-500'}`}>
                        {step}단
                    </span>
                    <Textarea
                        rows={1}
                        value={levels[step]}
                        onChange={e => updateLevel(effectKey, type, step, e.target.value)}
                        placeholder={`${step}단 ${type === 'exclusive' ? '전용 ' : ''}효과...`}
                    />
                </div>
            ))}
        </div>
    )

    return (
        <div className="space-y-4">
            {effects.map((effect, idx) => (
                <ItemBox key={effect._key}>
                    <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-bold text-[var(--accent)]">효과 {idx + 1}</span>
                        <div className="flex items-center gap-3">
                            <label className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={effect.hasExclusive}
                                    onChange={e => update(effect._key, 'hasExclusive', e.target.checked)}
                                    className="accent-amber-500"
                                />
                                <span className="text-xs text-[var(--text-muted)]">전용 효과 있음</span>
                            </label>
                            <RemoveBtn onClick={() => onChange(effects.filter(e => e._key !== effect._key))} />
                        </div>
                    </div>
                    <Grid cols={2}>
                        <Field label="효과 이름" required>
                            <Input value={effect.effectName} onChange={e => update(effect._key, 'effectName', e.target.value)} placeholder="예: 새벽의 빛" />
                        </Field>
                        <Field label="아이콘 URL">
                            <Input value={effect.iconUrl} onChange={e => update(effect._key, 'iconUrl', e.target.value)} placeholder="https://..." />
                        </Field>
                    </Grid>
                    <div className="mt-4 flex gap-1 border-b border-[var(--card-border)]">
                        <button
                            onClick={() => setTab(effect._key, 'normal')}
                            className={`px-4 py-1.5 text-xs font-cinzel tracking-wider transition border-b-2 -mb-px ${getTab(effect._key) === 'normal' ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-transparent text-stone-500 hover:text-stone-300'}`}
                        >일반 효과</button>
                        {effect.hasExclusive && (
                            <button
                                onClick={() => setTab(effect._key, 'exclusive')}
                                className={`px-4 py-1.5 text-xs font-cinzel tracking-wider transition border-b-2 -mb-px ${getTab(effect._key) === 'exclusive' ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-transparent text-stone-500 hover:text-stone-300'}`}
                            >전용 효과</button>
                        )}
                    </div>
                    <div className="mt-3">
                        {getTab(effect._key) === 'normal' && (
                            <>
                                <Field label="기본 효과 설명">
                                    <Textarea rows={2} value={effect.normalBaseEffect} onChange={e => update(effect._key, 'normalBaseEffect', e.target.value)} placeholder="기본 효과 설명..." />
                                </Field>
                                <div className="mt-3">
                                    <div className="mb-2 text-xs font-semibold text-[var(--text-muted)]">돌파 단계별 효과</div>
                                    <LevelInputs effectKey={effect._key} type="normal" levels={effect.normalLevels} />
                                </div>
                            </>
                        )}
                        {getTab(effect._key) === 'exclusive' && effect.hasExclusive && (
                            <>
                                <Field label="전용 기본 효과 설명">
                                    <Textarea rows={2} value={effect.exclusiveBaseEffect} onChange={e => update(effect._key, 'exclusiveBaseEffect', e.target.value)} placeholder="전용 효과 설명..." />
                                </Field>
                                <div className="mt-3">
                                    <div className="mb-2 text-xs font-semibold text-[var(--text-muted)]">돌파 단계별 효과</div>
                                    <LevelInputs effectKey={effect._key} type="exclusive" levels={effect.exclusiveLevels} />
                                </div>
                            </>
                        )}
                    </div>
                </ItemBox>
            ))}
            <AddBtn onClick={() => onChange([...effects, emptyEffect()])} label="효과 추가" />
        </div>
    )
}

// ─── 메인 컴포넌트 ─────────────────────────────────────────

const ItemAdmin = () => {
    const { show, ToastContainer } = useToast()

    // 탭: weapon | equipment
    const [tab, setTab] = useState<'weapon' | 'equipment'>('weapon')

    // 목록
    const [weaponList, setWeaponList] = useState<ExclusiveWeaponDto[]>([])
    const [equipmentList, setEquipmentList] = useState<EquipmentSummaryDto[]>([])

    // 편집
    const [editingId, setEditingId] = useState<number | null>(null)
    const [weaponForm, setWeaponForm] = useState<WeaponForm>(emptyWeaponForm())
    const [equipmentForm, setEquipmentForm] = useState<EquipmentForm>(emptyEquipmentForm())
    const [loading, setLoading] = useState(false)

    const loadLists = () => {
        getWeaponList().then(setWeaponList).catch(() => show('전용무기 목록 로드 실패', 'error'))
        getEquipmentList().then(setEquipmentList).catch(() => show('장비 목록 로드 실패', 'error'))
    }

    useEffect(() => { loadLists() }, [])

    const handleNew = () => {
        setEditingId(null)
        setWeaponForm(emptyWeaponForm())
        setEquipmentForm(emptyEquipmentForm())
    }

    const handleTabChange = (t: 'weapon' | 'equipment') => {
        setTab(t)
        handleNew()
    }

    // 전용무기 수정 클릭
    const handleEditWeapon = async (id: number) => {
        try {
            const d = await getWeaponDetail(id)
            setWeaponForm({
                name: d.name,
                weaponType: d.weaponType ?? '',
                grade: d.grade,
                baseStats: d.baseStats ?? '',
                extraStats: d.extraStats ?? '',
                description: d.description ?? '',
                iconUrl: d.iconUrl ?? '',
                effects: effectDtoToForm(d.effects)
            })
            setEditingId(id)
        } catch { show('불러오기 실패', 'error') }
    }

    // 장비 수정 클릭
    const handleEditEquipment = async (id: number) => {
        try {
            const d = await getEquipmentDetail(id)
            setEquipmentForm({
                name: d.name,
                type: d.type,
                defenseType: d.defenseType ?? 'light',
                grade: d.grade,
                baseStats: d.baseStats ?? '',
                extraStats: d.extraStats ?? '',
                setName: d.setName ?? '',
                setEffect2: d.setEffect2 ?? '',
                setEffect4: d.setEffect4 ?? '',
                description: d.description ?? '',
                iconUrl: d.iconUrl ?? '',
                effects: effectDtoToForm(d.effects)
            })
            setEditingId(id)
        } catch { show('불러오기 실패', 'error') }
    }

    // 삭제
    const handleDeleteWeapon = async (id: number, name: string) => {
        if (!confirm(`"${name}" 무기를 삭제할까요?`)) return
        try {
            await deleteWeapon(id)
            show('삭제 완료')
            loadLists()
            if (editingId === id) handleNew()
        } catch { show('삭제 실패', 'error') }
    }

    const handleDeleteEquipment = async (id: number, name: string) => {
        if (!confirm(`"${name}" 장비를 삭제할까요?`)) return
        try {
            await deleteEquipment(id)
            show('삭제 완료')
            loadLists()
            if (editingId === id) handleNew()
        } catch { show('삭제 실패', 'error') }
    }

    // 저장
    const handleSaveWeapon = async () => {
        if (!weaponForm.name.trim()) { show('무기 이름을 입력해주세요', 'error'); return }
        setLoading(true)
        try {
            const req: ExclusiveWeaponRequest = {
                name: weaponForm.name,
                weaponType: toStr(weaponForm.weaponType),
                grade: weaponForm.grade,
                baseStats: toStr(weaponForm.baseStats),
                extraStats: toStr(weaponForm.extraStats),
                description: toStr(weaponForm.description),
                iconUrl: toStr(weaponForm.iconUrl),
                effects: weaponForm.effects.flatMap(effectFormToRequests) as WeaponEffectRequest[]
            }
            if (editingId !== null) {
                await updateWeapon(editingId, req)
                show('수정 완료!')
            } else {
                await createWeapon(req)
                show('등록 완료!')
                handleNew()
            }
            loadLists()
        } catch { show('저장 실패', 'error') }
        finally { setLoading(false) }
    }

    const handleSaveEquipment = async () => {
        if (!equipmentForm.name.trim()) { show('아이템 이름을 입력해주세요', 'error'); return }
        setLoading(true)
        try {
            const isArmor = ARMOR_TYPES.includes(equipmentForm.type)
            const req: EquipmentRequest = {
                name: equipmentForm.name,
                type: equipmentForm.type,
                defenseType: isArmor ? toStr(equipmentForm.defenseType) : null,
                grade: equipmentForm.grade,
                baseStats: toStr(equipmentForm.baseStats),
                extraStats: toStr(equipmentForm.extraStats),
                setName: toStr(equipmentForm.setName),
                setEffect2: toStr(equipmentForm.setEffect2),
                setEffect4: toStr(equipmentForm.setEffect4),
                description: toStr(equipmentForm.description),
                iconUrl: toStr(equipmentForm.iconUrl),
                effects: equipmentForm.effects.flatMap(effectFormToRequests) as EquipmentEffectRequest[]
            }
            if (editingId !== null) {
                await updateEquipment(editingId, req)
                show('수정 완료!')
            } else {
                await createEquipment(req)
                show('등록 완료!')
                handleNew()
            }
            loadLists()
        } catch { show('저장 실패', 'error') }
        finally { setLoading(false) }
    }

    const setW = (k: keyof WeaponForm, v: string) => setWeaponForm(f => ({ ...f, [k]: v }))
    const setE = (k: keyof EquipmentForm, v: string) => setEquipmentForm(f => ({ ...f, [k]: v }))
    const isArmor = ARMOR_TYPES.includes(equipmentForm.type)

    return (
        <div className="flex min-w-0 flex-1 gap-0 overflow-hidden">
            <ToastContainer />

            {/* 좌측 목록 */}
            <aside className="flex w-56 flex-col border-r border-[var(--card-border)] bg-black/20">
                {/* 탭 */}
                <div className="flex border-b border-[var(--card-border)]">
                    {(['weapon', 'equipment'] as const).map(t => (
                        <button
                            key={t}
                            onClick={() => handleTabChange(t)}
                            className={`flex-1 py-2.5 text-xs font-cinzel tracking-wider transition ${tab === t ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
                        >
                            {t === 'weapon' ? '무기' : '장비'}
                        </button>
                    ))}
                </div>

                <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--card-border)]">
                    <span className="text-xs text-[var(--text-muted)]">
                        {tab === 'weapon' ? weaponList.length : equipmentList.length}개
                    </span>
                    <button
                        onClick={handleNew}
                        className="rounded bg-[var(--accent)]/10 border border-[var(--accent)]/30 px-2 py-1 text-xs text-[var(--accent)] hover:bg-[var(--accent)]/20 transition"
                    >
                        + 신규
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-1">
                    {tab === 'weapon' && weaponList.map(w => (
                        <div
                            key={w.weaponId}
                            onClick={() => handleEditWeapon(w.weaponId)}
                            className={`group flex cursor-pointer items-center justify-between px-4 py-2.5 transition hover:bg-white/5 ${editingId === w.weaponId ? 'bg-[var(--accent)]/10' : ''}`}
                        >
                            <div>
                                <div className={`text-sm font-medium ${editingId === w.weaponId ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>{w.name}</div>
                                <div className="text-xs text-[var(--text-muted)]">{w.weaponType ?? '-'} · {w.grade}</div>
                            </div>
                            <button
                                onClick={e => { e.stopPropagation(); handleDeleteWeapon(w.weaponId, w.name) }}
                                className="hidden rounded px-1.5 py-0.5 text-xs text-[var(--text-muted)] hover:bg-red-900/30 hover:text-red-400 group-hover:block"
                            >삭제</button>
                        </div>
                    ))}
                    {tab === 'equipment' && equipmentList.map(eq => (
                        <div
                            key={eq.equipmentId}
                            onClick={() => handleEditEquipment(eq.equipmentId)}
                            className={`group flex cursor-pointer items-center justify-between px-4 py-2.5 transition hover:bg-white/5 ${editingId === eq.equipmentId ? 'bg-[var(--accent)]/10' : ''}`}
                        >
                            <div>
                                <div className={`text-sm font-medium ${editingId === eq.equipmentId ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>{eq.name}</div>
                                <div className="text-xs text-[var(--text-muted)]">{eq.type} · {eq.grade}</div>
                            </div>
                            <button
                                onClick={e => { e.stopPropagation(); handleDeleteEquipment(eq.equipmentId, eq.name) }}
                                className="hidden rounded px-1.5 py-0.5 text-xs text-[var(--text-muted)] hover:bg-red-900/30 hover:text-red-400 group-hover:block"
                            >삭제</button>
                        </div>
                    ))}
                    {((tab === 'weapon' && weaponList.length === 0) || (tab === 'equipment' && equipmentList.length === 0)) && (
                        <p className="px-4 py-3 text-xs text-[var(--text-muted)]">등록된 항목 없음</p>
                    )}
                </div>
            </aside>

            {/* 우측 편집 패널 */}
            <main className="min-w-0 flex-1 overflow-y-auto px-8 py-7">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="font-cinzel text-lg tracking-widest text-[var(--accent)]">
                            {tab === 'weapon' ? '무기' : '장비'} {editingId !== null ? '수정' : '등록'}
                        </h1>
                        <p className="mt-0.5 text-xs text-stone-600">
                            {editingId !== null ? `ID: ${editingId}` : '* 필수 입력'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <CancelBtn onClick={handleNew} />
                        <SaveBtn
                            label={loading ? '저장 중...' : editingId !== null ? '수정 저장' : '저장 및 게시'}
                            onClick={tab === 'weapon' ? handleSaveWeapon : handleSaveEquipment}
                        />
                    </div>
                </div>

                {/* ── 전용무기 폼 ── */}
                {tab === 'weapon' && (
                    <>
                        <Section title="① 기본 정보">
                            <Grid cols={3}>
                                <Field label="무기 이름" required>
                                    <Input value={weaponForm.name} onChange={e => setW('name', e.target.value)} placeholder="예: 라 사바호" />
                                </Field>
                                <Field label="무기 타입">
                                    <Input value={weaponForm.weaponType} onChange={e => setW('weaponType', e.target.value)} placeholder="예: 쌍수단검" />
                                </Field>
                                <Field label="등급" required>
                                    <Select value={weaponForm.grade} onChange={e => setW('grade', e.target.value)}>
                                        {GRADES.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                                    </Select>
                                </Field>
                            </Grid>
                            <div className="mt-3">
                                <Field label="아이콘 URL">
                                    <Input value={weaponForm.iconUrl} onChange={e => setW('iconUrl', e.target.value)} placeholder="https://..." />
                                </Field>
                            </div>
                            <div className="mt-3">
                                <Field label="설명">
                                    <Textarea rows={2} value={weaponForm.description} onChange={e => setW('description', e.target.value)} placeholder="무기 배경 설명..." />
                                </Field>
                            </div>
                        </Section>

                        <Section title="② 스탯">
                            <Field label="기본 스탯 (JSON)">
                                <Textarea rows={2} value={weaponForm.baseStats} onChange={e => setW('baseStats', e.target.value)} placeholder='{"atk": 1234, "hp": 5678}' />
                            </Field>
                            <div className="mt-3">
                                <Field label="추가 능력치 설명">
                                    <Textarea rows={2} value={weaponForm.extraStats} onChange={e => setW('extraStats', e.target.value)} placeholder="예: 물리 관통 +14%" />
                                </Field>
                            </div>
                        </Section>

                        <Section title="③ 무기 효과">
                            <EffectSection effects={weaponForm.effects} onChange={effects => setWeaponForm(f => ({ ...f, effects }))} />
                        </Section>
                    </>
                )}

                {/* ── 장비 폼 ── */}
                {tab === 'equipment' && (
                    <>
                        <Section title="① 기본 정보">
                            <Grid cols={2}>
                                <Field label="아이템 이름" required>
                                    <Input value={equipmentForm.name} onChange={e => setE('name', e.target.value)} placeholder="예: 회색의 계승자 갑옷" />
                                </Field>
                                <Field label="등급" required>
                                    <Select value={equipmentForm.grade} onChange={e => setE('grade', e.target.value)}>
                                        {GRADES.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                                    </Select>
                                </Field>
                            </Grid>
                            <div className="mt-3">
                                <Grid cols={isArmor ? 2 : 1}>
                                    <Field label="부위" required>
                                        <Select value={equipmentForm.type} onChange={e => setE('type', e.target.value)}>
                                            {EQUIPMENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                        </Select>
                                    </Field>
                                    {isArmor && (
                                        <Field label="방어 타입">
                                            <Select value={equipmentForm.defenseType} onChange={e => setE('defenseType', e.target.value)}>
                                                {DEFENSE_TYPES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                                            </Select>
                                        </Field>
                                    )}
                                </Grid>
                            </div>
                            <div className="mt-3">
                                <Field label="아이콘 URL">
                                    <Input value={equipmentForm.iconUrl} onChange={e => setE('iconUrl', e.target.value)} placeholder="https://..." />
                                </Field>
                            </div>
                            <div className="mt-3">
                                <Field label="설명">
                                    <Textarea rows={2} value={equipmentForm.description} onChange={e => setE('description', e.target.value)} placeholder="아이템 배경 설명..." />
                                </Field>
                            </div>
                        </Section>

                        <Section title="② 스탯">
                            <Field label="기본 스탯 (JSON)">
                                <Textarea rows={2} value={equipmentForm.baseStats} onChange={e => setE('baseStats', e.target.value)} placeholder='{"atk": 1234, "hp": 5678}' />
                            </Field>
                            <div className="mt-3">
                                <Field label="추가 능력치 설명">
                                    <Textarea rows={2} value={equipmentForm.extraStats} onChange={e => setE('extraStats', e.target.value)} placeholder="예: 물리 관통 +14%" />
                                </Field>
                            </div>
                        </Section>

                        <Section title="③ 세트 효과">
                            <Field label="세트 이름">
                                <Input value={equipmentForm.setName} onChange={e => setE('setName', e.target.value)} placeholder="예: 회색의 계승자" />
                            </Field>
                            <div className="mt-3 space-y-3">
                                <ItemBox>
                                    <div className="mb-2">
                                        <span className="rounded bg-blue-900/20 px-2 py-0.5 text-xs font-bold text-blue-500">2세트 효과</span>
                                    </div>
                                    <Field label="효과 설명">
                                        <Textarea rows={2} value={equipmentForm.setEffect2} onChange={e => setE('setEffect2', e.target.value)} placeholder="2세트 효과..." />
                                    </Field>
                                </ItemBox>
                                <ItemBox>
                                    <div className="mb-2">
                                        <span className="rounded bg-purple-900/20 px-2 py-0.5 text-xs font-bold text-purple-400">4세트 효과</span>
                                    </div>
                                    <Field label="효과 설명">
                                        <Textarea rows={2} value={equipmentForm.setEffect4} onChange={e => setE('setEffect4', e.target.value)} placeholder="4세트 효과..." />
                                    </Field>
                                </ItemBox>
                            </div>
                        </Section>

                        <Section title="④ 아이템 효과">
                            <EffectSection effects={equipmentForm.effects} onChange={effects => setEquipmentForm(f => ({ ...f, effects }))} />
                        </Section>
                    </>
                )}

                <div className="mb-8 flex justify-end gap-2">
                    <CancelBtn onClick={handleNew} />
                    <SaveBtn
                        label={loading ? '저장 중...' : editingId !== null ? '수정 저장' : '저장 및 게시'}
                        onClick={tab === 'weapon' ? handleSaveWeapon : handleSaveEquipment}
                    />
                </div>
            </main>
        </div>
    )
}

export default ItemAdmin