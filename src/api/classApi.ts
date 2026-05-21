import api from './api'
import type {SkillDto} from './characterApi'

export interface ClassSummaryDto {
    classId: number
    name: string
    tier: number
    weaponType: string | null
    defenseType: string | null
    iconUrl: string | null
    parentClassId: number | null
}

export interface ClassDetailDto {
    classId: number
    name: string
    tier: number
    weaponType: string | null
    defenseType: string | null
    attackRange: number | null
    moveRange: number | null
    baseHp: number | null
    baseAttack: number | null
    parentClassId: number | null
    description: string | null
    iconUrl: string | null
    passive1Name: string | null
    passive1Lv1: string | null
    passive1Lv2: string | null
    skills: SkillDto[]
}

// 클래스 검색
export const searchClasses = (name: string) =>
    api.get<ClassSummaryDto[]>('/classes/search', { params: { name } }).then(res => res.data)

// 클래스 상세
export const getClassDetail = (id: number) =>
    api.get<ClassDetailDto>(`/classes/${id}`).then(res => res.data)