import { useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

// Keep positions by history entry, not URL: two visits may have different positions.
export default function RouteScrollRestoration() {
    const { key } = useLocation()
    const navigationType = useNavigationType()
    const positions = useRef(new Map<string, number>())

    useLayoutEffect(() => {
        const previous = window.history.scrollRestoration
        window.history.scrollRestoration = 'manual'
        return () => { window.history.scrollRestoration = previous }
    }, [])

    useLayoutEffect(() => {
        const target = navigationType === 'POP' ? (positions.current.get(key) ?? 0) : 0
        let restoring = true
        const restore = () => {
            window.scrollTo({ top: target, left: 0, behavior: 'instant' })
            if (Math.abs(window.scrollY - target) < 1) {
                restoring = false
                observer?.disconnect()
            }
        }
        // Back navigation may render a short loading screen before the list arrives.
        const observer = new ResizeObserver(restore)
        observer.observe(document.body)
        restore()
        const save = () => {
            if (!restoring) positions.current.set(key, window.scrollY)
        }
        const cancel = () => {
            restoring = false
            observer?.disconnect()
        }
        window.addEventListener('scroll', save, { passive: true })
        window.addEventListener('wheel', cancel, { passive: true })
        window.addEventListener('touchstart', cancel, { passive: true })
        window.addEventListener('keydown', cancel)
        return () => {
            observer?.disconnect()
            window.removeEventListener('scroll', save)
            window.removeEventListener('wheel', cancel)
            window.removeEventListener('touchstart', cancel)
            window.removeEventListener('keydown', cancel)
        }
    }, [key, navigationType])

    return null
}
