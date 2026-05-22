import { useState, useEffect } from 'react'
import { Section, Field, Input, Textarea, ItemBox, Grid, CancelBtn, SaveBtn } from '../../components/common/AdminComponents'
import { getBuffList, getDebuffList, getTagList, createBuff, createDebuff, createTag, deleteTag,
    updateBuff, updateDebuff, deleteBuff, deleteDebuff,
    type BuffDto, type DebuffDto, type TagDto, type BuffRequest,
    type TagRequest } from '../../api/buffApi'
import { useToast } from '../../components/common/Toast'

const TAG_COLORS = [
    { value: 'gray', label: '회색', class: 'bg-stone-700 text-stone-300' },
    { value: 'red', label: '빨강', class: 'bg-red-900/60 text-red-300' },
    { value: 'blue', label: '파랑', class: 'bg-blue-900/60 text-blue-300' },
    { value: 'green', label: '초록', class: 'bg-green-900/60 text-green-300' },
    { value: 'yellow', label: '노랑', class: 'bg-yellow-900/60 text-yellow-300' },
    { value: 'purple', label: '보라', class: 'bg-purple-900/60 text-purple-300' },
]

const getTagColorClass = (color: string) =>
    TAG_COLORS.find(c => c.value === color)?.class ?? 'bg-stone-700 text-stone-300'

type LevelState = {
    level: number
    levelName: string
    effectText: string
    duration: string
    maxStack: string
}

