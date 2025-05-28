import React, {useContext, useEffect, useRef, useState} from 'react';
import s from '@/styles/OneProductPage.module.css'
import refund from '@/static/icons/arrow-return-left.svg'
import returnImg from '@/static/icons/arrow-return-left.svg'
import like from '@/static/icons/heart.svg'
import like_fill from '@/static/icons/heart-fill.svg'
import SizeChoice from "@/components/pages/oneProduct/SizeChoice/SizeChoice";
import Arrow from "@/components/shared/UI/Arrow/Arrow";
import Image from 'next/image'
import {fetchOneProduct, fetchProductsByArray, fetchProductsPage} from "@/http/productsApi";
import MainLayout from "@/layout/MainLayout";
import {Context} from "@/context/AppWrapper";
import {observer} from "mobx-react-lite";
import AuthModal from "@/components/shared/AuthModal/AuthModal";
import Cookies from "js-cookie";
import {addToWishlist, removeFromWishlist} from "@/http/wishlistAPI";
import {parse} from "cookie";
import {addToCart} from "@/http/cartApi";
import {addLastSeen, fetchLastSeen2, fetchUserInfo} from "@/http/userApi";
import jwtDecode from "jwt-decode";
import Link from "next/link";
import Compilation from "@/components/shared/Compilation/Compilation";
import '@splidejs/react-splide/css'
import Head from "next/head";
import how from '@/static/icons/question-circle.svg'
import payment from '@/static/icons/credit-card.svg'
import {useRouter} from "next/router";
import LoyaltyFAQ from "@/components/pages/account/LoyaltyFAQ/LoyaltyFAQ";
import headphones from "@/static/icons/headphones-circle.svg";
import ImgSlider from "@/components/pages/oneProduct/ImgSlider/ImgSlider";
import StarRating from "@/components/shared/StarRating/StarRating";
import * as PropTypes from "prop-types";
import Notification from "@/components/shared/Notification/Notification";
import TextModalDesktopProductPage
    from "@/components/shared/UI/TextModalDesktopProductPage/TextModalDesktopProductPage";
import igBlack from "@/static/icons/igImg.svg";
import tgBlack from "@/static/icons/tg_black.svg";
import arrow from "@/static/icons/chevron-right-grey.svg";
import ProductPageMobileInfoModal from "@/components/shared/ProductPageMobileInfoModal/ProductPageMobileInfoModal";

export const getServerSideProps = async (context) => {
    const cookies = parse(context.req.headers.cookie || '');
    const token = cookies['access_token'];

    // Получение IP-адреса пользователя из заголовка X-Forwarded-For
    const ip = context.req.headers['x-forwarded-for'] || context.req.connection.remoteAddress;


    const product = await fetchOneProduct(context.params.slug, token, ip);
    if (product === "Товар не найден") {
        return {
            notFound: true, // Это устанавливает статус код 404
        };
    }

    const events = product.events

    // const events = await fetchOneProductEvents(context.params.slug, token, ip);
    // product.events = events

    let userData = {}
    if (token) {
        const {user_id} = jwtDecode(token)
        userData = await fetchUserInfo(context.req.headers.cookie, user_id)
    }

    return {props: {product, events, userData}};
};


