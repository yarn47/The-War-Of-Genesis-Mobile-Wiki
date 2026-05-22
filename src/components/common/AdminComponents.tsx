// ─── 공통 Admin 컴포넌트 ───────────────────────────────
// src/components/common/AdminComponents.tsx

import React from 'react'

export const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
    <div className="mb-5 overflow-hidden rounded border border-[var(--card-border)] theme-card">
        <div className="flex items-center gap-2 theme-card-header px-5 py-3">
            <div className="h-3.5 w-0.5 rounded bg-[var(--accent)]" />
            <span className="font-cinzel text-xs tracking-[0.15em] text-[var(--accent)] uppercase">{title}</span>
            {subtitle && <span className="text-xs text-[var(--text-muted)]">{subtitle}</span>}
        </div>
        <div className="p-5">{children}</div>
    </div>
)

export const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
    <div>
        <label className="mb-1.5 block text-xs font-semibold text-[var(--text-secondary)]">
            {label} {required && <span className="text-[var(--accent)]">*</span>}
        </label>
        {children}
    </div>
)

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className="theme-input w-full rounded px-3 py-2 text-sm" />
)

export const Select = ({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select {...props} className="theme-input w-full rounded px-3 py-2 text-sm">
        {children}
    </select>
)

export const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea {...props} className="theme-input w-full rounded px-3 py-2 text-sm" />
)

export const AddBtn = ({ onClick, label }: { onClick: () => void; label: string }) => (
    <button onClick={onClick} className="mt-2 rounded border border-dashed border-[var(--card-border)] px-4 py-2 text-xs text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]">
        + {label}
    </button>
)

export const RemoveBtn = ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} className="rounded border border-[var(--card-border)] px-2 py-1 text-xs text-[var(--text-muted)] hover:border-red-500/50 hover:text-red-400">
        삭제
    </button>
)

export const ItemBox = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`rounded border border-[var(--card-border)] bg-black/20 p-4 ${className}`}>{children}</div>
)

export const Grid = ({ cols, children }: { cols: number; children: React.ReactNode }) => (
    <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>{children}</div>
)

export const Collapse = ({ title, children }: { title: string; children: React.ReactNode }) => {
    const [open, setOpen] = React.useState(false)
    return (
        <div className="rounded border border-[var(--card-border)] overflow-hidden mb-3">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-4 py-3 bg-black/20 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
                <span>{title}</span>
                <span className="text-[var(--text-muted)]">{open ? '▲' : '▼'}</span>
            </button>
            {open && <div className="p-4">{children}</div>}
        </div>
    )
}

export const CancelBtn = ({ onClick }: { onClick?: () => void }) => (
    <button onClick={onClick} className="rounded border border-[var(--card-border)] px-4 py-2 text-xs text-[var(--text-muted)] hover:bg-[var(--accent-hover)]">
        취소
    </button>
)

export const DraftBtn = ({ onClick }: { onClick?: () => void }) => (
    <button onClick={onClick} className="rounded border border-[var(--card-border)] bg-black/20 px-4 py-2 text-xs text-[var(--text-secondary)] hover:bg-black/30">
        임시저장
    </button>
)

export const SaveBtn = ({ label = '저장 및 게시', onClick }: { label?: string; onClick?: () => void }) => (
    <button onClick={onClick} className="rounded border border-[var(--accent)] bg-[var(--accent-hover)] px-4 py-2 text-xs text-[var(--accent)] hover:opacity-80">
        {label}
    </button>
)