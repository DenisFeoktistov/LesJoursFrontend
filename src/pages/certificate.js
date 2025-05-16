import React, {useContext, useEffect, useState} from 'react';
import s from '@/styles/Certificate.module.css'
import truck from '@/static/icons/truck.svg'
import refund from '@/static/icons/arrow-return-left.svg'
import like from '@/static/icons/heart.svg'
import like_fill from '@/static/icons/heart-fill.svg'
import SizeChoice from "@/components/pages/oneProduct/SizeChoice/SizeChoice";
import HowToChoose from "@/components/pages/oneProduct/HowToChoose/HowToChoose";
import Image from 'next/image'
import {
    fetchProductsByArray,
    fetchProductsPage
} from "@/http/productsApi";
import MainLayout from "@/layout/MainLayout";
import {Context} from "@/context/AppWrapper";
import {observer} from "mobx-react-lite";
import AuthModal from "@/components/shared/AuthModal/AuthModal";
import Cookies from "js-cookie";
import RenderBtns from "@/components/pages/oneProduct/RenderBtns/RenderBtns";
import {addToCartCertificate} from "@/http/cartApi";
import {fetchLastSeen2} from "@/http/userApi";
import jwtDecode from "jwt-decode";
import Link from "next/link";
import Compilation from "@/components/shared/Compilation/Compilation";
import '@splidejs/react-splide/css'
import Head from "next/head";
import gift from '@/static/icons/gift-green.svg'
import warranty from '@/static/icons/shield-check.svg'
import {useRouter} from "next/router";
import LoyaltyFAQ from "@/components/pages/account/LoyaltyFAQ/LoyaltyFAQ";
import cashStack1 from "@/static/icons/cash-stack 1.svg";
import twoArrows from "@/static/icons/two_arrowsNew.svg";
import ffIcon from '@/static/icons/ff.png'
import selloutIcon from '@/static/icons/selloutIcon.png'
import shield from "@/static/icons/shield-check 1.svg";
import patch from "@/static/icons/patch-check 1.svg";
import personCheck from "@/static/icons/person-check 1.svg";
import file from '@/static/icons/file-earmark-check 1.svg'
import creditCard from '@/static/icons/credit-card 2.svg'
import aboutUs2 from '@/static/icons/aboutus2.svg'
import StarRating from "@/components/shared/StarRating/StarRating";
import Notification from "@/components/shared/Notification/Notification";
import TextModalDesktopProductPage
    from "@/components/shared/UI/TextModalDesktopProductPage/TextModalDesktopProductPage";
import igBlack from "@/static/icons/igImg.svg";
import tgBlack from "@/static/icons/tg_black.svg";
import imgUs4Mob from "@/static/img/Гарантии 1 mob.png";
import imgUs5Mob from "@/static/img/Гарантии 2 mob.png";
import imgUs6Mob from "@/static/img/Гарантии 3 mob.png";
import imgUs7Mob from "@/static/img/Гарантии 4 mob.png";
import imgUs8Mob from "@/static/img/Гарантии 5 mob.png";
import imgUs9Mob from "@/static/img/Гарантии 6 mob.png";
import imgUs10Mob from "@/static/img/Гарантии 7 mob.png";
import imgUs11Mob from "@/static/img/Гарантии 8 mob.png";
import arrow from "@/static/icons/chevron-right-grey.svg";
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
                                        <Link href={'/'} className={s.brand}>A</Link>
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
                                            <RenderBtns btns={productStore.shipps}/>
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
                {desktopStore.isDesktop && similarProducts.length > 0 &&
                    <Compilation arr={similarProducts} title={'Мастер-классы'} paddings={'regular'}/>
                }
                {desktopStore.isDesktop && lastSeen.length > 0 &&
                    <Compilation arr={lastSeen} title={'Ранее просмотренные'} paddings={'regular'}/>
                }
            </div>
            <ContactModal isOpen={contactOpen} handleClose={closeContact}/>
        </MainLayout>
    );
};

export default observer(Certificate);