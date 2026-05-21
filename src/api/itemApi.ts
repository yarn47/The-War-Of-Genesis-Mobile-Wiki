import api from './api'

export interface EquipmentEffectLevelDto {
    breakthroughStep: number
    effectText: string | null
}

export interface EquipmentEffectDto {
    eqEffectId: number
    effectName: string
    effectType: string
    baseEffect: string | null
    iconUrl: string | null
    levels: EquipmentEffectLevelDto[]
}

export interface EquipmentSummaryDto {
    equipmentId: number
    name: string
    type: string
    grade: string
    iconUrl: string | null
    setName: string | null
}

export interface EquipmentDetailDto {
    equipmentId: number
    name: string
    type: string
    defenseType: string | null
    grade: string
    baseStats: string | null
    extraStats: string | null
    setName: string | null
    setEffect2: string | null
    setEffect4: string | null
    description: string | null
    iconUrl: string | null
    effects: EquipmentEffectDto[]
}

export interface WeaponEffectLevelDto {
    breakthroughStep: number
    effectText: string | null
}

export interface ExclusiveWeaponEffectDto {
    effectId: number
    effectName: string
    effectType: string
    baseEffect: string | null
    iconUrl: string | null
    levels: WeaponEffectLevelDto[]
}

export interface ExclusiveWeaponDto {
    weaponId: number
    name: string
    weaponType: string | null
    grade: string
    baseStats: string | null
    extraStats: string | null
    description: string | null
    iconUrl: string | null
    effects: ExclusiveWeaponEffectDto[]
}

// 장비 목록
export const getEquipmentList = () =>
    api.get<EquipmentSummaryDto[]>('/items').then(res => res.data)

// 장비 상세
export const getEquipmentDetail = (id: number) =>
    api.get<EquipmentDetailDto>(`/items/${id}`).then(res => res.data)

// 전용무기 검색
export const searchWeapons = (name: string) =>
    api.get<ExclusiveWeaponDto[]>('/items/weapons/search', { params: { name } }).then(res => res.data)

// 전용무기 상세
export const getWeaponDetail = (id: number) =>
    api.get<ExclusiveWeaponDto>(`/items/weapons/${id}`).then(res => res.data)