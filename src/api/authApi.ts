import api from './api'

export interface LoginResponse {
    success: boolean
    message: string
}

// 401(아이디/비밀번호 틀림)은 에러로 던지지 않고 서버 메시지를 그대로 반환
export const login = (username: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { username, password }, {
        withCredentials: true,
        validateStatus: status => status === 200 || status === 401,
    }).then(res => res.data)

export const logout = () =>
    api.post<LoginResponse>('/auth/logout', {}, { withCredentials: true }).then(res => res.data)

export const checkAuth = () =>
    api.get<LoginResponse>('/auth/check', { withCredentials: true }).then(res => res.data)