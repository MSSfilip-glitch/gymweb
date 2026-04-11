// Sonner toast - lightweight stub that wraps a simple toast implementation
// In production, install 'sonner' package for full functionality

import { useEffect, useState } from "react";

interface Toast {
    id: number;
    message: string;
}

let toastId = 0;
const listeners: Set<(toast: Toast) => void> = new Set();

export function toast(message: string) {
    const t: Toast = { id: ++toastId, message };
    listeners.forEach(fn => fn(t));
}

export function Toaster() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    useEffect(() => {
        const handler = (t: Toast) => {
            setToasts(prev => [...prev, t]);
            setTimeout(() => {
                setToasts(prev => prev.filter(x => x.id !== t.id));
            }, 3000);
        };
        listeners.add(handler);
        return () => { listeners.delete(handler); };
    }, []);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map(t => (
                <div
                    key={t.id}
                    className="bg-foreground text-background px-4 py-3 rounded-lg shadow-lg text-sm animate-in slide-in-from-bottom-2"
                >
                    {t.message}
                </div>
            ))}
        </div>
    );
}
