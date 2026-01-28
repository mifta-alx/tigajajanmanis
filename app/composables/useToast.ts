import type {Toast} from "~/types/models";

export const useToast = () => {
    const toasts = useState<Toast[]>('app-toasts', () => [])
    const add = (title: string, description?: string, type: Toast['type'] = 'success') => {
        const id = Date.now()
        const newToast: Toast = { id, title, description, type }

        toasts.value.push(newToast)

        setTimeout(() => {
            remove(id)
        }, 3000)
    }
        const remove = (id: number) => {
            toasts.value = toasts.value.filter(t => t.id !== id)
        }

    return {
        toasts,
        success: (title: string, desc?: string) => add(title, desc, 'success'),
        error: (title: string, desc?: string) => add(title, desc, 'error'),
        warning: (title: string, desc?: string) => add(title, desc, 'warning'),
        info: (title: string, desc?: string) => add(title, desc, 'info'),
        default: (title: string, desc?: string) => add(title, desc, 'default'),
        remove
    }
}