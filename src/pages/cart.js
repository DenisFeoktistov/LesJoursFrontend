import React, {useContext, useEffect, useState} from 'react';
import s from '@/styles/Cart.module.css'
import MainLayout from "@/layout/MainLayout";
import CartItem from "@/components/pages/cart/CartItem/CartItem";
import {useRouter} from "next/router";
import {parse} from "cookie";
import {fetchCart, fetchCartPrice, fetchProductUnits} from "@/http/cartApi";
import {Context} from "@/context/AppWrapper";
import AuthModal from "@/components/shared/AuthModal/AuthModal";
import PromoInput from "@/components/pages/cart/PromoInput/PromoInput";
import jwtDecode from "jwt-decode";
import {observer} from "mobx-react-lite";
import Cookies from "js-cookie";
import Head from "next/head";
import Link from "next/link";
import {fetchLastSeen2} from "@/http/userApi";
import how from "@/static/icons/question-circle.svg";
import TextModal from "@/components/shared/UI/TextModal/TextModal";
import Image from "next/image";
import LoyaltyFAQ from "@/components/pages/account/LoyaltyFAQ/LoyaltyFAQ";
import headphones from "@/static/icons/headphones-circle.svg";
import tgBlack from "@/static/icons/tg_black.svg";
import Compilation from "@/components/shared/Compilation/Compilation";
import {fetchProductsByArray} from "@/http/productsApi";
import igBlack from "@/static/icons/igImg.svg";
import refund from "@/static/icons/arrow-return-left.svg";
import {cartStore} from "@/store/CartStore";


