import { useState, useEffect, useCallback, memo } from 'react'
import {
    Section, Field, Input, Select, Textarea,
    AddBtn, RemoveBtn, ItemBox, Grid, CancelBtn, SaveBtn
} from '../../components/common/AdminComponents'
import { useToast } from '../../components/common/Toast'
import {
    getAllClasses, getClassDetail, createClass, updateClass, deleteClass,
    type ClassSummaryDto, type ClassDetailDto, type ClassRequest, type SkillRequest
} from '../../api/classApi'

// ─── 타입 ──────────────────────────────────────────────────

interface SkillForm {
    _key: number
    name: string; type: string; tpCost: string
    rangeMin: string; rangeMax: string; area: string
    cooldown: string; effectText: string; iconUrl: string; unlockOrder: string
}

interface BasicState {
    name: string; tier: string; parentClassId: string
    description: string; iconUrl: string
}

interface StatState {
    weaponType: string; defenseType: string
    attackRange: string; moveRange: string
    baseHp: string; baseAttack: string
}

interface PassiveState {
    passive1Name: string; passive1Lv1: string; passive1Lv2: string
}

// ─── 기본값 ────────────────────────────────────────────────

const emptySkill = (): SkillForm => ({
    _key: Date.now() + Math.random(),
    name: '', type: 'active', tpCost: '', rangeMin: '', rangeMax: '',
    area: '', cooldown: '', effectText: '', iconUrl: '', unlockOrder: ''
})
const emptyBasic = (): BasicState => ({ name: '', tier: '1', parentClassId: '', description: '', iconUrl: '' })
const emptyStat = (): StatState => ({ weaponType: '', defenseType: 'light', attackRange: '', moveRange: '', baseHp: '', baseAttack: '' })
const emptyPassive = (): PassiveState => ({ passive1Name: '', passive1Lv1: '', passive1Lv2: '' })

// ─── 헬퍼 ──────────────────────────────────────────────────

const toInt = (v: string) => v.trim() === '' ? null : parseInt(v)
const toStr = (v: string) => v.trim() === '' ? null : v.trim()

const detailToStates = (d: ClassDetailDto) => ({
    basic: { name: d.name, tier: String(d.tier), parentClassId: d.parentClassId != null ? String(d.parentClassId) : '', description: d.description ?? '', iconUrl: d.iconUrl ?? '' },
    stat: { weaponType: d.weaponType ?? '', defenseType: d.defenseType ?? 'light', attackRange: d.attackRange != null ? String(d.attackRange) : '', moveRange: d.moveRange != null ? String(d.moveRange) : '', baseHp: d.baseHp != null ? String(d.baseHp) : '', baseAttack: d.baseAttack != null ? String(d.baseAttack) : '' },
    passive: { passive1Name: d.passive1Name ?? '', passive1Lv1: d.passive1Lv1 ?? '', passive1Lv2: d.passive1Lv2 ?? '' },
    skills: d.skills.map((s, i) => ({ _key: s.skillId, name: s.name, type: s.type, tpCost: s.tpCost != null ? String(s.tpCost) : '', rangeMin: s.rangeMin != null ? String(s.rangeMin) : '', rangeMax: s.rangeMax != null ? String(s.rangeMax) : '', area: s.area ?? '', cooldown: s.cooldown != null ? String(s.cooldown) : '', effectText: s.effectText ?? '', iconUrl: s.iconUrl ?? '', unlockOrder: String(i + 1) }))
})

const buildRequest = (basic: BasicState, stat: StatState, passive: PassiveState, skills: SkillForm[]): ClassRequest => ({
    name: basic.name, tier: parseInt(basic.tier),
    parentClassId: toInt(basic.parentClassId), description: toStr(basic.description), iconUrl: toStr(basic.iconUrl),
    weaponType: toStr(stat.weaponType), defenseType: toStr(stat.defenseType),
    attackRange: toInt(stat.attackRange), moveRange: toInt(stat.moveRange),
    baseHp: toInt(stat.baseHp), baseAttack: toInt(stat.baseAttack),
    passive1Name: toStr(passive.passive1Name), passive1Lv1: toStr(passive.passive1Lv1), passive1Lv2: toStr(passive.passive1Lv2),
    skills: skills.map((s, i): SkillRequest => ({
        name: s.name, type: s.type, tpCost: toInt(s.tpCost),
        rangeMin: toInt(s.rangeMin), rangeMax: toInt(s.rangeMax),
        area: toStr(s.area), cooldown: toInt(s.cooldown),
        effectText: toStr(s.effectText), iconUrl: toStr(s.iconUrl),
        unlockOrder: toInt(s.unlockOrder) ?? (i + 1)
    }))
})

