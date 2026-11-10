type TreeNode = { classId: number; parentClassId: number | null; tier: number; name?: string }

// 공용 2티어 클래스의 기본 부모가 이 캐릭터의 트리에 없을 때만
// 캐릭터의 유일한 1티어에 연결한다. 공용 클래스 데이터는 변경하지 않는다.
export function resolveClassTreeParents<T extends TreeNode>(nodes: T[]): T[] {
    const ids = new Set(nodes.map(node => node.classId))
    const firstTier = nodes.filter(node => node.tier === 1)
    if (firstTier.length !== 1) return nodes
    return nodes.map(node => {
        // 카나·크리스티나의 스페셜리스트는 건슬링어에서 전직한다. 제인 쇼어의
        // 에이전트 연결처럼 트리에 기존 부모가 있으면 그대로 유지한다.
        if (node.name === '스페셜리스트' && node.tier === 3 &&
            (node.parentClassId == null || !ids.has(node.parentClassId))) {
            const parent = nodes.find(candidate => candidate.name === '건슬링어' && candidate.tier === 2)
            if (parent) return { ...node, parentClassId: parent.classId }
        }
        return node.tier === 2 &&
        (node.parentClassId == null || !ids.has(node.parentClassId))
        ? { ...node, parentClassId: firstTier[0]!.classId }
        : node
    })
}
