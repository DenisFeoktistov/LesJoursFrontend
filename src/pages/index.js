import React, {useState} from "react";
import {observer} from "mobx-react-lite";
import MainLayout from "@/layout/MainLayout";
import Head from "next/head";
import s from "@/styles/Home.module.css";
import {fetchProductsPage} from "@/http/productsApi";
import ProductListMainPage from "@/components/shared/UI/ProductListMainPage/ProductListMainPage";
import EventsMainPage from "@/components/shared/UI/EventsMainPage/EventsMainPage";
import CertificateMainPage from "@/components/shared/UI/CertificateMainPage/CertificateMainPage";
import WelcomeMainPage from "@/components/shared/UI/WelcomeMainPage/WelcomeMainPage";
import {parse} from "cookie";
import AboutUsMainPage from "@/components/shared/UI/AboutUsMainPage/AboutUsMainPage";
import Cookies from "js-cookie";

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
            <WelcomeMainPage key={'1'}/>
        )

        arr.push(
            <AboutUsMainPage key={'2'}/>
        )

        arr.push(
            <ProductListMainPage products={products.results} key={'3'}/>
        )

        arr.push(
            <EventsMainPage key={'4'}/>
        )

        arr.push(
            <CertificateMainPage key={'5'}/>
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
                            {renderPage()}
                        </>
                    </div>
                </div>

            </div>
        </MainLayout>

    );
}

export default observer(Home);



