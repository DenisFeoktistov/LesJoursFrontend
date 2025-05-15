import React, {useContext, useEffect, useRef, useState} from 'react';
import s from '@/styles/Certificate.module.css'
import truck from '@/static/icons/truck.svg'
import refund from '@/static/icons/arrow-return-left.svg'
import returnImg from '@/static/icons/arrow-return-left.svg'
import like from '@/static/icons/heart.svg'
import like_fill from '@/static/icons/heart-fill.svg'
import SizeTable from "@/components/pages/oneProduct/SizeTable/SizeTable";
import SizeHelp from "@/components/pages/oneProduct/SizeHelp/SizeHelp";
import SizeChoice from "@/components/pages/oneProduct/SizeChoice/SizeChoice";
import HowToChoose from "@/components/pages/oneProduct/HowToChoose/HowToChoose";
import TextModal from "@/components/shared/UI/TextModal/TextModal";
import Arrow from "@/components/shared/UI/Arrow/Arrow";
import Image from 'next/image'
import {
    fetchOneProduct,
    fetchOneProductFull,
    fetchPrices,
    fetchProductsByArray,
    fetchShippings,
    fetchSimilarProducts,
    updateOneProduct,
    fetchProductsPage
} from "@/http/productsApi";
import MainLayout from "@/layout/MainLayout";
import {Context} from "@/context/AppWrapper";
import {observer} from "mobx-react-lite";
import AuthModal from "@/components/shared/AuthModal/AuthModal";
import Cookies from "js-cookie";
import {addToWishlist, removeFromWishlist} from "@/http/wishlistAPI";
import {parse} from "cookie";
import RenderBtns from "@/components/pages/oneProduct/RenderBtns/RenderBtns";
import {addToCart, addToCartCertificate} from "@/http/cartApi";
import {addLastSeen, fetchLastSeen2, fetchUserInfo} from "@/http/userApi";
import jwtDecode from "jwt-decode";
import Link from "next/link";
import Compilation from "@/components/shared/Compilation/Compilation";
import InvisibleCaptcha from "@/components/shared/CaptchaYandex/Captcha"
import '@splidejs/react-splide/css'
import Head from "next/head";
import gift from '@/static/icons/gift-green.svg'
import how from '@/static/icons/question-circle.svg'
import warranty from '@/static/icons/shield-check.svg'
import payment from '@/static/icons/credit-card.svg'
import {useRouter} from "next/router";
import parseHtml from 'html-react-parser'
import change from "@/static/icons/arrow-down-up.svg";
import map from "@/static/img/map.jpg";
import LoyaltyFAQ from "@/components/pages/account/LoyaltyFAQ/LoyaltyFAQ";
import gift_gard from "@/static/icons/gift-gard.svg";
import first from "@/static/icons/first.svg";
import shareIcon from "@/static/icons/icons8-поделиться.svg"
import shareGif from "@/static/icons/icons8-поделиться.gif"
import good from "@/static/icons/good.svg";
import friend from "@/static/icons/friend.svg";
import birth from "@/static/icons/happybirthday.svg";
import smile from "@/static/icons/emoji-smile 1.svg";
import giftModal from "@/static/icons/gift.svg";
import headphones from "@/static/icons/headphones-circle.svg";
import tg from "@/static/icons/tg_black.svg";
import vk from "@/static/icons/vk_black.svg";
import cashStack from "@/static/icons/cash-stack.svg";
import cashStack1 from "@/static/icons/cash-stack 1.svg";
import twoArrows from "@/static/icons/two_arrowsNew.svg";
import ffIcon from '@/static/icons/ff.png'
import selloutIcon from '@/static/icons/selloutIcon.png'
import ImgSlider from "@/components/pages/oneProduct/ImgSlider/ImgSlider";
import shield from "@/static/icons/shield-check 1.svg";
import patch from "@/static/icons/patch-check 1.svg";
import personCheck from "@/static/icons/person-check 1.svg";
import file from '@/static/icons/file-earmark-check 1.svg'
import creditCard from '@/static/icons/credit-card 2.svg'
import aboutUs from '@/static/icons/aboutus.svg'
import aboutUs2 from '@/static/icons/aboutus2.svg'
import HowWeWorkModal from "@/components/shared/HowWeWorkModal/HowWeWorkModal";
import {
    trackAddToCart,
    trackAddToFavorites,
    trackRemoveToFavorites,
    trackViewProduct,
} from "@/components/shared/YandexMetrica/YandexMetrica";
import TreeLine from "@/components/pages/oneProduct/TreeLines/TreeLine";
import BreadcrumbC from "@/components/shared/BreadcrumbC/BreadcrumbC";
import StarRating from "@/components/shared/StarRating/StarRating";
import * as PropTypes from "prop-types";
import ProductDetailsMob from "@/components/shared/ProductDetailsMob/ProductDetailsMob";
import Notification from "@/components/shared/Notification/Notification";
import ProductList from "@/components/pages/product/ProductList/ProductList";
import TextModalDesktopProductPage
    from "@/components/shared/UI/TextModalDesktopProductPage/TextModalDesktopProductPage";
