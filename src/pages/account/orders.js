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