const BuffAdmin = () => {
    const { show, ToastContainer } = useToast()

    const [mainTab, setMainTab] = useState<'buff' | 'tag'>('buff')
    const [buffTypeTab, setBuffTypeTab] = useState<'buff' | 'debuff'>('buff')

    const [buffList, setBuffList] = useState<BuffDto[]>([])
    const [debuffList, setDebuffList] = useState<DebuffDto[]>([])
    const [tagList, setTagList] = useState<TagDto[]>([])

    const [editingId, setEditingId] = useState<number | null>(null)

    const [buffName, setBuffName] = useState('')
    const [buffDesc, setBuffDesc] = useState('')
    const [buffIcon, setBuffIcon] = useState('')
    const [buffDuration, setBuffDuration] = useState('')
    const [buffMaxStack, setBuffMaxStack] = useState('1')
    const [hasLevels, setHasLevels] = useState(false)
    const [levels, setLevels] = useState<LevelState[]>([])
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])

    const [newTagName, setNewTagName] = useState('')
    const [newTagColor, setNewTagColor] = useState('gray')

    useEffect(() => { loadData() }, [])

    const loadData = async () => {
        const [buffs, debuffs, tags] = await Promise.all([getBuffList(), getDebuffList(), getTagList()])
        setBuffList(buffs)
        setDebuffList(debuffs)
        setTagList(tags)
    }

    const resetForm = () => {
        setEditingId(null)
        setBuffName(''); setBuffDesc(''); setBuffIcon('')
        setBuffDuration(''); setBuffMaxStack('1')
        setHasLevels(false); setLevels([]); setSelectedTagIds([])
    }

    const emptyLevel = (level: number): LevelState => ({
        level, levelName: '', effectText: '', duration: '', maxStack: ''
    })

    const fillForm = (item: BuffDto | DebuffDto) => {
        setEditingId('buffId' in item ? item.buffId : item.debuffId)
        setBuffName(item.name)
        setBuffDesc(item.description ?? '')
        setBuffIcon(item.iconUrl ?? '')
        setBuffDuration(item.duration?.toString() ?? '')
        setBuffMaxStack(item.maxStack?.toString() ?? '1')
        setHasLevels(item.hasLevels)
        setLevels(item.levels.map(l => ({
            level: l.level,
            levelName: l.levelName ?? '',
            effectText: l.effectText ?? '',
            duration: l.duration?.toString() ?? '',
            maxStack: l.maxStack?.toString() ?? ''
        })))
        setSelectedTagIds(item.tags.map(t => t.tagId))
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }

    const toggleLevels = (enabled: boolean) => {
        setHasLevels(enabled)
        if (enabled) setLevels([emptyLevel(1)])
        else setLevels([])
    }

    const addLevel = () => {
        setLevels(prev => [...prev, emptyLevel(prev.length + 1)])
    }

    const removeLevel = (idx: number) => {
        setLevels(prev => prev.filter((_, i) => i !== idx).map((l, i) => ({ ...l, level: i + 1 })))
    }

    const updateLevel = (idx: number, key: keyof Omit<LevelState, 'level'>, value: string) => {
        setLevels(prev => prev.map((l, i) => i === idx ? { ...l, [key]: value } : l))
    }

    const toggleTag = (tagId: number) => {
        setSelectedTagIds(prev =>
            prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
        )
    }

    const buildRequest = (): BuffRequest => ({
        name: buffName,
        description: buffDesc || undefined,
        iconUrl: buffIcon || undefined,
        duration: !hasLevels && buffDuration ? Number(buffDuration) : undefined,
        maxStack: !hasLevels ? Number(buffMaxStack) : undefined,
        hasLevels,
        levels: levels.map(l => ({
            level: l.level,
            levelName: l.levelName || undefined,
            effectText: l.effectText,
            duration: l.duration ? Number(l.duration) : undefined,
            maxStack: l.maxStack ? Number(l.maxStack) : undefined
        })),
        tagIds: selectedTagIds
    })

    const handleSave = async () => {
        if (!buffName.trim()) return
        const request = buildRequest()
        try {
            if (editingId !== null) {
                if (buffTypeTab === 'buff') await updateBuff(editingId, request)
                else await updateDebuff(editingId, request)
                show('수정되었습니다')
            } else {
                if (buffTypeTab === 'buff') await createBuff(request)
                else await createDebuff(request)
                show(buffTypeTab === 'buff' ? '버프가 저장되었습니다' : '디버프가 저장되었습니다')
            }
            resetForm()
            loadData()
        } catch {
            show('저장에 실패했습니다', 'error')
        }
    }

    const handleDelete = async () => {
        if (editingId === null) return
        try {
            if (buffTypeTab === 'buff') await deleteBuff(editingId)
            else await deleteDebuff(editingId)
            show('삭제되었습니다')
            resetForm()
            loadData()
        } catch {
            show('삭제에 실패했습니다', 'error')
        }
    }

    const handleAddTag = async () => {
        if (!newTagName.trim()) return
        try {
            await createTag({ name: newTagName.trim(), color: newTagColor } as TagRequest)
            setNewTagName('')
            loadData()
            show('태그가 추가되었습니다')
        } catch {
            show('태그 추가에 실패했습니다', 'error')
        }
    }

    const handleDeleteTag = async (id: number) => {
        try {
            await deleteTag(id)
            loadData()
            show('태그가 삭제되었습니다')
        } catch {
            show('태그 삭제에 실패했습니다', 'error')
        }
    }

    return (
        <>
            <ToastContainer />
            <main className="min-w-0 flex-1 overflow-y-auto px-8 py-7">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="font-cinzel text-lg tracking-widest text-[var(--accent)]">버프 / 디버프 / 태그 관리</h1>
                        <p className="mt-0.5 text-xs text-[var(--text-muted)]">버프·디버프 등록 및 태그 관리</p>
                    </div>
                    <div className="flex gap-2">
                        {editingId !== null && (
                            <button onClick={handleDelete}
                                    className="rounded px-4 py-2 text-xs font-bold text-red-400 border border-red-900/40 bg-red-900/20 hover:bg-red-900/30">
                                삭제
                            </button>
                        )}
                        <CancelBtn onClick={resetForm} />
                        <SaveBtn onClick={handleSave} />
                    </div>
                </div>

                <div className="mb-5 flex gap-1 border-b border-[var(--card-border)]">
                    {(['buff', 'tag'] as const).map(tab => (
                        <button key={tab} onClick={() => setMainTab(tab)}
                                className={`px-6 py-2.5 font-cinzel text-xs tracking-wider border-b-2 -mb-px ${mainTab === tab ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>
                            {tab === 'buff' ? '버프 / 디버프' : '태그 관리'}
                        </button>
                    ))}
                </div>

                {mainTab === 'buff' && (
                    <>
                        <div className="mb-4 flex gap-1">
                            {(['buff', 'debuff'] as const).map(tab => (
                                <button key={tab} onClick={() => { setBuffTypeTab(tab); resetForm() }}
                                        className={`rounded px-4 py-1.5 text-xs font-bold ${buffTypeTab === tab
                                            ? tab === 'buff' ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'
                                            : 'bg-stone-800/60 text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>
                                    {tab === 'buff' ? '버프' : '디버프'}
                                </button>
                            ))}
                        </div>

                        <Section title={buffTypeTab === 'buff' ? '등록된 버프' : '등록된 디버프'}>
                            <div className="flex flex-wrap gap-2">
                                {(buffTypeTab === 'buff' ? buffList : debuffList).length === 0 ? (
                                    <p className="text-xs text-[var(--text-muted)]">등록된 항목이 없습니다.</p>
                                ) : (buffTypeTab === 'buff' ? buffList : debuffList).map((item) => {
                                    const id = 'buffId' in item ? item.buffId : item.debuffId
                                    const isEditing = editingId === id
                                    return (
                                        <button
                                            key={id}
                                            onClick={() => isEditing ? resetForm() : fillForm(item)}
                                            className={`rounded px-3 py-1.5 text-xs border ${isEditing
                                                ? 'border-[var(--accent)] bg-[var(--accent-hover)] text-[var(--accent)]'
                                                : buffTypeTab === 'buff'
                                                    ? 'border-green-900/40 bg-green-900/20 text-green-300 hover:bg-green-900/30'
                                                    : 'border-red-900/40 bg-red-900/20 text-red-300 hover:bg-red-900/30'}`}
                                        >
                                            {item.name}
                                            {item.hasLevels && <span className="ml-1 text-[var(--text-muted)]">(Lv)</span>}
                                        </button>
                                    )
                                })}
                            </div>
                        </Section>

                        <Section title={editingId !== null
                            ? buffTypeTab === 'buff' ? '버프 수정' : '디버프 수정'
                            : buffTypeTab === 'buff' ? '버프 추가' : '디버프 추가'}>
                            <Grid cols={2}>
                                <Field label="이름">
                                    <Input value={buffName} onChange={e => setBuffName(e.target.value)} placeholder="예: 관능의 아라베스크" />
                                </Field>
                                <Field label="아이콘 URL">
                                    <Input value={buffIcon} onChange={e => setBuffIcon(e.target.value)} placeholder="https://..." />
                                </Field>
                            </Grid>

                            {!hasLevels && (
                                <div className="mt-3">
                                    <Grid cols={2}>
                                        <Field label="지속 턴 (없으면 비워두기)">
                                            <Input type="number" value={buffDuration} onChange={e => setBuffDuration(e.target.value)} placeholder="예: 2" />
                                        </Field>
                                        <Field label="최대 중첩">
                                            <Input type="number" value={buffMaxStack} onChange={e => setBuffMaxStack(e.target.value)} placeholder="1" />
                                        </Field>
                                    </Grid>
                                </div>
                            )}

                            <div className="mt-3">
                                <Field label="기본 설명 (선택)">
                                    <Textarea rows={2} value={buffDesc} onChange={e => setBuffDesc(e.target.value)} placeholder="효과 설명... [수치]{red} 태그 사용 가능" />
                                </Field>
                            </div>

                            <div className="mt-3 flex items-center gap-3">
                                <label className="text-xs font-semibold text-[var(--text-secondary)]">레벨별 효과</label>
                                <button onClick={() => toggleLevels(!hasLevels)}
                                        className={`rounded px-3 py-1 text-xs ${hasLevels ? 'bg-[var(--accent-hover)] border border-[var(--accent)] text-[var(--accent)]' : 'bg-stone-800 text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>
                                    {hasLevels ? '사용 중' : '사용 안 함'}
                                </button>
                            </div>

                            {hasLevels && (
                                <div className="mt-3 space-y-2">
                                    {levels.map((lv, idx) => (
                                        <ItemBox key={lv.level} className="bg-stone-900/20">
                                            <div className="mb-2 flex items-center justify-between">
                                                <span className="rounded bg-[var(--accent-hover)] px-2 py-0.5 text-xs font-bold text-[var(--accent)]">{lv.level}레벨</span>
                                                <button onClick={() => removeLevel(idx)} className="text-xs text-[var(--text-muted)] hover:text-red-400">✕</button>
                                            </div>
                                            <div className="mb-2">
                                                <Field label="레벨 이름 (비우면 자동생성)">
                                                    <Input value={lv.levelName} onChange={e => updateLevel(idx, 'levelName', e.target.value)}
                                                           placeholder={`예: ${buffName || '버프이름'} ${lv.level}`} />
                                                </Field>
                                            </div>
                                            <div className="mb-2">
                                                <Grid cols={2}>
                                                    <Field label="지속 턴">
                                                        <Input type="number" value={lv.duration}
                                                               onChange={e => updateLevel(idx, 'duration', e.target.value)}
                                                               placeholder="없으면 비워두기" />
                                                    </Field>
                                                    <Field label="최대 중첩">
                                                        <Input type="number" value={lv.maxStack}
                                                               onChange={e => updateLevel(idx, 'maxStack', e.target.value)}
                                                               placeholder="1" />
                                                    </Field>
                                                </Grid>
                                            </div>
                                            <Field label="효과 설명">
                                                <Textarea rows={2} value={lv.effectText}
                                                          onChange={e => updateLevel(idx, 'effectText', e.target.value)}
                                                          placeholder={`${lv.level}레벨 효과...`} />
                                            </Field>
                                        </ItemBox>
                                    ))}
                                    <button onClick={addLevel}
                                            className="mt-1 rounded border border-dashed border-[var(--card-border)] px-3 py-1.5 text-xs text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]">
                                        + 레벨 추가
                                    </button>
                                </div>
                            )}

                            <div className="mt-3">
                                <label className="mb-2 block text-xs font-semibold text-[var(--text-secondary)]">태그</label>
                                <div className="flex flex-wrap gap-1.5">
                                    {tagList.map(tag => (
                                        <button key={tag.tagId} onClick={() => toggleTag(tag.tagId)}
                                                className={`rounded px-2.5 py-1 text-xs ${selectedTagIds.includes(tag.tagId) ? getTagColorClass(tag.color) : 'bg-stone-800/60 text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>
                                            {tag.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </Section>
                    </>
                )}

                {mainTab === 'tag' && (
                    <Section title="태그 관리">
                        <div className="mb-5 flex gap-2 items-end">
                            <div className="flex-1 max-w-xs">
                                <Field label="태그 이름">
                                    <Input value={newTagName} onChange={e => setNewTagName(e.target.value)}
                                           placeholder="예: 해제 불가" onKeyDown={e => e.key === 'Enter' && handleAddTag()} />
                                </Field>
                            </div>
                            <div className="w-32">
                                <Field label="색상">
                                    <select value={newTagColor} onChange={e => setNewTagColor(e.target.value)}
                                            className="theme-input w-full rounded px-3 py-2 text-sm">
                                        {TAG_COLORS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                    </select>
                                </Field>
                            </div>
                            <SaveBtn label="추가" onClick={handleAddTag} />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {tagList.map(tag => (
                                <div key={tag.tagId} className="flex items-center gap-1.5">
                                    <span className={`rounded px-2.5 py-1 text-xs ${getTagColorClass(tag.color)}`}>{tag.name}</span>
                                    <button onClick={() => handleDeleteTag(tag.tagId)} className="text-[var(--text-muted)] hover:text-red-400 text-xs">✕</button>
                                </div>
                            ))}
                        </div>
                    </Section>
                )}
            </main>
        </>
    )
}

export default BuffAdmin