export const getServerSideProps = async (context) => {
    const cookies = parse(context.req.headers.cookie || '')
    const token = cookies['access_token']
    let productUnits
    let cartArr = []
    if (cookies.cart) {
        cartArr = cookies['cart'].trim().split(' ')
    }
    if (cookies['cart']) {
        const obj = {
            product_unit_list: cartArr
        }
        productUnits = await fetchProductUnits(obj, token)
    } else {
        productUnits = []
    }
    let defaultPrice
    let finalPrice
    let sale
    let totalSale
    let defaultPromo
    let isUpdate = false
    if (token) {
        const {user_id} = jwtDecode(token)
        const cart = await fetchCart(user_id, context.req.headers.cookie)
        defaultPrice = cart.total_amount
        finalPrice = cart.final_amount
        sale = cart.sale
        totalSale = cart.total_sale
        productUnits = cart.product_units
        defaultPromo = cart.promo_code ? cart.promo_code.string_representation : ''
        isUpdate = cart.is_update
    } else {
        defaultPromo = ''
        const promoStr = cookies['promo']
        if (promoStr) {
            defaultPromo = promoStr
        }
        const res = await fetchCartPrice(cartArr, defaultPromo)
        defaultPrice = res.total_amount
        finalPrice = res.final_amount
        sale = res.sale
        totalSale = res.sale
    }

    return {
        props: {
            productUnits,
            defaultPrice,
            finalPrice,
            sale,
            totalSale,
            defaultPromo,
            isUpdate
        }
    }
}
const Cart = ({
                  productUnits,
                  defaultPrice,
                  finalPrice,
                  sale,
                  totalSale,
                  defaultPromo,
                  isUpdate
              }) => {

    const router = useRouter()
    const [lastSeen, setLastSeen] = useState([])
    const {userStore, desktopStore} = useContext(Context)
    const [promo, setPromo] = useState(defaultPromo)

    const [defAmount, setDefAmount] = useState(defaultPrice)
    const [finAmount, setFinAmount] = useState(finalPrice)
    const [saleAmount, setSaleAmount] = useState(sale)
    const [totalSaleAmount, setTotalSaleAmount] = useState(totalSale)

    const [promoRes, setPromoRes] = useState(null)

    useEffect(() => {
        const token = Cookies.get('access_token')
        if (token) {
            const {user_id} = jwtDecode(token)
            fetchLastSeen2(token, user_id).then(res => setLastSeen(res))
        } else {
            let arr
            if (Cookies.get('last_seen')) {
                arr = Cookies.get('last_seen').trim().split(' ')
                if (arr[0] !== '') {
                    fetchProductsByArray(arr, token).then(res => setLastSeen(res))
                }
            }
        }
    }, [router.asPath])

    useEffect(() => {
        cartStore.setCartCnt(productUnits.length)
        setDefAmount(defaultPrice)
        setFinAmount(finalPrice)
        setSaleAmount(sale)
        setTotalSaleAmount(totalSale)

        checkPromo()

    }, [Cookies.get('cart'), productUnits, Cookies.get('promo')]);

    const checkPromo = async () => {
        const token = Cookies.get('access_token')
        let res
        // if (promo) {
        //     if (userStore.isLogged) {
        //         res = await promoAuth(promo, userStore.id, token)
        //         setFinAmount(Math.max(res.final_amount, 1))
        //         setTotalSaleAmount(Math.min(res.promo_sale + saleAmount, defAmount - 1))
        //         setPromoRes(res)
        //     } else {
        //         const cartArr = Cookies.get('cart').trim().split(' ')
        //         res = await promoUnauth(promo, cartArr)
        //
        //         setFinAmount(Math.max(res.final_amount, 1))
        //         setTotalSaleAmount(Math.min(res.promo_sale + saleAmount, defAmount - 1))
        //         setPromoRes(res)
        //     }
        // }

    }

    const sendPromo = async (e) => {
        e.preventDefault()
        checkPromo()
    }

    const [checkoutErr, setCheckoutErr] = useState('')
    const goToCheckout = () => {
        const hasUnavailable = productUnits.some(unit => unit.availability === false);
        if (hasUnavailable) {
            setCheckoutErr('Пожалуйста, удалите из корзины недоступные товары');
            return;
        }

        setCheckoutErr('')
        router.push('/order')
    }
    const [isUpdated, setIsUpdated] = useState(false)
    useEffect(() => {
        if (isUpdate) {
            setIsUpdated(true)
        }
    }, [])

    const addSpacesToNumber = (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    return (
        <MainLayout>
            <Head>
                <title>Корзина</title>
            </Head>
            <div className={s.cont + ' custom_cont'}>
                <div className={s.title_block}>
                    <h3>Корзина</h3>
                    <Link href={'/products'}
                          className={s.cart_link}
                    >Продолжить покупки</Link>
                </div>
                <div>
                    <div>
                        {!(productUnits.length) && 'Твоя корзина пуста.'}
                        {!userStore.isLogged &&
                            <div className={s.login_block}>
                                <AuthModal>
                                    <div className={s.text_underline}>Войдите или зарегистрируйтесь,&nbsp;</div>
                                </AuthModal>
                                чтобы ваша корзина сохранялась, а также получать специальные предложения и бонусы.
                            </div>
                        }
                    </div>
                    {!(productUnits.length) &&
                        <Link
                            href={'/products'}
                            className={s.shop_button}
                        >За покупками</Link>
                    }
                </div>
                {
                    productUnits.length > 0 &&
                    <div className={s.main_block}>
                        <div className={s.items_block}>
                            {
                                productUnits.slice().reverse().map((el, ind) =>
                                    <CartItem
                                        key={el?.id ?? `${Math.floor(Math.random() * 1_000_000_000)}`}
                                        name={el?.name}
                                        guestsAmount={el?.guestsAmount}
                                        date={el?.date}
                                        contacts={el?.contacts}
                                        address={el?.address}
                                        type={el.type}
                                        price={el?.totalPrice ?? 0}
                                        unitId={el?.date?.id ?? `${Math.floor(Math.random() * 1_000_000_000)}`}
                                        productId={el?.id ?? `${Math.floor(Math.random() * 1_000_000_000)}`}
                                        imgSrc={el?.bucket_link?.[0]?.url}
                                        slug={el.slug}
                                        inWL={el.in_wishlist}
                                        available={el?.availability}
                                        amount={Math.floor(el?.amount)}
                                    />
                                )
                            }
                        </div>
                        <div className={s.promos_block}>
                            <h4>Ваш заказ:</h4>


                            <div className={s.left_right}>
                                <p className={'mb-0'}>Cтоимость товаров:</p>
                                <p className={s.right_text}>{addSpacesToNumber(defAmount)}₽</p>
                            </div>

                            <PromoInput placeholder={'Введите промокод'}
                                        onChange={(e) => setPromo(e.target.value)}
                                        value={promo}
                                        onClick={(e) => sendPromo(e)}
                            />
                            {
                                promoRes &&
                                <p className={promoRes.status ? s.green_text : s.red_text}>
                                    {promoRes.message}

                                </p>
                            }
                            {

                                Number(totalSaleAmount) > 0 &&
                                <div className={s.left_right}>
                                    <p className={'mb-0'}>Скидка: </p>
                                    <p className={s.right_text}>
                                    <span
                                        className={s.bonuses}> -{addSpacesToNumber(totalSaleAmount)}₽</span></p>
                                </div>
                            }

                            <hr/>
                            <div className={s.left_right}>
                                <p className={s.big_text}>Промежуточный итог: </p>
                                <p className={s.big_text}>{addSpacesToNumber(finAmount)}₽</p>
                            </div>
                            {
                                userStore.isLogged
                                    ?
                                    <button className={s.order_btn}
                                            onClick={goToCheckout}
                                    >Перейти к оформлению заказа</button>
                                    :
                                    <AuthModal order={true} style={{width: '100%'}}>
                                        <div className={s.order_btn}
                                        >Перейти к оформлению заказа
                                        </div>
                                    </AuthModal>
                            }
                            {
                                checkoutErr &&
                                <p className={s.red_text}>
                                    {checkoutErr}
                                </p>
                            }
                            {
                                isUpdated &&
                                <p className={s.red_text}>
                                    Внимание! Ваша корзина обновилась
                                </p>
                            }
                            {desktopStore.isDesktop &&
                                <div className={s.questions_block}>
                                    <TextModal title={'Отмена записи на мастер-класс'} img={refund}>
                                        <Image src={refund} alt='' width={60}/>
                                        <h4 className={'my-3'}>Отмена записи на мастер-класс</h4>
                                        <p className={s.text}>
                                            Мы ценим Ваше время и стараемся обеспечить наилучший опыт на каждом нашем
                                            мастер-классе. Поэтому, если у Вас возникла необходимость отменить участие,
                                            пожалуйста, предупредите нас <span
                                            style={{fontWeight: 700}}>не менее чем за 3 дня</span> до запланированной
                                            даты
                                            проведения.
                                            Если отмена происходит менее чем за 3 дня до мастер-класса, стоимость
                                            участия не
                                            возвращается. Это связано с тем, что наши мастера и мы начинаем подготовку
                                            заранее:
                                            закупаем и готовим материалы, планируем рабочее место и, в случае кулинарных
                                            мастер-классов, начинаем делать заготовки на определенное количество
                                            человек, чтобы
                                            все было свежим и идеально подходило для вашего творчества.
                                        </p>
                                        <p className={s.text}>
                                            Мы благодарим Вас за понимание и ценим Ваше уважение к нашему труду!
                                        </p>
                                        <div className={s.faq_block}>
                                            <h5 className={'text-center'}>Часто задаваемые вопросы</h5>
                                            <LoyaltyFAQ title={'Почему нужно предупреждать об отмене именно за 3 дня?'}>
                                                Мы с мастерами начинаем подготовку заранее — закупаем необходимые
                                                материалы,
                                                планируем и готовим заготовки. Например, для бенто-тортов мы выпекаем
                                                коржи за
                                                день-два до мастер-класса, чтобы на занятии все было свежим и
                                                качественным.
                                            </LoyaltyFAQ>
                                            <LoyaltyFAQ
                                                title={'Если я не смогу прийти, можно ли просто перенести участие на другой день?'}>
                                                Да, при условии, что вы предупредите нас не менее чем за 3 дня. В
                                                противном
                                                случае стоимость участия не возвращается, и перенос будет невозможен.
                                            </LoyaltyFAQ>
                                            <LoyaltyFAQ title={'Могу ли я пригласить другого человека на свое место?'}>
                                                Конечно! Вы можете передать свое место другому человеку, просто сообщите
                                                нам его
                                                имя и контакты.
                                            </LoyaltyFAQ>
                                            <LoyaltyFAQ title={'Почему не вернуть деньги, если материалы остаются?'}>
                                                К сожалению, многие материалы индивидуальны и готовятся специально под
                                                каждого
                                                участника. В случае отмены за короткий срок, они уже подготовлены, и в
                                                некоторых
                                                случаях их невозможно использовать повторно.

                                            </LoyaltyFAQ>
                                            <LoyaltyFAQ
                                                title={'Как быстро вернутся деньги, если я отменил мастер-класс вовремя?'}>
                                                Возврат производится в течение 3 рабочих дней с момента получения
                                                запроса на
                                                отмену. Менеджер обязательно проконсультирует Вас.
                                            </LoyaltyFAQ>
                                        </div>
                                        <h5>Ответы на большинство вопросов вы найдете здесь: <Link href={'/faq'}
                                                                                                   className={s.link}
                                                                                                   target={'_blank'}>FAQ</Link>
                                        </h5>

                                    </TextModal>
                                    <TextModal title={'Остались вопросы?'} img={how}>
                                        <div className={s.content}>
                                            <Image src={headphones} alt='' width={60}/>
                                            <div className={s.text_cont}>
                                                <h5>Вы всегда можете написать в службу поддержки и мы будем рады вам
                                                    помочь!</h5>
                                                <div>
                                                    <div>
                                                        WhatsApp: <a href={'https://wa.me/message/79832858399'}
                                                                     target={'_blank'}
                                                                     className={s.link}>+7 983 285-83-99</a>
                                                    </div>
                                                    <div>
                                                        Telegram: <a href={'https://t.me/les_jour_mk'}
                                                                     target={'_blank'}
                                                                     className={s.link}>@les_jour_mk</a>
                                                    </div>
                                                </div>
                                                <div className={s.faq_block}>
                                                    <h5 className={'text-center'}>Часто задаваемые вопросы</h5>
                                                    <LoyaltyFAQ
                                                        title={'Нужно ли авторизовываться в аккаунт для совершения заказа?'}>
                                                        Да, для оформления заказа требуется либо войти в свой аккаунт,
                                                        либо создать новый, а также подтвердить свою почту. Благодаря
                                                        этому вы всегда сможете с легкостью отслеживать статусы заказов
                                                        в личном кабинете, а также вы точно не перепутаете указанные
                                                        данные и мы всегда сможем связаться с вами!

                                                    </LoyaltyFAQ>
                                                    <LoyaltyFAQ title={'Почему не работает промокод?'}>
                                                        Пожалуйста, убедитесь, что вы выполнили все условия для
                                                        применения промокода и время действия промокода еще не
                                                        закончилось. Зачастую промокоды выдаются на первую покупку или
                                                        на покупки от определенной суммы, проверьте, что вы вошли в
                                                        правильный аккаунт. Если вы все же считаете, что произошла
                                                        какая-то ошибка, напишите нам в службу поддержки, и мы
                                                        обязательно поможем вам разобраться в ситуации!

                                                    </LoyaltyFAQ>
                                                </div>
                                                <h5>Ответы на большинство вопросов вы найдете здесь: <Link href={'/faq'}
                                                                                                           className={s.link}>FAQ</Link>
                                                </h5>
                                                <div>
                                                    <h5>Мы в социальных сетях:</h5>
                                                    <div className={s.icons_block}>
                                                        <div className={s.socialsCont}>
                                                            <a style={{height: '45px'}}>
                                                                <Image src={igBlack} height={40} alt=""
                                                                       className={s.icon}/>
                                                            </a>
                                                            <span className={s.mainSocialsText}>
                                                  Запретграм: <br/> @les_jours
                                            </span>
                                                        </div>

                                                        <div className={s.socialsCont}>
                                                            <a href={'https://t.me/les_jours'} style={{height: '37px'}}>
                                                                <Image src={tgBlack} height={37} alt=""
                                                                       className={s.icon}/>
                                                            </a>
                                                            <span className={s.mainSocialsText}>
                                                  Телеграм: <br/>
                                                  @<a href="https://t.me/les_jours" className={s.linkTgSocials}>
                                                    les_jours
                                                  </a>
                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TextModal>
                                </div>
                            }
                        </div>
                    </div>
                }
            </div>
            {desktopStore.isDesktop && lastSeen.length > 0 && (
                <div>
                    <Compilation arr={lastSeen} title={'Ранее просмотренные'} paddings={'regular'}/>
                </div>
            )}
            {!desktopStore.isDesktop &&
                <div className={s.questions_block}>
                    <TextModal title={'Отмена записи на мастер-класс'} img={refund}>
                        <Image src={refund} alt='' width={60}/>
                        <h4 className={'my-3'}>Отмена записи на мастер-класс</h4>
                        <p className={s.text}>
                            Мы ценим Ваше время и стараемся обеспечить наилучший опыт на каждом нашем
                            мастер-классе. Поэтому, если у Вас возникла необходимость отменить участие,
                            пожалуйста, предупредите нас <span
                            style={{fontWeight: 700}}>не менее чем за 3 дня</span> до запланированной
                            даты
                            проведения.
                            Если отмена происходит менее чем за 3 дня до мастер-класса, стоимость
                            участия не
                            возвращается. Это связано с тем, что наши мастера и мы начинаем подготовку
                            заранее:
                            закупаем и готовим материалы, планируем рабочее место и, в случае кулинарных
                            мастер-классов, начинаем делать заготовки на определенное количество
                            человек, чтобы
                            все было свежим и идеально подходило для вашего творчества.
                        </p>
                        <p className={s.text}>
                            Мы благодарим Вас за понимание и ценим Ваше уважение к нашему труду!
                        </p>
                        <div className={s.faq_block}>
                            <h5 className={'text-center'}>Часто задаваемые вопросы</h5>
                            <LoyaltyFAQ title={'Почему нужно предупреждать об отмене именно за 3 дня?'}>
                                Мы с мастерами начинаем подготовку заранее — закупаем необходимые
                                материалы,
                                планируем и готовим заготовки. Например, для бенто-тортов мы выпекаем
                                коржи за
                                день-два до мастер-класса, чтобы на занятии все было свежим и
                                качественным.
                            </LoyaltyFAQ>
                            <LoyaltyFAQ
                                title={'Если я не смогу прийти, можно ли просто перенести участие на другой день?'}>
                                Да, при условии, что вы предупредите нас не менее чем за 3 дня. В
                                противном
                                случае стоимость участия не возвращается, и перенос будет невозможен.
                            </LoyaltyFAQ>
                            <LoyaltyFAQ title={'Могу ли я пригласить другого человека на свое место?'}>
                                Конечно! Вы можете передать свое место другому человеку, просто сообщите
                                нам его
                                имя и контакты.
                            </LoyaltyFAQ>
                            <LoyaltyFAQ title={'Почему не вернуть деньги, если материалы остаются?'}>
                                К сожалению, многие материалы индивидуальны и готовятся специально под
                                каждого
                                участника. В случае отмены за короткий срок, они уже подготовлены, и в
                                некоторых
                                случаях их невозможно использовать повторно.

                            </LoyaltyFAQ>
                            <LoyaltyFAQ
                                title={'Как быстро вернутся деньги, если я отменил мастер-класс вовремя?'}>
                                Возврат производится в течение 3 рабочих дней с момента получения
                                запроса на
                                отмену. Менеджер обязательно проконсультирует Вас.
                            </LoyaltyFAQ>
                        </div>
                        <h5>Ответы на большинство вопросов вы найдете здесь: <Link href={'/faq'}
                                                                                   className={s.link}
                                                                                   target={'_blank'}>FAQ</Link>
                        </h5>

                    </TextModal>
                    <TextModal title={'Остались вопросы?'} img={how}>
                        <div className={s.content}>
                            <Image src={headphones} alt='' width={60}/>
                            <div className={s.text_cont}>
                                <h5>Вы всегда можете написать в службу поддержки и мы будем рады вам
                                    помочь!</h5>
                                <div>
                                    <div>
                                        WhatsApp: <a href={'https://wa.me/message/79832858399'}
                                                     target={'_blank'}
                                                     className={s.link}>+7 983 285-83-99</a>
                                    </div>
                                    <div>
                                        Telegram: <a href={'https://t.me/les_jour_mk'}
                                                     target={'_blank'}
                                                     className={s.link}>@les_jour_mk</a>
                                    </div>
                                </div>
                                <div className={s.faq_block}>
                                    <h5 className={'text-center'}>Часто задаваемые вопросы</h5>
                                    <LoyaltyFAQ
                                        title={'Нужно ли авторизовываться в аккаунт для совершения заказа?'}>
                                        Да, для оформления заказа требуется либо войти в свой аккаунт,
                                        либо создать новый, а также подтвердить свою почту. Благодаря
                                        этому вы всегда сможете с легкостью отслеживать статусы заказов
                                        в личном кабинете, а также вы точно не перепутаете указанные
                                        данные и мы всегда сможем связаться с вами!

                                    </LoyaltyFAQ>
                                    <LoyaltyFAQ title={'Почему не работает промокод?'}>
                                        Пожалуйста, убедитесь, что вы выполнили все условия для
                                        применения промокода и время действия промокода еще не
                                        закончилось. Зачастую промокоды выдаются на первую покупку или
                                        на покупки от определенной суммы, проверьте, что вы вошли в
                                        правильный аккаунт. Если вы все же считаете, что произошла
                                        какая-то ошибка, напишите нам в службу поддержки, и мы
                                        обязательно поможем вам разобраться в ситуации!

                                    </LoyaltyFAQ>
                                </div>
                                <h5>Ответы на большинство вопросов вы найдете здесь: <Link href={'/faq'}
                                                                                           className={s.link}>FAQ</Link>
                                </h5>
                                <div>
                                    <h5>Мы в социальных сетях:</h5>
                                    <div className={s.icons_block}>
                                        <div className={s.socialsCont}>
                                            <a style={{height: '45px'}}>
                                                <Image src={igBlack} height={40} alt=""
                                                       className={s.icon}/>
                                            </a>
                                            <span className={s.mainSocialsText}>
                                                  Запретграм: <br/> @les_jours
                                            </span>
                                        </div>

                                        <div className={s.socialsCont}>
                                            <a href={'https://t.me/les_jours'} style={{height: '37px'}}>
                                                <Image src={tgBlack} height={37} alt=""
                                                       className={s.icon}/>
                                            </a>
                                            <span className={s.mainSocialsText}>
                                                  Телеграм: <br/>
                                                  @<a href="https://t.me/les_jours" className={s.linkTgSocials}>
                                                    les_jours
                                                  </a>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TextModal>
                </div>

            }

            {!desktopStore.isDesktop && lastSeen.length > 0 && (
                <div className={s.cont + ' custom_cont'}>
                    <Compilation arr={lastSeen} title={'Ранее просмотренные'}/>

                </div>
            )}


        </MainLayout>
    );
};

export default observer(Cart);