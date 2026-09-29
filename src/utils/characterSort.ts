type ReleaseDatedCharacter = {
    name: string
    releaseDate: string | null
}

// API 날짜는 YYYY-MM-DD. 등록 순서와 무관하게 출시일 내림차순으로 정렬한다.
// 출시일 미등록은 마지막, 동일 출시일은 이름순이다.
export const compareByReleaseDate = (a: ReleaseDatedCharacter, b: ReleaseDatedCharacter): number => {
    if (!a.releaseDate && !b.releaseDate) return a.name.localeCompare(b.name, 'ko')
    if (!a.releaseDate) return 1
    if (!b.releaseDate) return -1
    return b.releaseDate.localeCompare(a.releaseDate) || a.name.localeCompare(b.name, 'ko')
}
