import api from './api'

export interface TagDto {
    tagId: number
    name: string
    color: string
}

export interface BuffLevelDto {
    level: number
    levelName: string | null
    effectText: string | null
    duration: number | null
    maxStack: number | null
}

export interface BuffSourceDto {
    sourceType: string
    sourceId: number
    briefDesc: string | null
}

export interface BuffDto {
    buffId: number
    name: string
    description: string | null
    iconUrl: string | null
    duration: number | null
    maxStack: number | null
    hasLevels: boolean
    levels: BuffLevelDto[]
    tags: TagDto[]
    sources: BuffSourceDto[]
}

export interface DebuffDto {
    debuffId: number
    name: string
    description: string | null
    iconUrl: string | null
    duration: number | null
    maxStack: number | null
    hasLevels: boolean
    levels: BuffLevelDto[]
    tags: TagDto[]
    sources: BuffSourceDto[]
}

export const getBuffList = () =>
    api.get<BuffDto[]>('/buffs').then(res => res.data)

export const getBuffDetail = (id: number) =>
    api.get<BuffDto>(`/buffs/${id}`).then(res => res.data)

export const getDebuffList = () =>
    api.get<DebuffDto[]>('/debuffs').then(res => res.data)

export const getDebuffDetail = (id: number) =>
    api.get<DebuffDto>(`/debuffs/${id}`).then(res => res.data)

export const getTagList = () =>
    api.get<TagDto[]>('/tags').then(res => res.data)

// ─── 저장 API ─────────────────────────────────────────────────

export interface BuffRequest {
    name: string
    description?: string
    iconUrl?: string
    duration?: number
    maxStack?: number
    hasLevels?: boolean
    levels?: {
        level: number
        levelName?: string
        effectText?: string
        duration?: number
        maxStack?: number
    }[]
    tagIds?: number[]
}

export interface TagRequest {
    name: string
    color?: string
}

export const createBuff = (data: BuffRequest) =>
    api.post<BuffDto>('/buffs', data).then(res => res.data)

export const updateBuff = (id: number, data: BuffRequest) =>
    api.put<BuffDto>(`/buffs/${id}`, data).then(res => res.data)

export const deleteBuff = (id: number) =>
    api.delete(`/buffs/${id}`)

export const createDebuff = (data: BuffRequest) =>
    api.post<DebuffDto>('/debuffs', data).then(res => res.data)

export const updateDebuff = (id: number, data: BuffRequest) =>
    api.put<DebuffDto>(`/debuffs/${id}`, data).then(res => res.data)

export const deleteDebuff = (id: number) =>
    api.delete(`/debuffs/${id}`)

export const createTag = (data: TagRequest) =>
    api.post<TagDto>('/tags', data).then(res => res.data)

export const deleteTag = (id: number) =>
    api.delete(`/tags/${id}`)
