import api from './api'
import type { SkillDto } from './characterApi'

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

export interface SkillRequest {
    name: string
    type: string
    tpCost: number | null
    rangeMin: number | null
    rangeMax: number | null
    area: string | null
    cooldown: number | null
    effectText: string | null
    iconUrl: string | null
    unlockOrder: number | null
}

export interface ClassRequest {
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
    skills: SkillRequest[]
}

// 전체 목록
export const getAllClasses = () =>
    api.get<ClassSummaryDto[]>('/classes').then(res => res.data)

// 이름 검색
export const searchClasses = (name: string) =>
    api.get<ClassSummaryDto[]>('/classes/search', { params: { name } }).then(res => res.data)

// 상세
export const getClassDetail = (id: number) =>
    api.get<ClassDetailDto>(`/classes/${id}`).then(res => res.data)

// 생성
export const createClass = (req: ClassRequest) =>
    api.post<ClassDetailDto>('/classes', req).then(res => res.data)

// 수정
export const updateClass = (id: number, req: ClassRequest) =>
    api.put<ClassDetailDto>(`/classes/${id}`, req).then(res => res.data)

// 삭제
export const deleteClass = (id: number) =>
    api.delete(`/classes/${id}`)