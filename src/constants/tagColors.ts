// 태그 뱃지 색상 (스킬/버프/디버프 태그 공통)
export const TAG_COLORS = [
    { value: 'gray', label: '회색', class: 'bg-stone-700 text-stone-300' },
    { value: 'red', label: '빨강', class: 'bg-red-900/60 text-red-300' },
    { value: 'orange', label: '주황', class: 'bg-orange-900/60 text-orange-300' },
    { value: 'blue', label: '파랑', class: 'bg-blue-900/60 text-blue-300' },
    { value: 'green', label: '초록', class: 'bg-green-900/60 text-green-300' },
    { value: 'yellow', label: '노랑', class: 'bg-yellow-900/60 text-yellow-300' },
    { value: 'purple', label: '보라', class: 'bg-purple-900/60 text-purple-300' },
]

export const getTagColorClass = (color: string) =>
    TAG_COLORS.find(c => c.value === color)?.class ?? 'bg-stone-700 text-stone-300'
