import api from './api'
import type {BuffDto, DebuffDto} from './buffApi'

export interface CharacterSummaryDto {
    characterId: number
    name: string
    grade: string
    faction: string
    element: string
    thumbnailUrl: string | null
}

export interface CharacterStatsDto {
    hp: number | null
    attack: number | null
    defense: number | null
    critRate: number | null
    critDamage: number | null
    physPen: number | null
    magicPen: number | null
    effectResist: number | null
}

export interface CharacterSkinDto {
    skinId: number
    skinName: string
    isDefault: boolean
    thumbnailUrl: string | null
    portraitUrl: string | null
    fullImageUrl: string | null
    howToObtain: string | null
    releaseDate: string | null
}

export interface SkillDto {
    skillId: number
    name: string
    type: string
    tpCost: number | null
    rangeMin: number | null
    rangeMax: number | null
    area: string | null
    cooldown: number | null
    effectText: string | null
    iconUrl: string | null
}

export interface ClassTreeNodeDto {
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
    orderInTier: number | null
    iconUrl: string | null
    passive1Name: string | null
    passive1Lv1: string | null
    passive1Lv2: string | null
    skills: SkillDto[]
}

export interface CharacterPassiveLevelDto {
    unlockType: string
    unlockStep: number
    effectText: string | null
}

export interface CharacterPassiveDto {
    passiveId: number
    name: string
    iconUrl: string | null
    levels: CharacterPassiveLevelDto[]
}

export interface UltimateSkillLevelDto {
    manifestStep: number
    tpCost: number | null
    rangeMin: number | null
    rangeMax: number | null
    cooldown: number | null
    effectText: string | null
}

export interface UltimateSkillDto {
    ultimateId: number
    name: string
    iconUrl: string | null
    levels: UltimateSkillLevelDto[]
}

export interface ArtifactLevelDto {
    manifestStep: number
    effectText: string | null
}

export interface ArtifactDto {
    artifactId: number
    name: string
    artifactOrder: number
    iconUrl: string | null
    levels: ArtifactLevelDto[]
}

export interface CharacterManifestationDto {
    manifestLevel: number
    ultimateId: number | null
    passiveId: number | null
    artifact1Id: number | null
    artifact2Id: number | null
    artifact3Id: number | null
    artifact4Id: number | null
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

export interface CharacterDetailDto {
    characterId: number
    name: string
    grade: string
    faction: string
    element: string
    birthYear: string | null
    height: string | null
    cv: string | null
    profileText: string | null
    thumbnailUrl: string | null
    portraitUrl: string | null
    fullImageUrl: string | null
    stats: CharacterStatsDto | null
    skins: CharacterSkinDto[]
    classTree: ClassTreeNodeDto[]
    passive: CharacterPassiveDto | null
    ultimateSkill: UltimateSkillDto | null
    artifacts: ArtifactDto[]
    manifestations: CharacterManifestationDto[]
    exclusiveWeapon: ExclusiveWeaponDto | null
    relatedBuffs: BuffDto[]
    relatedDebuffs: DebuffDto[]
}

// 캐릭터 목록
export const getCharacterList = () =>
    api.get<CharacterSummaryDto[]>('/characters').then(res => res.data)

// 캐릭터 상세
export const getCharacterDetail = (id: number) =>
    api.get<CharacterDetailDto>(`/characters/${id}`).then(res => res.data)