// ─── 섹션 컴포넌트 ─────────────────────────────────────────

const BasicSection = memo(({ state, onChange }: { state: BasicState; onChange: (s: BasicState) => void }) => {
    const set = (k: keyof BasicState, v: string) => onChange({ ...state, [k]: v })
    return (
        <Section title="① 기본 정보">
            <Grid cols={3}>
                <Field label="클래스 이름" required>
                    <Input value={state.name} onChange={e => set('name', e.target.value)} placeholder="예: 로그" />
                </Field>
                <Field label="Tier">
                    <Select value={state.tier} onChange={e => set('tier', e.target.value)}>
                        <option value="1">1</option><option value="2">2</option><option value="3">3</option>
                    </Select>
                </Field>
                <Field label="부모 클래스 ID">
                    <Input type="number" value={state.parentClassId} onChange={e => set('parentClassId', e.target.value)} placeholder="없으면 비워두기" />
                </Field>
            </Grid>
            <div className="mt-3">
                <Field label="클래스 설명">
                    <Textarea rows={3} value={state.description} onChange={e => set('description', e.target.value)} placeholder="클래스 설명..." />
                </Field>
            </div>
            <div className="mt-3">
                <Field label="클래스 아이콘 URL">
                    <Input value={state.iconUrl} onChange={e => set('iconUrl', e.target.value)} placeholder="https://..." />
                </Field>
            </div>
        </Section>
    )
})

const StatSection = memo(({ state, onChange }: { state: StatState; onChange: (s: StatState) => void }) => {
    const set = (k: keyof StatState, v: string) => onChange({ ...state, [k]: v })
    return (
        <Section title="② 클래스 스탯">
            <Grid cols={4}>
                <Field label="사용 무기">
                    <Input value={state.weaponType} onChange={e => set('weaponType', e.target.value)} placeholder="예: 쌍수단검" />
                </Field>
                <Field label="방어 타입">
                    <Select value={state.defenseType} onChange={e => set('defenseType', e.target.value)}>
                        <option value="light">라이트</option><option value="medium">미디엄</option><option value="heavy">헤비</option>
                    </Select>
                </Field>
                <Field label="공격 사거리">
                    <Input type="number" value={state.attackRange} onChange={e => set('attackRange', e.target.value)} placeholder="1" />
                </Field>
                <Field label="이동거리">
                    <Input type="number" value={state.moveRange} onChange={e => set('moveRange', e.target.value)} placeholder="4" />
                </Field>
            </Grid>
            <div className="mt-3">
                <Grid cols={2}>
                    <Field label="최대 체력">
                        <Input type="number" value={state.baseHp} onChange={e => set('baseHp', e.target.value)} placeholder="8964" />
                    </Field>
                    <Field label="공격력">
                        <Input type="number" value={state.baseAttack} onChange={e => set('baseAttack', e.target.value)} placeholder="3636" />
                    </Field>
                </Grid>
            </div>
        </Section>
    )
})

