import React, {useContext, useEffect, useLayoutEffect, useState, useRef} from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import {useRouter} from "next/router";
import {observer} from "mobx-react-lite";
import MainLayout from "@/layout/MainLayout";

import styles from "@/styles/MainPage.module.css";
import stylesMob from "@/styles/MainPageMobile.module.css";
import Head from "next/head";
import {desktopStore} from "@/store/DesktopStore";
import s from "@/styles/Home.module.css";
import logo from "@/static/img/sellout_logo_light_blood.svg";
import Link from "next/link";
import arrowNew from "@/static/icons/arrowSlider.svg";
import PopularBrandsMainPage from "@/components/shared/UI/PopularBrandsMainPage/PopularBrandsMainPage";
import PromoBannerMainPageAbout from "@/components/shared/UI/PromoBannerMainPageAbout/PromoBannerMainPageAbout";
import PromoBannerMainPageOffers from "@/components/shared/UI/PromoBannerMainPageOffers/PromoBannerMainPageOffers";
import MultiSectionCirclesGrid from "@/components/shared/UI/MultiSectionCirclesGrid/MultiSectionCirclesGrid";
import MultiSectionRecs from "@/components/shared/UI/MultiSectionRecs/MultiSectionRecs";
import MultiSectionImages from "@/components/shared/UI/MultiSectionImages/MultiSectionImages";
import FirstMainBlock from "@/components/shared/UI/FirstMainBlock/FirstMainBlock";
import ComplexMainPageBlock from "@/components/shared/UI/ComplexMainPageBlock/ComplexMainPageBlock";
import MainImgBlock from "@/components/shared/UI/MainImgBlock/MainImgBlock";
import Selection from "@/components/shared/UI/Selection/Selection";
import ProductList from "@/components/pages/product/ProductList/ProductList";
import {fetchProductsPage} from "@/http/productsApi";
import loading_products_data from "@/static/jsons/loading_products_data.json";
import ProductListMainPage from "@/components/shared/UI/ProductListMainPage/ProductListMainPage";
import EventsMainPage from "@/components/shared/UI/EventsMainPage/EventsMainPage";
import CertificateMainPage from "@/components/shared/UI/CertificateMainPage/CertificateMainPage";
import WelcomeMainPage from "@/components/shared/UI/WelcomeMainPage/WelcomeMainPage";

export const getServerSideProps = async (context) => {

    return {props: {}};
}


const Home = ({data}) => {
    const router = useRouter();

    const [isDesktop, setIsDesktop] = useState(true)
    const checkIsDesktop = () => {
        const width = window.innerWidth
        const height = window.innerHeight;

        // if (width <= 1497) {
        //     setIsDesktop(false)
        // } else {
        //     setIsDesktop(true)
        // }

        // Вычисляем значение по моей формуле
        const threshold = (2144 / 1720) * width + 110 + 2.5 * Math.min(37, 0.045 * width);

        if (height >= threshold) {
            setIsDesktop(false);
        } else {
            setIsDesktop(true);
        }
    }
    useEffect(() => {
        window.addEventListener("resize", checkIsDesktop);
        // Call handler right away so state gets updated with initial window size
        checkIsDesktop();
        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", checkIsDesktop);
    })

    const [products, setProducts] = useState(loading_products_data)
    useEffect(() => {
        setProducts(loading_products_data)
    }, [router.asPath])

    useEffect(() => {
        const fetchData = async () => {
            const token = Cookies.get('access_token')
            const url = {}
            let data_products
            data_products = await fetchProductsPage(url, token)
            setProducts(data_products)
        };
        fetchData();
    }, [router.asPath])

    const renderPage = () => {
        const arr = []

        arr.push(
            <WelcomeMainPage/>
        )

        arr.push(
            <ProductListMainPage products={products.results} isAdmin={false} showPromos={false}/>
        )

        arr.push(
            <EventsMainPage/>
        )

        arr.push(
            <CertificateMainPage/>
        )

        return arr
    }

    return (
        <MainLayout>
            <Head>
                <title>Sellout: онлайн-платформа брендовой одежды и обуви</title>
                <meta
                    name="description"
                    content="2 000 000+ лотов по лучшим ценам с гарантией оригинальности: от премиальных и лимитированных релизов до более доступных, но не менее желанных позиций"
                />
                <meta property="og:image"
                      content="https://sellout.su/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo_sq.02469b83.png&w=640&q=75"/>
                <meta property="og:image:width" content="640px"/>
                <meta property="og:image:height" content="640px"/>
            </Head>
            <div>
                <div>
                    <div className={s.cont}>
                        <>
                            {/* Your existing code for rendering the main content */}
                            {!desktopStore.isDesktop &&
                                <div className={s.headerM}>
                                    {/* Первая часть: Логотип и крестик */}
                                    <div className={s.headerTop}>
                                        <div className={s.logoContainer}>
                                            <Image src={logo} alt="Logo" className={s.logo} width={370}
                                                   height={50}/>
                                        </div>
                                    </div>
                                </div>
                            }

                            {renderPage()} {/* Рендерим страницы через функцию */}
                        </>
                    </div>
                </div>

            </div>
        </MainLayout>

    );
}