import igBlack from "@/static/icons/igImg.svg";
import tgBlack from "@/static/icons/tg_black.svg";
import imgUs3 from "@/static/img/Гарантии 1.png";
import imgUs4 from "@/static/img/гарантии 2.png";
import imgUs5 from "@/static/img/Гарантии 3.png";
import imgUs6 from "@/static/img/Гарантии 4.png";
import imgUs7 from "@/static/img/Гарантии 5.png";
import imgUs8 from "@/static/img/Гарантии 6.png";
import productPageMainPageLinkWomen from "@/static/img/productPageMainPageLinkWomen.png";
import productPageMainPageLinkMen from "@/static/img/productPageMainPageLinkMen.png";
import productPageMainPageLinkAny from "@/static/img/productPageMainPageLinkAny.png";
import productPageMainPageLinkWomenMob from "@/static/img/productPageMainPageLinkWomenMob.png";
import productPageMainPageLinkMenMob from "@/static/img/productPageMainPageLinkMenMob.png";
import productPageMainPageLinkAnyMob from "@/static/img/productPageMainPageLinkAnyMob.png";
import productPageMainPageArrow from "@/static/img/productPageMainPageArrow.svg";
import imgUs4Mob from "@/static/img/Гарантии 1 mob.png";
import imgUs5Mob from "@/static/img/Гарантии 2 mob.png";
import imgUs6Mob from "@/static/img/Гарантии 3 mob.png";
import imgUs7Mob from "@/static/img/Гарантии 4 mob.png";
import imgUs8Mob from "@/static/img/Гарантии 5 mob.png";
import imgUs9Mob from "@/static/img/Гарантии 6 mob.png";
import imgUs10Mob from "@/static/img/Гарантии 7 mob.png";
import imgUs11Mob from "@/static/img/Гарантии 8 mob.png";
import arrow from "@/static/icons/chevron-right-grey.svg";
import ProductPageMobileInfoModal from "@/components/shared/ProductPageMobileInfoModal/ProductPageMobileInfoModal";
import ContactModal from "@/components/shared/ContactModal/ContactModal";
import similarBrands from '@/static/jsons/similarBrands.json'
import similarLines from '@/static/jsons/similarLines.json'
import similarCategories from '@/static/jsons/similarCategories.json'
import ModalRef from "@/components/shared/ModalRef/ModalRef";
import ModalGifts from "@/components/shared/ModalGifts/ModalGifts";
import certificateImg from "@/static/img/certificateImg.png";


