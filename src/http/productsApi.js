import {$host} from "@/http/index";

export async function fetchProductsPage(query, token = '') {
    let allQuery = ''
    Object.keys(query).forEach(key => {
        if (typeof query[key] === "object") {
            query[key].forEach(el => {
                allQuery += `${key}=${el}&`
            })
        } else {
            allQuery += `${key}=${query[key]}&`
        }
    })
    if (!token) {
        const {data} = await $host.get(`masterclasses/masterclasses/?${allQuery}`)
        return data
    } else {
        const {data} = await $host.get(`masterclasses/masterclasses/?${allQuery}`, {
            headers: {Authorization: `Bearer ${token}`}
        })
        return data
    }
}

export async function fetchOneProduct(slug, token = '', ip = "") {
    // Создаем объект с параметрами
    const params = {ip};

    if (!token) {
        const {data} = await $host.get(`masterclasses/masterclasses/${slug}`, {
            params,
            // Устанавливаем заголовок X-Forwarded-For
            headers: {
                'X-Forwarded-For': ip // Передаем IP-адрес в заголовке X-Forwarded-For
            }
        });
        return data;
    } else {
        const {data} = await $host.get(`masterclasses/masterclasses/${slug}`, {
            params,
            // Устанавливаем заголовок X-Forwarded-For и Authorization
            headers: {
                'X-Forwarded-For': ip, // Передаем IP-адрес в заголовке X-Forwarded-For
                'Authorization': `Bearer ${token}`
            }
        });
        return data;
    }
}

export async function fetchProductsByArray(arr, token = '') {
    const obj = {products: arr}
    if (token) {
        const {data} = await $host.post(`masterclasses/masterclasses/list_masterclasses`, obj, {
            headers: {Authorization: `Bearer ${token}`}
        })
        return data
    } else {
        const {data} = await $host.post(`masterclasses/masterclasses/list_masterclasses`, obj)
        return data
    }
}