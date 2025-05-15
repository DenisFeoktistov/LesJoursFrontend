import {parse} from "cookie";
import MainLayout from "@/layout/MainLayout";
import jwtDecode from "jwt-decode";
import {fetchWishlist} from "@/http/wishlistAPI";
import s from '@/styles/Wishlist.module.css'
import ProductCard from "@/components/shared/ProductCard/ProductCard";
import React, {useContext} from "react";
import {Context} from "@/context/AppWrapper";
import AuthModal from "@/components/shared/AuthModal/AuthModal";
import {observer} from "mobx-react-lite";
import Head from "next/head";
import Link from "next/link";
import {desktopStore} from "@/store/DesktopStore";

export const getServerSideProps = async (context) => {
    const cookies = parse(context.req.headers.cookie || '')
    const token = cookies['access_token']
    let wishlist
    try {
        const {user_id} = jwtDecode(token)
        wishlist = await fetchWishlist(user_id, context.req.headers.cookie)
    } catch (e) {
        wishlist = []
    }
    return {props: {wishlist}}
}

const Wishlist = ({wishlist}) => {
    const {userStore} = useContext(Context)

    function formOfWord(num) {
        let form = "мастер-классов";
        if (num % 10 === 1 && num % 100 !== 11) {
            form = "мастер-класс";
        } else if (
            num % 10 >= 2 &&
            num % 10 <= 4 &&
            (num % 100 < 10 || num % 100 >= 20)
        ) {
            form = "мастер-класс";
        }
        return `${num} ${form}`;
    }

    const tempMasterClasses = {
        "id": 43719,
        "in_wishlist": false,
        "price": {
            "start_price": 8490,
            "final_price": 8490
        },
        "short_description": "Вы сможете создать собственный тортик и чудесно провести вечер! Вы сможете создать еще один собственный тортик и опять чудесно провести вечер!",
        "slug": "vans-old-skool-blackwhite-43719",
        "location": "м. Новокузнецкая",
        "name": "Бенто-торт",
        "bucket_link": [
            {
                "id": 18603709,
                "url": "https://storage.yandexcloud.net/les-jours-bucket/1.png"
            },
            {
                "id": 18603710,
                "url": "https://cdn.poizon.com/pro-img/origin-img/20230721/037c574fa17445ea9a85215e6ebb63a7.jpg"
            },
            {
                "id": 18603711,
                "url": "https://cdn.poizon.com/pro-img/origin-img/20230721/df71fdc035fb40668def489de323e230.jpg"
            }
        ]
    }

    return (
        <MainLayout>
            <Head>
                <title>Избранное</title>
            </Head>
            <div className={'custom_cont'}
                 style={{marginTop: desktopStore.isDesktop ? '130px' : '20px', marginBottom: '50px'}}>
                <h3>Избранное</h3>
                {
                    wishlist.length > 0 &&
                    <p>{formOfWord(wishlist.length)}</p>
                }
                <div className={userStore.isLogged && wishlist.length ? s.wishlist_cont : s.wishlist_cont_no_login}>
                    {
                        userStore.isLogged
                            ?
                            <>
                                {
                                    !wishlist.length &&
                                    <div>
                                        <p className={s.empty_text}>Ваш список избранного пуст</p>
                                        <Link href={'/products'} className={s.button}
                                        >За покупками</Link>
                                    </div>
                                }
                                {wishlist.map(el =>
                                    <ProductCard
                                        product={tempMasterClasses}
                                        cardList={true}
                                        key={el.id}/>
                                )}
                            </>
                            :
                            <div>
                                <p className={s.empty_text}>Войдите или зарегистрируйтесь, чтобы посмотреть список
                                    избранного </p>
                                <AuthModal>
                                    <div className={s.button}>Войти / Зарегистрироваться</div>
                                </AuthModal>
                            </div>
                    }
                </div>

            </div>
        </MainLayout>
    );
};

export default observer(Wishlist);