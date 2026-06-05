import api from './api'

export interface LoginResponse {
    success: boolean
    message: string
}

export const login = (username: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { username, password }, { withCredentials: true }).then(res => res.data)

export const logout = () =>
    api.post<LoginResponse>('/auth/logout', {}, { withCredentials: true }).then(res => res.data)

export const checkAuth = () =>
    api.get<LoginResponse>('/auth/check', { withCredentials: true }).then(res => res.data)