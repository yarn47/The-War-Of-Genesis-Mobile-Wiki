import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCharacterDetail } from '../api/characterApi'
import type { CharacterDetailDto, ClassTreeNodeDto, SkillDto } from '../api/characterApi'
import EffectText from '../components/common/EffectText'
import { EffectDictProvider } from '../components/common/EffectDict'
import { getTagColorClass } from '../constants/tagColors'
import WeaponInfo from '../components/common/WeaponInfo'
import { PASSIVE_LEVELS, ULTIMATE_STEPS, PASSIVE_MANIFEST_STEPS, ARTIFACT_STEPS, MANIFEST_TREE_STEPS, STAT_BOOST_STEPS, STAT_BOOST_TEXT } from '../constants/manifest'

// ─── 속성 색상 ─────────────────────────────────────────────

const ELEMENT_COLORS: Record<string, { primary: string; secondary: string; bg: string; border: string; text: string; glow: string }> = {
    fire:    { primary: '#EF4444', secondary: '#DC2626', bg: 'rgba(239,68,68,0.08)',    border: 'rgba(239,68,68,0.35)',  text: '#FCA5A5', glow: 'rgba(239,68,68,0.3)' },
    light:   { primary: '#F59E0B', secondary: '#D97706', bg: 'rgba(245,158,11,0.08)',   border: 'rgba(245,158,11,0.35)', text: '#FCD34D', glow: 'rgba(245,158,11,0.3)' },
    crystal: { primary: '#3B82F6', secondary: '#2563EB', bg: 'rgba(59,130,246,0.08)',   border: 'rgba(59,130,246,0.35)', text: '#93C5FD', glow: 'rgba(59,130,246,0.3)' },
    nature:  { primary: '#10B981', secondary: '#059669', bg: 'rgba(16,185,129,0.08)',   border: 'rgba(16,185,129,0.35)', text: '#6EE7B7', glow: 'rgba(16,185,129,0.3)' },
    dark:    { primary: '#9333EA', secondary: '#7C3AED', bg: 'rgba(147,51,234,0.08)',   border: 'rgba(147,51,234,0.35)', text: '#C4B5FD', glow: 'rgba(147,51,234,0.3)' },
}

type ElementColor = typeof ELEMENT_COLORS[string]

const ELEMENT_LABELS: Record<string, string> = {
    fire: '자유의불꽃', light: '신념의빛', crystal: '지성의결정체', nature: '활력의나무', dark: '욕망의그림자'
}

const GRADE_LABELS: Record<string, string> = {
    rare: '희귀', hero: '영웅', legend: '전설', outer: '아우터원'
}

const FACTION_LABELS: Record<string, string> = {
    geysir: '게이시르', pendragon: '팬드래건', independent: '무소속',
    astania: '아스타니아', zephyrfalcon: '제피르팰컨', dagal: '다갈'
}

const DEFENSE_LABELS: Record<string, string> = { light: '라이트', medium: '미디엄', heavy: '헤비' }

// 사거리 0-0은 '자신'
const rangeLabel = (min: number | null, max: number | null) =>
    min == null ? null : min === 0 && (max ?? 0) === 0 ? '자신' : `${min}${max && max !== min ? `~${max}` : ''}`

// 2026-05-06 → 2026.05.06
const formatDate = (date: string | null) => date ? date.replaceAll('-', '.') : null

const passiveLevelLabel = (type: string, step: number) =>
    PASSIVE_LEVELS.find(l => l.type === type && l.step === step)?.label ?? `${type} ${step}`

// ─── 서브 컴포넌트 ─────────────────────────────────────────

const SectionBox = ({ title, color, children }: { title: string; color: ElementColor; children: React.ReactNode }) => (
    <div className="mb-5 overflow-hidden rounded" style={{ border: `1px solid ${color.border}`, background: 'rgba(0,0,0,0.3)' }}>
        <div className="px-5 py-3 flex items-center gap-2" style={{ background: color.bg, borderBottom: `1px solid ${color.border}` }}>
            <div className="h-4 w-0.5 rounded" style={{ background: color.primary }} />
            <span className="font-cinzel text-sm tracking-widest uppercase" style={{ color: color.text }}>{title}</span>
        </div>
        <div className="p-5">{children}</div>
    </div>
)