StarRating.propTypes = {rating: PropTypes.number};
const OneProductPage = ({product, events, userData}) => {
    const router = useRouter()
    const [moreOpen, setMoreOpen] = useState(false)
    const [notification, setNotification] = useState(null);

    const [similarProducts, setSimilarProducts] = useState([])
    const [lastSeen, setLastSeen] = useState([])

    const {productStore, userStore, cartStore, desktopStore} = useContext(Context)

    useEffect(() => {
        productStore.clearAll()
        if (events.length === 1) {
            productStore.setSizeChosen(events[0])
            const arr = Cookies.get('cart').trim().split(' ')
            productStore.setText(arr, productStore.sizeChosen.id)
        }
    }, [router.asPath])

    useEffect(() => {
        const token = Cookies.get('access_token')
        const fetchData = async () => {
            const token = Cookies.get('access_token')
            const url = {}

            function shuffleArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }

            let data_products = await fetchProductsPage(url, token);
            data_products = shuffleArray(data_products.results).slice(0, 10);
            setSimilarProducts(data_products);

        };
        fetchData();


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

    const renderParams = () => {
        const res = []
        const paramsObj = product.parameters
        const order = paramsObj.parameters_order
        if (order) {
            const params = {}
            for (const param of order) {
                if (param in product.parameters.parameters) {
                    params[param] = paramsObj.parameters[param]
                }
            }

            for (const key in params) {
                res.push(
                    <p className={s.characteristics}>{key}:
                        <span className={s.characteristics_text}>{params[key].join(', ')}</span>
                    </p>
                )
            }
        } else {
            for (const key in paramsObj) {
                res.push(
                    <p className={s.characteristics}>{key}:
                        <span className={s.characteristics_text}>{paramsObj[key].join(', ')}</span>
                    </p>
                )
            }
        }
        return res
    }

    const renderInfo = () => {
        const res = []
        const infoList = product.details
        for (let info of infoList) {
            res.push(
                <p className={s.details}>
                    🎀{info}
                </p>
            )
        }
        return res
    }


    const [isInWishlist, setIsInWishlist] = useState(product.in_wishlist)
    useEffect(() => {
        setIsInWishlist(product.in_wishlist)
    }, [router.asPath])


    const addToWL = async () => {
        setIsInWishlist(true)
        const token = Cookies.get('access_token')
        const userId = userStore.id
        const data = await addToWishlist(userId, product.id, token)
    }
    const deleteFromWL = async () => {
        setIsInWishlist(false)
        const token = Cookies.get('access_token')
        const userId = userStore.id
        const data = await removeFromWishlist(userId, product.id, token)
    }

    const cartAdd = async () => {
        let cart = Cookies.get('cart')
        Cookies.set('cart', cart + ' ' + productStore.sizeChosen.id + '_' + productStore.guestCounts + '_guests', {expires: 2772})
        const arr = Cookies.get('cart').trim().split(' ')
        productStore.setText(arr, productStore.sizeChosen.id)

        if (userStore.isLogged) {
            const token = Cookies.get('access_token')
            const userId = userStore.id
            const data = await addToCart(userId, productStore.sizeChosen.id, productStore.guestCounts, token)
        }

        cartStore.setCartCnt(cartStore.cartCnt + 1)
    }

    useEffect(() => {
        if (userStore.isLogged) {
            const token = Cookies.get('access_token')
            const userId = userStore.id
            addLastSeen(token, userId, product.id)
        }
        if (!Cookies.get('last_seen')) {
            Cookies.set('last_seen', '', {expires: 2772})
        }
        let currArr = Cookies.get('last_seen').trim().split(' ')
        const id = String(product.id)
        if (currArr.includes(id)) {
            let ind = currArr.indexOf(id)
            currArr.splice(ind, 1)
        } else {
            if (currArr.length > 7) {
                currArr.pop()
            }
        }
        currArr.unshift(id)
        const newStr = currArr.join(' ')
        Cookies.set('last_seen', newStr, {expires: 2772})
    }, [router.asPath])

    const toggle_more_open = () => {
        if (moreOpen) {
            setMoreOpen(true)
        }
        setMoreOpen(!moreOpen)
    }

    const [contentHeight, setContentHeight] = useState(desktopStore.isDesktop ? '145px' : "250px");
    const contentRef = useRef(null);
    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(moreOpen ? contentRef.current.scrollHeight + "px" : desktopStore.isDesktop ? '145px' : "250px");
            setTimeout(() => {
                setContentHeight(moreOpen ? contentRef.current.scrollHeight + "px" : desktopStore.isDesktop ? '145px' : "250px");
            }, 400)

        }
    }, [moreOpen]);
    const [infoBtn, setInfoBtn] = useState(true)
    const [fadeOutInvisible, setFadeOutInvisible] = useState(false)

    useEffect(() => {
        setMoreOpen(false)
        if (contentRef && contentRef.current && contentRef.current.clientHeight > 144) {
            setInfoBtn(true)
        } else {
            setInfoBtn(false)
            setFadeOutInvisible(true);
        }
    }, [router.asPath])

    const [infoOpen, setInfoOpen] = useState(false)
    const toggleInfoModal = () => {
        setInfoOpen(!infoOpen)
    }
    const closeInfoModal = () => {
        setInfoOpen(false)
    }
    const addSpacesToNumber = (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    const renderParametersForMobBlock = () => {
        const params = [];

        // Получаем остальные параметры
        const paramsObj = product.parameters;
        const order = paramsObj.parameters_order;

        if (order) {
            // Идем по порядку из order
            for (const param of order) {
                if (param in paramsObj.parameters) {
                    const value = paramsObj.parameters[param].join(', ');
                    params.push(
                        <div className={s.parameter} key={param}>
                            <div className={s.parameterName}>{param}</div>
                            <div className={s.parameterValue}>{value}</div>
                        </div>
                    );
                    params.push(<div className={s.verticalLine} key={`${param}-line`}></div>);
                }
            }
        } else {
            // Идем по всем параметрам, если порядок не указан
            for (const key in paramsObj.parameters) {
                const value = paramsObj.parameters[key].join(', ');
                params.push(
                    <div className={s.parameter} key={key}>
                        <div className={s.parameterName}>{key}</div>
                        <div className={s.parameterValue}>{value}</div>
                    </div>
                );
                params.push(<div className={s.verticalLine} key={`${key}-line`}></div>);
            }
        }

        // Убираем последнюю вертикальную линию, если есть параметры
        if (params.length > 0 && params[params.length - 1].type === 'div') {
            params.pop();
        }

        return params;
    };

    const [count, setCount] = useState(1);
    const [max, setMax] = useState(0);

    useEffect(() => {
        setCount(1);
        productStore.setGuestCounts(1);
        setMax(productStore.sizeChosen.available_seats)
    }, [productStore.sizeChosen]);

    const increment = () => {
        if (count < max) {
            const newCount = count + 1;
            setCount(newCount);
            productStore.setGuestCounts(newCount);
        }
    };

    const decrement = () => {
        if (count > 1) {
            const newCount = count - 1;
            setCount(newCount);
            productStore.setGuestCounts(newCount);
        }
    };

    return (
        <MainLayout>
            <Head>
                <title>{`Посетить мастер-класс ${product.name} в Москве от Les-Jours`}</title>
                <meta property="og:image" content={product.bucket_link[0].url}/>
                <meta property="og:image:width" content="640px"/>
                <meta property="og:image:height" content="410px"/>
                <meta property="og:title"
                      content={`Посетить мастер-класс ${product.name} в Москве от Les-Jours`}/>
                <meta property="og:description"
                      content={`Посетить мастер-класс ${product.name} в Москве от Les-Jours`}/>

                <meta name={'description'}
                      content={`Посетить мастер-класс ${product.name} в Москве от Les-Jours`}/>
            </Head>
            <div className={s.container}>
                {notification && (
                    <Notification
                        message={notification}
                        onClose={() => setNotification(null)}
                    />
                )}
                <div className={s.row + ' custom_cont'} itemScope itemType="https://schema.org/Product">

                    <meta itemProp="description"
                          content={`Посетить мастер-класс ${product.name} в Москве от Les-Jours`}/>

                    <div className={s.col1}>

                        {!desktopStore.isDesktop &&
                            <div style={{position: "relative", marginTop: '10px'}}>
                                <div>
                                    <div itemProp="name">
                                        <div className={s.brand}>{product.name}</div>
                                        <div className={s.model}>{product.long_description}</div>
                                    </div>
                                    <div className={s.iconContainer}>
                                        <StarRating rating={product.score_product_page} n={product.id}/>
                                    </div>
                                </div>
                            </div>
                        }
                        {
                            product.bucket_link.length > 1
                                ?
                                <div className={s.slider}>
                                    <div className={s.photo}>
                                        <ImgSlider photos={product.bucket_link} key={router.asPath}/>
                                    </div>
                                </div>
                                :
                                <div className={s.slider}
                                >
                                    <div className={s.photo}>
                                        <Image src={product.bucket_link[0].url}
                                               itemProp="image"
                                               alt={`A`}
                                               fill={true}
                                               loading={'eager'}
                                               style={{objectFit: 'contain'}}
                                        />
                                    </div>
                                </div>

                        }
                        {!desktopStore.isDesktop &&
                            <>
                                {
                                    events.length > 0 &&
                                    <div style={{marginBottom: '30px', marginLeft: '5px'}}>
                                        <span itemProp="offers" itemScope itemType="https://schema.org/Offer"
                                              className={(product.price.start_price > product.price.final_price) ? s.price_sale : s.price_default}
                                        >
                                            <span>{addSpacesToNumber(product.price.final_price)}</span><span>₽</span>
                                            <meta itemProp="price" content={product.price.final_price}/>
                                            <meta itemProp="priceCurrency" content="RUB"/>
                                            <meta itemProp="availability" content="OnlineOnly"/>
                                        </span>
                                        {(product.price.start_price > product.price.final_price) &&
                                            <span className={s.price_default}
                                                  style={{
                                                      textDecoration: 'line-through',
                                                      fontSize: '17px'
                                                  }}> {addSpacesToNumber(product.price.start_price)} ₽
                                            </span>
                                        }
                                    </div>
                                }
                                {
                                    events.length > 0
                                        ?
                                        <SizeChoice prices={events} productId={product.id}
                                                    isDesktop={desktopStore.isDesktop}/>
                                        :
                                        <p className={s.grey_text}>Товара нет в наличии</p>
                                }
                                {
                                    productStore.sizeChosen &&
                                    <>
                                        <div className={s.wrapper}>
                                            <div className={s.wrapper2}>
                                                <span className={s.amount}>Число гостей:</span>
                                                <div className={s.selector}>
                                                    <button className={s.btn} onClick={decrement}>−</button>
                                                    <span className={s.count}>{count}</span>
                                                    <button className={s.btn} onClick={increment}>+</button>
                                                </div>
                                            </div>

                                            {desktopStore.isDesktop &&
                                                <span className={s.separator}>|</span>
                                            }
                                            <div className={s.total}>
                                                Итого: <strong>{count * product.price.final_price} ₽</strong>
                                            </div>
                                        </div>
                                    </>
                                }
                                <div className={s.btn_group}>
                                    <button className={s.cart_btn}
                                            disabled={!productStore.sizeChosen || productStore.text === 'Уже в корзине'}
                                            onClick={cartAdd}
                                    >
                                        {productStore.text}
                                    </button>
                                    {
                                        userStore.isLogged
                                            ?
                                            <button className={s.fav_btn}
                                                    onClick={() => {
                                                        isInWishlist ? deleteFromWL() : addToWL()
                                                    }}
                                            >
                                                <div className={s.icon_block} key={router.asPath}>
                                                    <Image src={isInWishlist ? like_fill : like} alt=""
                                                           style={{width: '22px', height: '22px'}}/>
                                                    {/*<div>{isInWishlist ? 'В избранном' : 'В избранное'}</div>*/}
                                                </div>
                                            </button>
                                            :
                                            <div className={s.fav_btn}>
                                                <AuthModal fromWishlist={true}>
                                                    <div className={s.icon_block}>
                                                        <Image src={like} alt="" style={{
                                                            width: '22px',
                                                            height: '22px',
                                                            marginLeft: '12px'
                                                        }}/>
                                                    </div>
                                                </AuthModal>
                                            </div>
                                    }
                                </div>
                                <hr style={{marginTop: '10px', marginBottom: '10px', color: '#d1838c', opacity: '1'}}/>
                                <div className={s.containerParamsMob} onClick={toggleInfoModal}>
                                    {/* Верхняя часть */}
                                    <div className={s.section}>
                                        <span>Оплата&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;Отмена&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;Что вас ждет?&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;Вопросы?</span>
                                    </div>
                                    {/* Линия по центру */}
                                    <div className={s.centerLine}></div>
                                    {/* Нижняя часть (пока такая же) */}
                                    {/* Нижняя часть с параметрами */}
                                    <div className={s.parametersSection}>
                                        <span className={s.parametersTitle}>Детали:</span>

                                        <div className={s.parametersContainer}>
                                            {renderParametersForMobBlock()}
                                        </div>
                                    </div>
                                    <Image src={arrow} alt='' className={s.arrowParamsMob}/>
                                </div>
                            </>
                        }
                    </div>
                    <div className={s.col2}>
                        {desktopStore.isDesktop &&
                            <>
                                <div>
                                    <StarRating rating={product.score_product_page} n={product.id}/>
                                    <div itemProp="name">
                                        <div className={s.brand}>{product.name}</div>
                                        <div className={s.model}>{product.long_description}</div>
                                    </div>
                                </div>
                                {
                                    events.length > 0 &&
                                    <div style={{marginBottom: '50px'}}>
                                        {(product.price.start_price > product.price.final_price) &&
                                            <div className={s.price_default}
                                                 style={{textDecoration: 'line-through', fontSize: '17px'}}>
                                                {addSpacesToNumber(product.price.start_price)} ₽
                                            </div>
                                        }
                                        <div itemProp="offers" itemScope itemType="https://schema.org/Offer"
                                             className={(product.price.start_price > product.price.final_price) ? s.price_sale : s.price_default}
                                        >
                                            <span>{addSpacesToNumber(product.price.final_price)} </span><span>₽</span>

                                            <meta itemProp="price" content={product.price.final_price}/>
                                            <meta itemProp="priceCurrency" content="RUB"/>
                                            <meta itemProp="availability" content="OnlineOnly"/>
                                        </div>
                                    </div>
                                }
                                {
                                    events.length > 0
                                        ?
                                        <SizeChoice prices={events} productId={product.id}
                                                    isDesktop={desktopStore.isDesktop}/>
                                        :
                                        <p className={s.grey_text}>Нет свободных мест на мастер-класс</p>
                                }
                                {
                                    productStore.sizeChosen &&
                                    <>
                                        <div className={s.wrapper}>
                                            <div className={s.wrapper2}>
                                                <span className={s.amount}>Число гостей:</span>
                                                <div className={s.selector}>
                                                    <button className={s.btn} onClick={decrement}>−</button>
                                                    <span className={s.count}>{count}</span>
                                                    <button className={s.btn} onClick={increment}>+</button>
                                                </div>
                                            </div>

                                            <span className={s.separator}>|</span>
                                            <div className={s.total}>
                                                Итого: <strong>{count * product.price.final_price} ₽</strong>
                                            </div>
                                        </div>
                                    </>
                                }

                                <div className={s.btn_group}>
                                    <button className={s.cart_btn2}
                                            disabled={!productStore.sizeChosen || productStore.text === 'Уже в корзине'}
                                            onClick={cartAdd}
                                    >
                                        {productStore.text}
                                    </button>
                                    {
                                        userStore.isLogged
                                            ?
                                            <button className={s.fav_btn2}
                                                    onClick={() => {
                                                        isInWishlist ? deleteFromWL() : addToWL()
                                                    }}
                                            >
                                                <div className={s.icon_block}>
                                                    <Image src={isInWishlist ? like_fill : like} alt=""
                                                           className={s.icons} style={{width: '27px', height: '27px'}}/>
                                                </div>
                                            </button>
                                            :
                                            <div className={s.fav_btn2}>
                                                <AuthModal fromWishlist={true}>
                                                    <div className={s.icon_block}>
                                                        <Image src={like} alt="" className={s.icons}
                                                               style={{width: '27px', height: '27px'}}/>
                                                    </div>
                                                </AuthModal>
                                            </div>
                                    }
                                </div>

                                <hr style={{color: '#d1838c', opacity: '1', marginTop: 20, marginBottom: 10}}/>

                                <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
                                    <TextModalDesktopProductPage width={'27%'} title={'Оплата'} img={payment}>
                                        <Image src={payment} alt='' width={60}/>
                                        <h4 className={'my-3'}>Оплата</h4>
                                        <p className={s.text}>
                                            При оплате товара средства с вашей карты замораживаются эквайрингом, а не
                                            списываются. Далее мы должны подтвердить ваш заказ, и только после этого
                                            деньги поступят к нам. Обычно
                                            подтверждение заказа происходит в кратчайшие сроки. Обо всех изменениях
                                            статуса
                                            заказа вы можете получать уведомления удобным для вас способом, а также
                                            следить
                                            за
                                            ними в личном кабинете. В случае, если заказ не удастся подтвердить, вся
                                            сумма
                                            будет
                                            незамедлительно разморожена и снова станет доступной на вашем счету.

                                        </p>
                                        <div className={s.faq_block}>
                                            <h5 className={'text-center'}>Часто задаваемые вопросы</h5>
                                            <LoyaltyFAQ title={'Безопасная оплата'}>
                                                При оплате заказа банковской картой, обработка платежа (включая ввод
                                                номера
                                                карты) происходит на защищенной странице процессинговой системы, которая
                                                прошла
                                                международную сертификацию. Это значит, что Ваши конфиденциальные данные
                                                (реквизиты карты, регистрационные данные и др.) не поступают в
                                                интернет-магазин,
                                                их обработка полностью защищена и никто, в том числе наш
                                                интернет-магазин,
                                                не
                                                может получить персональные и банковские данные клиента. При работе с
                                                карточными
                                                данными применяется стандарт защиты информации, разработанный
                                                международными
                                                платёжными системами Visa и Masterсard-Payment Card Industry Data
                                                Security
                                                Standard (PCI DSS), что обеспечивает безопасную обработку реквизитов
                                                Банковской
                                                карты Держателя. Применяемая технология передачи данных гарантирует
                                                безопасность
                                                по сделкам с Банковскими картами путем использования протоколов Secure
                                                Sockets
                                                Layer (SSL), Verifiedby Visa, Secure Code, и закрытых банковских сетей,
                                                имеющих
                                                высшую степень защиты.
                                            </LoyaltyFAQ>
                                            <LoyaltyFAQ title={'Какие есть способы оплаты?'}>
                                                Мы принимаем всевозможные способы оплаты: МИР, Visa, Mastercard, СБП.
                                            </LoyaltyFAQ>
                                            <LoyaltyFAQ title={'Безопасность данных'}>
                                                Мы собираем и не разглашаем третьим лицам конфиденциальную информацию.
                                                Более
                                                подробно с политикой обработки персональных данных можно
                                                ознакомиться <a href="/docs/Политика%20конфиденциальности.pdf"
                                                                target={"_blank"}
                                                                className={'text-black'}>
                                                здесь</a>
                                                <br/>
                                                Все платежи проходят через интернет-эквайринг с использованием защиты
                                                3d-secure.
                                                <br/>
                                                Интернет-эквайринг защищен всеми нужными протоколами и имеет
                                                сертификации
                                                для
                                                создания безопасной связи между доменами при оплате. Более того,
                                                интернет-эквайринг позволяет отслеживать данные по каждой транзакции
                                                (пункт
                                                товара, сумма транзакции, статус транзакции, данные покупателя) и
                                                вовремя
                                                заподозрить вредоносные операции со стороны сотрудников, покупателей или
                                                сторонних людей (мошенников).
                                            </LoyaltyFAQ>
                                            <LoyaltyFAQ title={'Возврат средств в случае отмены заказа'}>
                                                В большинстве случаев средства при оплате не списываются, а
                                                замораживаются
                                                на
                                                вашем счете и списываются лишь после окончательного подтверждения
                                                заказа.
                                                Если
                                                нам не удастся подтвердить заказ, то деньги моментально разморозятся и
                                                вернутся
                                                на ваш счет. Вам для этого ничего делать не потребуется. Если деньги уже
                                                списались с вашего счета, то при отмене заказа деньги вернутся в течение
                                                3-10
                                                рабочих дней в зависимости от банка.

                                            </LoyaltyFAQ>
                                            <LoyaltyFAQ title={'Правила возврата средств при частичной отмене заказа'}>
                                                В большинстве случаев средства при оплате не списываются, а
                                                замораживаются
                                                на
                                                вашем счете и списываются лишь после окончательного подтверждения
                                                заказа.
                                                Если
                                                нам не удастся подтвердить заказ частично, то часть денег, которая
                                                подлежит
                                                возврату, моментально разморозится и вернется на ваш счет. Вам для этого
                                                ничего
                                                делать не потребуется. Если деньги уже списались с вашего счета, то при
                                                частичной отмене заказа часть денег вернется в течение 3-10 рабочих дней
                                                в
                                                зависимости от банка.
                                                <br/>
                                                Оплата за ту часть заказа, которая успешна подтверждена, будет списана с
                                                вашего
                                                счета.
                                            </LoyaltyFAQ>
                                            <LoyaltyFAQ title={'Возможна ли оплата криптовалютой?'}>
                                                На сайте не предусмотрена оплата криптовалютой. В Российской Федерации
                                                запрещено
                                                принимать цифровые деньги.
                                            </LoyaltyFAQ>
                                        </div>
                                    </TextModalDesktopProductPage>
                                    <TextModalDesktopProductPage width={'27%'} title={'Отмена записи'} img={returnImg}>
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
                                    </TextModalDesktopProductPage>
                                    <TextModalDesktopProductPage width={'27%'} title={'Остались вопросы?'} img={how}>
                                        <div className={s.content}>
                                            <Image src={headphones} alt='' width={60}/>
                                            <div className={s.text_cont}>
                                                <h5>Если у вас остались вопросы в том числе по данному мастер-классу, вы
                                                    всегда
                                                    можете
                                                    написать в службу поддержки, и мы будем рады вам помочь!</h5>
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
                                                        title={'Можно ли оформить заказ, позвонив или написав нам?'}>
                                                        Да, вы всегда можете написать нам в службу поддержки, и мы
                                                        поможем
                                                        вам и
                                                        выбрать мастер-класс, и оформить заказ.
                                                        Вы также можете написать нам, какой мастер-класс ищете, и мы
                                                        сами
                                                        найдем
                                                        его
                                                        для вас и предложим к заказу!

                                                    </LoyaltyFAQ>
                                                    <LoyaltyFAQ title={'Где узнать больше информации о мастер-классе?'}>
                                                        Если вы хотите узнать больше о мастер-классе, вы всегда можете
                                                        обратиться к нам, и
                                                        наши
                                                        специалисты ответят на все вопросы и
                                                        предоставят исчерпывающую информацию о мастер-классе!

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
                                    </TextModalDesktopProductPage>
                                </div>

                                <hr style={{color: '#d1838c', opacity: '1', marginTop: 10, marginBottom: 10}}/>

                                {desktopStore.isDesktop &&
                                    <div ref={contentRef}
                                         className={[s.more, moreOpen ? s.more_open : ""].join(" ")}
                                         style={{maxHeight: contentHeight}}>

                                        <div className={s.row}>
                                            <div className={s.col50}>
                                                <div className={s.characteristics_title}>Что вас ждет?</div>
                                                {renderInfo()}
                                            </div>
                                            <div className={s.col50}>
                                                <div className={s.characteristics_title}>Детали:</div>
                                                {renderParams()}
                                            </div>
                                        </div>

                                        <div
                                            className={`${moreOpen || fadeOutInvisible ? s.invisible : s.fadeOut}`}></div>
                                    </div>
                                }

                                {
                                    desktopStore.isDesktop && infoBtn &&
                                    <div className='d-flex justify-content-center'>
                                        <button
                                            className={s.more_btn}
                                            onClick={toggle_more_open}>
                                            <div className={s.more_text}>
                                                Подробнее
                                                <Arrow isOpen={moreOpen}/>
                                            </div>
                                        </button>
                                    </div>
                                }
                            </>
                        }
                    </div>
                </div>
                {desktopStore.isDesktop &&
                    <hr className={s.margins}/>}
                {similarProducts.length > 0 &&
                    <Compilation arr={similarProducts} title={'Похожие мастер-классы'} paddings={'regular'}/>
                }
                {!desktopStore.isDesktop && lastSeen.length > 0 &&
                    <>
                        <Compilation arr={lastSeen} title={'Ранее просмотренные'} paddings={'regular'}
                                     key={product.id}/>
                    </>
                }

                {desktopStore.isDesktop && lastSeen.length > 0 &&
                    <Compilation arr={lastSeen} title={'Ранее просмотренные'} paddings={'regular'} key={product.id}/>
                }
            </div>
            <ProductPageMobileInfoModal show={infoOpen} onHide={closeInfoModal} product={product}/>
        </MainLayout>
    );
};

export default observer(OneProductPage);