const SkillSection = memo(({ skills, onChange }: { skills: SkillForm[]; onChange: (s: SkillForm[]) => void }) => {
    const update = (key: number, field: keyof SkillForm, val: string) =>
        onChange(skills.map(s => s._key === key ? { ...s, [field]: val } : s))
    return (
        <Section title="③ 습득 스킬 (액티브)">
            <div className="space-y-3">
                {skills.map(skill => (
                    <ItemBox key={skill._key}>
                        <div className="mb-3 flex items-center justify-between">
                            <span className="rounded bg-red-900/30 px-2 py-0.5 text-xs font-bold text-red-400">A 액티브</span>
                            <RemoveBtn onClick={() => onChange(skills.filter(s => s._key !== skill._key))} />
                        </div>
                        <Grid cols={2}>
                            <Field label="스킬 이름" required>
                                <Input value={skill.name} onChange={e => update(skill._key, 'name', e.target.value)} placeholder="스킬 이름" />
                            </Field>
                            <Field label="스킬 아이콘 URL">
                                <Input value={skill.iconUrl} onChange={e => update(skill._key, 'iconUrl', e.target.value)} placeholder="https://..." />
                            </Field>
                        </Grid>
                        <div className="mt-3">
                            <Grid cols={4}>
                                <Field label="TP 소모"><Input type="number" value={skill.tpCost} onChange={e => update(skill._key, 'tpCost', e.target.value)} /></Field>
                                <Field label="사거리 최소"><Input type="number" value={skill.rangeMin} onChange={e => update(skill._key, 'rangeMin', e.target.value)} /></Field>
                                <Field label="사거리 최대"><Input type="number" value={skill.rangeMax} onChange={e => update(skill._key, 'rangeMax', e.target.value)} /></Field>
                                <Field label="쿨타임 (턴)"><Input type="number" value={skill.cooldown} onChange={e => update(skill._key, 'cooldown', e.target.value)} /></Field>
                            </Grid>
                        </div>
                        <div className="mt-3">
                            <Grid cols={2}>
                                <Field label="범위"><Input value={skill.area} onChange={e => update(skill._key, 'area', e.target.value)} placeholder="단일 / 직선 / 범위" /></Field>
                                <Field label="순서"><Input type="number" value={skill.unlockOrder} onChange={e => update(skill._key, 'unlockOrder', e.target.value)} placeholder="1" /></Field>
                            </Grid>
                        </div>
                        <div className="mt-3">
                            <Field label="효과 설명">
                                <Textarea rows={2} value={skill.effectText} onChange={e => update(skill._key, 'effectText', e.target.value)} placeholder="[150%]{red} 물리 피해..." />
                            </Field>
                        </div>
                    </ItemBox>
                ))}
            </div>
            <AddBtn onClick={() => onChange([...skills, emptySkill()])} label="스킬 추가" />
        </Section>
    )
})

const PassiveSection = memo(({ state, onChange, passiveTab, setPassiveTab }: {
    state: PassiveState; onChange: (s: PassiveState) => void
    passiveTab: 1 | 2; setPassiveTab: (t: 1 | 2) => void
}) => {
    const set = (k: keyof PassiveState, v: string) => onChange({ ...state, [k]: v })
    return (
        <Section title="④ 클래스 패시브">
            <div className="mb-4 flex gap-1 border-b border-[var(--card-border)]">
                {([1, 2] as const).map(tab => (
                    <button key={tab} onClick={() => setPassiveTab(tab)}
                            className={`-mb-px border-b-2 px-5 py-2 text-xs font-cinzel tracking-wider ${passiveTab === tab ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-transparent text-stone-500 hover:text-stone-300'}`}
                    >{tab}레벨</button>
                ))}
            </div>
            <div className="mb-3">
                <Field label="패시브 이름">
                    <Input value={state.passive1Name} onChange={e => set('passive1Name', e.target.value)} placeholder="예: 정보 보안" />
                </Field>
            </div>
            {passiveTab === 1 && (
                <Field label="패시브 설명">
                    <Textarea rows={4} value={state.passive1Lv1} onChange={e => set('passive1Lv1', e.target.value)} placeholder="1레벨 패시브 효과..." />
                </Field>
            )}
            {passiveTab === 2 && (
                <Field label="패시브 설명">
                    <Textarea rows={4} value={state.passive1Lv2} onChange={e => set('passive1Lv2', e.target.value)} placeholder="2레벨 패시브 효과..." />
                </Field>
            )}
        </Section>
    )
})

// ─── 메인 컴포넌트 ─────────────────────────────────────────

