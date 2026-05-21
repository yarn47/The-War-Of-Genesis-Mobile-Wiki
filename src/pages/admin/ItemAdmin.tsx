import { useState } from 'react'

import { Section, Field, Input, Select, Textarea, ItemBox, Grid,CancelBtn, DraftBtn, SaveBtn } from '../../components/common/AdminComponents'

const Collapse = ({ title, children }: { title: string; children: React.ReactNode }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className="rounded border border-amber-900/15 overflow-hidden mb-3">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-4 py-3 bg-stone-900/40 text-xs font-semibold text-stone-400 hover:text-stone-200 transition"
            >
                <span>{title}</span>
                <span className="text-stone-600">{open ? '▲' : '▼'}</span>
            </button>
            {open && <div className="p-4">{children}</div>}
        </div>
    )
}

// 돌파 단계별 효과 입력 (1~6단)
const BreakthroughLevels = ({ placeholder }: { placeholder: string }) => {
    const levels = [1, 2, 3, 4, 5, 6]
    return (
        <div className="space-y-2">
            {levels.map(level => (
                <ItemBox key={level} className="bg-stone-900/20">
                    <div className="mb-2">
                        <span className={`rounded px-2 py-0.5 text-xs font-bold ${level <= 3 ? 'bg-blue-900/20 text-blue-400' : 'bg-amber-900/20 text-amber-500'}`}>
                            돌파 {level}단
                        </span>
                    </div>
                    <Field label="효과 설명">
                        <Textarea rows={2} placeholder={`${level}단 ${placeholder}`} />
                    </Field>
                </ItemBox>
            ))}
        </div>
    )
}

