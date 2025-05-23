import {$host} from "@/http/index";

export async function checkoutOrder(obj, userId, token) {
    const {data} = await $host.post(`order/checkout/${userId}`, obj, {
        headers: {Authorization: `Bearer ${token}`}
    })

    return data
}