const ClassAdmin = () => {
    const { show, ToastContainer } = useToast()
    const [classList, setClassList] = useState<ClassSummaryDto[]>([])
    const [editingId, setEditingId] = useState<number | null>(null)
    const [loading, setLoading] = useState(false)
    const [passiveTab, setPassiveTab] = useState<1 | 2>(1)

    const [basic, setBasic] = useState<BasicState>(emptyBasic())
    const [stat, setStat] = useState<StatState>(emptyStat())
    const [passive, setPassive] = useState<PassiveState>(emptyPassive())
    const [skills, setSkills] = useState<SkillForm[]>([emptySkill()])

    const loadList = useCallback(() => {
        getAllClasses().then(setClassList).catch(() => show('목록 로드 실패', 'error'))
    }, [])

    useEffect(() => { loadList() }, [])

    const resetAll = useCallback(() => {
        setEditingId(null)
        setBasic(emptyBasic()); setStat(emptyStat())
        setPassive(emptyPassive()); setSkills([emptySkill()])
        setPassiveTab(1)
    }, [])

    const handleEdit = useCallback(async (id: number) => {
        try {
            const d = await getClassDetail(id)
            const s = detailToStates(d)
            setBasic(s.basic); setStat(s.stat)
            setPassive(s.passive); setSkills(s.skills)
            setEditingId(id); setPassiveTab(1)
        } catch { show('불러오기 실패', 'error') }
    }, [])

    const handleDelete = useCallback(async (id: number, name: string) => {
        if (!confirm(`"${name}" 클래스를 삭제할까요?`)) return
        try {
            await deleteClass(id); show('삭제 완료'); loadList()
            if (editingId === id) resetAll()
        } catch { show('삭제 실패', 'error') }
    }, [editingId])

    const handleSave = useCallback(async () => {
        if (!basic.name.trim()) { show('클래스 이름을 입력해주세요', 'error'); return }
        setLoading(true)
        try {
            const req = buildRequest(basic, stat, passive, skills)
            if (editingId !== null) {
                await updateClass(editingId, req); show('수정 완료!')
            } else {
                await createClass(req); show('등록 완료!'); resetAll()
            }
            loadList()
        } catch { show('저장 실패', 'error') }
        finally { setLoading(false) }
    }, [basic, stat, passive, skills, editingId])

    return (
        <div className="flex min-w-0 flex-1 gap-0 overflow-hidden">
            <ToastContainer />

            <aside className="flex w-56 flex-col border-r border-[var(--card-border)] bg-black/20">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--card-border)]">
                    <span className="text-xs font-cinzel tracking-widest text-[var(--accent)]">클래스 목록</span>
                    <button onClick={resetAll} className="rounded bg-[var(--accent)]/10 border border-[var(--accent)]/30 px-2 py-1 text-xs text-[var(--accent)] hover:bg-[var(--accent)]/20">+ 신규</button>
                </div>
                <div className="flex-1 overflow-y-auto py-1">
                    {classList.length === 0 && <p className="px-4 py-3 text-xs text-[var(--text-muted)]">등록된 클래스 없음</p>}
                    {classList.map(c => (
                        <div key={c.classId} onClick={() => handleEdit(c.classId)}
                             className={`group flex cursor-pointer items-center justify-between px-4 py-2.5 hover:bg-white/5 ${editingId === c.classId ? 'bg-[var(--accent)]/10' : ''}`}
                        >
                            <div>
                                <div className={`text-sm font-medium ${editingId === c.classId ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>{c.name}</div>
                                <div className="text-xs text-[var(--text-muted)]">Tier {c.tier}</div>
                            </div>
                            <button onClick={e => { e.stopPropagation(); handleDelete(c.classId, c.name) }}
                                    className="hidden rounded px-1.5 py-0.5 text-xs text-[var(--text-muted)] hover:bg-red-900/30 hover:text-red-400 group-hover:block"
                            >삭제</button>
                        </div>
                    ))}
                </div>
            </aside>

            <main className="min-w-0 flex-1 overflow-y-auto px-8 py-7">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="font-cinzel text-lg tracking-widest text-[var(--accent)]">
                            {editingId !== null ? '클래스 수정' : '클래스 등록'}
                        </h1>
                        <p className="mt-0.5 text-xs text-stone-600">
                            {editingId !== null ? `ID: ${editingId}` : '클래스 데이터 입력 · 노드 연결은 캐릭터 관리에서'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <CancelBtn onClick={resetAll} />
                        <SaveBtn label={loading ? '저장 중...' : editingId !== null ? '수정 저장' : '저장 및 게시'} onClick={handleSave} />
                    </div>
                </div>

                <BasicSection state={basic} onChange={setBasic} />
                <StatSection state={stat} onChange={setStat} />
                <SkillSection skills={skills} onChange={setSkills} />
                <PassiveSection state={passive} onChange={setPassive} passiveTab={passiveTab} setPassiveTab={setPassiveTab} />

                <div className="mb-8 flex justify-end gap-2">
                    <CancelBtn onClick={resetAll} />
                    <SaveBtn label={loading ? '저장 중...' : editingId !== null ? '수정 저장' : '저장 및 게시'} onClick={handleSave} />
                </div>
            </main>
        </div>
    )
}

export default ClassAdmin