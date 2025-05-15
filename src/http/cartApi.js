import {$authHost, $host} from "@/http/index";

// Используем: получаем все содержимое корзины. Формат описал, как обычно, в .json файле, указав полный прежний формат Салаута и новый, обрезанный максимально для фронтенда.
export async function fetchCart(id, cookies) {
    const {data} = await $authHost.get(`order/cart/${id}`, {
        headers: {cookie: cookies}
    })
    return data
}

export async function fetchCart2(id, token) {
    const {data} = await $host.get(`order/cart/${id}`, {
        headers: {Authorization: `Bearer ${token}`}
    })
    return data
}

export async function updateCart2(id, token) {
    const {data} = await $host.get(`order/cart/${id}?is_update=true`, {
        headers: {Authorization: `Bearer ${token}`}
    })
    return data
}

// Принимает id конкретного юнита (сеанс/мероприятие)
export async function addToCart(userId, productUnitId, guestsAmount, token) {
    const {data} = await $host.post(`order/cart/${userId}/${productUnitId}/${guestsAmount}`, {}, {
        headers: {Authorization: `Bearer ${token}`}
    })
    return data
}

// Принимает amount сертификата, который надо добавить в корзину
export async function addToCartCertificate(userId, amount, token) {
    const {data} = await $host.post(`order/cart/${userId}/${amount}?is_certificate=true`, {}, {
        headers: {Authorization: `Bearer ${token}`}
    })
    return data
}

// Удаление из корзины мастер-класса по его unitId (id конкретного ивента)
export async function removeFromCart(userId, productUnitId, token) {
    const {data} = await $host.delete(`order/cart/${userId}/${productUnitId}`, {
        headers: {Authorization: `Bearer ${token}`}
    })
    return data
}


// Удаление из корзины сертификата по его номиналу (один такой сертификат удаляем, а не все с таким номиналом!)
export async function removeFromCartCertificate(userId, amount, token) {
    const {data} = await $host.delete(`order/cart/${userId}/${amount}?is_certificate=true`, {
        headers: {Authorization: `Bearer ${token}`}
    })
    return data
}

export async function updateProductUnit(userId, productUnitId, newProductUnitId, token) {
    const {data} = await $host.put(`order/cart/${userId}/${productUnitId}/${newProductUnitId}`, {
        headers: {Authorization: `Bearer ${token}`}
    })
    return data
}

// Используем. Отдаем объект со списком id юнитов (+сертификаты). Возвращает по структуре из моего .json корзина->product_units полные данные об этих юнитах (сеанс->вся нужная инфа о МК; сертификат->корректный формат с указанием, что это сертификат и номинал.)
export async function fetchProductUnits(obj, token) {
    if (!token) {
        const {data} = await $host.post('product_unit/list', obj)
        return data
    } else {
        const {data} = await $host.post('product_unit/list', obj, {
            headers: {Authorization: `Bearer ${token}`}
        })
        return data
    }
}

export async function updateCartFromCookies(cookieStr, userId, token) {
    const unitIdArr = cookieStr.trim().split(' ').filter(el => el !== '' && el !== ' ')
    const obj = {product_unit_list: unitIdArr}
    if (!cookieStr) {
        obj.product_unit_list = []
    }
    const {data} = await $host.post(`order/cart_list/${userId}`, JSON.stringify(obj), {
        headers: {Authorization: `Bearer ${token}`}
    })
    return data
}

// Функция, которая делается расчет корзины с учетом применения промокода. Это для незалоганного юзера использовали
export async function fetchCartPrice(cartArr, promoStr) {
    const obj = {
        product_unit_list: cartArr,
        promo: promoStr
    }
    const {data} = await $host.post(`product_unit/total_amount_list`, JSON.stringify(obj))
    return data
}

// Проверка промокода для авторизованного юзера. Ответ есть в json.
export async function promoAuth(promoStr, userId, token) {
    const obj = {
        promo: promoStr
    }
    const {data} = await $host.post(`promo/check/${userId}`, JSON.stringify(obj), {
            headers: {Authorization: `Bearer ${token}`}
        }
    )
    return data
}

// Проверка промокода для неавторизованного юзера. Ответ есть в json.
export async function promoUnauth(promoStr, cartArr) {
    const obj = {
        product_unit_list: cartArr,
        promo: promoStr
    }
    const {data} = await $host.post(`promo/anon_check`, JSON.stringify(obj))
    return data
}

export async function useBonuses(bonusesVal, token) {
    const obj = {
        bonus: bonusesVal
    }
    const {data} = await $host.post(`order/cart/use_bonus`, JSON.stringify(obj), {
            headers: {Authorization: `Bearer ${token}`}
        }
    )
    return data
}