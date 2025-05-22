import {$host} from "@/http/index";
import collabs_filter_data from '@/static/jsons/collabs.json'
import tree_cat_filter_data from '@/static/jsons/tree_cat.json'
import tree_line_filter_data from '@/static/jsons/tree_line.json'
import colors_filter_data from '@/static/jsons/colors.json'
import age_filters from '@/static/jsons/age_filters.json'
import materials_filter_data from '@/static/jsons/materials.json'


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