const Certificate = () => {
    const router = useRouter()
    const [moreOpen, setMoreOpen] = useState(false)
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
            console.log(data_products)
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

    const changeBonusesString = (value) => {
        setBonuses(value)
    }
    const brandsDisplay = () => {
        if (product.collab) {
            return product.collab.name
        } else {
            return product.brands[0].name
        }
    }
    const clickBrand = () => {
        const query = {}
        if (product.collab) {
            query.collab = product.collab.query_name
        } else {
            query.line = product.brands[0].query_name
        }
        return {
            pathname: '/products',
            query: query
        }
    }

    const renderParams = () => {
        const res = []
        const paramsObj = tempMasterClasses.parameters
        const order = paramsObj.parameters_order
        if (order) {
            const params = {}
            for (const param of order) {
                if (param in tempMasterClasses.parameters.parameters) {
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
        const infoList = tempMasterClasses.details
        console.log(infoList)
        for (let info of infoList) {
            console.log(info)
            res.push(
                <p className={s.details}>
                    🎀{info}
                </p>
            )
        }
        return res
    }


    const cartAdd = async () => {
        let cart = Cookies.get('cart')
        Cookies.set('cart', cart + ' ' + productStore.shipChosen, {expires: 2772})
        const arr = Cookies.get('cart').trim().split(' ')
        productStore.setText(arr, productStore.shipChosen)
        if (userStore.isLogged) {
            const token = Cookies.get('access_token')
            const userId = userStore.id
            const data = await addToCart(userId, productStore.shipChosen, token)
        }
        const priceAsString = String(product.price.final_price);
        const productIdAsString = String(product.id);
        const productDetails = getProductDetail(product);
        // trackAddToCart(productDetails)

        window._tmr = window._tmr || [];
        window._tmr.push({
            type: "reachGoal",
            id: 3470916,
            value: priceAsString, // Замените "VALUE" на необходимое значение
            goal: "addToCart",
            params: {product_id: productIdAsString} // Замените "PRODUCT_ID" на необходимое значение
        });
        cartStore.setCartCnt(cartStore.cartCnt + 1)
    }

    const cartAddMock = async () => {
        let cart = Cookies.get('cart')
        Cookies.set('cart', cart + ' certificate_' + productStore.certificateChosen.amount, {expires: 2772})

        if (userStore.isLogged) {
            const token = Cookies.get('access_token')
            const userId = userStore.id
            const data = await addToCartCertificate(userId, productStore.certificateChosen.amount, token)
        }

        cartStore.setCartCnt(cartStore.cartCnt + 1)
    }

    const shouldRenderBonuses = () => {
        return Number(product.price.bonus) > 0;
    }
    const hasOneTable = () => {
        let bool = false
        console.log(product.size_table_platform)
        console.log(Array.isArray(product.size_table_platform))
        if (Array.isArray(product.size_table_platform)) {
            bool = product.size_table_platform.some(
                (item) =>
                    item.table && // Убедимся, что ключ `table` существует
                    typeof item.table === 'object' && // Проверяем, что `table` — объект
                    Object.keys(item.table).length > 0 // Убедимся, что объект не пустой
            );
        } else {
            Object.values(product.size_table_platform.tables).forEach(table => {
                if (Object.keys(table).length > 0) {
                    bool = true
                }
            })
        }

        return bool
    }


    const addSpacesToNumber = (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');


    const getProductDetail = (product) => {
        return {
            id: product.id.toString(),
            name: `${brandsDisplay()} ${product.model} ${product.colorway}`,
            price: product.min_price,
            brand: brandsDisplay()
        };
    };

    // useEffect(() => {
    //     trackViewProduct(getProductDetail(product))
    // }, [product.id]);

    const [selectedGender, setSelectedGender] = useState("any")

    useEffect(() => {
        if (Cookies.get('selected_gender')) {
            setSelectedGender(Cookies.get('selected_gender'))
        }
        // Проверяем, что скрипт еще не добавлен
        if (!document.getElementById('boxberry-script')) {
            // Создаем элемент script

            // Преобразуем значения в строки, если они ожидаются как строки
            const priceAsString = String(tempMasterClasses.price.final_price);
            const productIdAsString = String(tempMasterClasses.id);

            // Отправляем событие goal tracking при загрузке компонента
            window._tmr = window._tmr || [];
            window._tmr.push({
                type: "reachGoal",
                id: 3470916,
                value: priceAsString,
                goal: "viewProduct",
                params: {product_id: productIdAsString}
            });

            // Функция очистки (вызывается при размонтировании компонента)
        }
    }, []); // Пустой массив зависимостей гарантирует выполнение эффекта только один раз при монтировании компонента

    const productPageMainPageLinkImage = selectedGender === "any" ? productPageMainPageLinkAny : selectedGender === "M" ? productPageMainPageLinkMen : productPageMainPageLinkWomen
    const productPageMainPageLinkImageMob = selectedGender === "any" ? productPageMainPageLinkAnyMob : selectedGender === "M" ? productPageMainPageLinkMenMob : productPageMainPageLinkWomenMob

    const [isClicked, setIsClicked] = useState(false);

    const handleShareClick = () => {
        navigator.clipboard.writeText(`https://sellout.su/products/${product.slug}`).then(() => {
            setNotification('Ссылка скопирована');
        }, () => {
            setNotification('Не удалось скопировать ссылку');
        });

        setIsClicked(true);
        setTimeout(() => {
            setIsClicked(false);
        }, 300);  // Duration of the animation
    };

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

    const [giftsModalOpen, setGiftsModalOpen] = useState(false);

    const toggleGifts = () => {
        setGiftsModalOpen((prev) => !prev);
        document.body.classList.add('body-scroll-clip')
    };

    const handleGiftsModalClose = () => {
        setGiftsModalOpen(false); // Закрытие модалки извне
        document.body.classList.remove('body-scroll-clip')
    };

    const tempMasterClasses = {
        "id": 43719,
        "in_wishlist": false,
        "price": {
            "start_price": 8490,
            "final_price": 8490
        },
        "short_description": "Короткое описание тут. Вы сможете создать собственный тортик и чудесно провести вечер! Вы сможете создать еще один собственный тортик и опять чудесно провести вечер!",
        "slug": "vans-old-skool-blackwhite-43719",
        "name": "Бенто-торт",
        "long_description": "Большое описание тут. Вы сможете создать собственный тортик и чудесно провести вечер! Вы сможете создать еще один собственный тортик и опять чудесно провести вечер! Вы сможете создать собственный тортик и чудесно провести вечер! Вы сможете создать собственный тортик и чудесно провести вечер! Вы сможете создать еще один собственный тортик и опять чудесно провести вечер! Вы сможете создать собственный тортик и чудесно провести вечер! Вы сможете создать еще один собственный тортик и опять чудесно провести вечер! Вы сможете создать собственный тортик и чудесно провести вечер! Вы сможете создать еще один собственный тортик и опять чудесно провести вечер!",
        "bucket_link": [
            {
                "id": 18603709,
                "url": "https://s924sas.storage.yandex.net/rdisk/66469d23ef4d6469c7be0ff30ad9e0be6640277f614eafee65991675fe10b403/681d0840/fKqInKw3d7bLFOeFnMGnhDKsgUKR9221F9Ryb_3IFBA6wErnhUrv2ZfJ_nk3YAGBC8Dqr7j1VREAxSCY6yKxk-W79QwjkicFAhXHWHAa6tmr8npumZHI4midPdWhecNq?uid=1130000061336583&filename=mkImgTest.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=1130000061336583&fsize=429466&hid=f2e8cc2019a0dfc651cb64562b8770d0&media_type=image&tknv=v3&etag=692ca033d9d235f6c696a5027f958773&ts=634a4ff229000&s=67881f61d5f7a214e67e6f4f8a6615d9d5a798c6ac281b728318d514dac60d84&pb=U2FsdGVkX18op807rLqhwQ0lMBUMyaUxtd3J_b8gUDe7GpUGNRw3p8DM45GNNnevaZo4EH_BgxJqEeA-lpki7USKoNtczoIPi65xYfl8wArrcEMzi-9eSsMTcLdSa1WB"
            }
        ],
        "available_flag": true,
        "parameters": {
            "parameters": {
                "Адрес": [
                    "Кремлевский дворец"
                ],
                "Контакты": [
                    "+7 (007) МММ 77-77"
                ],
                "Возраст": [
                    "60+"
                ],
                "Продолжительность": [
                    "1 час"
                ]
            },
            "parameters_order": [
                "Адрес",
                "Контакты",
                "Возраст",
                "Продолжительность"
            ]
        },
        "details": [
            "Сборка бенто-торта",
            "Работа с красителями",
            "Выравнивание кремом"
        ],
        "score_product_page": 3005,
        "events": [
            {
                "id": 1,
                "start_datetime": "2024-04-01T14:00:00Z",
                "end_datetime": "2024-04-01T16:00:00Z",
                "available_seats": 20,
                "occupied_seats": 5,
                "created_at": "2024-03-20T10:00:00Z"
            },
            {
                "id": 2,
                "start_datetime": "2024-04-02T14:00:00Z",
                "end_datetime": "2024-04-02T16:00:00Z",
                "available_seats": 20,
                "occupied_seats": 8,
                "created_at": "2024-03-20T10:00:00Z"
            },
            {
                "id": 3,
                "start_datetime": "2024-04-03T14:00:00Z",
                "end_datetime": "2024-04-03T16:00:00Z",
                "available_seats": 20,
                "occupied_seats": 3,
                "created_at": "2024-03-20T10:00:00Z"
            },
            {
                "id": 4,
                "start_datetime": "2024-04-02T14:00:00Z",
                "end_datetime": "2024-04-02T16:00:00Z",
                "available_seats": 0,
                "occupied_seats": 8,
                "created_at": "2024-03-20T10:00:00Z"
            },
            {
                "id": 5,
                "start_datetime": "2024-04-03T14:00:00Z",
                "end_datetime": "2024-04-03T16:00:00Z",
                "available_seats": 1,
                "occupied_seats": 3,
                "created_at": "2024-03-20T10:00:00Z"
            }
        ]
    }

    const tempPrices = tempMasterClasses.events

    const [count, setCount] = useState(1);
    const [max, setMax] = useState(0);

    useEffect(() => {
        setCount(1);
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
                <title>{`Сертификаты на мастер-классы от Les-Jours`}</title>
                <meta property="og:image"
                      content="https://sellout.su/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo_sq.02469b83.png&w=640&q=75"/>
                <meta property="og:image:width" content="640px"/>
                <meta property="og:image:height" content="410px"/>
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
                                <div itemProp="name">
                                    <div itemProp="brand">
                                        <Link href={clickBrand()} className={s.brand}>{brandsDisplay()}</Link>
                                    </div>
                                    <div className={s.model} itemProp="model">{product.model}</div>
                                    <div className={s.color}>{product.colorway}</div>
                                </div>
                                <div className={s.iconContainer}>
                                    <StarRating rating={product.score_product_page} n={product.id}/>
                                </div>
                                {/*<div className={s.iconContainer}>*/}
                                {/*    <Image*/}
                                {/*        src={shareIcon}*/}
                                {/*        alt="Share"*/}
                                {/*        className={isClicked ? `${s.shareIcon} ${s.clicked}` : s.shareIcon}*/}
                                {/*        onClick={handleShareClick}*/}
                                {/*    />*/}
                                {/*</div>*/}
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
                                {
                                    prices.length > 0 &&
                                    <div style={{marginBottom: '20px'}}>
                                        <span itemProp="offers" itemScope itemType="https://schema.org/Offer"
                                              className={(product.price.start_price > product.price.final_price) ? s.price_sale : s.price_default}
                                        >
                                            <span>от </span><span>{addSpacesToNumber(product.price.final_price)}</span><span>₽</span>


                                            {product.is_fast_shipping &&
                                                <Image src={truck} alt="" className={s.icons}/>}
                                            {product.is_return && <Image src={refund} alt="" className={s.icons}/>}
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

                                        <br/>
                                        {
                                            shouldRenderBonuses() &&
                                            <p className={s.bonuses_block}>
                                                <Image src={gift} alt='' className={s.bonus_icon}/> <span
                                                className={s.bonuses}> {bonuses}₽</span> бонусов
                                                в подарок!
                                            </p>
                                        }
                                        {
                                            userData && userData.user_status && !userData.user_status.base &&
                                            <div className={s.privText}>
                                                <Image src={ffIcon} alt=''
                                                       width={100}
                                                       height={80}
                                                       className={s.priv_icon}
                                                />
                                                <div>
                                                    <span className={s.privTextPart}>{userStore.firstName}, привилегии и максимальная скидка уже учтены!<br/>Однако сейчас цена на сайте может отличаться от лучшего предложения, поэтому напишите&nbsp;
                                                        {userData.personalManager && userData.personalManager === "Марк Фельдман" ? (
                                                            <a href={'https://t.me/markermann'} target={'_blank'}
                                                               style={{
                                                                   textDecoration: 'underline',
                                                                   cursor: 'pointer',
                                                                   color: '#83052F'
                                                               }}>Марку</a>
                                                        ) : (
                                                            <span onClick={toggleContact} style={{
                                                                textDecoration: 'underline',
                                                                cursor: 'pointer'
                                                            }}>нам</span>
                                                        )}, и, может, мы подберем еще более приятную цену!)</span>
                                                </div>

                                            </div>
                                        }
                                    </div>
                                }
                                {
                                    prices.length > 0 &&
                                    <div className={s.modals_block}>
                                        {
                                            hasOneTable() &&
                                            <SizeTable tables={product.size_table_platform}
                                                       photo={product.bucket_link[0].url} key={product.id}/>
                                        }
                                        {/*<SizeHelp model={`${brandsDisplay()} ${product.model}`}*/}
                                        {/*          imgSrc={product.bucket_link[0].url} manySizes={product.has_many_sizes}*/}
                                        {/*          str={product.size_table_platform?.size_fit_recommendation ?? ''}/>*/}
                                    </div>
                                }
                                {
                                    prices.length > 0
                                        ?
                                        <SizeChoice prices={prices} productId={product.id}
                                                    config={product.size_row_name} manySizes={product.has_many_sizes}
                                                    isDesktop={desktopStore.isDesktop}/>
                                        :
                                        <p className={s.grey_text}>Товара нет в наличии</p>
                                }
                                {
                                    productStore.sizeChosen &&
                                    <>
                                        <div className={s.btn_group}>
                                            <RenderBtns btns={productStore.shipps} changeBonuses={changeBonusesString}/>
                                        </div>
                                        <div className={s.taxIncludedText}>Таможенные пошлины и другие комиссии включены
                                            в стоимость
                                        </div>
                                    </>
                                }
                                {
                                    productStore.sizeChosen &&
                                    <div className={s.how}>
                                        <HowToChoose/>
                                    </div>}
                                <div className={s.btn_group}>
                                    <button className={s.cart_btn}
                                            disabled={!productStore.shipChosen || productStore.text[0] === 'У'}
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
                                                        {/*<Image src={like} alt="" style={{ width: '22px', height: '22px'}}/>*/}
                                                        {/*<div>В избранное</div>*/}
                                                    </div>
                                                </AuthModal>
                                            </div>
                                    }
                                </div>

                                <TextModalDesktopProductPage title={'Нашли дешевле?'}>
                                    <Image src={cashStack1} alt='' width={80}/>
                                    <h4 className={'my-3'}>Нашли тот же товар дешевле?</h4>
                                    <div className={s.arrows_section} style={{marginLeft: -5}}>
                                        <Image src={ffIcon} alt='' width={100}/>
                                        <div className={s.arrows_block}>
                                            <div>
                                                Информация о конкуренте
                                            </div>
                                            <div className={s.arrows_cont}>
                                                <Image src={twoArrows} alt='' fill={true} className={s.arrow_img}/>
                                            </div>
                                            <div>
                                                Лучшая цена
                                            </div>
                                        </div>
                                        <Image src={selloutIcon} alt='' width={70}/>
                                    </div>
                                    <p className={s.text}>
                                        Пришлите информацию о предложении конкурента, а мы гарантированно подберем для
                                        вас более выгодное!
                                    </p>
                                    <div className='d-flex flex-row align-items-center justify-content-between'
                                         style={{marginBottom: '30px'}}>
                                        {/* Telegram */}
                                        <a
                                            href='https://t.me/sellout_official'
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className={`${s.button} mb-3`}
                                            style={{
                                                backgroundColor: '#24A1DE',
                                                color: '#fff',
                                                width: '48%',
                                                textAlign: 'center',
                                                padding: '10px 0',
                                                borderRadius: '5px',
                                                textDecoration: 'none'
                                            }}>
                                            Телеграм
                                        </a>

                                        {/* WhatsApp */}
                                        <a
                                            href='https://wa.me/message/L2OINP6KNMNLA1'
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className={`${s.button} mb-3`}
                                            style={{
                                                backgroundColor: '#128c7e',
                                                color: '#fff',
                                                width: '48%',
                                                textAlign: 'center',
                                                padding: '10px 0',
                                                borderRadius: '5px',
                                                textDecoration: 'none'
                                            }}>
                                            WhatsApp
                                        </a>
                                    </div>
                                    <p className={s.text}>
                                        Мы стараемся держать лидирующую позицию на российском рынке брендовой одежды и
                                        обуви, поэтому тщательно мониторим конкурентов и стремимся предлагать нашим
                                        клиентам
                                        лучшие цены! Одна из наших ключевых ценностей - это самые выгодные цены на
                                        широчайший ассортимент брендовой, стильной, премиальной одежды, обуви и
                                        аксессуаров.
                                        Поэтому если вы нашли более низкую цену у наших конкурентов, <span
                                        style={{fontWeight: '600'}}>причем речь не
                                        только о крупнейших российских сетях и премиальных бутиках, но и о любых
                                        сервисах, магазинах из любых стран</span>, смело пишите нам, и мы
                                        обязательно сделаем для вас наилучшее предложение!

                                    </p>
                                    <div className={s.faq_block}>
                                        <h5 className={'text-center'}>Часто задаваемые вопросы</h5>
                                        <LoyaltyFAQ
                                            title={'Цена в другом месте слишком низкая, и вы думаете, что там продают подделки, что делать?'}>
                                            Да, если цена разительно ниже нашей, то это явный признак неоригинального
                                            товара, однако все равно присылайте нам, где вы наткнулись на подозрительное
                                            предложения, а мы в свою очередь расскажем вам и объективно докажем,
                                            является ли
                                            данный магазин магазином подделок. Не стесняйтесь писать нам об этом, быть
                                            может, наши опытные специалисты
                                            уберегут вас от покупки подделки!

                                        </LoyaltyFAQ>
                                        <LoyaltyFAQ
                                            title={'Куда присылать информацию о том, что вы нашли более выгодное предложение?'}>
                                            Вы можете написать нам любым удобным для вас способом и прислать в любом
                                            формате
                                            информацию о предложении конкурентов: ссылка, контакы в соц. сетях, скриншот
                                            и.т.д.
                                            <br/>
                                            Наши контакты:
                                            <div>
                                                <div>
                                                    Почта: <a href={'mailto:customerservice@sellout.su'}
                                                              className={'text-black'}>customerservice@sellout.su</a>
                                                </div>
                                                <div>
                                                    WhatsApp: <a href={'https://wa.me/message/L2OINP6KNMNLA1'}
                                                                 target={'_blank'}
                                                                 className={'text-black'}>+7 993 896-92-27</a>
                                                </div>
                                                <div>
                                                    Telegram: <a href={'https://t.me/sellout_official'}
                                                                 target={'_blank'}
                                                                 className={'text-black'}>@sellout_official</a>
                                                </div>
                                            </div>
                                        </LoyaltyFAQ>
                                    </div>
                                    <h5>Ответы на большинство вопросов вы найдете здесь: <Link href={'/faq'}
                                                                                               className={s.link}
                                                                                               target={'_blank'}>FAQ</Link>
                                    </h5>
                                </TextModalDesktopProductPage>
                                <hr style={{marginTop: '10px', color: '#51031D', opacity: '1'}}/>
                                {!receivedWelcomeGift &&
                                    <div className={`${s.promoBanner} ${selectedGender === "F" ? s.womenBanner : ''}`}>
                                        <span className={s.promoText}>До 5000₽ в подарок</span>
                                        <button className={s.promoButton} onClick={toggleGifts}>Получить</button>
                                    </div>
                                }
                                <button
                                    className={s.how_btn}
                                    onClick={toggleHow}
                                >
                                    <Image src={aboutUs2} alt="" className={s.icon_about_us}/>
                                    <div className={s.label}>
                                        Откуда у нас выбор из 2’000’000+ товаров и
                                        выгоднейшие цены: на 30-70% ниже всех в РФ
                                    </div>
                                </button>
                                <TextModalDesktopProductPage title={'Гарантии оригинальности и отзывы'} img={warranty}>
                                    <Image src={shield} alt='' width={60}/>
                                    <h4 className={'my-3'}>Гарантии оригинальности и качества</h4>
                                    <p className={s.text}>
                                        На SELLOUT продаются только 100% оригинальные и новые вещи. Мы бережно относимся
                                        к своей репутации и не допускаем подделок. Мы сотрудничаем только с проверенными
                                        бутиками, магазинами и продавцами. Каждый товар перед отправкой покупателю
                                        проходит тщательные проверки на оригинальность и качество. Наша команда состоит
                                        из специалистов, которые уже более 5 лет занимаются проверкой подлинности
                                        одежды, обуви и прочих аксессуаров, а также использует передовые технологии
                                        искусственного интеллекта, чтобы исключить человеческий фактор.

                                    </p>
                                    <h5 className={'mb-3 mt-5'}>Вы можете найти нас во всех соц. сетях и посмотреть
                                        отзывы, подробнее прочитать <Link href={'/about'} className={s.link}
                                                                          target={'_blank'}>про нашу компанию</Link>, а
                                        также изучить отзывы на интернет ресурсах:</h5>
                                    <div className={s.icons_block}>
                                        <div className={s.socialsCont}>
                                            <a style={{height: '45px'}}>
                                                <Image src={igBlack} height={45} alt="" className={s.icon}/>
                                            </a>
                                            <span className={s.mainSocialsText}>
                                                  Запретграм: <br/> @sellout_platform
                                            </span>
                                        </div>

                                        <div className={s.socialsCont}>
                                            <a href={'https://t.me/selloutsu'} style={{height: '45px'}}>
                                                <Image src={tgBlack} height={45} alt="" className={s.icon}/>
                                            </a>
                                            <span className={s.mainSocialsText}>
                                                  Телеграм: <br/>
                                                  @<a href="https://t.me/selloutsu" className={s.linkTgSocials}>
                                                    selloutsu
                                                  </a>
                                            </span>
                                        </div>
                                    </div>
                                    <div className={s.icons_block}>
                                        <iframe
                                            src="https://www.yandex.ru/sprav/widget/rating-badge/108238948174?type=rating&theme=dark"
                                            width="150" height="50" frameBorder="0"></iframe>
                                        {/*<a id="zoon_widget_210x40_dark"*/}
                                        {/*   href="https://zoon.ru/service/657ee85a79a80027cf0274d7/">*/}
                                        {/*    <img src="https://zoon.ru/wg/210x40/657ee85a79a80027cf0274d7/dark/"*/}
                                        {/*         alt="Интернет-магазин Sellout" title="Интернет-магазин Sellout"*/}
                                        {/*         width="210" height="40"/>*/}
                                        {/*</a>*/}
                                    </div>
                                    <Image src={patch} alt='' width={60} className={'mt-3'}/>
                                    <h5 className={'my-3'}>Какие этапы проверки проходит каждый товар?</h5>
                                    <Image src={personCheck} alt='' width={60}/>
                                    <h5 className={'my-3'}>Проверка партнера</h5>
                                    <p className={s.text}>
                                        Перед тем как оказаться на платформе SELLOUT, мы тщательно проверяем наших
                                        контрагентов. Мы работаем только с крупнейшими международными ресурсами с
                                        многомиллиардными оборотами и годами проверенными продавцами, а также частными
                                        коллекционерами, деятелями искусства и моды и публичными персонами.

                                    </p>
                                    <Image src={file} alt='' width={60}/>
                                    <h5 className={'my-3'}>Многоэтапная проверка</h5>
                                    <p className={s.text}>
                                        Несмотря на надёжность каждого партнера, мы дополнительно проверяем каждый товар
                                        по прибытии к нам на склад. Мы можем запросить дополнительную проверку у
                                        независимых экспертов, если сомневаемся в оригинальности товара. Лишь после
                                        этого мы приложим к товару сертификат подлинности и сопутствующий комплект,
                                        подтверждающий оригинальность (пломбы, наклейки и.т.д) и отправим вам заказ!

                                    </p>
                                    <Image src={creditCard} alt='' width={60}/>
                                    <h5 className={'my-3'}>Безопасная оплата</h5>
                                    <p className={s.text}>
                                        Деньги на вашем счету замораживаются и списываются лишь после того, как ваш
                                        заказ повторно успешно пройдет все проверки на оригинальность и качество! В ином
                                        случае деньги будут незамедлительно разморожены и станут доступными на вашем
                                        счете.
                                    </p>
                                    <div className={s.faq_block}>
                                        <h5 className={'text-center'}>Часто задаваемые вопросы</h5>
                                        <LoyaltyFAQ
                                            title={'Что делать, если сомневаетесь в оригинальности или качестве?'}>
                                            Если вы считаете, что вам привезли подделку или бракованный товар, можете
                                            смело обращаться в службу поддержки, и мы разберемся в вашей ситуации. Мы
                                            проведем ряд дополнительных проверок, а также призовем независимых экспертов
                                            для вынесения объективного вердикта. Мы настоятельно рекомендуем фиксировать
                                            на видео факт получения и вскрытия заказа, чтобы избежать двояких ситуаций!
                                            Согласно нашим правилам, за попытку продажи через платформу Sellout
                                            неоригинального товара следуют большие штрафы, конфискация товара и отказ от
                                            сотрудничества с партнером. Торговля контрафактом карается законом, наша
                                            компания занимается исключительно легальным и прозрачным бизнесом.

                                        </LoyaltyFAQ>
                                    </div>
                                    <h5 style={{marginBottom: '30px'}}>Ответы на большинство вопросов вы найдете
                                        здесь: <Link href={'/faq'}
                                                     className={s.link}
                                                     target={'_blank'}>FAQ</Link>
                                    </h5>
                                    <div className={s.page2}>
                                        <Image src={imgUs4Mob} alt="Img" width={6000} height={2000}
                                               className={s.page2Img}/>
                                    </div>
                                    <div className={s.page2}>
                                        <Image src={imgUs5Mob} alt="Img" width={6000} height={2000}
                                               className={s.page2Img}/>
                                    </div>
                                    <div className={s.page2}>
                                        <Image src={imgUs6Mob} alt="Img" width={6000} height={2000}
                                               className={s.page2Img}/>
                                    </div>
                                    <div className={s.page2}>
                                        <Image src={imgUs7Mob} alt="Img" width={6000} height={2000}
                                               className={s.page2Img}/>
                                    </div>
                                    <div className={s.page2}>
                                        <Image src={imgUs8Mob} alt="Img" width={6000} height={2000}
                                               className={s.page2Img}/>
                                    </div>
                                    <div className={s.page2}>
                                        <Image src={imgUs9Mob} alt="Img" width={6000} height={2000}
                                               className={s.page2Img}/>
                                    </div>
                                    <div className={s.page2}>
                                        <Image src={imgUs10Mob} alt="Img" width={6000} height={2000}
                                               className={s.page2Img}/>
                                    </div>
                                    <div className={s.page2}>
                                        <Image src={imgUs11Mob} alt="Img" width={6000} height={2000}
                                               className={s.page2Img}/>
                                    </div>
                                </TextModalDesktopProductPage>
                                <div className={s.containerParamsMob} onClick={toggleInfoModal}>
                                    {/* Верхняя часть */}
                                    <div className={s.section}>
                                        <span>Доставка&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;Оплата&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;Возврат&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;Бонусы&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;Вопросы&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;Изменилась цена?</span>
                                    </div>
                                    {/* Линия по центру */}
                                    <div className={s.centerLine}></div>
                                    {/* Нижняя часть (пока такая же) */}
                                    {/* Нижняя часть с параметрами */}
                                    <div className={s.parametersSection}>
                                        <span className={s.parametersTitle}>Параметры:</span>

                                        <div className={s.parametersContainer}>
                                            {renderParametersForMobBlock()}
                                        </div>
                                    </div>
                                    <Image src={arrow} alt='' className={s.arrowParamsMob}/>
                                </div>
                                <TreeLine list={product.list_lines}/>
                                <Link href={selectedGender === "any" ? "/" : selectedGender === "M" ? "/men" : "/women"}
                                      className={s.containerMain}>
                                    <Image
                                        src={productPageMainPageLinkImageMob}
                                        alt=""
                                        className={s.image}
                                        layout="responsive"
                                        width={700} // Укажите нужную ширину
                                        height={400} // Укажите нужную высоту
                                    />
                                </Link>
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
                {!desktopStore.isDesktop && similarProducts.map(el =>
                    <>
                        <Compilation arr={el.products} title={'Похожие товары'} paddings={'regular'}
                                     rows={1} key={product.id}/>
                    </>
                )}
                {!desktopStore.isDesktop && lastSeen.length > 0 &&
                    <>
                        <Compilation arr={lastSeen} title={'Ранее просмотренные'} paddings={'regular'}
                                     key={product.id}/>
                    </>
                }
                {/*{!desktopStore.isDesktop && recProducts && recProducts.length > 0 &&*/}
                {/*    <div className={'custom_cont'}>*/}
                {/*        <h3 className={s.similar_title}>Рекомендации</h3>*/}
                {/*        <ProductList products={recProducts} isAdmin={false} key={product.id}/>*/}
                {/*        <div ref={observerRef}/>*/}
                {/*    </div>*/}
                {/*}*/}
                {desktopStore.isDesktop && similarProducts.length > 0 &&
                    <Compilation arr={similarProducts} title={'Мастер-классы'} paddings={'regular'}/>
                }
                {/*{desktopStore.isDesktop && recProducts && recProducts.length > 0 &&*/}
                {/*    <Compilation arr={recProducts} title={'Рекомендации'} paddings={'regular'}*/}
                {/*                 resetScrollToBeginning={true}/>*/}
                {/*}*/}
                {desktopStore.isDesktop && lastSeen.length > 0 &&
                    <Compilation arr={lastSeen} title={'Ранее просмотренные'} paddings={'regular'}/>
                }
            </div>
            <ContactModal isOpen={contactOpen} handleClose={closeContact}/>
        </MainLayout>
    );
};

export default observer(Certificate);