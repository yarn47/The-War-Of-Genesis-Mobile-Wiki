import { useState } from 'react'
import ClassTreeModal from '../../components/common/ClassTreeModal'
import type { ClassNode } from '../../components/common/ClassTreeModal'
import { Section, Field, Input, Select, Textarea, AddBtn, RemoveBtn, ItemBox, Grid, CancelBtn, DraftBtn, SaveBtn} from '../../components/common/AdminComponents'

interface SkillItem {
    id: number
    skill_name: string
    skill_type: string
    class_id: string
    tp_cost: string
    range_min: string
    range_max: string
    area_of_effect: string
    cooldown: string
    effect_description: string
}

interface ArtifactItem {
    id: number
    artifact_name: string
    icon_url: string
    levels: { level: number; description: string }[]
}

const CharacterAdmin = () => {
    const [showClassTree, setShowClassTree] = useState(false)
    const [classTree, setClassTree] = useState<ClassNode[]>([])

    const [skills, setSkills] = useState<SkillItem[]>([
        { id: 1, skill_name: '', skill_type: '액티브', class_id: '', tp_cost: '', range_min: '', range_max: '', area_of_effect: '', cooldown: '', effect_description: '' }
    ])
    const [artifacts, setArtifacts] = useState<ArtifactItem[]>([
        { id: 1, artifact_name: '', icon_url: '', levels: [3,4,5,6].map(l => ({ level: l, description: '' })) }
    ])

    const addSkill = () => {
        setSkills([...skills, { id: Date.now(), skill_name: '', skill_type: '액티브', class_id: '', tp_cost: '', range_min: '', range_max: '', area_of_effect: '', cooldown: '', effect_description: '' }])
    }

    const addArtifact = () => {
        if (artifacts.length >= 4) return
        setArtifacts([...artifacts, { id: Date.now(), artifact_name: '', icon_url: '', levels: [3,4,5,6].map(l => ({ level: l, description: '' })) }])
    }

    const passiveLevels = [
        { type: '각성', level: 3 }, { type: '각성', level: 4 },
        { type: '각성', level: 5 }, { type: '각성', level: 6 },
        { type: '발현', level: 2 }, { type: '발현', level: 4 }, { type: '발현', level: 6 },
    ]

    const ultimateLevels = [0, 1, 3, 5]

    return (
        <main className="min-w-0 flex-1 overflow-y-auto px-8 py-7">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="font-cinzel text-lg tracking-widest text-[var(--accent)]">캐릭터 등록 / 수정</h1>
                    <p className="mt-0.5 text-xs text-stone-600">* 필수 입력</p>
                </div>
                <div className="flex gap-2">
                    <CancelBtn />
                    <DraftBtn />
                    <SaveBtn />
                </div>
            </div>

            {/* ① 기본 정보 */}
            <Section title="① 기본 정보">
                <Grid cols={2}>
                    <Field label="캐릭터 이름" required><Input placeholder="예: 조안 카트라이트" /></Field>
                    <Field label="영문 이름 (URL)"><Input placeholder="예: joan-cartwright" /></Field>
                </Grid>
                <div className="mt-3">
                    <Grid cols={3}>
                        <Field label="등급" required>
                            <Select><option>희귀</option><option>영웅</option><option>전설</option><option>아우터원</option></Select>
                        </Field>
                        <Field label="진영" required>
                            <Select><option>게이시르</option><option>팬드래건</option><option>무소속</option><option>아스타니아</option><option>제피르팰컨</option><option>다갈</option></Select>
                        </Field>
                        <Field label="속성" required>
                            <Select><option>신념의빛</option><option>욕망의그림자</option><option>자유의불꽃</option><option>지성의결정체</option><option>활력의나무</option></Select>
                        </Field>
                    </Grid>
                </div>
                <div className="mt-3">
                    <Grid cols={4}>
                        <Field label="출생연도"><Input type="number" placeholder="1263" /></Field>
                        <Field label="신장 (cm)"><Input type="number" placeholder="170" /></Field>
                        <Field label="성우 (CV)"><Input placeholder="이계윤" /></Field>
                        <Field label="출시일"><Input type="date" /></Field>
                    </Grid>
                </div>
                <div className="mt-3">
                    <Field label="캐릭터 소개"><Textarea rows={3} placeholder="캐릭터 소개 텍스트..." /></Field>
                </div>
                <div className="mt-3">
                    <Grid cols={3}>
                        <Field label="썸네일 URL"><Input placeholder="https://..." /></Field>
                        <Field label="초상화 URL"><Input placeholder="https://..." /></Field>
                        <Field label="전신 일러스트 URL"><Input placeholder="https://..." /></Field>
                    </Grid>
                </div>
            </Section>

            {/* ② 스탯 */}
            <Section title="② 기본 스탯" subtitle="Lv.55 / 각성 6성 기준">
                <Grid cols={3}>
                    <Field label="HP"><Input type="number" placeholder="12450" /></Field>
                    <Field label="공격력"><Input type="number" placeholder="1840" /></Field>
                    <Field label="방어력"><Input type="number" placeholder="980" /></Field>
                    <Field label="치명타율 (%)"><Input type="number" placeholder="15" /></Field>
                    <Field label="치명타 피해 (%)"><Input type="number" placeholder="150" /></Field>
                    <Field label="물리 관통"><Input type="number" placeholder="0" /></Field>
                    <Field label="마법 관통"><Input type="number" placeholder="0" /></Field>
                    <Field label="효과 저항 (%)"><Input type="number" placeholder="0" /></Field>
                </Grid>
            </Section>

            {/* ③ 클래스 트리 */}
            <Section title="③ 클래스 트리">
                <button
                    onClick={() => setShowClassTree(true)}
                    className="rounded border border-amber-700/50 bg-amber-900/20 px-4 py-2 text-xs text-amber-400 hover:bg-amber-900/30 transition"
                >
                    클래스 트리 설정
                </button>
                {classTree.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {classTree.map(c => (
                            <span key={c.id} className="rounded border border-amber-900/20 bg-stone-900/40 px-3 py-1 text-xs text-stone-300">
                                T{c.tier} · {c.class_name}
                                {c.parent_id && <span className="ml-1 text-stone-600">↑ {classTree.find(p => p.id === c.parent_id)?.class_name}</span>}
                            </span>
                        ))}
                    </div>
                )}
                {showClassTree && (
                    <ClassTreeModal
                        onClose={() => setShowClassTree(false)}
                        onSave={(nodes) => setClassTree(nodes)}
                    />
                )}
            </Section>

            {/* ④ 스킬 */}
            <Section title="④ 스킬">
                <div className="space-y-3">
                    {skills.map((skill) => (
                        <ItemBox key={skill.id}>
                            <div className="mb-3 flex justify-end">
                                <RemoveBtn onClick={() => setSkills(skills.filter(s => s.id !== skill.id))} />
                            </div>
                            <Grid cols={4}>
                                <Field label="스킬 이름" required><Input /></Field>
                                <Field label="타입" required>
                                    <Select><option>액티브</option><option>패시브</option></Select>
                                </Field>
                                <Field label="습득 클래스">
                                    <Select>
                                        <option>선택</option>
                                        {classTree.map(c => <option key={c.id}>{c.class_name}</option>)}
                                    </Select>
                                </Field>
                                <Field label="TP 소모"><Input type="number" /></Field>
                            </Grid>
                            <div className="mt-3">
                                <Grid cols={4}>
                                    <Field label="사거리 최소"><Input type="number" /></Field>
                                    <Field label="사거리 최대"><Input type="number" /></Field>
                                    <Field label="범위"><Input placeholder="단일 / 직선 / 범위" /></Field>
                                    <Field label="쿨타임 (턴)"><Input type="number" /></Field>
                                </Grid>
                            </div>
                            <div className="mt-3">
                                <Grid cols={2}>
                                    <Field label="스킬 아이콘 URL"><Input placeholder="https://..." /></Field>
                                    <div />
                                </Grid>
                            </div>
                            <div className="mt-3">
                                <Field label="효과 설명" required>
                                    <Textarea rows={2} placeholder="[150%]{red} 물리 피해... 태그 사용 가능" />
                                </Field>
                            </div>
                        </ItemBox>
                    ))}
                </div>
                <AddBtn onClick={addSkill} label="스킬 추가" />
            </Section>

            {/* ⑤ 고유 패시브 */}
            <Section title="⑤ 고유 패시브" subtitle="각성 3/4/5/6 + 발현 2/4/6">
                <div className="mb-4">
                    <Grid cols={2}>
                        <Field label="패시브 이름"><Input placeholder="예: 화염의 창" /></Field>
                        <Field label="패시브 아이콘 URL"><Input placeholder="https://..." /></Field>
                    </Grid>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {passiveLevels.map(({ type, level }) => (
                        <ItemBox key={`${type}-${level}`} className={type === '발현' ? 'border-blue-900/20' : ''}>
                            <div className="mb-2 flex items-center gap-2">
                                <span className={`rounded px-2 py-0.5 text-xs font-bold ${type === '각성' ? 'bg-yellow-900/30 text-yellow-600' : 'bg-blue-900/30 text-blue-500'}`}>
                                    {type} {level}단
                                </span>
                            </div>
                            <Field label="효과 설명">
                                <Textarea rows={2} placeholder={`${type} ${level}단 효과...`} />
                            </Field>
                        </ItemBox>
                    ))}
                </div>
            </Section>

            {/* ⑥ 필살기 */}
            <Section title="⑥ 필살기" subtitle="발현 0 / 1 / 3 / 5단">
                <div className="mb-4">
                    <Grid cols={2}>
                        <Field label="필살기 이름"><Input placeholder="예: 화염의 심판" /></Field>
                        <Field label="필살기 아이콘 URL"><Input placeholder="https://..." /></Field>
                    </Grid>
                </div>
                <div className="space-y-3">
                    {ultimateLevels.map((level) => (
                        <ItemBox key={level}>
                            <div className="mb-3">
                                <span className={`rounded px-2 py-0.5 text-xs font-bold ${level === 0 ? 'bg-stone-800 text-stone-400' : 'bg-blue-900/30 text-blue-400'}`}>
                                    {level === 0 ? '노발현' : `발현 ${level}단`}
                                </span>
                            </div>
                            <Grid cols={4}>
                                <Field label="TP"><Input type="number" /></Field>
                                <Field label="사거리 최소"><Input type="number" /></Field>
                                <Field label="사거리 최대"><Input type="number" /></Field>
                                <Field label="쿨타임"><Input type="number" /></Field>
                            </Grid>
                            <div className="mt-3">
                                <Field label="효과 설명">
                                    <Textarea rows={2} placeholder={`${level === 0 ? '노발현' : `발현 ${level}단`} 필살기 효과...`} />
                                </Field>
                            </div>
                        </ItemBox>
                    ))}
                </div>
            </Section>

            {/* ⑦ 아티팩트 */}
            <Section title="⑦ 아티팩트" subtitle="최대 4개, 각 발현 3/4/5/6단">
                <div className="space-y-4">
                    {artifacts.map((art, i) => (
                        <ItemBox key={art.id}>
                            <div className="mb-3 flex items-center justify-between">
                                <span className="rounded bg-stone-800 px-2 py-0.5 font-cinzel text-xs text-stone-400">
                                    아티팩트 {String.fromCharCode(65 + i)}
                                </span>
                                <RemoveBtn onClick={() => setArtifacts(artifacts.filter(a => a.id !== art.id))} />
                            </div>
                            <div className="mb-3">
                                <Grid cols={2}>
                                    <Field label="아티팩트 이름"><Input placeholder="예: 불꽃의 창" /></Field>
                                    <Field label="아티팩트 아이콘 URL"><Input placeholder="https://..." /></Field>
                                </Grid>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {art.levels.map(({ level }) => (
                                    <ItemBox key={level} className="border-green-900/20 bg-stone-900/20">
                                        <div className="mb-2">
                                            <span className="rounded bg-green-900/20 px-2 py-0.5 text-xs font-bold text-green-600">발현 {level}단</span>
                                        </div>
                                        <Field label="효과 설명">
                                            <Textarea rows={2} placeholder={`발현 ${level}단 효과...`} />
                                        </Field>
                                    </ItemBox>
                                ))}
                            </div>
                        </ItemBox>
                    ))}
                </div>
                <AddBtn onClick={addArtifact} label={`아티팩트 추가 (${artifacts.length}/4)`} />
            </Section>

            {/* ⑧ 전용무기 연결 */}
            <Section title="⑧ 전용무기 연결" subtitle="아이템에서 먼저 등록 필요">
                <div className="flex gap-2">
                    <Input placeholder="무기 이름으로 검색..." className="max-w-xs" />
                    <button className="rounded border border-amber-900/30 px-4 py-2 text-xs text-amber-600 transition hover:border-amber-600">검색</button>
                </div>
                <p className="mt-2 text-xs text-stone-700">아이템 관리에서 전용무기를 먼저 등록해주세요.</p>
            </Section>

            <div className="mb-8 flex justify-end gap-2">
                <button className="rounded border border-stone-700 px-5 py-2 text-sm text-stone-400 transition hover:bg-stone-800">취소</button>
                <button className="rounded border border-stone-600 bg-stone-800/60 px-5 py-2 text-sm text-stone-300 transition hover:bg-stone-700">임시저장</button>
                <button className="rounded border border-amber-700/50 bg-amber-900/20 px-5 py-2 text-sm text-amber-400 transition hover:bg-amber-900/30">저장 및 게시</button>
            </div>
        </main>
    )
}

export default CharacterAdmin