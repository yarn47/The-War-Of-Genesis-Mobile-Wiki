import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCharacterDetail } from '../api/characterApi'
import type { CharacterDetailDto } from '../api/characterApi'

// ─── 속성 색상 ─────────────────────────────────────────────

const ELEMENT_COLORS: Record<string, { primary: string; secondary: string; bg: string; border: string; text: string; glow: string }> = {
    fire:    { primary: '#EF4444', secondary: '#DC2626', bg: 'rgba(239,68,68,0.08)',    border: 'rgba(239,68,68,0.35)',  text: '#FCA5A5', glow: 'rgba(239,68,68,0.3)' },
    light:   { primary: '#F59E0B', secondary: '#D97706', bg: 'rgba(245,158,11,0.08)',   border: 'rgba(245,158,11,0.35)', text: '#FCD34D', glow: 'rgba(245,158,11,0.3)' },
    crystal: { primary: '#3B82F6', secondary: '#2563EB', bg: 'rgba(59,130,246,0.08)',   border: 'rgba(59,130,246,0.35)', text: '#93C5FD', glow: 'rgba(59,130,246,0.3)' },
    nature:  { primary: '#10B981', secondary: '#059669', bg: 'rgba(16,185,129,0.08)',   border: 'rgba(16,185,129,0.35)', text: '#6EE7B7', glow: 'rgba(16,185,129,0.3)' },
    dark:    { primary: '#9333EA', secondary: '#7C3AED', bg: 'rgba(147,51,234,0.08)',   border: 'rgba(147,51,234,0.35)', text: '#C4B5FD', glow: 'rgba(147,51,234,0.3)' },
}

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

const PASSIVE_LEVEL_LABELS: Record<string, Record<number, string>> = {
    awaken: { 3: '각성 3', 4: '각성 4', 5: '각성 5', 6: '각성 6' },
    manifest: { 2: '발현 2', 4: '발현 4', 6: '발현 6' }
}

// ─── 서브 컴포넌트 ─────────────────────────────────────────

const SectionBox = ({ title, color, children }: { title: string; color: typeof ELEMENT_COLORS[string]; children: React.ReactNode }) => (
    <div className="mb-5 overflow-hidden rounded" style={{ border: `1px solid ${color.border}`, background: 'rgba(0,0,0,0.3)' }}>
        <div className="px-5 py-3 flex items-center gap-2" style={{ background: color.bg, borderBottom: `1px solid ${color.border}` }}>
            <div className="h-3.5 w-0.5 rounded" style={{ background: color.primary }} />
            <span className="font-cinzel text-xs tracking-widest uppercase" style={{ color: color.text }}>{title}</span>
        </div>
        <div className="p-5">{children}</div>
    </div>
)

const CollapsibleBox = ({ title, color, children }: { title: string; color: typeof ELEMENT_COLORS[string]; children: React.ReactNode }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className="mb-3 overflow-hidden rounded" style={{ border: `1px solid ${color.border}` }}>
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-5 py-3 text-left"
                style={{ background: color.bg }}
            >
                <span className="text-sm font-semibold" style={{ color: color.text }}>{title}</span>
                <span className="text-xs" style={{ color: color.primary }}>{open ? '▲' : '▼'}</span>
            </button>
            {open && <div className="p-5 border-t" style={{ borderColor: color.border }}>{children}</div>}
        </div>
    )
}

// ─── 클래스 트리 ───────────────────────────────────────────