const CollapsibleBox = ({ title, color, icon, children }: { title: string; color: ElementColor; icon?: string | null; children: React.ReactNode }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className="mb-3 overflow-hidden rounded" style={{ border: `1px solid ${color.border}` }}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-5 py-3 text-left"
                style={{ background: color.bg }}
            >
                <span className="flex items-center gap-2.5 text-base font-semibold" style={{ color: color.text }}>
                    {icon && <img src={icon} alt="" className="w-9 h-9 rounded" />}
                    {title}
                </span>
                <span className="text-sm" style={{ color: color.primary }}>{open ? '▲' : '▼'}</span>
            </button>
            {open && <div className="p-5 border-t" style={{ borderColor: color.border }}>{children}</div>}
        </div>
    )
}

// 스킬 카드 (클래스 트리 · 액티브 스킬 공용)
const SkillCard = ({ skill, color, fallbackAttackType }: { skill: SkillDto; color: ElementColor; fallbackAttackType?: string | null }) => (
    <div className="rounded p-3" style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${color.border}` }}>
        <div className="flex items-center gap-2.5 mb-1.5">
            {skill.iconUrl && <img src={skill.iconUrl} alt="" className="w-8 h-8 rounded" />}
            <span className="text-sm font-medium text-stone-200">{skill.name}</span>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-stone-500">
            <span>TP {skill.tpCost ?? '-'}</span>
            {skill.rangeMin != null && <span>사거리 {skill.rangeMin === 0 && skill.rangeMax === 0 ? '자신' : `${skill.rangeMin}-${skill.rangeMax ?? skill.rangeMin}`}</span>}
            {skill.area && <span>{skill.area}</span>}
            {skill.cooldown != null && <span>쿨타임 {skill.cooldown}턴</span>}
            {(skill.attackType ?? fallbackAttackType) && <span>공격타입 {skill.attackType ?? fallbackAttackType}</span>}
            {skill.allowedWeapon && <span className="text-red-300/80">허용 무기: {skill.allowedWeapon}</span>}
        </div>
        {skill.tags.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
                {skill.tags.map(tag => (
                    <span key={tag.tagId} className={`rounded px-1.5 py-0.5 text-[11px] ${getTagColorClass(tag.color)}`}>{tag.name}</span>
                ))}
            </div>
        )}
        {skill.effectText && <div className="mt-1.5 text-sm text-stone-400 leading-relaxed"><EffectText text={skill.effectText} /></div>}
    </div>
)

// ─── 클래스 트리 ───────────────────────────────────────────
// 아이콘 위 · 이름 아래, 부모에서 자식으로 대각선 한 줄로 연결

const CLASS_ICON = 80        // 아이콘 원 지름
const CLASS_NODE_W = 104     // 노드 한 칸 너비
const CLASS_COL_GAP = 20
const CLASS_ROW_H = 132

type PlacedClass = { cls: ClassTreeNodeDto; x: number; y: number }

// 같은 단계는 왼쪽부터 차례로 (1티어 아이콘 기준 왼쪽 정렬), 부모→자식은 대각선으로 잇는다
const layoutClassTree = (roots: ClassTreeNodeDto[], childrenOf: (id: number) => ClassTreeNodeDto[]) => {
    const rows: ClassTreeNodeDto[][] = []

    const collect = (cls: ClassTreeNodeDto, depth: number) => {
        (rows[depth] ??= []).push(cls)
        childrenOf(cls.classId).forEach(kid => collect(kid, depth + 1))
    }
    roots.forEach(root => collect(root, 0))

    const placed: PlacedClass[] = rows.flatMap((row, depth) =>
        row.map((cls, i) => ({
            cls,
            x: i * (CLASS_NODE_W + CLASS_COL_GAP) + CLASS_NODE_W / 2,
            y: depth * CLASS_ROW_H,
        }))
    )

    const width = Math.max(1, ...rows.map(r => r.length)) * (CLASS_NODE_W + CLASS_COL_GAP) - CLASS_COL_GAP
    const height = Math.max(0, ...placed.map(p => p.y)) + CLASS_ICON + 30
    return { placed, width, height }
}

const ClassTreeGraph = ({ placed, width, height, color, selectedId, onSelect }: {
    placed: PlacedClass[]
    width: number
    height: number
    color: ElementColor
    selectedId: number | null
    onSelect: (cls: ClassTreeNodeDto) => void
}) => {
    return (
        <div className="relative" style={{ width, height }}>
            {placed.map(({ cls, x, y }) => {
                const selected = selectedId === cls.classId
                return (
                    <button
                        key={cls.classId}
                        type="button"
                        onClick={() => onSelect(cls)}
                        className="absolute flex flex-col items-center gap-1.5"
                        style={{ left: x - CLASS_NODE_W / 2, top: y, width: CLASS_NODE_W }}
                    >
                        <span
                            className="flex items-center justify-center rounded-full transition"
                            style={{
                                width: CLASS_ICON,
                                height: CLASS_ICON,
                                border: `2px solid ${selected ? color.primary : color.border}`,
                                background: selected ? color.bg : 'rgba(0,0,0,0.35)',
                                boxShadow: selected ? `0 0 16px ${color.glow}` : 'none',
                            }}
                        >
                            {cls.iconUrl
                                ? <img src={cls.iconUrl} alt="" className="h-16 w-16 rounded-full object-contain" />
                                : <span className="text-xs text-stone-600">{cls.name}</span>}
                        </span>
                        <span className="text-center text-sm break-keep" style={{ color: selected ? color.text : '#D6D3D1' }}>{cls.name}</span>
                    </button>
                )
            })}
        </div>
    )
}

const ClassTreeSection = ({ classTree, color }: { classTree: CharacterDetailDto['classTree']; color: ElementColor }) => {
    const byOrder = (a: ClassTreeNodeDto, b: ClassTreeNodeDto) =>
        a.tier - b.tier || (a.orderInTier ?? 0) - (b.orderInTier ?? 0)

    const ids = new Set(classTree.map(c => c.classId))
    // 부모가 트리 안에 없으면 뿌리로 취급
    const roots = classTree.filter(c => c.parentClassId == null || !ids.has(c.parentClassId)).sort(byOrder)
    const childrenOf = (id: number) => classTree.filter(c => c.parentClassId === id).sort(byOrder)
    const { placed, width, height } = layoutClassTree(roots, childrenOf)

    // 처음엔 1티어(로그)를 펼쳐둔다
    const [selectedClass, setSelectedClass] = useState<ClassTreeNodeDto | null>(() => roots[0] ?? null)

    return (
        <SectionBox title="클래스 트리" color={color}>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                {/* 트리 */}
                <div className="overflow-x-auto pb-2 lg:shrink-0">
                    <ClassTreeGraph placed={placed} width={width} height={height} color={color}
                                    selectedId={selectedClass?.classId ?? null} onSelect={setSelectedClass} />
                </div>

                {/* 선택 패널 (트리 오른쪽) */}
                {selectedClass && (
                    <div className="min-w-0 flex-1 rounded p-4" style={{ border: `1px solid ${color.border}`, background: color.bg }}>
                        <div className="mb-3 flex items-center gap-2.5">
                            {selectedClass.iconUrl && <img src={selectedClass.iconUrl} alt="" className="w-11 h-11 rounded-full" />}
                            <div className="font-semibold text-base" style={{ color: color.text }}>{selectedClass.name}</div>
                        </div>

                        {/* 스탯 */}
                        <div className="mb-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                            {selectedClass.weaponType && <div className="text-stone-400">사용무기 <span className="text-stone-200">{selectedClass.weaponType}</span></div>}
                            {selectedClass.defenseType && <div className="text-stone-400">방어타입 <span className="text-stone-200">{DEFENSE_LABELS[selectedClass.defenseType] ?? selectedClass.defenseType}</span></div>}
                            {selectedClass.attackType && <div className="text-stone-400">공격타입 <span className="text-stone-200">{selectedClass.attackType}</span></div>}
                            {selectedClass.attackRange != null && <div className="text-stone-400">공격사거리 <span className="text-stone-200">{selectedClass.attackRange}</span></div>}
                            {selectedClass.moveRange != null && <div className="text-stone-400">이동거리 <span className="text-stone-200">{selectedClass.moveRange}</span></div>}
                            {selectedClass.baseHp != null && <div className="text-stone-400">체력 <span className="text-stone-200">{selectedClass.baseHp.toLocaleString()}</span></div>}
                            {selectedClass.baseAttack != null && <div className="text-stone-400">공격력 <span className="text-stone-200">{selectedClass.baseAttack.toLocaleString()}</span></div>}
                        </div>

                        {/* 패시브 */}
                        {selectedClass.passive1Name && (
                            <div className="mb-3">
                                <div className="mb-1.5 text-sm font-semibold" style={{ color: color.primary }}>클래스 패시브</div>
                                <div className="mb-1 flex items-center gap-2.5">
                                    {selectedClass.passive1IconUrl && <img src={selectedClass.passive1IconUrl} alt="" className="w-8 h-8 rounded" />}
                                    <span className="text-sm text-stone-300 font-medium">{selectedClass.passive1Name}</span>
                                </div>
                                {selectedClass.passive1Lv1 && <div className="text-sm text-stone-400 mb-1 leading-relaxed">Lv.1 <EffectText text={selectedClass.passive1Lv1} /></div>}
                                {selectedClass.passive1Lv2 && <div className="text-sm text-stone-400 leading-relaxed">Lv.2 <EffectText text={selectedClass.passive1Lv2} /></div>}
                            </div>
                        )}

                        {/* 스킬 */}
                        {selectedClass.skills.length > 0 && (
                            <div>
                                <div className="mb-2 text-sm font-semibold" style={{ color: color.primary }}>습득 스킬</div>
                                <div className="grid gap-2 md:grid-cols-2">
                                    {selectedClass.skills.map(skill => (
                                        <SkillCard key={skill.skillId} skill={skill} color={color} fallbackAttackType={selectedClass.attackType} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </SectionBox>
    )
}

// ─── 액티브 스킬 ───────────────────────────────────────────
// 클래스 트리에 딸린 스킬을 클래스 구분 없이 한 줄로

const ActiveSkillSection = ({ classTree, color }: { classTree: ClassTreeNodeDto[]; color: ElementColor }) => {
    const skills = classTree
        .filter(c => c.skills.length > 0)
        .sort((a, b) => a.tier - b.tier || (a.orderInTier ?? 0) - (b.orderInTier ?? 0))
        .flatMap(c => c.skills.map(skill => ({ skill, attackType: c.attackType })))

    if (skills.length === 0) return null

    return (
        <SectionBox title="액티브 스킬" color={color}>
            <div className="grid gap-3 md:grid-cols-2">
                {skills.map(({ skill, attackType }) => (
                    <SkillCard key={skill.skillId} skill={skill} color={color} fallbackAttackType={attackType} />
                ))}
            </div>
        </SectionBox>
    )
}

// ─── 발현 트리 ─────────────────────────────────────────────
// 게임 발현 화면과 같은 배치: 필살기 | 고유 패시브 | 능력치 강화·아티팩트
// 단계 규칙은 constants/manifest.ts (필살기 0/1/3/5 · 패시브 2/4/6 · 아티팩트 3~6 · 능력치 1/2)

type ManifestItemType = 'ultimate' | 'passive' | 'stat' | 'artifact'
type ManifestNode = { type: ManifestItemType; step: number; col: number }

const MANIFEST_LABELS: Record<ManifestItemType, string> = {
    ultimate: '필살기', passive: '고유 패시브', stat: '능력치 강화', artifact: '아티팩트',
}

// 게임에서 딴 공용 아이콘 (캐릭터마다 같은 그림)
const MANIFEST_ICONS: Partial<Record<ManifestItemType, string>> = {
    stat: '/icons/manifest/stat_boost.png',
    artifact: '/icons/manifest/artifact.png',
}

const MANIFEST_ICON = 56
const MANIFEST_COL_W = 96
const MANIFEST_ROW_H = 76
const MANIFEST_GUTTER = 48   // 왼쪽 단계 번호 자리

const ManifestationSection = ({ character, color }: { character: CharacterDetailDto; color: ElementColor }) => {
    const getUltimateLevel = (step: number) =>
        character.ultimateSkill?.levels.find(l => l.manifestStep === step)

    const getPassiveLevel = (step: number) =>
        character.passive?.levels.find(l => l.unlockType === 'manifest' && l.unlockStep === step)

    // 아티팩트는 최대 4개, 각 아티팩트가 단계별 효과를 가짐
    const getArtifactsAt = (step: number) =>
        character.artifacts.filter(a => a.levels.some(l => l.manifestStep === step))

    const nodes: ManifestNode[] = [
        ...ULTIMATE_STEPS.filter(step => step > 0).map(step => ({ type: 'ultimate' as const, step, col: 0 })),
        ...PASSIVE_MANIFEST_STEPS.map(step => ({ type: 'passive' as const, step, col: 1 })),
        ...STAT_BOOST_STEPS.map(step => ({ type: 'stat' as const, step, col: 2 })),
        ...ARTIFACT_STEPS.map(step => ({ type: 'artifact' as const, step, col: 2 })),
    ]

    const [selected, setSelected] = useState<ManifestNode>(nodes[0])

    const pos = (node: ManifestNode) => ({
        x: MANIFEST_GUTTER + node.col * MANIFEST_COL_W + MANIFEST_ICON / 2,
        y: MANIFEST_TREE_STEPS.indexOf(node.step) * MANIFEST_ROW_H,
    })

    const width = MANIFEST_GUTTER + 3 * MANIFEST_COL_W
    const height = (MANIFEST_TREE_STEPS.length - 1) * MANIFEST_ROW_H + MANIFEST_ICON + 8

    const nodeIcon = (node: ManifestNode) => {
        if (node.type === 'ultimate') return character.ultimateSkill?.iconUrl
        if (node.type === 'passive') return character.passive?.iconUrl
        return MANIFEST_ICONS[node.type]
    }

    const isSelected = (node: ManifestNode) => selected.type === node.type && selected.step === node.step

    // 오른쪽 상세
    const renderDetail = () => {
        const { type, step } = selected

        if (type === 'stat') return (
            <>
                <div className="mb-2 font-semibold text-base" style={{ color: color.text }}>능력치 강화</div>
                <div className="text-sm text-stone-400 mb-3">발현 {step}단</div>
                <div className="text-sm text-stone-300">{STAT_BOOST_TEXT}</div>
            </>
        )

        if (type === 'ultimate') {
            const lvl = getUltimateLevel(step)
            return (
                <>
                    <div className="mb-2 flex items-center gap-2.5">
                        {character.ultimateSkill?.iconUrl && <img src={character.ultimateSkill.iconUrl} alt="" className="w-9 h-9 rounded" />}
                        <span className="font-semibold text-base" style={{ color: color.text }}>{character.ultimateSkill?.name ?? '필살기 없음'}</span>
                        <span className="text-sm text-stone-500">발현 {step}단</span>
                    </div>
                    {lvl ? (
                        <div className="space-y-2">
                            <div className="flex gap-4 text-sm text-stone-400">
                                {lvl.tpCost != null && <span>TP {lvl.tpCost}</span>}
                                {lvl.rangeMin != null && <span>사거리 {rangeLabel(lvl.rangeMin, lvl.rangeMax)}</span>}
                                {lvl.cooldown != null && <span>쿨타임 {lvl.cooldown}턴</span>}
                            </div>
                            {lvl.effectText && <div className="text-sm text-stone-300 leading-relaxed"><EffectText text={lvl.effectText} /></div>}
                        </div>
                    ) : <div className="text-sm text-stone-500">효과 없음</div>}
                </>
            )
        }

        if (type === 'passive') {
            const lvl = getPassiveLevel(step)
            return (
                <>
                    <div className="mb-2 flex items-center gap-2.5">
                        {character.passive?.iconUrl && <img src={character.passive.iconUrl} alt="" className="w-9 h-9 rounded" />}
                        <span className="font-semibold text-base" style={{ color: color.text }}>{character.passive?.name ?? '패시브 없음'}</span>
                        <span className="text-sm text-stone-500">발현 {step}단</span>
                    </div>
                    {lvl?.effectText
                        ? <div className="text-sm text-stone-300 leading-relaxed"><EffectText text={lvl.effectText} /></div>
                        : <div className="text-sm text-stone-500">효과 없음</div>}
                </>
            )
        }

        const artifacts = getArtifactsAt(step)
        return artifacts.length > 0 ? (
            <>
                <div className="text-sm text-stone-400 mb-3">발현 {step}단 아티팩트</div>
                <div className="space-y-3">
                    {artifacts.map(art => {
                        const lvl = art.levels.find(l => l.manifestStep === step)
                        return (
                            <div key={art.artifactId}>
                                <div className="mb-1 flex items-center gap-2.5 font-semibold text-base" style={{ color: color.text }}>
                                    {art.iconUrl && <img src={art.iconUrl} alt="" className="w-8 h-8 rounded" />}
                                    {art.artifactOrder}. {art.name}
                                </div>
                                {lvl?.effectText
                                    ? <div className="text-sm text-stone-300 leading-relaxed"><EffectText text={lvl.effectText} /></div>
                                    : <div className="text-sm text-stone-500">효과 없음</div>}
                            </div>
                        )
                    })}
                </div>
            </>
        ) : <div className="text-sm text-stone-500">아티팩트 없음</div>
    }

    return (
        <SectionBox title="발현 트리" color={color}>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                {/* 트리 */}
                <div className="overflow-x-auto pb-2 lg:shrink-0">
                    <div className="relative" style={{ width, height }}>
                        <svg className="pointer-events-none absolute inset-0" width={width} height={height}>
                            {/* 단계 구분선 */}
                            {MANIFEST_TREE_STEPS.map((step, i) => (
                                <line key={`row_${step}`} x1={0} y1={i * MANIFEST_ROW_H - 10} x2={width} y2={i * MANIFEST_ROW_H - 10}
                                      stroke="#78716C" strokeWidth={1} strokeOpacity={0.25} />
                            ))}
                        </svg>

                        {nodes.map(node => {
                            const { x, y } = pos(node)
                            const icon = nodeIcon(node)
                            const on = isSelected(node)
                            return (
                                <button
                                    key={`${node.type}_${node.step}`}
                                    type="button"
                                    onClick={() => setSelected(node)}
                                    className="absolute flex flex-col items-center gap-1"
                                    style={{ left: x - MANIFEST_COL_W / 2, top: y, width: MANIFEST_COL_W }}
                                >
                                    <span
                                        title={MANIFEST_LABELS[node.type]}
                                        className="flex items-center justify-center rounded-full transition"
                                        style={{
                                            width: MANIFEST_ICON, height: MANIFEST_ICON,
                                            border: `2px solid ${on ? color.primary : color.border}`,
                                            background: on ? color.bg : 'rgba(0,0,0,0.35)',
                                            boxShadow: on ? `0 0 14px ${color.glow}` : 'none',
                                        }}
                                    >
                                        {icon && <img src={icon} alt="" className="h-11 w-11 rounded-full object-contain" />}
                                    </span>
                                </button>
                            )
                        })}

                        {/* 단계 번호 */}
                        {MANIFEST_TREE_STEPS.map((step, i) => (
                            <div key={step} className="absolute flex items-center justify-center rounded-full text-sm font-bold"
                                 style={{
                                     left: 4, top: i * MANIFEST_ROW_H + (MANIFEST_ICON - 32) / 2,
                                     width: 32, height: 32,
                                     border: `2px solid ${color.primary}`, color: color.text, background: color.bg,
                                 }}>
                                {step}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 상세 (트리 오른쪽) */}
                <div className="min-w-0 flex-1 rounded p-4" style={{ border: `1px solid ${color.border}`, background: color.bg }}>
                    {renderDetail()}
                </div>
            </div>
        </SectionBox>
    )
}

// ─── 메인 페이지 ───────────────────────────────────────────

const CharacterDetail = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [character, setCharacter] = useState<CharacterDetailDto | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        if (!id) return
        setLoading(true)
        getCharacterDetail(Number(id))
            .then(setCharacter)
            .catch(() => setError(true))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return (
        <div className="flex flex-1 items-center justify-center py-20">
            <div className="text-stone-500 font-cinzel tracking-widest text-sm">LOADING...</div>
        </div>
    )

    if (error || !character) return (
        <div className="flex flex-1 items-center justify-center py-20">
            <div className="text-center">
                <div className="text-stone-500 mb-3">캐릭터를 찾을 수 없습니다</div>
                <button type="button" onClick={() => navigate('/characters')} className="text-xs text-stone-600 hover:text-stone-400">← 목록으로</button>
            </div>
        </div>
    )

    const color = ELEMENT_COLORS[character.element] ?? ELEMENT_COLORS['light']

    return (
        <EffectDictProvider>
        <div className="flex-1 overflow-y-auto">
            {/* ── 프로필 카드 ── */}
            <div className="relative overflow-hidden" style={{ borderBottom: `1px solid ${color.border}`, background: `linear-gradient(135deg, rgba(0,0,0,0.6) 0%, ${color.bg} 100%)` }}>
                <div className="max-w-screen-xl mx-auto px-8 py-8">
                    <div className="flex gap-8 items-start">
                        {/* 이미지 */}
                        <div className="shrink-0 relative">
                            {character.portraitUrl ? (
                                <img src={character.portraitUrl} className="w-56 h-72 object-cover rounded" style={{ border: `2px solid ${color.border}`, boxShadow: `0 0 30px ${color.glow}` }} />
                            ) : (
                                <div className="w-56 h-72 rounded flex items-center justify-center text-stone-700" style={{ border: `2px solid ${color.border}`, background: 'rgba(0,0,0,0.4)' }}>
                                    No Image
                                </div>
                            )}
                        </div>

                        {/* 기본 정보 */}
                        <div className="flex-1 pt-2">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                <span className="text-sm tracking-widest" style={{ color: color.primary }}>
                                    {GRADE_LABELS[character.grade]} · {FACTION_LABELS[character.faction]}
                                </span>
                                <span className="rounded px-2.5 py-0.5 text-sm font-bold"
                                      style={{ background: color.bg, border: `1px solid ${color.border}`, color: color.text }}>
                                    {ELEMENT_LABELS[character.element]}
                                </span>
                            </div>
                            <h1 className="font-cinzel text-4xl font-bold mb-1" style={{ color: color.text, textShadow: `0 0 30px ${color.glow}` }}>
                                {character.name}
                            </h1>

                            <div className="mt-5 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                {character.birthYear && (
                                    <div className="text-sm"><div className="text-stone-500 mb-0.5 text-xs">출생연도</div><div className="text-stone-200">{character.birthYear}</div></div>
                                )}
                                {character.height && (
                                    <div className="text-sm"><div className="text-stone-500 mb-0.5 text-xs">신장</div><div className="text-stone-200">{character.height}</div></div>
                                )}
                                {character.cv && (
                                    <div className="text-sm"><div className="text-stone-500 mb-0.5 text-xs">CV</div><div className="text-stone-200">{character.cv}</div></div>
                                )}
                                {character.releaseDate && (
                                    <div className="text-sm"><div className="text-stone-500 mb-0.5 text-xs">출시일</div><div className="text-stone-200">{formatDate(character.releaseDate)}</div></div>
                                )}
                                {character.appearedIn && (
                                    <div className="text-sm"><div className="text-stone-500 mb-0.5 text-xs">출현작</div><div className="text-stone-200 break-keep">{character.appearedIn}</div></div>
                                )}
                                {character.exclusiveWeapon && (
                                    <div className="text-sm">
                                        <div className="text-stone-500 mb-0.5 text-xs">전용무기</div>
                                        <div className="flex items-center gap-2 text-stone-200 break-keep">
                                            {character.exclusiveWeapon.iconUrl && <img src={character.exclusiveWeapon.iconUrl} alt="" className="w-7 h-7 rounded" />}
                                            {character.exclusiveWeapon.name}
                                        </div>
                                    </div>
                                )}
                                {character.passive && (
                                    <div className="text-sm">
                                        <div className="text-stone-500 mb-0.5 text-xs">고유 패시브</div>
                                        <div className="flex items-center gap-2 text-stone-200 break-keep">
                                            {character.passive.iconUrl && <img src={character.passive.iconUrl} alt="" className="w-7 h-7 rounded" />}
                                            {character.passive.name}
                                        </div>
                                    </div>
                                )}
                                {character.ultimateSkill && (
                                    <div className="text-sm">
                                        <div className="text-stone-500 mb-0.5 text-xs">필살기</div>
                                        <div className="flex items-center gap-2 text-stone-200 break-keep">
                                            {character.ultimateSkill.iconUrl && <img src={character.ultimateSkill.iconUrl} alt="" className="w-7 h-7 rounded" />}
                                            {character.ultimateSkill.name}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 스탯 */}
                            {character.stats && (
                                <div className="mt-5 flex flex-wrap gap-5">
                                    {[
                                        { label: 'HP', value: character.stats.hp?.toLocaleString() },
                                        { label: '공격력', value: character.stats.attack?.toLocaleString() },
                                        { label: '방어력', value: character.stats.defense?.toLocaleString() },
                                        { label: '치명타율', value: character.stats.critRate != null ? `${character.stats.critRate}%` : null },
                                        { label: '치명타 피해', value: character.stats.critDamage != null ? `${character.stats.critDamage}%` : null },
                                    ].filter(s => s.value).map(s => (
                                        <div key={s.label} className="text-sm">
                                            <div className="text-stone-500 mb-0.5 text-xs">{s.label}</div>
                                            <div className="font-bold" style={{ color: color.text }}>{s.value}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 소개 */}
                    {character.profileText && (
                        <div className="mt-6 pt-6 border-t text-base text-stone-100 leading-relaxed whitespace-pre-line" style={{ borderColor: color.border }}>
                            {character.profileText}
                        </div>
                    )}
                </div>
            </div>

            {/* ── 본문 ── */}
            <div className="max-w-screen-xl mx-auto px-8 py-6">
                {/* 클래스 트리 */}
                {character.classTree.length > 0 && (
                    <ClassTreeSection classTree={character.classTree} color={color} />
                )}

                {/* 고유 패시브 */}
                {character.passive && (
                    <SectionBox title="고유 패시브" color={color}>
                        <div className="mb-3 flex items-center gap-2.5">
                            {character.passive.iconUrl && <img src={character.passive.iconUrl} className="w-11 h-11 rounded" />}
                            <span className="font-semibold text-base" style={{ color: color.text }}>{character.passive.name}</span>
                        </div>
                        <div className="space-y-2.5">
                            {character.passive.levels.map(lvl => (
                                <div key={`${lvl.unlockType}_${lvl.unlockStep}`} className="flex gap-3 text-sm">
                                    <span className="shrink-0 rounded px-2 py-0.5 font-bold"
                                          style={{ background: lvl.unlockType === 'awaken' ? 'rgba(59,130,246,0.15)' : color.bg, color: lvl.unlockType === 'awaken' ? '#93C5FD' : color.text }}>
                                        {passiveLevelLabel(lvl.unlockType, lvl.unlockStep)}
                                    </span>
                                    <EffectText text={lvl.effectText} className="text-stone-300 leading-relaxed" />
                                </div>
                            ))}
                        </div>
                    </SectionBox>
                )}

                {/* 액티브 스킬 */}
                <ActiveSkillSection classTree={character.classTree} color={color} />

                {/* 필살기 */}
                {character.ultimateSkill && (
                    <SectionBox title="필살기" color={color}>
                        <div className="mb-3 flex items-center gap-2.5">
                            {character.ultimateSkill.iconUrl && <img src={character.ultimateSkill.iconUrl} className="w-11 h-11 rounded" />}
                            <span className="font-semibold text-base" style={{ color: color.text }}>{character.ultimateSkill.name}</span>
                        </div>
                        <div className="space-y-3">
                            {character.ultimateSkill.levels.map(lvl => (
                                <div key={lvl.manifestStep} className="rounded p-3" style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${color.border}` }}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm font-bold rounded px-2 py-0.5" style={{ background: color.bg, color: color.text }}>발현 {lvl.manifestStep}단</span>
                                        <div className="flex gap-3 text-xs text-stone-500">
                                            {lvl.tpCost != null && <span>TP {lvl.tpCost}</span>}
                                            {lvl.rangeMin != null && <span>사거리 {rangeLabel(lvl.rangeMin, lvl.rangeMax)}</span>}
                                            {lvl.cooldown != null && <span>쿨타임 {lvl.cooldown}턴</span>}
                                        </div>
                                    </div>
                                    {lvl.effectText && <div className="text-sm text-stone-300 leading-relaxed"><EffectText text={lvl.effectText} /></div>}
                                </div>
                            ))}
                        </div>
                    </SectionBox>
                )}

                {/* 발현 트리 */}
                <ManifestationSection character={character} color={color} />

                {/* 아티팩트 */}
                {character.artifacts.length > 0 && (
                    <SectionBox title="아티팩트" color={color}>
                        <div className="space-y-4">
                            {character.artifacts.map(art => (
                                <CollapsibleBox key={art.artifactId} title={`${art.artifactOrder}. ${art.name}`} icon={art.iconUrl} color={color}>
                                    <div className="space-y-2.5">
                                        {art.levels.map(lvl => (
                                            <div key={lvl.manifestStep} className="flex gap-3 text-sm">
                                                <span className="shrink-0 rounded px-2 py-0.5 font-bold" style={{ background: color.bg, color: color.text }}>
                                                    발현 {lvl.manifestStep}단
                                                </span>
                                                <EffectText text={lvl.effectText} className="text-stone-300 leading-relaxed" />
                                            </div>
                                        ))}
                                    </div>
                                </CollapsibleBox>
                            ))}
                        </div>
                    </SectionBox>
                )}

                {/* 전용무기 */}
                {character.exclusiveWeapon && (
                    <SectionBox title="전용무기" color={color}>
                        <WeaponInfo weapon={character.exclusiveWeapon} color={color} />
                    </SectionBox>
                )}
            </div>
        </div>
        </EffectDictProvider>
    )
}

export default CharacterDetail