// const Home = ({data}) => {
//     const router = useRouter()
//     const {desktopStore} = useContext(Context)
//     // const [isDesktop, setIsDesktop] = useState(true)
//
//     // useLayoutEffect(() => {
//     //     const savedGender = Cookies.get('selected_gender');
//     //     // if (savedGender) {
//     //     //     if (savedGender === "M") {
//     //     //         router.push("/men")
//     //     //     } else {
//     //     //         router.push("/women")
//     //     //     }
//     //     // }
//     //     const checkIsDesktop = () => {
//     //         const width = window.innerWidth;
//     //         setIsDesktop(width > 1200);
//     //     };
//     //     checkIsDesktop();
//     //
//     // }, []);
//
//
//     const [isSend, setIsSend] = useState(false)
//     const [show, setShow] = useState(false);
//     const handleClose = () => {
//         setShow(false)
//     };
//     const handleShow = () => {
//         setShow(true)
//         setIsSend(false)
//     };
//
//     const [currentPage, setCurrentPage] = useState('men');
//
//     const handleSwipeLeft = () => {
//         setCurrentPage('women');
//         router.push('/women');
//     };
//
//     const handleSwipeRight = () => {
//         setCurrentPage('men');
//         router.push('/men');
//     };
//
//     return (
//         <MainLayout>
//             <Head>
//                 <title>Sellout: онлайн-платформа брендовой одежды и обуви</title>
//                 <meta property="og:title" content="Sellout: онлайн-платформа брендовой одежды и обуви"/>
//                 <meta property="og:description" content="2 000 000+ лотов по лучшим ценам с гарантией оригинальности: от премиальных и лимитированных релизов до более доступных, но не менее желанных позиций"
//                 />
//
//                 <meta
//                     name="description"
//                     content="2 000 000+ лотов по лучшим ценам с гарантией оригинальности: от премиальных и лимитированных релизов до более доступных, но не менее желанных позиций"
//                 />
//                 <meta property="og:image" content="https://sellout.su/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo_sq.02469b83.png&w=640&q=75"/>
//                 <meta property="og:image:width" content="640px"/>
//                 <meta property="og:image:height" content="640px"/>
//             </Head>
//             <div>
//                 {/*<div className={s.main_cont + ' custom_cont'}>*/}
//                 {/*    /!*<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>*!/*/}
//                 {/*    /!*    <Stories />*!/*/}
//                 {/*    /!*</div>*!/*/}
//                 {/*    /!*<Swipeable onSwipedLeft={handleSwipeLeft} onSwipedRight={handleSwipeRight}>*!/*/}
//                 {/*    /!*    /!*<div>*!/*!/*/}
//                 {/*    /!*    /!*    {currentPage === 'men' && <MenPage />}*!/*!/*/}
//                 {/*    /!*    /!*    {currentPage === 'women' && <WomenPage />}*!/*!/*/}
//                 {/*    /!*    /!*</div>*!/*!/*/}
//                 {/*    /!*</Swipeable>*!/*/}
//                 {/*</div>*/}
//
//                 <div className={s.cont}>
//
//                     {/*<br/>*/}
//                     {desktopStore.isDesktop ?
//                         <div>
//                             <div>
//                                 <div className={s.main}
//                                      style={{width: '50%', margin: '0 auto', padding: 0, float: 'left'}}>
//                                     <Link href="/women">
//
//                                         <Image src={kylie} alt="Description of your image"
//                                                style={{float: 'left', cursor: 'pointer'}}
//                                                layout="responsive" loading={'eager'}/></Link>
//
//                                 </div>
//
//                                 <div className={s.main}
//                                      style={{width: '50%', margin: '0 auto', padding: 0, float: 'right'}}>
//                                     <Link href="/men">
//
//                                         <Image src={manBig} alt="Description of your image"
//                                                style={{float: 'left', cursor: 'pointer'}}
//                                                layout="responsive" loading={'eager'}/></Link>
//
//                                 </div>
//                             </div>
//                             <div>
//                                 <div style={{width: '100%', margin: '0 auto', padding: 0}}>
//                                     <Link href="/about">
//                                         <Image
//                                             src={mainbig}
//                                             alt="Description of your image"
//                                             layout="responsive"
//                                             loading={'eager'}
//                                         />
//                                     </Link>
//                                 </div>
//                             </div>
//                         </div>
//                         :
//                         <div>
//                             {/*<div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: "10px", paddingBottom: "80px" }}>*/}
//                                 <div className={s.main} style={{ width: '100%', margin: '0 auto', padding: 0}}>
//                                     <Link href="/women">
//                                         <Image src={women_mob} alt="Description of your image" style={{float: 'left', cursor: 'pointer'}} layout="responsive" loading={'eager'} />
//                                     </Link>
//                                 </div>
//                                  <div className={s.main} style={{ width: '100%', margin: '0 auto', padding: 0 }}>
//                                     <Link href="/men">
//                                         <Image src={men_mob} alt="Description of your image" style={{float: 'left', cursor: 'pointer'}} layout="responsive" loading={'eager'} />
//                                     </Link>
//                                 </div>
//                             {/*</div>*/}
//
//
//                             {/*<div style={{width: '100%', margin: '0 auto', padding: 0}}>*/}
//                             {/*    <Link href="/women">*/}
//
//                             {/*        <Image src={kylieBig} alt="Description of your image"*/}
//                             {/*               style={{float: 'left', cursor: 'pointer'}}*/}
//                             {/*               layout="responsive" loading={'eager'}/>*/}
//                             {/*    </Link>*/}
//
//
//                             {/*</div>*/}
//                             {/*<div style={{width: '100%', margin: '0 auto', padding: 0}}>*/}
//                             {/*    <Link href="/men">*/}
//
//                             {/*        <Image src={manBig} alt="Description of your image"*/}
//                             {/*               style={{float: 'left', cursor: "pointer"}}*/}
//                             {/*               layout="responsive" loading={'eager'}/></Link>*/}
//
//
//                             {/*</div>*/}
//                             <div className={s.main} style={{width: '100%', margin: '0 auto', padding: 0}}>
//                                 <Link href="/about">
//                                     <Image
//                                         src={mainbigMob}
//                                         alt="Description of your image"
//                                         layout="responsive"
//                                         loading={'eager'}
//                                     />
//                                 </Link>
//                             </div>
//                         </div>}
//                     <BuyoutModal show={show} handleClose={handleClose} isSend={isSend}/>
//                     <div className={s.text_container} style={{marginTop: 0}}>
//                         <div className={s.text}>
//                             Не нашли то, что искали? <br/>
//                             Мы привезем для вас желанный лот!
//                         </div>
//                         <div className={'d-flex justify-content-center'}>
//                             <button onClick={handleShow} className={s.toggle_btn}>
//                                 Оставить заявку
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//
//             </div>
//         </MainLayout>
//     )
// };
export default observer(Home);



