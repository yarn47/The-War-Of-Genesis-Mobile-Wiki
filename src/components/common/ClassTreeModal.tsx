import { useState } from 'react'

// 더미 클래스 데이터 (실제론 API에서 가져올 것)
const DUMMY_CLASSES = [
    { id: 1, class_name: '로그', tier: 1 },
    { id: 2, class_name: '씨프', tier: 2 },
    { id: 3, class_name: '카덴차', tier: 2 },
    { id: 4, class_name: '새도우댄서', tier: 3 },
    { id: 5, class_name: '안크', tier: 3 },
    { id: 6, class_name: '프리마', tier: 3 },
]

export interface ClassNode {
    id: number
    class_name: string
    tier: number
    parent_id: number | null
}

interface ClassTreeModalProps {
    onClose: () => void
    onSave: (nodes: ClassNode[]) => void
}

const ClassTreeModal = ({ onClose, onSave }: ClassTreeModalProps) => {
    const [nodes, setNodes] = useState<ClassNode[]>([])
    const [search, setSearch] = useState('')

    const filteredClasses = DUMMY_CLASSES.filter(c =>
        c.class_name.includes(search) && !nodes.find(n => n.id === c.id)
    )

    const addNode = (cls: typeof DUMMY_CLASSES[0]) => {
        setNodes([...nodes, { ...cls, parent_id: null }])
        setSearch('')
    }

    const removeNode = (id: number) => {
        // 해당 노드를 부모로 가진 노드들도 parent_id 초기화
        setNodes(nodes
            .filter(n => n.id !== id)
            .map(n => n.parent_id === id ? { ...n, parent_id: null } : n)
        )
    }

    const setParent = (nodeId: number, parentId: number | null) => {
        setNodes(nodes.map(n => n.id === nodeId ? { ...n, parent_id: parentId } : n))
    }

    const tier1 = nodes.filter(n => n.tier === 1)
    const tier2 = nodes.filter(n => n.tier === 2)
    const tier3 = nodes.filter(n => n.tier === 3)

    const getParentName = (parentId: number | null) => {
        if (!parentId) return '없음'
        return nodes.find(n => n.id === parentId)?.class_name ?? '없음'
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* 배경 */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

            {/* 모달 */}
            <div className="relative z-10 w-[720px] max-h-[85vh] overflow-y-auto rounded border border-amber-900/40 bg-stone-950 shadow-2xl">
                {/* 헤더 */}
                <div className="flex items-center justify-between border-b border-amber-900/25 px-6 py-4">
                    <div>
                        <h2 className="font-cinzel text-sm tracking-widest text-amber-400">클래스 트리 설정</h2>
                        <p className="mt-0.5 text-xs text-stone-600">클래스를 추가하고 상위 클래스를 연결하세요</p>
                    </div>
                    <button onClick={onClose} className="text-stone-600 hover:text-stone-300 text-lg">✕</button>
                </div>

                <div className="p-6">
                    {/* 클래스 검색 추가 */}
                    <div className="mb-5">
                        <div className="flex gap-2">
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="클래스 이름 검색..."
                                className="flex-1 rounded border border-amber-900/20 bg-stone-900/60 px-3 py-2 text-sm text-stone-200 placeholder-stone-700 focus:border-amber-700/60 focus:outline-none"
                            />
                        </div>
                        {search && filteredClasses.length > 0 && (
                            <div className="mt-1 rounded border border-amber-900/20 bg-stone-900 overflow-hidden">
                                {filteredClasses.map(cls => (
                                    <button
                                        key={cls.id}
                                        onClick={() => addNode(cls)}
                                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-stone-300 hover:bg-amber-900/10 border-b border-stone-800 last:border-0"
                                    >
                                        <span>{cls.class_name}</span>
                                        <span className="text-xs text-stone-600">Tier {cls.tier}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 트리 시각화 */}
                    {nodes.length > 0 ? (
                        <div className="rounded border border-amber-900/15 bg-stone-900/30 p-4">
                            {/* Tier 1 */}
                            {tier1.length > 0 && (
                                <div className="mb-6">
                                    <div className="mb-2 text-xs font-cinzel tracking-widest text-stone-600">TIER 1</div>
                                    <div className="flex gap-3 flex-wrap">
                                        {tier1.map(node => (
                                            <ClassNodeCard
                                                key={node.id}
                                                node={node}
                                                nodes={nodes}
                                                onRemove={removeNode}
                                                onSetParent={setParent}
                                                getParentName={getParentName}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 연결선 */}
                            {tier1.length > 0 && tier2.length > 0 && (
                                <div className="flex justify-center mb-2">
                                    <div className="h-6 w-px bg-amber-900/40" />
                                </div>
                            )}

                            {/* Tier 2 */}
                            {tier2.length > 0 && (
                                <div className="mb-6">
                                    <div className="mb-2 text-xs font-cinzel tracking-widest text-stone-600">TIER 2</div>
                                    <div className="flex gap-3 flex-wrap">
                                        {tier2.map(node => (
                                            <ClassNodeCard
                                                key={node.id}
                                                node={node}
                                                nodes={nodes}
                                                onRemove={removeNode}
                                                onSetParent={setParent}
                                                getParentName={getParentName}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 연결선 */}
                            {tier2.length > 0 && tier3.length > 0 && (
                                <div className="flex justify-center mb-2">
                                    <div className="h-6 w-px bg-amber-900/40" />
                                </div>
                            )}

                            {/* Tier 3 */}
                            {tier3.length > 0 && (
                                <div>
                                    <div className="mb-2 text-xs font-cinzel tracking-widest text-stone-600">TIER 3</div>
                                    <div className="flex gap-3 flex-wrap">
                                        {tier3.map(node => (
                                            <ClassNodeCard
                                                key={node.id}
                                                node={node}
                                                nodes={nodes}
                                                onRemove={removeNode}
                                                onSetParent={setParent}
                                                getParentName={getParentName}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="rounded border border-dashed border-amber-900/20 py-10 text-center text-sm text-stone-700">
                            클래스를 검색해서 추가해주세요
                        </div>
                    )}
                </div>

                {/* 하단 버튼 */}
                <div className="flex justify-end gap-2 border-t border-amber-900/25 px-6 py-4">
                    <button onClick={onClose} className="rounded border border-stone-700 px-4 py-2 text-xs text-stone-400 hover:bg-stone-800">취소</button>
                    <button onClick={() => { onSave(nodes); onClose() }} className="rounded border border-amber-700/50 bg-amber-900/20 px-4 py-2 text-xs text-amber-400 hover:bg-amber-900/30">저장</button>
                </div>
            </div>
        </div>
    )
}

// 클래스 노드 카드
const ClassNodeCard = ({ node, nodes, onRemove, onSetParent, getParentName }: {
    node: ClassNode
    nodes: ClassNode[]
    onRemove: (id: number) => void
    onSetParent: (nodeId: number, parentId: number | null) => void
    getParentName: (parentId: number | null) => string
}) => {
    const possibleParents = nodes.filter(n => n.tier === node.tier - 1)

    return (
        <div className="rounded border border-amber-900/20 bg-stone-900/60 p-3 w-44">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-stone-200">{node.class_name}</span>
                <button onClick={() => onRemove(node.id)} className="text-stone-700 hover:text-red-500 text-xs">✕</button>
            </div>
            {node.tier > 1 && possibleParents.length > 0 && (
                <div>
                    <label className="text-[10px] text-stone-600 mb-1 block">상위 클래스</label>
                    <select
                        value={node.parent_id ?? ''}
                        onChange={e => onSetParent(node.id, e.target.value ? Number(e.target.value) : null)}
                        className="w-full rounded border border-amber-900/15 bg-stone-800 px-2 py-1 text-xs text-stone-300 focus:outline-none"
                    >
                        <option value="">선택</option>
                        {possibleParents.map(p => (
                            <option key={p.id} value={p.id}>{p.class_name}</option>
                        ))}
                    </select>
                </div>
            )}
            {node.tier > 1 && possibleParents.length === 0 && (
                <p className="text-[10px] text-stone-700">Tier {node.tier - 1} 클래스를 먼저 추가하세요</p>
            )}
            {node.parent_id && (
                <div className="mt-1 text-[10px] text-amber-800">↑ {getParentName(node.parent_id)}</div>
            )}
        </div>
    )
}

export default ClassTreeModal