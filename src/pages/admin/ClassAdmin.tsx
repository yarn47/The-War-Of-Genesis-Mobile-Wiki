import { useState, useEffect } from 'react'
import {
    Section, Field, Input, Select, Textarea,
    AddBtn, RemoveBtn, ItemBox, Grid, CancelBtn, SaveBtn
} from '../../components/common/AdminComponents'
import { useToast } from '../../components/common/Toast'
import {
    getAllClasses, getClassDetail, createClass, updateClass, deleteClass,
    type ClassSummaryDto, type ClassDetailDto, type ClassRequest, type SkillRequest
} from '../../api/classApi'

// ─── 기본값 ────────────────────────────────────────────────

const emptySkill = (): SkillForm => ({
    _key: Date.now(),
    name: '', type: 'active',
    tpCost: '', rangeMin: '', rangeMax: '',
    area: '', cooldown: '', effectText: '', iconUrl: '', unlockOrder: ''
})

const emptyForm = (): FormState => ({
    name: '', tier: '1',
    weaponType: '', defenseType: 'light',
    attackRange: '', moveRange: '',
    baseHp: '', baseAttack: '',
    parentClassId: '', description: '',
    iconUrl: '',
    passive1Name: '', passive1Lv1: '', passive1Lv2: '',
    skills: [emptySkill()]
})

// ─── 타입 ──────────────────────────────────────────────────

interface SkillForm {
    _key: number
    name: string
    type: string
    tpCost: string
    rangeMin: string
    rangeMax: string
    area: string
    cooldown: string
    effectText: string
    iconUrl: string
    unlockOrder: string
}

interface FormState {
    name: string
    tier: string
    weaponType: string
    defenseType: string
    attackRange: string
    moveRange: string
    baseHp: string
    baseAttack: string
    parentClassId: string
    description: string
    iconUrl: string
    passive1Name: string
    passive1Lv1: string
    passive1Lv2: string
    skills: SkillForm[]
}

// ─── 헬퍼 ──────────────────────────────────────────────────

const toInt = (v: string) => v.trim() === '' ? null : parseInt(v)
const toStr = (v: string) => v.trim() === '' ? null : v.trim()

const detailToForm = (d: ClassDetailDto): FormState => ({
    name: d.name,
    tier: String(d.tier),
    weaponType: d.weaponType ?? '',
    defenseType: d.defenseType ?? 'light',
    attackRange: d.attackRange != null ? String(d.attackRange) : '',
    moveRange: d.moveRange != null ? String(d.moveRange) : '',
    baseHp: d.baseHp != null ? String(d.baseHp) : '',
    baseAttack: d.baseAttack != null ? String(d.baseAttack) : '',
    parentClassId: d.parentClassId != null ? String(d.parentClassId) : '',
    description: d.description ?? '',
    iconUrl: d.iconUrl ?? '',
    passive1Name: d.passive1Name ?? '',
    passive1Lv1: d.passive1Lv1 ?? '',
    passive1Lv2: d.passive1Lv2 ?? '',
    skills: d.skills.map((s, i) => ({
        _key: s.skillId,
        name: s.name,
        type: s.type,
        tpCost: s.tpCost != null ? String(s.tpCost) : '',
        rangeMin: s.rangeMin != null ? String(s.rangeMin) : '',
        rangeMax: s.rangeMax != null ? String(s.rangeMax) : '',
        area: s.area ?? '',
        cooldown: s.cooldown != null ? String(s.cooldown) : '',
        effectText: s.effectText ?? '',
        iconUrl: s.iconUrl ?? '',
        unlockOrder: String(i + 1)
    }))
})

const formToRequest = (f: FormState): ClassRequest => ({
    name: f.name,
    tier: parseInt(f.tier),
    weaponType: toStr(f.weaponType),
    defenseType: toStr(f.defenseType),
    attackRange: toInt(f.attackRange),
    moveRange: toInt(f.moveRange),
    baseHp: toInt(f.baseHp),
    baseAttack: toInt(f.baseAttack),
    parentClassId: toInt(f.parentClassId),
    description: toStr(f.description),
    iconUrl: toStr(f.iconUrl),
    passive1Name: toStr(f.passive1Name),
    passive1Lv1: toStr(f.passive1Lv1),
    passive1Lv2: toStr(f.passive1Lv2),
    skills: f.skills.map((s, i): SkillRequest => ({
        name: s.name,
        type: s.type,
        tpCost: toInt(s.tpCost),
        rangeMin: toInt(s.rangeMin),
        rangeMax: toInt(s.rangeMax),
        area: toStr(s.area),
        cooldown: toInt(s.cooldown),
        effectText: toStr(s.effectText),
        iconUrl: toStr(s.iconUrl),
        unlockOrder: toInt(s.unlockOrder) ?? (i + 1)
    }))
})

