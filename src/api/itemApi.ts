import api from './api'

// ─── 장비 ────────────────────────────────────────────────

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

export interface EffectLevelRequest {
    breakthroughStep: number
    effectText: string | null
}

export interface EquipmentEffectRequest {
    effectName: string
    effectType: string
    baseEffect: string | null
    iconUrl: string | null
    levels: EffectLevelRequest[]
}

export interface EquipmentRequest {
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
    effects: EquipmentEffectRequest[]
}

// ─── 전용무기 ─────────────────────────────────────────────

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

export interface WeaponEffectRequest {
    effectName: string
    effectType: string
    baseEffect: string | null
    iconUrl: string | null
    levels: EffectLevelRequest[]
}

export interface ExclusiveWeaponRequest {
    name: string
    weaponType: string | null
    grade: string
    baseStats: string | null
    extraStats: string | null
    description: string | null
    iconUrl: string | null
    effects: WeaponEffectRequest[]
}

// ─── API 함수 ─────────────────────────────────────────────

export const getEquipmentList = () =>
    api.get<EquipmentSummaryDto[]>('/items').then(res => res.data)

export const getEquipmentDetail = (id: number) =>
    api.get<EquipmentDetailDto>(`/items/${id}`).then(res => res.data)

export const createEquipment = (req: EquipmentRequest) =>
    api.post<EquipmentDetailDto>('/items', req).then(res => res.data)

export const updateEquipment = (id: number, req: EquipmentRequest) =>
    api.put<EquipmentDetailDto>(`/items/${id}`, req).then(res => res.data)

export const deleteEquipment = (id: number) =>
    api.delete(`/items/${id}`)

export const getWeaponList = () =>
    api.get<ExclusiveWeaponDto[]>('/items/weapons').then(res => res.data)

export const searchWeapons = (name: string) =>
    api.get<ExclusiveWeaponDto[]>('/items/weapons/search', { params: { name } }).then(res => res.data)

export const getWeaponDetail = (id: number) =>
    api.get<ExclusiveWeaponDto>(`/items/weapons/${id}`).then(res => res.data)

export const createWeapon = (req: ExclusiveWeaponRequest) =>
    api.post<ExclusiveWeaponDto>('/items/weapons', req).then(res => res.data)

export const updateWeapon = (id: number, req: ExclusiveWeaponRequest) =>
    api.put<ExclusiveWeaponDto>(`/items/weapons/${id}`, req).then(res => res.data)

export const deleteWeapon = (id: number) =>
    api.delete(`/items/weapons/${id}`)