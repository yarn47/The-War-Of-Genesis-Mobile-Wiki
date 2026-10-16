type TreeNode = { classId: number; parentClassId: number | null; tier: number }

// 공용 2티어 클래스의 기본 부모가 이 캐릭터의 트리에 없을 때만
// 캐릭터의 유일한 1티어에 연결한다. 공용 클래스 데이터는 변경하지 않는다.
export function resolveClassTreeParents<T extends TreeNode>(nodes: T[]): T[] {
    const ids = new Set(nodes.map(node => node.classId))
    const firstTier = nodes.filter(node => node.tier === 1)
    if (firstTier.length !== 1) return nodes
    return nodes.map(node => node.tier === 2 &&
        (node.parentClassId == null || !ids.has(node.parentClassId))
        ? { ...node, parentClassId: firstTier[0]!.classId }
        : node)
}
