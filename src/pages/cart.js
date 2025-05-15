import React, {useContext, useEffect, useState} from 'react';
import s from '@/styles/Cart.module.css'
import MainLayout from "@/layout/MainLayout";
import CartItem from "@/components/pages/cart/CartItem/CartItem";
import {useRouter} from "next/router";
import {parse} from "cookie";
import {fetchCart, fetchCartPrice, fetchProductUnits, promoAuth, promoUnauth, updateCart2} from "@/http/cartApi";
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
import change from "@/static/icons/arrow-down-up.svg";
import gift from "@/static/icons/gift.svg";
import TextModal from "@/components/shared/UI/TextModal/TextModal";
import gift_gard from '@/static/icons/gift-gard.svg'
import smile from '@/static/icons/emoji-smile 1.svg'
import first from '@/static/icons/first.svg'
import good from '@/static/icons/good.svg'
import friend from '@/static/icons/friend.svg'
import birth from '@/static/icons/happybirthday.svg'
import Image from "next/image";
import LoyaltyFAQ from "@/components/pages/account/LoyaltyFAQ/LoyaltyFAQ";
import headphones from "@/static/icons/headphones-circle.svg";
import tgBlack from "@/static/icons/tg_black.svg";
import map from '@/static/img/map.jpg'
import Compilation from "@/components/shared/Compilation/Compilation";
import {fetchProductsByArray} from "@/http/productsApi";
import igBlack from "@/static/icons/igImg.svg";
import refund from "@/static/icons/arrow-return-left.svg";


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
        productUnits = await fetchProductUnits(JSON.stringify(obj), token)
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
        productUnits = cart.productUnits
        defaultPromo = cart.promo_code ? cart.promo_code.string_representation : ''
        isUpdate = cart.isUpdate
    } else {
        defaultPromo = ''
        const promoStr = cookies['promo']
        if (promoStr) {
            defaultPromo = promoStr
        }
        const res = await fetchCartPrice(cartArr, promoStr)
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
    const {userStore, cartStore, desktopStore} = useContext(Context)
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

    // Надо потестить промики как работают
    // useEffect(() => {
    //     cartStore.setCartCnt(productUnits.length)
    //     setDefAmount(defaultPrice)
    //     setFinAmount(finalPrice)
    //     setSaleAmount(sale)
    //     setTotalSaleAmount(totalSale)
    //
    //     checkPromo()
    //
    // }, [Cookies.get('cart'), productUnits, Cookies.get('promo')]);

    const checkPromo = async () => {
        const token = Cookies.get('access_token')
        let res
        if (promo) {
            if (userStore.isLogged) {
                res = await promoAuth(promo, userStore.id, token)
                setFinAmount(Math.max(res.final_amount, 1))
                setTotalSaleAmount(Math.min(res.promo_sale + saleAmount, defAmount - 1))
                setPromoRes(res)
            } else {
                const cartArr = Cookies.get('cart').trim().split(' ')
                res = await promoUnauth(promo, cartArr)

                setFinAmount(Math.max(res.final_amount, 1))
                setTotalSaleAmount(Math.min(res.promo_sale + saleAmount, defAmount - 1))
                setPromoRes(res)
            }
        }

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

    const tempCartProductUnits = [
        {
            "id": 1544,
            "name": "Бенто-торт",
            "in_wishlist": false,
            "availability": false,
            "bucket_link": [
                {
                    "url": "https://storage.yandexcloud.net/les-jours-bucket/PavelContainer.png"
                }
            ],
            "slug": "vans-old-skool-blackwhite-43719",
            "guestsAmount": 2,
            "totalPrice": 7800,
            "date": {
                "id": 121312312,
                "start_datetime": "2024-04-01T14:00:00Z",
                "end_datetime": "2024-04-01T16:00:00Z"
            },
            "address": "Кремлевский дворец",
            "contacts": "+7 (007) МММ 77-77",
            "type": "master_class"
        },
        {
            "type": "certificate",
            "amount": "5000"
        }
    ]

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
                                        unitId={el.id}
                                        productId={el.product.id}
                                        slug={el.product.slug}
                                        inWL={el.product.in_wishlist}

                                        product={el.product}
                                        key={el.id}

                                        name={tempCartProductUnits[0]?.name}
                                        guestsAmount={tempCartProductUnits[0]?.guestsAmount}
                                        date={tempCartProductUnits[0]?.date}
                                        contacts={tempCartProductUnits[0]?.contacts}
                                        address={tempCartProductUnits[0]?.address}
                                        type={tempCartProductUnits[0].type}
                                        price={tempCartProductUnits[0]?.totalPrice ?? 0}
                                        // unitId={tempCartProductUnits[0]?.date?.id}
                                        // productId={tempCartProductUnits[0].id}
                                        imgSrc={tempCartProductUnits[0]?.bucket_link?.[0]?.url}
                                        // slug={tempCartProductUnits[0].slug}
                                        // inWL={tempCartProductUnits[0].in_wishlist}
                                        available={tempCartProductUnits[0]?.availability}
                                        amount={tempCartProductUnits[0]?.amount}
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
                    <TextModal title={'Почему изменилась цена или модель оказалась распроданной?'} img={change}>
                        <Image src={change} alt='' width={60}/>
                        <h4 className={'my-3'}>Почему изменилась цена или модель оказалась распроданной?</h4>
                        <div className={s.img_cont}>
                            <Image src={map} alt='' className={s.img} fill={true}/>
                        </div>
                        <p className={s.text}>
                            Многие представленные модели являются лимитированными и находятся в наличии в ограниченном
                            количестве, поэтому может произойти такое, что кто-то другой купит эту позицию и данное
                            ценовое предложение перестанет быть доступным. Мы собираем десятки миллионов предложений со
                            всего мира, поэтому даже в короткие промежутки времени цена может меняться. В том числе на
                            цену могут сказываться прочие внешние факторы, не зависящие от нас, такие как курс,
                            стоимость доставки и многое другое.

                        </p>
                        <div className={s.faq_block}>
                            <h5 className={'text-center'}>Часто задаваемые вопросы</h5>
                            <LoyaltyFAQ title={'После чего цена меняться не будет?'}>
                                После того, как вы оформите заказ, цена для вас будет зафиксирована и никаким изменениям
                                не подлежит. Добавление товара в корзину или избранное, к сожалению, не позволяет нам
                                зафиксировать цену по объективным причинам. Мы стараемся в каждый момент времени
                                предлагать вам наилучшую цену из возможных и делать ваш шопинг с нами еще более удобным
                                и выгодным, поэтому не откладывайте ваши покупки на потом, чтобы не упустить приятные
                                цены!

                            </LoyaltyFAQ>
                            <LoyaltyFAQ title={'Как часто могут меняться цены?'}>
                                Цена может не меняться как на протяжении долгого времени, так и постоянно оставаться
                                волатильной. Она может как повыситься, так и понизиться. Вскоре мы добавим возможность
                                следить за изменением цен, а также получать уведомления о появлении более выгодного
                                предложения на интересующий вас лот!

                            </LoyaltyFAQ>
                            <LoyaltyFAQ title={'Почему модель оказалась распроданной?'}>
                                Так как многие размещенные на нашей платформе лоты являются коллекционными и редкими,
                                может произойти такое, что какой-то конкретный размер или вся модель пропадет из
                                наличия, поэтому не откладывайте свои покупки, чтобы успеть приобрести желанную модель!

                            </LoyaltyFAQ>
                        </div>
                        <h5>Ответы на большинство вопросов вы найдете здесь: <Link href={'/faq'} className={s.link}
                                                                                   target={'_blank'}>FAQ</Link></h5>
                    </TextModal>
                    <TextModal title={'Бонусы'} img={gift}>
                        <Image src={gift_gard} alt='' width={80}/>
                        <h4 className={'my-3'}>Получайте бонусы</h4>
                        <div className={'d-flex justify-content-evenly'}>
                            <div className={s.point_block}>
                                <Image src={first} alt='' width={60}/>
                                <div>за первый заказ</div>
                                <div className={s.line}/>
                                1000 ₽
                            </div>
                            <div className={s.point_block}>
                                <Image src={good} alt='' width={60}/>
                                <div>за каждый товар</div>
                                <div className={s.line}/>
                                до 1500 ₽
                            </div>
                        </div>
                        <div className={'d-flex justify-content-evenly'}>
                            <div className={s.point_block}>
                                <Image src={friend} alt='' width={60}/>
                                <div>за приглашенного друга</div>
                                <div className={s.line}/>
                                до 3000 ₽
                            </div>
                            <div className={s.point_block}>
                                <Image src={birth} alt='' width={60}/>
                                <div>на день рождения</div>
                                <div className={s.line}/>
                                1000 ₽
                            </div>
                        </div>
                        <div className={'d-block'}>
                            <Image src={smile} alt='' width={60}/>
                            <div className={'my-3'}>И оплачивайте ими 100% от стоимости заказа!</div>
                        </div>
                        <p className={s.text}>
                            Мы стараемся всячески благодарить вас за покупки на платформе SELLOUT, поэтому за каждую
                            совершенную покупку мы будем начислять вам бонусы в соответствии с вашим статусом.
                            Конкретное число бонусов за каждый товар вы сможете увидеть на странице товара, а также в
                            корзине. Также мы дарим 1000 бонусных рублей за первую покупку и на ваш день рождения и
                            регулярно начисляем бонусы в честь различных праздников!

                        </p>
                        <div className={s.faq_block}>
                            <h5 className={'text-center'}>Часто задаваемые вопросы</h5>
                            <LoyaltyFAQ title={'Чему равны бонусы?'}>
                                Каждый один бонус приравнивается к одному рублю! Вы можете оплачивать до 100% заказа,
                                тем самым сводя стоимость заказа к нулю!

                            </LoyaltyFAQ>
                            <LoyaltyFAQ title={'Как воспользоваться бонусами?'}>
                                Чтобы оплатить заказ целиком или частично бонусами, в корзине или на любом этапе
                                оформления заказа введите количество бонусов, которое хотите списать, и скидка будет
                                автоматически применена!
                            </LoyaltyFAQ>
                            <LoyaltyFAQ title={'Как быстро после совершения покупки начисляются бонусы?'}>
                                Обратите внимание, бонусы на ваш баланс будут начислены не сразу, а по прошествии
                                некоторого времени. Нам требуется обработать заказ, подтвердить корректность всех данных
                                и после этого начислить бонусы. Если вы считаете, что бонусы слишком долго не
                                начисляются и произошла какая-то ошибка, обязательно напишите нам и мы вам поможем!

                            </LoyaltyFAQ>
                            <LoyaltyFAQ title={'Как получить бонусы по реферальной программе, приглашая друзей?'}>
                                Реферальная программа - это специальная возможность для вас поделиться удовлетворением
                                от покупок с друзьями и получить взамен уникальные бонусы размером до 7000₽! Просто
                                пригласите своих знакомых стать частью нашего сообщества, и вы оба сможете наслаждаться
                                эксклюзивными преимуществами, такими как скидки и бонусы, созданными специально для
                                участников нашей реферальной программы. Благодарим за доверие и ваш вклад в наше
                                расширяющееся сообщество! Подробнее про реферальную программу
                                смотрите <Link href={'/faq'} style={{color: 'inherit'}}>здесь</Link>
                            </LoyaltyFAQ>
                        </div>

                        <div className={s.faq_block}>
                            <h5 className={`text-center ${s.questions_text}`}>Ответы на большинство вопросов
                                вы найдете здесь: <Link href={'/faq'} className={'text-black'}
                                                        target={'_blank'}>FAQ</Link></h5>
                            <h5 className={`text-center ${s.questions_text}`}>Если у вас остались вопросы, вы всегда
                                можете обратиться в службу поддержки и мы будем
                                рады вам помочь!</h5>
                        </div>
                    </TextModal>
                    <TextModal title={'Остались вопросы?'} img={how}>
                        <div className={s.content}>
                            <Image src={headphones} alt='' width={60}/>
                            <div className={s.text_cont}>
                                <h5>Вы всегда можете написать в службу поддержки, и мы будем рады вам помочь!</h5>
                                <div>
                                    <div>
                                        Почта: <a href={'mailto:customerservice@sellout.su'}
                                                  className={s.link}>customerservice@sellout.su</a>
                                    </div>
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
                                    <LoyaltyFAQ title={'Нужно ли авторизовываться в аккаунт для совершения заказа?'}>
                                        Да, для оформления заказа требуется либо войти в свой аккаунт, либо создать
                                        новый, а также подтвердить свою почту. Благодаря этому вы всегда сможете с
                                        легкостью отслеживать статусы заказов в личном кабинете, а также вы точно не
                                        перепутаете указанные данные и мы всегда сможем связаться с вами!

                                    </LoyaltyFAQ>
                                    <LoyaltyFAQ title={'Почему не работает промокод?'}>
                                        Пожалуйста, убедитесь, что вы выполнили все условия для применения промокода и
                                        время действия промокода еще не закончилось. Зачастую промокоды выдаются на
                                        первую покупку или на покупки от определенной суммы, проверьте, что вы вошли в
                                        правильный аккаунт. Если вы все же считаете, что произошла какая-то ошибка,
                                        напишите нам в службу поддержки, и мы обязательно поможем вам разобраться в
                                        ситуации!

                                    </LoyaltyFAQ>
                                </div>
                                <h5>Ответы на большинство вопросов вы найдете здесь: <Link href={'/faq'}
                                                                                           className={s.link}
                                                                                           target={'_blank'}>FAQ</Link>
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
                                                  Запретграм: <br/> @sellout_platform
                                            </span>
                                        </div>

                                        <div className={s.socialsCont}>
                                            <a href={'https://t.me/selloutsu'} style={{height: '37px'}}>
                                                <Image src={tgBlack} height={37} alt=""
                                                       className={s.icon}/>
                                            </a>
                                            <span className={s.mainSocialsText}>
                                                  Телеграм: <br/>
                                                  @<a href="https://t.me/selloutsu" className={s.linkTgSocials}>
                                                    selloutsu
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