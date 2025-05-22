import {$authHost, $host} from "@/http/index";
import Cookies from 'js-cookie'

export async function registration(body) {
    const {data} = await $host.post(`user/register`, body)
    Cookies.set('access_token', data.access, {expires: 2772})
    Cookies.set('refresh_token', data.refresh, {expires: 2772})

    return data
}

export async function login(body) {
    const {data} = await $host.post(`user/login`, body)
    Cookies.set('access_token', data.access, {expires: 2772})
    Cookies.set('refresh_token', data.refresh, {expires: 2772})
    return data
}

export async function refreshToken(token) {
    const {data} = await $host.post('user/token/refresh/', token)
    Cookies.set('access_token', data.access, {expires: 2772})
    return data
}

// Что должна возвращать отразил в примере bdStructTemp.json (некоторые поля я если честно не знаю зачем были нужны, поэтому все, чего нет на фронте - удалил. Можешь сам посмотреть за остальные, нужны ли для бека. В том же файле оставил для удобства пример данных о пользователе как на Sellout)
export async function fetchUserInfo(cookies, id) {
    const {data} = await $authHost.get(`user/user_info/${id}`, {
        headers: {cookie: cookies}
    })
    return data
}

// Должна работать 1в1 и возвращать то же самое (в том числе ошибки какие-то)
export async function editUserInfo(token, userId, obj) {
    const {data} = await $host.post(`user/user_info/${userId}`, obj, {
        headers: {Authorization: `Bearer ${token}`}
    })
    return data
}

export async function fetchLastSeen(cookies, userId) {
    const {data} = await $authHost.get(`user/last_seen/${userId}`, {
        headers: {cookie: cookies}
    })
    return data
}

export async function fetchLastSeen2(token, userId) {
    const {data} = await $authHost.get(`user/last_seen/${userId}`, {
        headers: {Authorization: `Bearer ${token}`}
    })
    return data
}

export async function addLastSeen(token, userId, productId) {
    const obj = {product_id: productId}
    const {data} = await $host.post(`user/last_seen/${userId}`, obj, {
        headers: {Authorization: `Bearer ${token}`}
    })
    return data
}

// Должна работать 1в1
export async function changePassAccountPage(token, userId, oldPass, newPass) {
    const obj = {
        old_password: oldPass,
        new_password: newPass
    }
    const {data} = await $host.post(`user/change_pwd_lk/${userId}`, obj, {
        headers: {Authorization: `Bearer ${token}`}
    })
    return data
}

// Нужно. (Это все заказы юзера). Формат данных в json. (в 1ом словаре все поля как были в салате, во 2ом только те, что будут использоваться фронтом сейчас, оч многое удалил, что-то, возможно, нужно на беке еще для чего-то). Логику расчета всех полей сверь. (Всякие суммы скидки итп)
export async function fetchUserOrders(userId, token) {
    const {data} = await $host.get(`order/user_orders/${userId}`, {
        headers: {Authorization: `Bearer ${token}`}
    })
    return data
}

export async function fetchOneOrder(orderId, token) {
    const {data} = await $host.get(`order/info/${orderId}`, {
        headers: {Authorization: `Bearer ${token}`}
    })
    return data
}