import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'

// ─── 버프/디버프 사용자 얼굴 ───────────────────────────────
// 캐릭터는 동그라미, 무기(공용 옵션)는 네모.
// 여러 명이면 앞의 몇 개만 보여주고 +N 으로 접어서, 호버하면 전부 펼쳐 보여준다.

export interface EffectOwner {
    kind: 'character' | 'weapon'
    name: string
    iconUrl: string | null
}

const shapeClass = (kind: EffectOwner['kind']) => kind === 'weapon' ? 'rounded' : 'rounded-full'

const OwnerIcon = ({ owner, size }: { owner: EffectOwner; size: number }) => (
    owner.iconUrl
        ? <img src={owner.iconUrl} alt={owner.name} style={{ width: size, height: size, border: '1px solid rgba(255,255,255,0.15)' }}
               className={`object-cover ${shapeClass(owner.kind)}`} />
        : <span style={{ width: size, height: size }}
                className={`flex items-center justify-center bg-stone-800 text-[10px] text-stone-400 ${shapeClass(owner.kind)}`}>
              {owner.name.slice(0, 1)}
          </span>
)

const OwnerTitle = (owner: EffectOwner) => owner.kind === 'weapon' ? `${owner.name} (무기 옵션)` : owner.name

const EffectOwners = ({ owners, max = 5, size = 28 }: { owners: EffectOwner[]; max?: number; size?: number }) => {
    const ref = useRef<HTMLDivElement>(null)
    const [anchor, setAnchor] = useState<DOMRect | null>(null)

    if (owners.length === 0) return null

    // 넘치면 마지막 한 자리를 +N 으로
    const shown = owners.length > max ? owners.slice(0, max - 1) : owners
    const rest = owners.length - shown.length

    return (
        <div
            ref={ref}
            className="flex items-center gap-1"
            onClick={e => e.stopPropagation()}
            onMouseEnter={() => rest > 0 && setAnchor(ref.current?.getBoundingClientRect() ?? null)}
            onMouseLeave={() => setAnchor(null)}
        >
            {shown.map(owner => (
                <span key={`${owner.kind}_${owner.name}`} title={OwnerTitle(owner)} className="flex items-center">
                    <OwnerIcon owner={owner} size={size} />
                </span>
            ))}

            {rest > 0 && (
                <span style={{ width: size, height: size }}
                      className="flex items-center justify-center rounded-full border border-stone-700 bg-black/50 text-[11px] text-stone-400">
                    +{rest}
                </span>
            )}

            {anchor && createPortal(
                <div
                    className="fixed z-[60] max-h-72 overflow-y-auto rounded-lg p-2.5 shadow-2xl"
                    style={{
                        left: Math.min(Math.max(anchor.left + anchor.width / 2, 110), window.innerWidth - 110),
                        top: anchor.top - 8,
                        transform: 'translate(-50%, -100%)',
                        minWidth: 180,
                        background: 'rgba(12,10,9,0.97)',
                        border: '1px solid rgba(255,255,255,0.12)',
                    }}
                >
                    <div className="mb-1.5 text-[11px] text-stone-500">사용자 {owners.length}</div>
                    <div className="grid gap-1.5">
                        {owners.map(owner => (
                            <div key={`${owner.kind}_${owner.name}`} className="flex items-center gap-2 text-xs text-stone-300">
                                <OwnerIcon owner={owner} size={24} />
                                <span className="break-keep">{owner.name}</span>
                                {owner.kind === 'weapon' && <span className="text-[10px] text-stone-600">무기 옵션</span>}
                            </div>
                        ))}
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}

export default EffectOwners
