import React, {useContext, useEffect, useState} from 'react';
import MainLayout from "@/layout/MainLayout";
import s from '@/styles/OrderComplete.module.css'
import check from '@/static/icons/check2-circle.svg'
import Image from "next/image";
import {Context} from "@/context/AppWrapper";
import CompleteCard from "@/components/pages/order/CompleteCard/CompleteCard";
import {observer} from "mobx-react-lite";
import Link from "next/link";
import {parse} from "cookie";
import ContactModal from "@/components/shared/ContactModal/ContactModal";
import heart from '@/static/icons/circle_heart.svg'
import {fetchOneOrder} from "@/http/userApi";


export const getServerSideProps = async (context) => {
    const cookies = parse(context.req.headers.cookie || '')
    const token = cookies['access_token']
    const {id} = context.query
    const order = await fetchOneOrder(id, token)

    // const order = {
    //     "id": 1113,
    //     "order_units": [
    //         {
    //             "id": 1544,
    //             "name": "Бенто-торт",
    //             "bucket_link": [
    //                 {
    //                     "url": "https://storage.yandexcloud.net/les-jours-bucket/1.png"
    //                 }
    //             ],
    //             "slug": "vans-old-skool-blackwhite-43719",
    //             "price": {
    //                 "start_price": 3900,
    //                 "final_price": 3900
    //             },
    //             "guestsAmount": 2,
    //             "totalPrice": 7800,
    //             "date": {
    //                 "start_datetime": "2025-06-01T14:00:00Z",
    //                 "end_datetime": "2025-06-01T16:00:00Z"
    //             },
    //             "address": "Кремлевский дворец",
    //             "contacts": "+7 (915) 777 77-77",
    //             "type": "master_class"
    //         },
    //         {
    //             "type": "certificate",
    //             "amount": "5000"
    //         }
    //     ],
    //     "formatted_date": "24.05.25",
    //     "number": "10005",
    //     "total_amount": 12800,
    //     "final_amount": 12800,
    //     "total_sale": 0,
    //     "email": "markenson888@mail.ru",
    //     "phone": "+7 916 114-92-27",
    //     "surname": "Фельдман",
    //     "name": "Марк",
    //     "telegram": "@markermann"
    // }

    return {props: {order}}
}
const Complete = ({order}) => {
    const {userStore, cartStore} = useContext(Context)

    const {desktopStore} = useContext(Context)
    const [contactOpen, setContactOpen] = useState(false)
    const toggleContact = () => {
        setContactOpen(!contactOpen)
    }
    const closeContact = () => {
        setContactOpen(false)
    }
    useEffect(() => {
        cartStore.setCartCnt(0)
    }, [userStore.isLogged])
    return (
        <MainLayout>
            <div className={s.cont + ' custom_cont'}>
                <div className={s.thanks_block}>
                    <Image src={check} alt='' width={desktopStore.isDesktop ? 50 : 40}/>
                    <div>
                        {order.name}, спасибо за заказ!
                    </div>
                </div>
                <div className={s.header}>
                    <div className={s.header_text}>
                        Ваш заказ: № {order.number}
                    </div>
                    <div className={s.header_text}>
                        Дата: {order.formatted_date}
                    </div>
                </div>
                <hr/>
                <CompleteCard order={order}/>
                <hr/>
                <div className={s.info_block}>
                    <Image src={heart} alt='' width={desktopStore.isDesktop ? 80 : 40} className={s.icon}/>
                    <div>
                        В ближайшее время мы свяжемся с вами, сообщим все детали и ответим на любые вопросы!<br/><br/>
                    </div>
                    <div>
                        Благодарим вас за выбор нашего сервиса и доверие к Les-Jours!
                    </div>
                    <div>
                        Ответы на большинство вопросов вы всегда можете найти
                        здесь: <Link href="/faq" className={s.link}>FAQ</Link>
                    </div>
                    <div>
                        Если у вас остались вопросы, обращайтесь в <span className={s.link} onClick={toggleContact}>службу поддержки</span>
                    </div>
                </div>
            </div>
            <ContactModal isOpen={contactOpen} handleClose={closeContact}/>
        </MainLayout>
    );
};

export default observer(Complete);