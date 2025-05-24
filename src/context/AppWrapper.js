import {createContext, useEffect} from "react";
import {productStore} from "@/store/ProductsStore";
import {desktopStore} from "@/store/DesktopStore";
import {filterStore} from "@/store/FilterStore";
import {userStore} from "@/store/UserStore";
import {refreshToken} from "@/http/userApi";
import jwtDecode from "jwt-decode";
import Cookies from 'js-cookie';
import {cartStore} from "@/store/CartStore";
import {orderStore} from "@/store/OrderStore";
import {fetchCart2} from "@/http/cartApi";

export const Context = createContext(null);

export default function AppWrapper({children}) {
    let sharedState = {
        desktopStore,
        productStore,
        filterStore,
        userStore,
        cartStore,
        orderStore
    }

    useEffect(() => {
        const token = Cookies.get('refresh_token')
        const refreshObj = JSON.stringify({refresh: token})
        if (token) {
            refreshToken(refreshObj).then((data) => {
                // Save the new token
                Cookies.set('access_token', data.access, {expires: 2772})
                // Decode token to get user data
                const userData = jwtDecode(data.access)
                // Set user data in userStore
                userStore.setIsLogged(true)
                console.log(userData)
                userStore.setId(userData.user_id)
                userStore.setUsername(userData.username)
                userStore.setFirstName(userData.first_name)
                userStore.setLastName(userData.last_name)
                if (userData.gender === 'None') {
                    userStore.setGender('')
                } else {
                    userStore.setGender(userData.gender)
                }
                fetchCart2(userData.user_id, data.access).then(cart => {
                    cartStore.setCartCnt(cart.product_units.length)
                    console.log(cart)
                })

            }).catch(() => {
                userStore.setIsLogged(false)
                userStore.setGender('')
                Cookies.remove('access_token')
                Cookies.remove('refresh_token')
            })
        }
        const cart = Cookies.get('cart')
        const lastSeen = Cookies.get('last_seen')
        if (cart && !userStore.isLogged) {
            const cartCnt = cart.trim().split(' ').filter(el => el !== ' ' && el !== '').length
            cartStore.setCartCnt(cartCnt)
        }
        if (!cart) {
            Cookies.set('cart', '', {expires: 2772})
        }
        if (!lastSeen) {
            Cookies.set('last_seen', '', {expires: 2772})
        }
    }, [])

    return (
        <Context.Provider value={sharedState}>
            {children}
        </Context.Provider>
    );
}