// ─── 컴포넌트 ───────────────────────────────────────────────

const ClassAdmin = () => {
    const { show, ToastContainer } = useToast()
    const [classList, setClassList] = useState<ClassSummaryDto[]>([])
    const [editingId, setEditingId] = useState<number | null>(null)
    const [form, setForm] = useState<FormState>(emptyForm())
    const [passiveTab, setPassiveTab] = useState<1 | 2>(1)
    const [loading, setLoading] = useState(false)

    // 목록 로드
    const loadList = () => {
        getAllClasses().then(setClassList).catch(() => show('목록 로드 실패', 'error'))
    }

    useEffect(() => { loadList() }, [])

    // 수정 클릭
    const handleEdit = async (id: number) => {
        try {
            const detail = await getClassDetail(id)
            setForm(detailToForm(detail))
            setEditingId(id)
            setPassiveTab(1)
        } catch {
            show('불러오기 실패', 'error')
        }
    }

    // 새 등록 폼
    const handleNew = () => {
        setForm(emptyForm())
        setEditingId(null)
        setPassiveTab(1)
    }

    // 삭제
    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`"${name}" 클래스를 삭제할까요?`)) return
        try {
            await deleteClass(id)
            show('삭제 완료')
            loadList()
            if (editingId === id) handleNew()
        } catch {
            show('삭제 실패', 'error')
        }
    }

    // 저장
    const handleSave = async () => {
        if (!form.name.trim()) { show('클래스 이름을 입력해주세요', 'error'); return }
        setLoading(true)
        try {
            if (editingId !== null) {
                await updateClass(editingId, formToRequest(form))
                show('수정 완료!')
            } else {
                await createClass(formToRequest(form))
                show('등록 완료!')
                handleNew()
            }
            loadList()
        } catch {
            show('저장 실패', 'error')
        } finally {
            setLoading(false)
        }
    }

    // 폼 필드 업데이트
    const set = (key: keyof FormState, val: string) =>
        setForm(f => ({ ...f, [key]: val }))

    // 스킬 업데이트
    const updateSkill = (key: number, field: keyof SkillForm, val: string) =>
        setForm(f => ({ ...f, skills: f.skills.map(s => s._key === key ? { ...s, [field]: val } : s) }))

    const addSkill = () =>
        setForm(f => ({ ...f, skills: [...f.skills, emptySkill()] }))

    const removeSkill = (key: number) =>
        setForm(f => ({ ...f, skills: f.skills.filter(s => s._key !== key) }))

    // ─── 렌더 ──────────────────────────────────────────────

    return (
        <div className="flex min-w-0 flex-1 gap-0 overflow-hidden">
            <ToastContainer />

            {/* 좌측 목록 패널 */}
            <aside className="flex w-56 flex-col border-r border-[var(--card-border)] bg-black/20">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--card-border)]">
                    <span className="text-xs font-cinzel tracking-widest text-[var(--accent)]">클래스 목록</span>
                    <button
                        onClick={handleNew}
                        className="rounded bg-[var(--accent)]/10 border border-[var(--accent)]/30 px-2 py-1 text-xs text-[var(--accent)] hover:bg-[var(--accent)]/20 transition"
                    >
                        + 신규
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-1">
                    {classList.length === 0 && (
                        <p className="px-4 py-3 text-xs text-[var(--text-muted)]">등록된 클래스 없음</p>
                    )}
                    {classList.map(c => (
                        <div
                            key={c.classId}
                            onClick={() => handleEdit(c.classId)}
                            className={`group flex cursor-pointer items-center justify-between px-4 py-2.5 transition hover:bg-white/5 ${editingId === c.classId ? 'bg-[var(--accent)]/10' : ''}`}
                        >
                            <div>
                                <div className={`text-sm font-medium ${editingId === c.classId ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>
                                    {c.name}
                                </div>
                                <div className="text-xs text-[var(--text-muted)]">Tier {c.tier}</div>
                            </div>
                            <button
                                onClick={e => { e.stopPropagation(); handleDelete(c.classId, c.name) }}
                                className="hidden rounded px-1.5 py-0.5 text-xs text-[var(--text-muted)] hover:bg-red-900/30 hover:text-red-400 group-hover:block transition"
                            >
                                삭제
                            </button>
                        </div>
                    ))}
                </div>
            </aside>

            {/* 우측 편집 패널 */}
            <main className="min-w-0 flex-1 overflow-y-auto px-8 py-7">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="font-cinzel text-lg tracking-widest text-amber-400">
                            {editingId !== null ? '클래스 수정' : '클래스 등록'}
                        </h1>
                        <p className="mt-0.5 text-xs text-stone-600">
                            {editingId !== null ? `ID: ${editingId}` : '클래스 데이터 입력 · 노드 연결은 캐릭터 관리에서'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <CancelBtn onClick={handleNew} />
                        <SaveBtn
                            label={loading ? '저장 중...' : editingId !== null ? '수정 저장' : '저장 및 게시'}
                            onClick={handleSave}
                        />
                    </div>
                </div>

                {/* ① 기본 정보 */}
                <Section title="① 기본 정보">
                    <Grid cols={3}>
                        <Field label="클래스 이름" required>
                            <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="예: 로그" />
                        </Field>
                        <Field label="Tier">
                            <Select value={form.tier} onChange={e => set('tier', e.target.value)}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </Select>
                        </Field>
                        <Field label="부모 클래스 ID">
                            <Input
                                type="number"
                                value={form.parentClassId}
                                onChange={e => set('parentClassId', e.target.value)}
                                placeholder="없으면 비워두기"
                            />
                        </Field>
                    </Grid>
                    <div className="mt-3">
                        <Field label="클래스 설명">
                            <Textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="클래스 설명..." />
                        </Field>
                    </div>
                    <div className="mt-3">
                        <Field label="클래스 아이콘 URL">
                            <Input value={form.iconUrl} onChange={e => set('iconUrl', e.target.value)} placeholder="https://..." />
                        </Field>
                    </div>
                </Section>

                {/* ② 클래스 스탯 */}
                <Section title="② 클래스 스탯">
                    <Grid cols={4}>
                        <Field label="사용 무기">
                            <Input value={form.weaponType} onChange={e => set('weaponType', e.target.value)} placeholder="예: 쌍수단검" />
                        </Field>
                        <Field label="방어 타입">
                            <Select value={form.defenseType} onChange={e => set('defenseType', e.target.value)}>
                                <option value="light">라이트</option>
                                <option value="medium">미디엄</option>
                                <option value="heavy">헤비</option>
                            </Select>
                        </Field>
                        <Field label="공격 사거리">
                            <Input type="number" value={form.attackRange} onChange={e => set('attackRange', e.target.value)} placeholder="1" />
                        </Field>
                        <Field label="이동거리">
                            <Input type="number" value={form.moveRange} onChange={e => set('moveRange', e.target.value)} placeholder="4" />
                        </Field>
                    </Grid>
                    <div className="mt-3">
                        <Grid cols={2}>
                            <Field label="최대 체력">
                                <Input type="number" value={form.baseHp} onChange={e => set('baseHp', e.target.value)} placeholder="8964" />
                            </Field>
                            <Field label="공격력">
                                <Input type="number" value={form.baseAttack} onChange={e => set('baseAttack', e.target.value)} placeholder="3636" />
                            </Field>
                        </Grid>
                    </div>
                </Section>

                {/* ③ 습득 스킬 */}
                <Section title="③ 습득 스킬 (액티브)">
                    <div className="space-y-3">
                        {form.skills.map((skill) => (
                            <ItemBox key={skill._key}>
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="rounded bg-red-900/30 px-2 py-0.5 text-xs font-bold text-red-400">A 액티브</span>
                                    <RemoveBtn onClick={() => removeSkill(skill._key)} />
                                </div>
                                <Grid cols={2}>
                                    <Field label="스킬 이름" required>
                                        <Input value={skill.name} onChange={e => updateSkill(skill._key, 'name', e.target.value)} placeholder="스킬 이름" />
                                    </Field>
                                    <Field label="스킬 아이콘 URL">
                                        <Input value={skill.iconUrl} onChange={e => updateSkill(skill._key, 'iconUrl', e.target.value)} placeholder="https://..." />
                                    </Field>
                                </Grid>
                                <div className="mt-3">
                                    <Grid cols={4}>
                                        <Field label="TP 소모">
                                            <Input type="number" value={skill.tpCost} onChange={e => updateSkill(skill._key, 'tpCost', e.target.value)} />
                                        </Field>
                                        <Field label="사거리 최소">
                                            <Input type="number" value={skill.rangeMin} onChange={e => updateSkill(skill._key, 'rangeMin', e.target.value)} />
                                        </Field>
                                        <Field label="사거리 최대">
                                            <Input type="number" value={skill.rangeMax} onChange={e => updateSkill(skill._key, 'rangeMax', e.target.value)} />
                                        </Field>
                                        <Field label="쿨타임 (턴)">
                                            <Input type="number" value={skill.cooldown} onChange={e => updateSkill(skill._key, 'cooldown', e.target.value)} />
                                        </Field>
                                    </Grid>
                                </div>
                                <div className="mt-3">
                                    <Grid cols={2}>
                                        <Field label="범위">
                                            <Input value={skill.area} onChange={e => updateSkill(skill._key, 'area', e.target.value)} placeholder="단일 / 직선 / 범위" />
                                        </Field>
                                        <Field label="순서">
                                            <Input type="number" value={skill.unlockOrder} onChange={e => updateSkill(skill._key, 'unlockOrder', e.target.value)} placeholder="1" />
                                        </Field>
                                    </Grid>
                                </div>
                                <div className="mt-3">
                                    <Field label="효과 설명">
                                        <Textarea
                                            rows={2}
                                            value={skill.effectText}
                                            onChange={e => updateSkill(skill._key, 'effectText', e.target.value)}
                                            placeholder="[150%]{red} 물리 피해... 태그 사용 가능"
                                        />
                                    </Field>
                                </div>
                            </ItemBox>
                        ))}
                    </div>
                    <AddBtn onClick={addSkill} label="스킬 추가" />
                </Section>

                {/* ④ 클래스 패시브 */}
                <Section title="④ 클래스 패시브">
                    <div className="mb-4 flex gap-1 border-b border-amber-900/20">
                        {([1, 2] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setPassiveTab(tab)}
                                className={`-mb-px border-b-2 px-5 py-2 text-xs font-cinzel tracking-wider transition ${
                                    passiveTab === tab
                                        ? 'border-amber-500 text-amber-400'
                                        : 'border-transparent text-stone-500 hover:text-stone-300'
                                }`}
                            >
                                {tab}레벨
                            </button>
                        ))}
                    </div>

                    {passiveTab === 1 && (
                        <div>
                            <div className="mb-3">
                                <Field label="패시브 이름">
                                    <Input value={form.passive1Name} onChange={e => set('passive1Name', e.target.value)} placeholder="예: 정보 보안 1" />
                                </Field>
                            </div>
                            <Field label="패시브 설명">
                                <Textarea rows={4} value={form.passive1Lv1} onChange={e => set('passive1Lv1', e.target.value)} placeholder="1레벨 패시브 효과... [수치]{red} 태그 사용 가능" />
                            </Field>
                        </div>
                    )}

                    {passiveTab === 2 && (
                        <div>
                            <div className="mb-3">
                                <Field label="패시브 이름">
                                    <Input value={form.passive1Name} onChange={e => set('passive1Name', e.target.value)} placeholder="예: 정보 보안 2" />
                                </Field>
                            </div>
                            <Field label="패시브 설명">
                                <Textarea rows={4} value={form.passive1Lv2} onChange={e => set('passive1Lv2', e.target.value)} placeholder="2레벨 패시브 효과... [수치]{red} 태그 사용 가능" />
                            </Field>
                        </div>
                    )}
                </Section>

                <div className="mb-8 flex justify-end gap-2">
                    <CancelBtn onClick={handleNew} />
                    <SaveBtn
                        label={loading ? '저장 중...' : editingId !== null ? '수정 저장' : '저장 및 게시'}
                        onClick={handleSave}
                    />
                </div>
            </main>
        </div>
    )
}

export default ClassAdmin