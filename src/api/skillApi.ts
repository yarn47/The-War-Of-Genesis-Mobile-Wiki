import api from './api'
import type { SkillDto } from './characterApi'
import type { EffectOwnerDto } from './buffApi'

export interface ActiveSkillDto {
    skill: SkillDto
    classes: { classId: number; name: string }[]
    attackTypes: string[]
    usedBy: EffectOwnerDto[]
}

export const getActiveSkills = (signal?: AbortSignal) =>
    api.get<ActiveSkillDto[]>('/skills', { signal }).then(res => res.data)
