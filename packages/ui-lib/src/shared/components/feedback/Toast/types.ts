export type ToastType = 'default' | 'info' | 'success' | 'warning' | 'error'
export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'

export interface ToastAction {
    label: string
    onClick: () => void
    outline?: boolean
}

export interface ToastOptions {
    id?: string
    title?: string
    message?: string
    type?: ToastType
    icon?: string // Custom icon name override
    duration?: number // ms, 0 = indefinite
    dismissible?: boolean
    action?: ToastAction
    position?: ToastPosition // Defaults to provider settings if not set, commonly handled by queue
    style?: Record<string, string> | string // Custom styles
    className?: string // Custom class
}

export interface ToastInstance extends ToastOptions {
    id: string
    createdAt: number
}
