import React, {useState} from 'react';
import MainLayout from "@/layout/MainLayout";
import AccountLayout from "@/layout/AccountLayout";
import s from '@/styles/AccountOrders.module.css'
import OrderCard from "@/components/pages/account/OrderCard/OrderCard";
import Head from "next/head";
import {parse} from "cookie";
import jwtDecode from "jwt-decode";
import Link from "next/link";
import ContactModal from "@/components/shared/ContactModal/ContactModal";
import {fetchUserOrders} from "@/http/userApi";

export const getServerSideProps = async (context) => {
    const cookies = parse(context.req.headers.cookie || '')
    const token = cookies['access_token']
    const {user_id} = jwtDecode(token)
    const orders = await fetchUserOrders(user_id, token)

    // const orders = [
    //     {
    //         "id": 1113,
    //         "order_units": [
    //             {
    //                 "id": 1544,
    //                 "name": "Бенто-торт",
    //                 "bucket_link": [
    //                     {
    //                         "url": "https://storage.yandexcloud.net/les-jours-bucket/1.png"
    //                     }
    //                 ],
    //                 "slug": "vans-old-skool-blackwhite-43719",
    //                 "price": {
    //                     "start_price": 3900,
    //                     "final_price": 3900
    //                 },
    //                 "guestsAmount": 2,
    //                 "totalPrice": 7800,
    //                 "date": {
    //                     "start_datetime": "2025-06-01T14:00:00Z",
    //                     "end_datetime": "2025-06-01T16:00:00Z"
    //                 },
    //                 "address": "Кремлевский дворец",
    //                 "contacts": "+7 (915) 777 77-77",
    //                 "type": "master_class"
    //             },
    //             {
    //                 "type": "certificate",
    //                 "amount": "5000"
    //             }
    //         ],
    //         "formatted_date": "24.05.25", // Дата заказа
    //         "number": "10005",
    //         "total_amount": 12800, // Общая стоимость без скидок
    //         "final_amount": 12800, // Общая стоимость после скидок
    //         "total_sale": 0 // Все скидки (от товаров + промиков)
    //     },
    //     {
    //         "id": 1113,
    //         "order_units": [ // Список позиций в заказе (то есть МК с конкретным сеансом и кол-вом гостей, или сертификат))
    //             { // МК
    //                 "id": 1544,
    //                 "name": "Бенто-торт",
    //                 "bucket_link": [
    //                     {
    //                         "url": "https://storage.yandexcloud.net/les-jours-bucket/1.png"
    //                     }
    //                 ],
    //                 "slug": "vans-old-skool-blackwhite-43719",
    //                 "price": {
    //                     "start_price": 3900,
    //                     "final_price": 3900
    //                 },
    //                 "guestsAmount": 2, // Кол-во гостей
    //                 "totalPrice": 7800, // final_price * Кол-во гостей
    //                 "date": {
    //                     "start_datetime": "2024-04-01T14:00:00Z",
    //                     "end_datetime": "2024-04-01T16:00:00Z"
    //                 },
    //                 "address": "Кремлевский дворец",
    //                 "contacts": "+7 (007) МММ 77-77",
    //                 "type": "master_class"
    //             },
    //             { // Сертификат
    //                 "type": "certificate",
    //                 "amount": "5000"
    //             }
    //         ],
    //         "formatted_date": "16.11.24", // Дата заказа
    //         "number": "115536", // Номер заказа (похуй вообще ни к чему не привязан, на салате артем его как-то генерировал около рандомно)
    //         "total_amount": 13190, // Общая стоимость без скидок
    //         "final_amount": 10640, // Общая стоимость после скидок
    //         "total_sale": 3100 // Все скидки (от товаров + промиков)
    //     }
    // ]

    return {props: {orders}}
}
const Orders = ({orders}) => {
    const [contactOpen, setContactOpen] = useState(false)
    const toggleContact = () => {
        setContactOpen(!contactOpen)
    }
    const closeContact = () => {
        setContactOpen(false)
    }
    return (
        <MainLayout>
            <Head>
                <title>Мои заказы</title>
            </Head>
            <AccountLayout>
                <div className={s.cont}>
                    <h4 className={s.title}>Ваши заказы</h4>
                    <div className={s.orders_block}>
                        {
                            orders.length > 0
                                ?
                                <div className={s.cards_block}>
                                    {
                                        orders.map(el =>
                                            <OrderCard order={el}/>
                                        )
                                    }
                                </div>
                                :
                                <>
                                    <h5 className={'text-center'}>У вас пока нет заказов</h5>
                                    <div className={'d-flex justify-content-center mt-3'}>
                                        <Link href={'/products'} className={s.link}>За покупками</Link>
                                    </div>
                                </>
                        }
                    </div>
                    <div className={s.faq_block}>
                        <h5 className={`text-center ${s.questions_text}`}>Ответы на большинство вопросов
                            вы найдете здесь: <Link href={'/faq'} className={'text-black'} target={'_blank'}>FAQ</Link>
                        </h5>
                        <h5 className={`text-center ${s.questions_text}`}>Если у вас остались вопросы, вы всегда
                            можете обратиться в <span className={s.link_text}
                                                      onClick={toggleContact}>службу поддержки</span> и мы будем
                            рады вам помочь!</h5>
                    </div>
                </div>
            </AccountLayout>
            <ContactModal handleClose={closeContact} isOpen={contactOpen}/>
        </MainLayout>
    );
};

export default Orders;