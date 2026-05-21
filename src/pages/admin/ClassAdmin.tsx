import { useState } from 'react'
import { Section, Field, Input, Select, Textarea, AddBtn, RemoveBtn, ItemBox, Grid, CancelBtn, DraftBtn, SaveBtn } from '../../components/common/AdminComponents'

interface SkillItem {
    id: number
    skill_name: string
    tp_cost: string
    range_min: string
    range_max: string
    area_of_effect: string
    cooldown: string
    effect_description: string
}

const ClassAdmin = () => {
    const [skills, setSkills] = useState<SkillItem[]>([
        { id: 1, skill_name: '', tp_cost: '', range_min: '', range_max: '', area_of_effect: '', cooldown: '', effect_description: '' }
    ])
    const [passiveTab, setPassiveTab] = useState<1 | 2>(1)

    const addSkill = () => {
        setSkills([...skills, { id: Date.now(), skill_name: '', tp_cost: '', range_min: '', range_max: '', area_of_effect: '', cooldown: '', effect_description: '' }])
    }

    const updateSkill = (id: number, key: keyof SkillItem, value: string) => {
        setSkills(skills.map(s => s.id === id ? { ...s, [key]: value } : s))
    }

    return (
        <main className="min-w-0 flex-1 overflow-y-auto px-8 py-7">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="font-cinzel text-lg tracking-widest text-amber-400">클래스 등록 / 수정</h1>
                    <p className="mt-0.5 text-xs text-stone-600">클래스 데이터 입력 · 노드 연결은 캐릭터 관리에서</p>
                </div>
                <div className="flex gap-2">
                    <CancelBtn />
                    <DraftBtn />
                    <SaveBtn />
                </div>
            </div>

            {/* ① 기본 정보 */}
            <Section title="① 기본 정보">
                <Grid cols={3}>
                    <Field label="클래스 이름"><Input placeholder="예: 로그" /></Field>
                    <Field label="Tier">
                        <Select><option>1</option><option>2</option><option>3</option></Select>
                    </Field>
                    <Field label="클래스 ID (URL용)"><Input placeholder="예: rogue-t1" /></Field>
                </Grid>
                <div className="mt-3">
                    <Field label="클래스 설명">
                        <Textarea rows={3} placeholder="클래스 설명..." />
                    </Field>
                </div>
                <div className="mt-3">
                    <Field label="클래스 아이콘 URL"><Input placeholder="https://..." /></Field>
                </div>
            </Section>

            {/* ② 클래스 스탯 */}
            <Section title="② 클래스 스탯">
                <Grid cols={4}>
                    <Field label="사용 무기"><Input placeholder="예: 쌍수단검" /></Field>
                    <Field label="방어 타입">
                        <Select><option>라이트</option><option>미디엄</option><option>헤비</option></Select>
                    </Field>
                    <Field label="공격 사거리"><Input type="number" placeholder="1" /></Field>
                    <Field label="이동거리"><Input type="number" placeholder="4" /></Field>
                </Grid>
                <div className="mt-3">
                    <Grid cols={2}>
                        <Field label="최대 체력"><Input type="number" placeholder="8964" /></Field>
                        <Field label="공격력"><Input type="number" placeholder="3636" /></Field>
                    </Grid>
                </div>
            </Section>

            {/* ③ 습득 스킬 - 액티브만 */}
            <Section title="③ 습득 스킬 (액티브)">
                <div className="space-y-3">
                    {skills.map((skill) => (
                        <ItemBox key={skill.id}>
                            <div className="mb-3 flex justify-between items-center">
                                <span className="rounded bg-red-900/30 px-2 py-0.5 text-xs font-bold text-red-400">A 액티브</span>
                                <RemoveBtn onClick={() => setSkills(skills.filter(s => s.id !== skill.id))} />
                            </div>
                            <Grid cols={2}>
                                <Field label="스킬 이름">
                                    <Input value={skill.skill_name} onChange={e => updateSkill(skill.id, 'skill_name', e.target.value)} placeholder="스킬 이름" />
                                </Field>
                                <Field label="스킬 아이콘 URL"><Input placeholder="https://..." /></Field>
                            </Grid>
                            <div className="mt-3">
                                <Grid cols={4}>
                                    <Field label="TP 소모"><Input type="number" value={skill.tp_cost} onChange={e => updateSkill(skill.id, 'tp_cost', e.target.value)} /></Field>
                                    <Field label="사거리 최소"><Input type="number" value={skill.range_min} onChange={e => updateSkill(skill.id, 'range_min', e.target.value)} /></Field>
                                    <Field label="사거리 최대"><Input type="number" value={skill.range_max} onChange={e => updateSkill(skill.id, 'range_max', e.target.value)} /></Field>
                                    <Field label="쿨타임 (턴)"><Input type="number" value={skill.cooldown} onChange={e => updateSkill(skill.id, 'cooldown', e.target.value)} /></Field>
                                </Grid>
                            </div>
                            <div className="mt-3">
                                <Grid cols={2}>
                                    <Field label="범위"><Input value={skill.area_of_effect} onChange={e => updateSkill(skill.id, 'area_of_effect', e.target.value)} placeholder="단일 / 직선 / 범위" /></Field>
                                    <div />
                                </Grid>
                            </div>
                            <div className="mt-3">
                                <Field label="효과 설명">
                                    <Textarea rows={2} value={skill.effect_description} onChange={e => updateSkill(skill.id, 'effect_description', e.target.value)} placeholder="[150%]{red} 물리 피해... 태그 사용 가능" />
                                </Field>
                            </div>
                        </ItemBox>
                    ))}
                </div>
                <AddBtn onClick={addSkill} label="스킬 추가" />
            </Section>

            {/* ④ 클래스 패시브 - 탭 1/2레벨 */}
            <Section title="④ 클래스 패시브">
                {/* 탭 */}
                <div className="mb-4 flex gap-1 border-b border-amber-900/20">
                    {([1, 2] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setPassiveTab(tab)}
                            className={`px-5 py-2 text-xs font-cinzel tracking-wider transition border-b-2 -mb-px ${
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
                            <Field label="패시브 이름"><Input placeholder="예: 정보 보안 1" /></Field>
                        </div>
                        <Field label="패시브 설명">
                            <Textarea rows={4} placeholder="1레벨 패시브 효과... [수치]{red} 태그 사용 가능" />
                        </Field>
                    </div>
                )}

                {passiveTab === 2 && (
                    <div>
                        <div className="mb-3">
                            <Field label="패시브 이름"><Input placeholder="예: 정보 보안 2" /></Field>
                        </div>
                        <Field label="패시브 설명">
                            <Textarea rows={4} placeholder="2레벨 패시브 효과... [수치]{red} 태그 사용 가능" />
                        </Field>
                    </div>
                )}
            </Section>

            {/* 하단 버튼 */}
            <div className="mb-8 flex justify-end gap-2">
                <button className="rounded border border-stone-700 px-5 py-2 text-sm text-stone-400 transition hover:bg-stone-800">취소</button>
                <button className="rounded border border-stone-600 bg-stone-800/60 px-5 py-2 text-sm text-stone-300 transition hover:bg-stone-700">임시저장</button>
                <button className="rounded border border-amber-700/50 bg-amber-900/20 px-5 py-2 text-sm text-amber-400 transition hover:bg-amber-900/30">저장</button>
            </div>
        </main>
    )
}

export default ClassAdmin