const ItemAdmin = () => {
    const [itemType, setItemType] = useState<'weapon' | 'armor' | 'accessory'>('weapon')
    const [isExclusive, setIsExclusive] = useState(false)
    const [weaponEffectTab, setWeaponEffectTab] = useState<'normal' | 'exclusive'>('normal')
    const [hasExclusiveEffect, setHasExclusiveEffect] = useState(false)

    return (
        <main className="min-w-0 flex-1 overflow-y-auto px-8 py-7">
            {/* 헤더 */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="font-cinzel text-lg tracking-widest text-amber-400">아이템 등록 / 수정</h1>
                    <p className="mt-0.5 text-xs text-stone-600">* 필수 입력</p>
                </div>
                <div className="flex gap-2">
                    <CancelBtn />
                    <DraftBtn />
                    <SaveBtn />
                </div>
            </div>

            {/* 아이템 타입 탭 */}
            <div className="mb-5 flex gap-1 border-b border-amber-900/20">
                {([['weapon', '무기'], ['armor', '방어구'], ['accessory', '악세사리']] as const).map(([type, label]) => (
                    <button
                        key={type}
                        onClick={() => setItemType(type)}
                        className={`px-6 py-2.5 font-cinzel text-xs tracking-wider transition border-b-2 -mb-px ${
                            itemType === type ? 'border-amber-500 text-amber-400' : 'border-transparent text-stone-500 hover:text-stone-300'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* ① 기본 정보 */}
            <Section title="① 기본 정보">
                <Grid cols={2}>
                    <Field label="아이템 이름" required><Input placeholder="예: 라 사바호" /></Field>
                    <Field label="아이템 ID (URL용)"><Input placeholder="예: la-sabaho" /></Field>
                </Grid>
                <div className="mt-3">
                    <Grid cols={3}>
                        <Field label="등급" required>
                            <Select>
                                <option>일반</option><option>희귀</option><option>영웅</option><option>전설</option>
                            </Select>
                        </Field>
                        {itemType === 'weapon' && (
                            <Field label="무기 타입" required>
                                <Input placeholder="예: 쌍수단검/관통" />
                            </Field>
                        )}
                        {itemType === 'armor' && (
                            <Field label="부위" required>
                                <Select>
                                    <option>투구</option><option>갑옷</option><option>장갑</option><option>신발</option>
                                </Select>
                            </Field>
                        )}
                        {itemType === 'armor' && (
                            <Field label="방어 타입">
                                <Select>
                                    <option>라이트</option><option>미디엄</option><option>헤비</option>
                                </Select>
                            </Field>
                        )}
                        {itemType === 'accessory' && (
                            <Field label="부위" required>
                                <Select>
                                    <option>목걸이</option><option>반지</option><option>귀걸이</option>
                                </Select>
                            </Field>
                        )}
                    </Grid>
                </div>

                {/* 무기 전용 여부 */}
                {itemType === 'weapon' && (
                    <div className="mt-3">
                        <div className="flex items-center gap-3 mb-3">
                            <label className="text-xs font-semibold text-stone-400">캐릭터 전용 무기</label>
                            <button
                                onClick={() => setIsExclusive(!isExclusive)}
                                className={`rounded px-3 py-1 text-xs transition ${isExclusive ? 'bg-amber-900/40 text-amber-400' : 'bg-stone-800 text-stone-500 hover:text-stone-300'}`}
                            >
                                {isExclusive ? '전용' : '일반'}
                            </button>
                        </div>
                        {isExclusive && (
                            <div className="flex gap-2">
                                <Input placeholder="캐릭터 이름으로 검색..." className="max-w-xs" />
                                <button className="rounded border border-amber-900/30 px-4 py-2 text-xs text-amber-600 transition hover:border-amber-600">검색</button>
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-3">
                    <Grid cols={2}>
                        <Field label="아이콘 URL"><Input placeholder="https://..." /></Field>
                        <div />
                    </Grid>
                </div>
                <div className="mt-3">
                    <Field label="아이템 설명">
                        <Textarea rows={3} placeholder="아이템 배경 설명..." />
                    </Field>
                </div>
            </Section>

            {/* ② 기본 스탯 / 추가 능력치 (접기) */}
            <div className="mb-5 overflow-hidden rounded border border-amber-900/25 bg-stone-950/40 backdrop-blur-sm">
                <div className="flex items-center gap-2 border-b border-amber-900/25 bg-stone-950/30 px-5 py-3">
                    <div className="h-3.5 w-0.5 rounded bg-[var(--accent)]" />
                    <span className="font-cinzel text-xs tracking-[0.15em] text-[var(--accent)] uppercase">② 기본 스탯</span>
                </div>
                <div className="p-5">
                    <Collapse title="기본 스탯 입력">
                        <Grid cols={3}>
                            <Field label="최대 체력"><Input type="number" placeholder="0" /></Field>
                            <Field label="공격력"><Input type="number" placeholder="0" /></Field>
                            <Field label="방어력"><Input type="number" placeholder="0" /></Field>
                            <Field label="저항력"><Input type="number" placeholder="0" /></Field>
                            <Field label="주문력"><Input type="number" placeholder="0" /></Field>
                            <Field label="치명타율 (%)"><Input type="number" placeholder="0" /></Field>
                        </Grid>
                    </Collapse>
                    <Collapse title="추가 능력치 입력">
                        <Field label="추가 능력치 설명">
                            <Textarea rows={3} placeholder="예: 물리 관통 +14% 최대 체력 +9%&#10;[수치]{red} 태그 사용 가능" />
                        </Field>
                    </Collapse>
                </div>
            </div>

            {/* ③ 무기 효과 (무기만) */}
            {itemType === 'weapon' && (
                <Section title="③ 무기 효과">
                    {/* 일반/전용 토글 */}
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex gap-1 border-b border-amber-900/20 flex-1">
                            {(['normal', 'exclusive'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setWeaponEffectTab(tab)}
                                    className={`px-5 py-2 font-cinzel text-xs tracking-wider transition border-b-2 -mb-px ${
                                        weaponEffectTab === tab ? 'border-amber-500 text-amber-400' : 'border-transparent text-stone-500 hover:text-stone-300'
                                    }`}
                                >
                                    {tab === 'normal' ? '일반 효과' : '전용 효과'}
                                </button>
                            ))}
                        </div>
                        {weaponEffectTab === 'exclusive' && (
                            <button
                                onClick={() => setHasExclusiveEffect(!hasExclusiveEffect)}
                                className={`rounded px-3 py-1 text-xs transition flex-shrink-0 ${hasExclusiveEffect ? 'bg-amber-900/40 text-amber-400' : 'bg-stone-800 text-stone-500 hover:text-stone-300'}`}
                            >
                                {hasExclusiveEffect ? '사용 중' : '사용 안 함'}
                            </button>
                        )}
                    </div>

                    {/* 일반 효과 */}
                    {weaponEffectTab === 'normal' && (
                        <div>
                            <div className="mb-4">
                                <Grid cols={2}>
                                    <Field label="스킬 이름"><Input placeholder="예: 새벽의 빛" /></Field>
                                    <Field label="스킬 아이콘 URL"><Input placeholder="https://..." /></Field>
                                </Grid>
                                <div className="mt-3">
                                    <Field label="기본 효과 설명">
                                        <Textarea rows={2} placeholder="스킬 기본 설명..." />
                                    </Field>
                                </div>
                            </div>
                            <div className="text-xs font-semibold text-stone-500 mb-2">돌파 단계별 효과</div>
                            <BreakthroughLevels placeholder="일반 효과..." />
                        </div>
                    )}

                    {/* 전용 효과 */}
                    {weaponEffectTab === 'exclusive' && hasExclusiveEffect && (
                        <div>
                            <div className="mb-4">
                                <Grid cols={2}>
                                    <Field label="스킬 이름"><Input placeholder="예: 고고한 에투알" /></Field>
                                    <Field label="스킬 아이콘 URL"><Input placeholder="https://..." /></Field>
                                </Grid>
                                <div className="mt-3">
                                    <Field label="기본 효과 설명">
                                        <Textarea rows={2} placeholder="전용 스킬 기본 설명..." />
                                    </Field>
                                </div>
                            </div>
                            <div className="text-xs font-semibold text-stone-500 mb-2">돌파 단계별 효과</div>
                            <BreakthroughLevels placeholder="전용 효과..." />
                        </div>
                    )}

                    {weaponEffectTab === 'exclusive' && !hasExclusiveEffect && (
                        <div className="py-8 text-center text-sm text-stone-700">
                            전용 효과 없음 (위 토글로 활성화)
                        </div>
                    )}
                </Section>
            )}

            {/* ③ 세트 효과 (방어구만) */}
            {itemType === 'armor' && (
                <Section title="③ 세트 효과">
                    <div className="mb-3">
                        <Field label="세트 이름"><Input placeholder="예: 회색의 계승자" /></Field>
                    </div>
                    <div className="space-y-3">
                        <ItemBox>
                            <div className="mb-2">
                                <span className="rounded bg-blue-900/20 px-2 py-0.5 text-xs font-bold text-blue-500">2세트 효과</span>
                            </div>
                            <Field label="효과 설명">
                                <Textarea rows={2} placeholder="예: 최대 체력 +15%, 받는 치명타 피해 감소 +15%" />
                            </Field>
                        </ItemBox>
                        <ItemBox>
                            <div className="mb-2">
                                <span className="rounded bg-purple-900/20 px-2 py-0.5 text-xs font-bold text-purple-400">4세트 효과</span>
                            </div>
                            <Field label="효과 설명">
                                <Textarea rows={3} placeholder="예: 공격력/물리 관통 +20%. 2칸 이내 아군 플레이어가 없고..." />
                            </Field>
                        </ItemBox>
                    </div>
                </Section>
            )}

            {/* ③ 악세 효과 (악세사리만) */}
            {itemType === 'accessory' && (
                <Section title="③ 악세사리 효과">
                    <div className="mb-4">
                        <Grid cols={2}>
                            <Field label="스킬 이름"><Input placeholder="스킬 이름" /></Field>
                            <Field label="스킬 아이콘 URL"><Input placeholder="https://..." /></Field>
                        </Grid>
                        <div className="mt-3">
                            <Field label="기본 효과 설명">
                                <Textarea rows={2} placeholder="스킬 기본 설명..." />
                            </Field>
                        </div>
                    </div>
                    <div className="text-xs font-semibold text-stone-500 mb-2">돌파 단계별 효과</div>
                    <BreakthroughLevels placeholder="악세사리 효과..." />
                </Section>
            )}

            {/* 하단 버튼 */}
            <div className="mb-8 flex justify-end gap-2">
                <button className="rounded border border-stone-700 px-5 py-2 text-sm text-stone-400 transition hover:bg-stone-800">취소</button>
                <button className="rounded border border-stone-600 bg-stone-800/60 px-5 py-2 text-sm text-stone-300 transition hover:bg-stone-700">임시저장</button>
                <button className="rounded border border-amber-700/50 bg-amber-900/20 px-5 py-2 text-sm text-amber-400 transition hover:bg-amber-900/30">저장 및 게시</button>
            </div>
        </main>
    )
}

export default ItemAdmin