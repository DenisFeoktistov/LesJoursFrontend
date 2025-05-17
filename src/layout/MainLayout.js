import NavbarC from "@/components/shared/NavbarC/NavbarC";
import React, {useContext, useEffect, useLayoutEffect, useState} from "react";
import Footer from "@/components/shared/Footer/Footer";
import ScrollUp from "@/components/shared/ScrollUp/ScrollUp";
import Head from "next/head";
import Cookies from "js-cookie";
import CookieComponent from "@/components/shared/CookieComponent/CookieComponent";
import {Context} from "@/context/AppWrapper";
import {observer} from "mobx-react-lite";
import {useRouter} from 'next/router';

const MainLayout = ({children}) => {
    const {desktopStore} = useContext(Context)
    const router = useRouter();


    const [cookieOpen, setCookieOpen] = useState(false)

    const closeCookie = () => {
        Cookies.set('cookie_message', true, {expires: 2772})
        setCookieOpen(false)
    }

    const checkIsDesktop = () => {

        const width = window.innerWidth

        if (width <= 1200) {
            desktopStore.setIsDesktop(false)
        } else {
            desktopStore.setIsDesktop(true)
        }
    }


    useLayoutEffect(() => {
        if (!Cookies.get('cookie_message')) {
            setCookieOpen(true)
        }

        window.addEventListener('resize', checkIsDesktop);
        checkIsDesktop();

        return () => {
            window.removeEventListener('resize', checkIsDesktop);
        };

    }, [])

    const [canonicalUrl, setCanonicalUrl] = useState('');

    useEffect(() => {
        if (process.browser) {
            const url = window.location.href;
            setCanonicalUrl(url);
        }
    }, [router]);


    return (
        <>
            <Head>
                <link rel="canonical" href={canonicalUrl}/>
                <meta property="og:type" content="website"/>
                <meta property="og:url" content={canonicalUrl}/>
                <link rel={'icon'} type={'image/png'} sizes={"192x192"} href={'/favicon.png'}/>
                <link rel="apple-touch-icon" href="/favicon.jpg"/>
                <link rel={'manifest'} href={'/manifest.json'}/>

                <meta name="google-site-verification" content="-9Lz8B9UM4KuSBbpP5pxTwJW9Ha0ee2nQmpMUTXh75E"/>
                <meta name="yandex-verification" content="82500b5b5e72aa3a"/>
                <meta name="theme-color" content='#ffffff'/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>
                <meta name="mailru-verification" content="2d636d2d3b28c14a"/>


                {/*        <script*/}
                {/*            type="text/javascript"*/}
                {/*            dangerouslySetInnerHTML={{*/}
                {/*                __html: `*/}
                {/*    var _tmr = window._tmr || (window._tmr = []);*/}
                {/*    _tmr.push({id: "3470916", type: "pageView", start: (new Date()).getTime()});*/}
                {/*    (function (d, w, id) {*/}
                {/*        if (d.getElementById(id)) return;*/}
                {/*        var ts = d.createElement("script"); ts.type = "text/javascript"; ts.async = true; ts.id = id;*/}
                {/*        ts.src = "https://top-fwz1.mail.ru/js/code.js";*/}
                {/*        var f = function () {var s = d.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ts, s);};*/}
                {/*        if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); }*/}
                {/*    })(document, window, "tmr-code");*/}
                {/*`,*/}
                {/*            }}*/}
                {/*        />*/}
                {/*<noscript>*/}
                {/*    <div>*/}
                {/*        <img src="https://top-fwz1.mail.ru/counter?id=3470916;js=na"*/}
                {/*             style={{position: 'absolute', left: '-9999px'}} alt="Top.Mail.Ru"/>*/}
                {/*    </div>*/}
                {/*</noscript>*/}


                {/*<meta name="google-site-verification" content="N9kK5FGqkUH2WCQCjRsNPhP-jyCRNa4oWTjkS_Ll_nc" />*/}
                {/*             <script*/}
                {/*                 async*/}
                {/*                 type="text/javascript"*/}
                {/*                 dangerouslySetInnerHTML={{*/}
                {/*                     __html: `*/}
                {/*         (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};*/}
                {/*m[i].l=1*new Date();*/}
                {/*for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}*/}
                {/*k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})*/}
                {/*(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");*/}

                {/*ym(95264330, "init", {*/}
                {/*     clickmap:true,*/}
                {/*     trackLinks:true,*/}
                {/*     accurateTrackBounce:true,*/}
                {/*     webvisor:true,*/}
                {/*     ecommerce:"dataLayer"*/}
                {/*});*/}
                {/*       `,*/}
                {/*                 }}*/}
                {/*             />*/}
            </Head>
            <div className={'body'}>
                <NavbarC/>
                <div className={`${desktopStore.isDesktop ? 'cont_up' : 'cont_up_mob'}`}>
                    {children}
                </div>
                <Footer/>
            </div>
            <ScrollUp/>
            <CookieComponent isOpen={cookieOpen} close={closeCookie}/>
        </>
    );
};

export default observer(MainLayout);
