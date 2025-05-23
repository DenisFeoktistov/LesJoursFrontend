import React, {useContext, useEffect, useState} from 'react';
import s from '@/styles/Certificate.module.css'
import SizeChoice from "@/components/pages/oneProduct/SizeChoice/SizeChoice";
import Image from 'next/image'
import {
    fetchProductsByArray,
    fetchProductsPage
} from "@/http/productsApi";
import MainLayout from "@/layout/MainLayout";
import {Context} from "@/context/AppWrapper";
import {observer} from "mobx-react-lite";
import Cookies from "js-cookie";
import {addToCartCertificate} from "@/http/cartApi";
import {fetchLastSeen2} from "@/http/userApi";
import jwtDecode from "jwt-decode";
import Compilation from "@/components/shared/Compilation/Compilation";
import '@splidejs/react-splide/css'
import Head from "next/head";
import {useRouter} from "next/router";
import Notification from "@/components/shared/Notification/Notification";
import ContactModal from "@/components/shared/ContactModal/ContactModal";
import certificateImg from "@/static/img/certificateImg.png";


const Certificate = () => {
    const router = useRouter()
    const [notification, setNotification] = useState(null);

    const [similarProducts, setSimilarProducts] = useState([])
    const [lastSeen, setLastSeen] = useState([])

    const {productStore, userStore, cartStore, desktopStore} = useContext(Context)

    useEffect(() => {
        productStore.clearAll()
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

    const cartAdd = async () => {
        let cart = Cookies.get('cart')
        Cookies.set('cart', cart + ' certificate_' + productStore.certificateChosen.amount, {expires: 2772})

        if (userStore.isLogged) {
            const token = Cookies.get('access_token')
            const userId = userStore.id
            const data = await addToCartCertificate(userId, productStore.certificateChosen.amount, token)
        }

        cartStore.setCartCnt(cartStore.cartCnt + 1)
    }

    const addSpacesToNumber = (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    const renderParametersForMobBlock = () => {
        const params = [];

        // Добавляем Артикул, если он есть
        if (product.manufacturer_sku) {
            params.push(
                <div className={s.parameter} key="Артикул">
                    <div className={s.parameterName}>Артикул</div>
                    <div className={s.parameterValue}>{product.manufacturer_sku}</div>
                </div>
            );
            params.push(<div className={s.verticalLine} key="Артикул"></div>);
        }

        // Добавляем Дату релиза, если она есть
        if (product.approximate_date) {
            params.push(
                <div className={s.parameter} key="Дата релиза">
                    <div className={s.parameterName}>Дата релиза</div>
                    <div className={s.parameterValue}>{product.approximate_date}</div>
                </div>
            );
            params.push(<div className={s.verticalLine} key="Дата релиза"></div>);
        }

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

    const [contactOpen, setContactOpen] = useState(false);
    const toggleContact = () => {
        setContactOpen(!contactOpen);
    };

    const closeContact = () => {
        setContactOpen(false);
    };

    return (
        <MainLayout>
            <Head>
                <title>{`Сертификаты на мастер-классы от Les-Jours`}</title>
                <meta property="og:title"
                      content={`Сертификаты на мастер-классы от Les-Jours`}/>
                <meta property="og:description"
                      content={`Сертификаты на мастер-классы от Les-Jours`}/>

                <meta name={'description'}
                      content={`Сертификаты на мастер-классы от Les-Jours`}/>
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
                          content={`Сертификаты на мастер-классы от Les-Jours`}/>

                    <div className={s.col1}>

                        {!desktopStore.isDesktop &&
                            <div style={{position: "relative", marginTop: '10px'}}>
                                <div>
                                    <div itemProp="name">
                                        <div className={s.brand}>Сертификат</div>
                                        <div className={s.model}>Сертификат - это возможность подарить не просто вещь, а
                                            настоящие эмоции, время для
                                            себя и новый опыт!<br/><br/>Вы можете сами выбрать подходящий номинал
                                            сертификата.<br/><br/>Тот, кому вы подарите сертификат, может тратить не всю
                                            сумму сразу, а также при необходимости доплачивать!
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        <div className={s.slider}
                        >
                            <div className={s.photo}>
                                <Image src={certificateImg}
                                       itemProp="image"
                                       alt={`Сертификат`}
                                       loading={'eager'}
                                       className={s.certImg}
                                       width={826}
                                       height={504}
                                       style={{objectFit: 'contain'}}
                                />
                            </div>
                        </div>
                        {!desktopStore.isDesktop &&
                            <>
                                <SizeChoice isDesktop={desktopStore.isDesktop} isCertificate={true}/>

                                <div className={s.btn_group}>
                                    <button className={s.cart_btn2}
                                            disabled={!productStore.certificateChosen || !productStore.certificateChosen.amount}
                                            onClick={cartAdd}
                                    >
                                        Добавить в корзину
                                    </button>
                                </div>
                            </>
                        }
                    </div>
                    <div className={s.col2}>
                        {desktopStore.isDesktop &&
                            <>
                                <div>
                                    <div itemProp="name">
                                        <div className={s.brand}>Сертификат</div>
                                        <div className={s.model}>Сертификат - это возможность подарить не просто вещь, а
                                            настоящие эмоции, время для
                                            себя и новый опыт!<br/><br/>Вы можете сами выбрать подходящий номинал
                                            сертификата.<br/><br/>Тот, кому вы подарите сертификат, может тратить не всю
                                            сумму сразу, а также при необходимости доплачивать!
                                        </div>
                                    </div>
                                </div>

                                <SizeChoice isDesktop={desktopStore.isDesktop} isCertificate={true}/>

                                <div className={s.btn_group}>
                                    <button className={s.cart_btn2}
                                            disabled={!productStore.certificateChosen || !productStore.certificateChosen.amount}
                                            onClick={cartAdd}
                                    >
                                        Добавить в корзину
                                    </button>
                                </div>
                            </>
                        }
                    </div>
                </div>
                {desktopStore.isDesktop &&
                    <hr className={s.margins}/>}
                {similarProducts.length > 0 &&
                    <Compilation arr={similarProducts} title={'Мастер-классы'} paddings={'regular'}/>
                }
                {lastSeen.length > 0 &&
                    <Compilation arr={lastSeen} title={'Ранее просмотренные'} paddings={'regular'}/>
                }
            </div>
            <ContactModal isOpen={contactOpen} handleClose={closeContact}/>
        </MainLayout>
    );
};

export default observer(Certificate);