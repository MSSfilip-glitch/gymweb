import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
    if (!dateString) return "";
    try {
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return dateString; // fallback for non-compliant strings
        return d.toLocaleDateString('hr-HR', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
        return dateString;
    }
}
