import { useEffect, useState, useCallback } from 'react'

type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
    message: string
    type?: ToastType
    duration?: number
    onClose: () => void
}

const ICONS = { success: '✓', error: '✕', info: 'ℹ' }
const COLORS = {
    success: 'border-[var(--accent)] text-[var(--accent)]',
    error: 'border-red-500 text-red-400',
    info: 'border-blue-500 text-blue-400'
}

const Toast = ({ message, type = 'success', duration = 2500, onClose }: ToastProps) => {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true))
        const timer = setTimeout(() => {
            setVisible(false)
            setTimeout(onClose, 300)
        }, duration)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300
            ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
            <div className={`flex items-center gap-2.5 rounded-lg border bg-[var(--card-bg)]
                px-4 py-3 shadow-xl text-sm ${COLORS[type]}`}>
                <span className="font-bold">{ICONS[type]}</span>
                <span className="text-[var(--text-primary)]">{message}</span>
            </div>
        </div>
    )
}

interface ToastState {
    message: string
    type: ToastType
    id: number
}

export const useToast = () => {
    const [toasts, setToasts] = useState<ToastState[]>([])

    const show = useCallback((message: string, type: ToastType = 'success') => {
        const id = Date.now()
        setToasts(prev => [...prev, { message, type, id }])
    }, [])

    const remove = useCallback((id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    const ToastContainer = () => (
        <>
            {toasts.map(t => (
                <Toast key={t.id} message={t.message} type={t.type} onClose={() => remove(t.id)} />
            ))}
        </>
    )

    return { show, ToastContainer }
}
