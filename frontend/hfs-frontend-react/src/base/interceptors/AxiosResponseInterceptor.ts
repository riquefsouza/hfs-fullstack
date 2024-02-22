/*
import axios from "axios";
import router from "next/router";
import { TokenStorageService } from "../services/TokenStorageService";

const localStorageService = new TokenStorageService();

axios.interceptors.response.use(
    (response: any) => {
        return response
    },
    function (error: { config: any; response: { status: number } }) {
        const originalRequest = error.config

        if (
            error.response.status === 401 &&
            originalRequest.url === 'http://127.0.0.1:3000/v1/auth/token'
        ) {
            router.push('/login')
            return Promise.reject(error)
        }

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            const refreshToken = localStorageService.getRefreshToken()
            return axios
                .post('/auth/token', {
                    refresh_token: refreshToken
                })
                .then((res: { status: number; data: any }) => {
                    if (res.status === 201) {
                        localStorageService.setToken(res.data)
                        axios.defaults.headers.common['Authorization'] =
                            'Bearer ' + localStorageService.getAccessToken()
                        return axios(originalRequest)
                    }
                })
        }
        return Promise.reject(error)
    }
)
*/