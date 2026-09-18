import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCharacterDetail } from '../api/characterApi'
import type { CharacterDetailDto, ClassTreeNodeDto, SkillDto } from '../api/characterApi'
import EffectText from '../components/common/EffectText'
import { EffectDictProvider } from '../components/common/EffectDict'
import { getTagColorClass } from '../constants/tagColors'
import WeaponInfo from '../components/common/WeaponInfo'
import { PASSIVE_LEVELS, ULTIMATE_STEPS, PASSIVE_MANIFEST_STEPS, ARTIFACT_STEPS, MANIFEST_STEPS } from '../constants/manifest'

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

const ClassTreeSection = ({ classTree, color }: { classTree: CharacterDetailDto['classTree']; color: ElementColor }) => {
    const [selectedClass, setSelectedClass] = useState<typeof classTree[0] | null>(null)

    const tiers = [1, 2, 3]
    const byTier = (tier: number) => classTree.filter(c => c.tier === tier)

    return (
        <SectionBox title="클래스 트리" color={color}>
            <div className="space-y-4">
                {/* 트리 */}
                <div>
                    <div className="relative">
                        {tiers.map(tier => (
                            <div key={tier} className="mb-4">
                                <div className="mb-2 text-sm font-semibold text-stone-500">Tier {tier}</div>
                                <div className="flex flex-wrap gap-2">
                                    {byTier(tier).map(cls => (
                                        <button
                                            key={cls.classId}
                                            type="button"
                                            onClick={() => setSelectedClass(selectedClass?.classId === cls.classId ? null : cls)}
                                            className="flex items-center gap-2.5 rounded px-4 py-2.5 text-base"
                                            style={{
                                                border: `1px solid ${selectedClass?.classId === cls.classId ? color.primary : color.border}`,
                                                background: selectedClass?.classId === cls.classId ? color.bg : 'rgba(0,0,0,0.2)',
                                                color: selectedClass?.classId === cls.classId ? color.text : '#9CA3AF',
                                                boxShadow: selectedClass?.classId === cls.classId ? `0 0 12px ${color.glow}` : 'none'
                                            }}
                                        >
                                            {cls.iconUrl && <img src={cls.iconUrl} alt="" className="w-7 h-7 rounded-full" />}
                                            <span>{cls.name}</span>
                                        </button>
                                    ))}
                                    {byTier(tier).length === 0 && <span className="text-sm text-stone-700">-</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 선택 패널 */}
                {selectedClass && (
                    <div className="rounded p-4" style={{ border: `1px solid ${color.border}`, background: color.bg }}>
                        <div className="mb-3 flex items-center gap-2.5">
                            {selectedClass.iconUrl && <img src={selectedClass.iconUrl} alt="" className="w-11 h-11 rounded-full" />}
                            <div>
                                <div className="font-semibold text-base" style={{ color: color.text }}>{selectedClass.name}</div>
                                <div className="text-xs text-stone-500">Tier {selectedClass.tier}</div>
                            </div>
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
// 단계 규칙은 constants/manifest.ts (필살기 0/1/3/5 · 패시브 발현 2/4/6 · 아티팩트 3~6)

type ManifestItemType = 'ultimate' | 'passive' | 'artifact'

const ManifestationSection = ({ character, color }: { character: CharacterDetailDto; color: ElementColor }) => {
    const [selectedItem, setSelectedItem] = useState<{ type: ManifestItemType; step: number } | null>(null)

    const getUltimateLevel = (step: number) =>
        character.ultimateSkill?.levels.find(l => l.manifestStep === step)

    const getPassiveLevel = (step: number) =>
        character.passive?.levels.find(l => l.unlockType === 'manifest' && l.unlockStep === step)

    // 아티팩트는 최대 4개, 각 아티팩트가 단계별 효과를 가짐
    const getArtifactsAt = (step: number) =>
        character.artifacts.filter(a => a.levels.some(l => l.manifestStep === step))

    const isSelected = (type: ManifestItemType, step: number) =>
        selectedItem?.type === type && selectedItem.step === step

    const toggle = (type: ManifestItemType, step: number) =>
        setSelectedItem(isSelected(type, step) ? null : { type, step })

    const cellStyle = (type: ManifestItemType, step: number) => ({
        border: `1px solid ${isSelected(type, step) ? color.primary : color.border}`,
        background: isSelected(type, step) ? color.bg : 'rgba(0,0,0,0.2)',
    })

    const EmptyCell = () => (
        <div className="rounded p-2.5 text-sm opacity-30" style={{ border: `1px solid ${color.border}` }}>
            <div className="text-stone-500">-</div>
        </div>
    )

    // 선택한 칸 바로 아래에 상세를 펼친다
    const renderDetail = (type: ManifestItemType, step: number) => {
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
                                {lvl.rangeMin != null && <span>사거리 {lvl.rangeMin}{lvl.rangeMax && lvl.rangeMax !== lvl.rangeMin ? `~${lvl.rangeMax}` : ''}</span>}
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
            <div className="space-y-2">
                {MANIFEST_STEPS.map(step => {
                    const artifacts = getArtifactsAt(step)
                    return (
                        <div key={step}>
                            <div className="flex items-stretch gap-3">
                                {/* 단계 표시 */}
                                <div className="flex items-center justify-center w-14 shrink-0">
                                    <div className="flex flex-col items-center">
                                        <div className="w-px h-4 bg-stone-700" />
                                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                                             style={{ border: `2px solid ${color.primary}`, color: color.text, background: color.bg }}>
                                            {step}
                                        </div>
                                        <div className="w-px flex-1 bg-stone-700" />
                                    </div>
                                </div>

                                <div className="flex-1 grid grid-cols-2 gap-2">
                                    {/* 필살기 / 패시브 */}
                                    {ULTIMATE_STEPS.includes(step) ? (
                                        <button type="button" onClick={() => toggle('ultimate', step)} className="rounded p-2.5 text-left text-sm" style={cellStyle('ultimate', step)}>
                                            <div className="text-stone-400 mb-0.5 text-xs">{step === 0 ? '필살기' : '필살기 강화'}</div>
                                            <div className="flex items-center gap-2">
                                                {character.ultimateSkill?.iconUrl && <img src={character.ultimateSkill.iconUrl} alt="" className="w-7 h-7 rounded shrink-0" />}
                                                <span className="truncate" style={{ color: color.text }}>{character.ultimateSkill?.name ?? '-'}</span>
                                            </div>
                                        </button>
                                    ) : PASSIVE_MANIFEST_STEPS.includes(step) ? (
                                        <button type="button" onClick={() => toggle('passive', step)} className="rounded p-2.5 text-left text-sm" style={cellStyle('passive', step)}>
                                            <div className="text-stone-400 mb-0.5 text-xs">패시브 강화</div>
                                            <div className="flex items-center gap-2">
                                                {character.passive?.iconUrl && <img src={character.passive.iconUrl} alt="" className="w-7 h-7 rounded shrink-0" />}
                                                <span className="truncate" style={{ color: color.text }}>{character.passive?.name ?? '-'}</span>
                                            </div>
                                        </button>
                                    ) : <EmptyCell />}

                                    {/* 아티팩트 */}
                                    {ARTIFACT_STEPS.includes(step) ? (
                                        <button type="button" onClick={() => toggle('artifact', step)} className="rounded p-2.5 text-left text-sm" style={cellStyle('artifact', step)}>
                                            <div className="text-stone-400 mb-0.5 text-xs">아티팩트{artifacts.length > 1 ? ` ${artifacts.length}개` : ''}</div>
                                            <div className="flex items-center gap-1.5">
                                                {artifacts.filter(a => a.iconUrl).map(a => (
                                                    <img key={a.artifactId} src={a.iconUrl!} alt="" className="w-7 h-7 rounded" />
                                                ))}
                                                <span className="truncate" style={{ color: color.text }}>
                                                    {artifacts.length > 0 ? artifacts.map(a => a.name).join(', ') : '-'}
                                                </span>
                                            </div>
                                        </button>
                                    ) : <EmptyCell />}
                                </div>
                            </div>

                            {/* 상세 (클릭한 줄 바로 아래) */}
                            {selectedItem?.step === step && (
                                <div className="ml-14 mt-2 rounded p-4" style={{ border: `1px solid ${color.primary}`, background: color.bg }}>
                                    {renderDetail(selectedItem.type, step)}
                                </div>
                            )}
                        </div>
                    )
                })}
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
        <EffectDictProvider users={[{ name: character.name, thumbnailUrl: character.thumbnailUrl }]}>
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
                                            {lvl.rangeMin != null && <span>사거리 {lvl.rangeMin}{lvl.rangeMax && lvl.rangeMax !== lvl.rangeMin ? `~${lvl.rangeMax}` : ''}</span>}
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
