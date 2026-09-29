import assert from 'node:assert/strict'
import test from 'node:test'
import { compareByReleaseDate } from '../src/utils/characterSort.ts'

test('최신순은 등록 ID가 아니라 출시일 내림차순', () => {
    const characters = [
        { characterId: 99, name: '아이린', releaseDate: '2024-01-09' },
        { characterId: 1, name: '자드', releaseDate: '2026-05-06' },
        { characterId: 50, name: '칼스', releaseDate: '2025-12-31' },
    ]
    assert.deepEqual(characters.sort(compareByReleaseDate).map(c => c.name), ['자드', '칼스', '아이린'])
})

test('출시일이 같으면 이름순', () => {
    const characters = ['칼스', '아이린', '아리아나'].map(name => ({ name, releaseDate: '2024-01-09' }))
    assert.deepEqual(characters.sort(compareByReleaseDate).map(c => c.name), ['아리아나', '아이린', '칼스'])
})

test('출시일 미등록은 뒤로 보내고 이름순으로 정렬', () => {
    const characters = [
        { name: '칼스', releaseDate: null },
        { name: '아이린', releaseDate: '' },
        { name: '자드', releaseDate: '2024-01-09' },
    ]
    assert.deepEqual(characters.sort(compareByReleaseDate).map(c => c.name), ['자드', '아이린', '칼스'])
})
