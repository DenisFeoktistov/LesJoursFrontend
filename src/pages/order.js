import React, {useContext, useRef, useState} from 'react';
import s from '@/styles/Order.module.css'
import {observer} from "mobx-react-lite";
import {Context} from "@/context/AppWrapper";
import Stage1 from "@/components/pages/order/Stage1/Stage1";
import MainLayout from "@/layout/MainLayout";
import Cookies from "js-cookie";
import {useRouter} from "next/router";
import Head from "next/head";
import {checkoutOrder} from "@/http/orderApi";
import Image from "next/image";
import heart from "@/static/icons/circle_heart.svg";
import {desktopStore} from "@/store/DesktopStore";
import ContactModal from "@/components/shared/ContactModal/ContactModal";
import jwtDecode from "jwt-decode";
import {fetchCart} from "@/http/cartApi";
import {fetchUserInfo} from "@/http/userApi";
import {parse} from "cookie";

export const getServerSideProps = async (context) => {
    const cookies = parse(context.req.headers.cookie || '')
    const token = cookies['access_token']
    const {user_id} = jwtDecode(token)
    const cart = await fetchCart(user_id, context.req.headers.cookie)
    const defaultPrice = cart.total_amount
    const finalPrice = cart.final_amount
    const sale = cart.total_sale

    // Временное решение
    const skipPayment = true
    const userData = await fetchUserInfo(context.req.headers.cookie, user_id)

    return {
        props: {
            defaultPrice,
            finalPrice,
            sale,
            userData,
            skipPayment
        }
    }
}
const Order = ({
                   defaultPrice,
                   finalPrice,
                   sale,
                   userData,
                   skipPayment
               }) => {
    console.log(defaultPrice)
    console.log(finalPrice)
    console.log(sale)
    console.log(userData)
    console.log(skipPayment)


    const router = useRouter()
    const {orderStore, userStore} = useContext(Context)
    const [defAmount, setDefAmount] = useState(defaultPrice)
    const [finAmount, setFinAmount] = useState(finalPrice)
    const [saleAmount, setSaleAmount] = useState(sale)
    const [isSkipPayment, setIsSkipPayment] = useState(skipPayment)

    const renderStage = () => {
        const stage = orderStore.stage
        if (stage === 1) {
            return <Stage1 userData={userData}/>
        }
    }

    const calculateFinalPrice = () => {
        return finAmount
    }


    const [fillAll, setFillAll] = useState(false)
    const [order, setOrder] = useState({})
    const checkoutRef = useRef(null)
    const checkout = async () => {
        const orderObj = {
            email: orderStore.email,
            phone: orderStore.phone,
            surname: orderStore.surname,
            name: orderStore.name,
            patronymic: orderStore.patronymic,
            comment: orderStore.comment,
            telegram: orderStore.telegram
        }


        const validate = () => {
            setFillAll(false)
            if (!orderObj.name || !orderObj.surname || !orderObj.email || !orderObj.phone || !orderObj.telegram) {
                setFillAll(true)
                return null
            }
            return true
        }


        if (!validate()) {
            return null
        }

        const token = Cookies.get('access_token')
        const id = userStore.id

        console.log(orderObj)

        const checkout = await checkoutOrder(orderObj, id, token).catch()
        console.log(checkout)
        Cookies.set('cart', '', {expires: 2772})
        Cookies.set('promo', '', {expires: 2772})
        const invoiceStr = JSON.stringify(checkout.invoice_data)
        checkout.invoice_data = invoiceStr
        setOrder(checkout)
        if (!isSkipPayment) {
            setTimeout(() => {
                checkoutRef.current.submit()
            }, 100)
        } else {
            router.push(`/order/complete?id=${checkout.id}`)
        }
    }

    const addSpacesToNumber = (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
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
                <title>Оформление заказа</title>
            </Head>
            <div className={s.cont + ' custom_cont'}>
                <div className={s.section}>
                    <div className={s.main_block}>
                        {renderStage()}
                    </div>
                    <div className={s.promos_block}>
                        <h4>Ваш заказ:</h4>
                        <div className={s.left_right}>
                            <p className={'mb-0'}> Cтоимость товаров:</p>
                            <p className={s.right_text}>{addSpacesToNumber(defAmount)}₽</p>
                        </div>

                        {

                            Number(saleAmount) > 0 &&
                            <div className={s.left_right}>
                                <p className={'mb-0'}>Скидка: </p>
                                <p className={s.right_text}>
                                    <span
                                        className={s.bonuses}> -{addSpacesToNumber(saleAmount)}₽</span></p>
                            </div>
                        }

                        <hr/>
                        <div className={s.left_right}>
                            <p className={s.big_text}>Итого: </p>
                            <p className={s.big_text}>{addSpacesToNumber(calculateFinalPrice())} ₽</p></div>

                        <form method="POST" action="https://les-jours.ru/api/order/payment" id="payment-form"
                              ref={checkoutRef}>
                            <input type="hidden" name="sum" value={String(order.final_amount)}/>
                            <input type="hidden" name="clientid" value={order.surname + " " + order.name}/>
                            <input type="hidden" name="orderid" value={order.number?.toString()}/>
                            <input type="hidden" name="service_name" value={`Заказ №${order.number?.toString()}`}/>
                            <input type="hidden" name="client_email" value={order.email}/>
                            <input type="hidden" name="client_phone" value={order.phone_int}/>
                            <input type="hidden" name="pstype" value='sbp_default'/>
                            <input type="hidden" name="json" value='true'/>
                            <input type="hidden" name="user_result_callback"
                                   value={`https://les-jours.ru/api/order/fact_of_payment?id=${order.id}`}/>
                            <input type="hidden" name="cart" value={order.invoice_data}/>
                        </form>


                        <button className={s.order_btn} onClick={checkout}>
                            {
                                (!isSkipPayment)
                                    ?
                                    'Перейти к оплате'
                                    :
                                    'Оформить заказ'
                            }
                        </button>

                        {fillAll &&
                            <p className={'red_text'}>Заполните все поля</p>
                        }

                        {!desktopStore.isDesktop &&
                            <div>
                                <br/>

                                <div className={'d-flex justify-content-center'}>
                                    <Image src={heart} alt='' width={85}/>
                                </div>
                                <p className={'text-center mt-2'}>
                                    Мы готовы сформировать для вас индивидуальные условия отправления,
                                    поэтому вы всегда можете написать нам в <span
                                    style={{color: 'black', textDecoration: 'underline', cursor: 'pointer'}}
                                    onClick={toggleContact}>службу поддержку</span> свой запрос и мы обязательно вам
                                    поможем!
                                </p>
                                <ContactModal isOpen={contactOpen} handleClose={closeContact}/>

                            </div>}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default observer(Order);