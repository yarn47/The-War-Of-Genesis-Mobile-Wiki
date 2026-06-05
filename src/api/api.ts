import axios from 'axios'

const api = axios.create({
    // 환경 변수가 있으면 그걸 쓰고, 없으면 로컬 호스트를 바라보게 세팅!
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

export default api