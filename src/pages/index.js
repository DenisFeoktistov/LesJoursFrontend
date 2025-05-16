import React, {useState} from "react";
import Image from "next/image";
import {observer} from "mobx-react-lite";
import MainLayout from "@/layout/MainLayout";

import Head from "next/head";
import {desktopStore} from "@/store/DesktopStore";
import s from "@/styles/Home.module.css";
import logo from "@/static/img/sellout_logo_light_blood.svg";
import {fetchProductsPage} from "@/http/productsApi";
import ProductListMainPage from "@/components/shared/UI/ProductListMainPage/ProductListMainPage";
import EventsMainPage from "@/components/shared/UI/EventsMainPage/EventsMainPage";
import CertificateMainPage from "@/components/shared/UI/CertificateMainPage/CertificateMainPage";
import WelcomeMainPage from "@/components/shared/UI/WelcomeMainPage/WelcomeMainPage";
import {parse} from "cookie";

export const getServerSideProps = async (context) => {
    const cookies = parse(context.req.headers.cookie || '')
    const token = cookies['access_token']
    const url = {}
    const productsAll = await fetchProductsPage(url, token);

    return {props: {productsAll}};
}


const Home = ({productsAll}) => {
    const [products, setProducts] = useState(productsAll)

    const renderPage = () => {
        const arr = []

        arr.push(
            <WelcomeMainPage/>
        )

        arr.push(
            <ProductListMainPage products={products.results}/>
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
                <title>Творческая студия Les-Jours</title>
                <meta
                    name="description"
                    content="Мастер-классы от Les-Jours"
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
                            {!desktopStore.isDesktop &&
                                <div className={s.headerM}>
                                    <div className={s.headerTop}>
                                        <div className={s.logoContainer}>
                                            <Image src={logo} alt="Logo" className={s.logo} width={370}
                                                   height={50}/>
                                        </div>
                                    </div>
                                </div>
                            }

                            {renderPage()}
                        </>
                    </div>
                </div>

            </div>
        </MainLayout>

    );
}

export default observer(Home);



