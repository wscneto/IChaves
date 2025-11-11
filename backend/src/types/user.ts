// User interface for authentication
export interface User {
    id: string
    name: string
    email: string
    role: 'admin' | 'student' | null
    course?: string // Optional
    period?: string // Optional
}
