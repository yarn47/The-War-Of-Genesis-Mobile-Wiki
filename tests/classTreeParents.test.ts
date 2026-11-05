import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveClassTreeParents } from '../src/utils/classTreeParents.ts'

test('카나 스페셜리스트만 건슬링어에 연결하고 제인 연결은 보존', () => {
    const kana = [
        { classId: 1, name: '거너', tier: 1, parentClassId: null },
        { classId: 2, name: '건슬링어', tier: 2, parentClassId: 1 },
        { classId: 3, name: '스페셜리스트', tier: 3, parentClassId: 99 },
    ]
    assert.equal(resolveClassTreeParents(kana)[2]!.parentClassId, 2)
    assert.equal(kana[2]!.parentClassId, 99)
    const jane = [...kana, { classId: 99, name: '에이전트', tier: 2, parentClassId: 1 }]
    assert.equal(resolveClassTreeParents(jane)[2]!.parentClassId, 99)
})

test('공용 패스파인더를 캐릭터의 발키리에 연결하고 원본은 보존', () => {
    const input = [
        { classId: 1, tier: 1, parentClassId: null },
        { classId: 2, tier: 2, parentClassId: 99 },
        { classId: 3, tier: 3, parentClassId: 2 },
    ]
    const result = resolveClassTreeParents(input)
    assert.equal(result[1]!.parentClassId, 1)
    assert.equal(result[2]!.parentClassId, 2)
    assert.equal(input[1]!.parentClassId, 99)
})

test('기존 부모 연결 및 부모가 모호한 트리는 유지', () => {
    const input = [
        { classId: 1, tier: 1, parentClassId: null },
        { classId: 2, tier: 2, parentClassId: 1 },
    ]
    assert.deepEqual(resolveClassTreeParents(input), input)
    const ambiguous = [...input, { classId: 4, tier: 1, parentClassId: null },
        { classId: 5, tier: 2, parentClassId: 99 }]
    assert.deepEqual(resolveClassTreeParents(ambiguous), ambiguous)
    assert.deepEqual(resolveClassTreeParents([input[1]!]), [input[1]!])
})