const ClassTreeSection = ({ classTree, color }: { classTree: CharacterDetailDto['classTree']; color: typeof ELEMENT_COLORS[string] }) => {
    const [selectedClass, setSelectedClass] = useState<typeof classTree[0] | null>(null)

    const tiers = [1, 2, 3]
    const byTier = (tier: number) => classTree.filter(c => c.tier === tier)

    return (
        <SectionBox title="클래스 트리" color={color}>
            <div className="flex gap-6">
                {/* 트리 */}
                <div className="flex-1">
                    <div className="relative">
                        {tiers.map(tier => (
                            <div key={tier} className="mb-4">
                                <div className="mb-2 text-xs font-semibold text-stone-500">Tier {tier}</div>
                                <div className="flex flex-wrap gap-2">
                                    {byTier(tier).map(cls => (
                                        <button
                                            key={cls.classId}
                                            onClick={() => setSelectedClass(selectedClass?.classId === cls.classId ? null : cls)}
                                            className="flex items-center gap-2 rounded px-3 py-2 text-sm"
                                            style={{
                                                border: `1px solid ${selectedClass?.classId === cls.classId ? color.primary : color.border}`,
                                                background: selectedClass?.classId === cls.classId ? color.bg : 'rgba(0,0,0,0.2)',
                                                color: selectedClass?.classId === cls.classId ? color.text : '#9CA3AF',
                                                boxShadow: selectedClass?.classId === cls.classId ? `0 0 12px ${color.glow}` : 'none'
                                            }}
                                        >
                                            {cls.iconUrl && <img src={cls.iconUrl} className="w-5 h-5 rounded" />}
                                            <span>{cls.name}</span>
                                        </button>
                                    ))}
                                    {byTier(tier).length === 0 && <span className="text-xs text-stone-700">-</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 선택 패널 */}
                {selectedClass && (
                    <div className="w-72 shrink-0 rounded p-4" style={{ border: `1px solid ${color.border}`, background: color.bg }}>
                        <div className="mb-3 flex items-center gap-2">
                            {selectedClass.iconUrl && <img src={selectedClass.iconUrl} className="w-8 h-8 rounded" />}
                            <div>
                                <div className="font-semibold text-sm" style={{ color: color.text }}>{selectedClass.name}</div>
                                <div className="text-xs text-stone-500">Tier {selectedClass.tier}</div>
                            </div>
                        </div>

                        {/* 스탯 */}
                        <div className="mb-3 grid grid-cols-2 gap-1 text-xs">
                            {selectedClass.weaponType && <div className="text-stone-400">사용무기 <span className="text-stone-200">{selectedClass.weaponType}</span></div>}
                            {selectedClass.defenseType && <div className="text-stone-400">방어타입 <span className="text-stone-200">{selectedClass.defenseType}</span></div>}
                            {selectedClass.attackRange != null && <div className="text-stone-400">공격사거리 <span className="text-stone-200">{selectedClass.attackRange}</span></div>}
                            {selectedClass.moveRange != null && <div className="text-stone-400">이동거리 <span className="text-stone-200">{selectedClass.moveRange}</span></div>}
                            {selectedClass.baseHp != null && <div className="text-stone-400">체력 <span className="text-stone-200">{selectedClass.baseHp.toLocaleString()}</span></div>}
                            {selectedClass.baseAttack != null && <div className="text-stone-400">공격력 <span className="text-stone-200">{selectedClass.baseAttack.toLocaleString()}</span></div>}
                        </div>

                        {/* 패시브 */}
                        {selectedClass.passive1Name && (
                            <div className="mb-3">
                                <div className="mb-1 text-xs font-semibold" style={{ color: color.primary }}>클래스 패시브</div>
                                <div className="text-xs text-stone-300 font-medium mb-1">{selectedClass.passive1Name}</div>
                                {selectedClass.passive1Lv1 && <div className="text-xs text-stone-400 mb-1">Lv.1 {selectedClass.passive1Lv1}</div>}
                                {selectedClass.passive1Lv2 && <div className="text-xs text-stone-400">Lv.2 {selectedClass.passive1Lv2}</div>}
                            </div>
                        )}

                        {/* 스킬 */}
                        {selectedClass.skills.length > 0 && (
                            <div>
                                <div className="mb-2 text-xs font-semibold" style={{ color: color.primary }}>습득 스킬</div>
                                <div className="space-y-2">
                                    {selectedClass.skills.map(skill => (
                                        <div key={skill.skillId} className="rounded p-2" style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${color.border}` }}>
                                            <div className="flex items-center gap-2 mb-1">
                                                {skill.iconUrl && <img src={skill.iconUrl} className="w-5 h-5 rounded" />}
                                                <span className="text-xs font-medium text-stone-200">{skill.name}</span>
                                            </div>
                                            <div className="flex gap-3 text-xs text-stone-500">
                                                {skill.tpCost != null && <span>TP {skill.tpCost}</span>}
                                                {skill.rangeMin != null && <span>사거리 {skill.rangeMin}{skill.rangeMax && skill.rangeMax !== skill.rangeMin ? `~${skill.rangeMax}` : ''}</span>}
                                                {skill.cooldown != null && <span>쿨타임 {skill.cooldown}턴</span>}
                                            </div>
                                            {skill.effectText && <div className="mt-1 text-xs text-stone-400">{skill.effectText}</div>}
                                        </div>
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

// ─── 발현 트리 ─────────────────────────────────────────────

const ManifestationSection = ({ character, color }: { character: CharacterDetailDto; color: typeof ELEMENT_COLORS[string] }) => {
    const [selectedItem, setSelectedItem] = useState<{ type: 'ultimate' | 'passive' | 'artifact'; step: number; artifactIdx?: number } | null>(null)

    const MANIFEST_STEPS = [2, 3, 4, 5, 6]

    const getUltimateLevel = (step: number) =>
        character.ultimateSkill?.levels.find(l => l.manifestStep === (step === 2 ? 0 : step === 3 ? 1 : step === 5 ? 3 : 5))

    const getPassiveLevel = (step: number) =>
        character.passive?.levels.find(l => l.unlockType === 'manifest' && l.unlockStep === step)

    const getArtifact = (step: number) =>
        character.artifacts.find(a => a.levels.some(l => l.manifestStep === step))

    return (
        <SectionBox title="발현 트리" color={color}>
            <div className="flex gap-6">
                {/* 트리 */}
                <div className="flex-1 space-y-3">
                    {MANIFEST_STEPS.map(step => (
                        <div key={step} className="flex items-stretch gap-3">
                            {/* 단계 표시 */}
                            <div className="flex items-center justify-center w-12 shrink-0">
                                <div className="flex flex-col items-center">
                                    <div className="w-px h-4 bg-stone-700" />
                                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                                         style={{ border: `2px solid ${color.primary}`, color: color.text, background: color.bg }}>
                                        {step}
                                    </div>
                                    <div className="w-px flex-1 bg-stone-700" />
                                </div>
                            </div>

                            {/* 왼쪽: 스킬/패시브 */}
                            <div className="flex-1 grid grid-cols-2 gap-2">
                                {/* 필살기 (짝수단: 패시브, 홀수단: 필살기) */}
                                {(step % 2 === 1 || step === 2) ? (
                                    <button
                                        onClick={() => setSelectedItem({ type: 'ultimate', step })}
                                        className="rounded p-2 text-left text-xs"
                                        style={{
                                            border: `1px solid ${selectedItem?.type === 'ultimate' && selectedItem.step === step ? color.primary : color.border}`,
                                            background: selectedItem?.type === 'ultimate' && selectedItem.step === step ? color.bg : 'rgba(0,0,0,0.2)',
                                        }}
                                    >
                                        <div className="text-stone-400 mb-0.5">필살기 강화</div>
                                        <div className="truncate" style={{ color: color.text }}>{character.ultimateSkill?.name ?? '-'}</div>
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setSelectedItem({ type: 'passive', step })}
                                        className="rounded p-2 text-left text-xs"
                                        style={{
                                            border: `1px solid ${selectedItem?.type === 'passive' && selectedItem.step === step ? color.primary : color.border}`,
                                            background: selectedItem?.type === 'passive' && selectedItem.step === step ? color.bg : 'rgba(0,0,0,0.2)',
                                        }}
                                    >
                                        <div className="text-stone-400 mb-0.5">패시브 강화</div>
                                        <div className="truncate" style={{ color: color.text }}>{character.passive?.name ?? '-'}</div>
                                    </button>
                                )}

                                {/* 아티팩트 */}
                                {step >= 3 ? (
                                    <button
                                        onClick={() => setSelectedItem({ type: 'artifact', step })}
                                        className="rounded p-2 text-left text-xs"
                                        style={{
                                            border: `1px solid ${selectedItem?.type === 'artifact' && selectedItem.step === step ? color.primary : color.border}`,
                                            background: selectedItem?.type === 'artifact' && selectedItem.step === step ? color.bg : 'rgba(0,0,0,0.2)',
                                        }}
                                    >
                                        <div className="text-stone-400 mb-0.5">아티팩트</div>
                                        <div className="truncate" style={{ color: color.text }}>
                                            {character.artifacts.find(a => a.levels.some(l => l.manifestStep === step))?.name ?? '-'}
                                        </div>
                                    </button>
                                ) : (
                                    <div className="rounded p-2 text-xs opacity-30" style={{ border: `1px solid ${color.border}` }}>
                                        <div className="text-stone-500">-</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 상세 패널 */}
                {selectedItem && (
                    <div className="w-72 shrink-0 rounded p-4" style={{ border: `1px solid ${color.border}`, background: color.bg }}>
                        {selectedItem.type === 'ultimate' && character.ultimateSkill && (() => {
                            const lvl = character.ultimateSkill.levels.find(l =>
                                l.manifestStep === (selectedItem.step === 2 ? 0 : selectedItem.step === 3 ? 1 : selectedItem.step === 5 ? 3 : 5)
                            )
                            return (
                                <>
                                    <div className="mb-2 font-semibold text-sm" style={{ color: color.text }}>{character.ultimateSkill.name}</div>
                                    <div className="text-xs text-stone-400 mb-3">발현 {selectedItem.step}단</div>
                                    {lvl ? (
                                        <div className="space-y-2">
                                            <div className="flex gap-4 text-xs text-stone-400">
                                                {lvl.tpCost != null && <span>TP {lvl.tpCost}</span>}
                                                {lvl.rangeMin != null && <span>사거리 {lvl.rangeMin}{lvl.rangeMax && lvl.rangeMax !== lvl.rangeMin ? `~${lvl.rangeMax}` : ''}</span>}
                                                {lvl.cooldown != null && <span>쿨타임 {lvl.cooldown}턴</span>}
                                            </div>
                                            {lvl.effectText && <div className="text-xs text-stone-300">{lvl.effectText}</div>}
                                        </div>
                                    ) : <div className="text-xs text-stone-500">효과 없음</div>}
                                </>
                            )
                        })()}

                        {selectedItem.type === 'passive' && character.passive && (() => {
                            const lvl = character.passive.levels.find(l => l.unlockType === 'manifest' && l.unlockStep === selectedItem.step)
                            return (
                                <>
                                    <div className="mb-2 font-semibold text-sm" style={{ color: color.text }}>{character.passive.name}</div>
                                    <div className="text-xs text-stone-400 mb-3">발현 {selectedItem.step}단</div>
                                    {lvl?.effectText ? <div className="text-xs text-stone-300">{lvl.effectText}</div> : <div className="text-xs text-stone-500">효과 없음</div>}
                                </>
                            )
                        })()}

                        {selectedItem.type === 'artifact' && (() => {
                            const art = character.artifacts.find(a => a.levels.some(l => l.manifestStep === selectedItem.step))
                            const lvl = art?.levels.find(l => l.manifestStep === selectedItem.step)
                            return art ? (
                                <>
                                    <div className="mb-2 font-semibold text-sm" style={{ color: color.text }}>{art.name}</div>
                                    <div className="text-xs text-stone-400 mb-3">발현 {selectedItem.step}단</div>
                                    {lvl?.effectText ? <div className="text-xs text-stone-300">{lvl.effectText}</div> : <div className="text-xs text-stone-500">효과 없음</div>}
                                </>
                            ) : <div className="text-xs text-stone-500">아티팩트 없음</div>
                        })()}
                    </div>
                )}
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
                <button onClick={() => navigate('/characters')} className="text-xs text-stone-600 hover:text-stone-400">← 목록으로</button>
            </div>
        </div>
    )

    const color = ELEMENT_COLORS[character.element] ?? ELEMENT_COLORS['light']

    return (
        <div className="flex-1 overflow-y-auto">
            {/* ── 프로필 카드 ── */}
            <div className="relative overflow-hidden" style={{ borderBottom: `1px solid ${color.border}`, background: `linear-gradient(135deg, rgba(0,0,0,0.6) 0%, ${color.bg} 100%)` }}>
                <div className="max-w-screen-xl mx-auto px-8 py-8">
                    <div className="flex gap-8 items-start">
                        {/* 이미지 */}
                        <div className="shrink-0 relative">
                            {character.portraitUrl ? (
                                <img src={character.portraitUrl} className="w-36 h-44 object-cover rounded" style={{ border: `2px solid ${color.border}`, boxShadow: `0 0 30px ${color.glow}` }} />
                            ) : (
                                <div className="w-36 h-44 rounded flex items-center justify-center text-stone-700" style={{ border: `2px solid ${color.border}`, background: 'rgba(0,0,0,0.4)' }}>
                                    No Image
                                </div>
                            )}
                            {/* 속성 뱃지 */}
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-xs font-bold"
                                 style={{ background: color.primary, color: '#000' }}>
                                {ELEMENT_LABELS[character.element]}
                            </div>
                        </div>

                        {/* 기본 정보 */}
                        <div className="flex-1 pt-2">
                            <div className="mb-1 text-xs tracking-widest" style={{ color: color.primary }}>
                                {GRADE_LABELS[character.grade]} · {FACTION_LABELS[character.faction]}
                            </div>
                            <h1 className="font-cinzel text-3xl font-bold mb-1" style={{ color: color.text, textShadow: `0 0 30px ${color.glow}` }}>
                                {character.name}
                            </h1>

                            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                                {character.birthYear && (
                                    <div className="text-xs"><div className="text-stone-500 mb-0.5">출생연도</div><div className="text-stone-200">{character.birthYear}</div></div>
                                )}
                                {character.height && (
                                    <div className="text-xs"><div className="text-stone-500 mb-0.5">신장</div><div className="text-stone-200">{character.height}</div></div>
                                )}
                                {character.cv && (
                                    <div className="text-xs"><div className="text-stone-500 mb-0.5">CV</div><div className="text-stone-200">{character.cv}</div></div>
                                )}
                                {character.exclusiveWeapon && (
                                    <div className="text-xs"><div className="text-stone-500 mb-0.5">전용무기</div><div className="text-stone-200">{character.exclusiveWeapon.name}</div></div>
                                )}
                                {character.passive && (
                                    <div className="text-xs"><div className="text-stone-500 mb-0.5">고유 패시브</div><div className="text-stone-200">{character.passive.name}</div></div>
                                )}
                                {character.ultimateSkill && (
                                    <div className="text-xs"><div className="text-stone-500 mb-0.5">필살기</div><div className="text-stone-200">{character.ultimateSkill.name}</div></div>
                                )}
                            </div>

                            {/* 스탯 */}
                            {character.stats && (
                                <div className="mt-4 flex flex-wrap gap-4">
                                    {[
                                        { label: 'HP', value: character.stats.hp?.toLocaleString() },
                                        { label: '공격력', value: character.stats.attack?.toLocaleString() },
                                        { label: '방어력', value: character.stats.defense?.toLocaleString() },
                                        { label: '치명타율', value: character.stats.critRate != null ? `${character.stats.critRate}%` : null },
                                        { label: '치명타 피해', value: character.stats.critDamage != null ? `${character.stats.critDamage}%` : null },
                                    ].filter(s => s.value).map(s => (
                                        <div key={s.label} className="text-xs">
                                            <div className="text-stone-500 mb-0.5">{s.label}</div>
                                            <div className="font-bold" style={{ color: color.text }}>{s.value}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 소개 */}
                    {character.profileText && (
                        <div className="mt-6 pt-6 border-t text-sm text-stone-400 leading-relaxed" style={{ borderColor: color.border }}>
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
                        <div className="mb-3 flex items-center gap-2">
                            {character.passive.iconUrl && <img src={character.passive.iconUrl} className="w-8 h-8 rounded" />}
                            <span className="font-semibold text-sm" style={{ color: color.text }}>{character.passive.name}</span>
                        </div>
                        <div className="space-y-2">
                            {character.passive.levels.map(lvl => (
                                <div key={`${lvl.unlockType}_${lvl.unlockStep}`} className="flex gap-3 text-xs">
                                    <span className="shrink-0 rounded px-2 py-0.5 font-bold"
                                          style={{ background: lvl.unlockType === 'awaken' ? 'rgba(59,130,246,0.15)' : color.bg, color: lvl.unlockType === 'awaken' ? '#93C5FD' : color.text }}>
                                        {PASSIVE_LEVEL_LABELS[lvl.unlockType]?.[lvl.unlockStep] ?? `${lvl.unlockType} ${lvl.unlockStep}`}
                                    </span>
                                    <span className="text-stone-300 leading-relaxed">{lvl.effectText}</span>
                                </div>
                            ))}
                        </div>
                    </SectionBox>
                )}

                {/* 필살기 */}
                {character.ultimateSkill && (
                    <SectionBox title="필살기" color={color}>
                        <div className="mb-3 flex items-center gap-2">
                            {character.ultimateSkill.iconUrl && <img src={character.ultimateSkill.iconUrl} className="w-8 h-8 rounded" />}
                            <span className="font-semibold text-sm" style={{ color: color.text }}>{character.ultimateSkill.name}</span>
                        </div>
                        <div className="space-y-3">
                            {character.ultimateSkill.levels.map(lvl => (
                                <div key={lvl.manifestStep} className="rounded p-3" style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${color.border}` }}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-bold rounded px-2 py-0.5" style={{ background: color.bg, color: color.text }}>발현 {lvl.manifestStep}단</span>
                                        <div className="flex gap-3 text-xs text-stone-500">
                                            {lvl.tpCost != null && <span>TP {lvl.tpCost}</span>}
                                            {lvl.rangeMin != null && <span>사거리 {lvl.rangeMin}{lvl.rangeMax && lvl.rangeMax !== lvl.rangeMin ? `~${lvl.rangeMax}` : ''}</span>}
                                            {lvl.cooldown != null && <span>쿨타임 {lvl.cooldown}턴</span>}
                                        </div>
                                    </div>
                                    {lvl.effectText && <div className="text-xs text-stone-300 leading-relaxed">{lvl.effectText}</div>}
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
                                <CollapsibleBox key={art.artifactId} title={`${art.artifactOrder}. ${art.name}`} color={color}>
                                    <div className="space-y-2">
                                        {art.levels.map(lvl => (
                                            <div key={lvl.manifestStep} className="flex gap-3 text-xs">
                                                <span className="shrink-0 rounded px-2 py-0.5 font-bold" style={{ background: color.bg, color: color.text }}>
                                                    발현 {lvl.manifestStep}단
                                                </span>
                                                <span className="text-stone-300 leading-relaxed">{lvl.effectText}</span>
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
                        <div className="flex items-start gap-4">
                            {character.exclusiveWeapon.iconUrl && (
                                <img src={character.exclusiveWeapon.iconUrl} className="w-12 h-12 rounded shrink-0" style={{ border: `1px solid ${color.border}` }} />
                            )}
                            <div className="flex-1">
                                <div className="font-semibold text-sm mb-1" style={{ color: color.text }}>{character.exclusiveWeapon.name}</div>
                                <div className="text-xs text-stone-500 mb-2">{character.exclusiveWeapon.weaponType} · {GRADE_LABELS[character.exclusiveWeapon.grade]}</div>
                                {character.exclusiveWeapon.description && <div className="text-xs text-stone-400 mb-3">{character.exclusiveWeapon.description}</div>}
                                {character.exclusiveWeapon.effects.map(effect => (
                                    <CollapsibleBox key={effect.effectId} title={effect.effectName} color={color}>
                                        {effect.baseEffect && <div className="text-xs text-stone-400 mb-2">{effect.baseEffect}</div>}
                                        <div className="space-y-1">
                                            {effect.levels.map(lvl => (
                                                <div key={lvl.breakthroughStep} className="flex gap-2 text-xs">
                                                    <span className="shrink-0 rounded px-1.5 py-0.5 font-bold" style={{ background: color.bg, color: color.text }}>{lvl.breakthroughStep}단</span>
                                                    <span className="text-stone-300">{lvl.effectText}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CollapsibleBox>
                                ))}
                            </div>
                        </div>
                    </SectionBox>
                )}
            </div>
        </div>
    )
}

export default CharacterDetail