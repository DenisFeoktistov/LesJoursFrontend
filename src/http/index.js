import axios from 'axios'
import {parse} from "cookie";

const $host = axios.create({
    baseURL: 'https://les-jours.ru/api/'
})
const $authHost = axios.create({
    baseURL: 'https://les-jours.ru/api/'
})
const $dadata = axios.create({
    baseURL: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address'
})

$authHost.interceptors.request.use((config) => {
    const accessToken = parse(String(config.headers.cookie)).access_token
    // const refreshToken = parse(config.headers.cookie).refresh_token
    if (accessToken) {
        config.headers.authorization = `Bearer ${accessToken}`
        // config.refresh_token = refreshToken
    }
    return config
})

export {
    $host,
    $authHost,
    $dadata
}