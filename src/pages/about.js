import React, {useEffect} from 'react';
import s from '@/styles/AboutUs.module.css'
import MainLayout from "@/layout/MainLayout";
import Image from "next/image";
import Head from "next/head";
import aboutUsImg1 from "@/static/img/aboutUsImg1.png";
import aboutUsImg2 from "@/static/img/aboutUsImg2.png";
import welcomeFlowerLogo from "@/static/img/welcomeFlowerLogo.png";
import {desktopStore} from "@/store/DesktopStore";
import sMob from "@/styles/AboutUsMob.module.css";

const About = () => {

    function changeBrowserColor(color) {
        // Для Chrome, Firefox, Opera на Android
        const themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (themeColorMeta) {
            themeColorMeta.setAttribute('content', color);
        }

        // Для Safari на iOS (к сожалению, не все цвета поддерживаются)
        const statusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
        if (statusBarMeta) {
            // Изменение цвета status-bar на iOS
            statusBarMeta.setAttribute('content', 'black-translucent'); // ограниченные возможности
        }

        // Для Microsoft Edge
        const msNavbuttonMeta = document.querySelector('meta[name="msapplication-navbutton-color"]');
        if (msNavbuttonMeta) {
            msNavbuttonMeta.setAttribute('content', color);
        }
    }

    useEffect(() => {
        changeBrowserColor('#F5EAF0')
    }, [])

    return (
        <MainLayout>
            <Head>
                <title>Les-Jours: Про нас</title>
                <meta name="description" content="Les-Jours: Про нас"/>
            </Head>
            {desktopStore.isDesktop ?
                <div className={s.sectionWrapper}>
                    <div className={s.contentWrapper}>
                        <div className={s.title}>О нас</div>

                        <div className={s.topBlock}>
                            <div className={s.imageBlock}>
                                <Image src={aboutUsImg1} alt="Фото" width={300} height={200} className={s.image}/>
                            </div>
                            <div className={s.textBlock}>
                                <div className={s.text1_1}>Творческая студия Les Jours была создана в 2024 году, как
                                    досуговое
                                    пространство для людей, желающих прикоснуться к творчеству.
                                </div>
                                <div className={s.text1_2}>Мы стремимся оказать поддержку каждому в стремлении познать
                                    новое
                                    и
                                    раскрыть свой потенциал под руководством профессиональных мастеров.
                                </div>
                            </div>
                        </div>

                        <div className={s.bottomBlock}>
                            <div className={s.textBlock} style={{marginTop: 370}}>
                                <div className={s.text2} style={{marginTop: 20}}>Здесь вы забываете о делах, проблемах и
                                    просто наслаждаетесь процессом – собственноручно создаете что-то красивое, что-то
                                    своё.
                                    Это не только про творчество, это про состояние души: когда внутри становится легче,
                                    спокойнее и теплее…
                                </div>
                            </div>
                            <div className={s.imageBlock}>
                                <Image src={aboutUsImg2} alt="Фото" width={300} height={200} className={s.image}/>
                            </div>
                        </div>

                        <div className={s.text}>Приходи к нам, чтобы почувствовать эту магию на себе.
                            Мы уверены, ты уйдёшь с улыбкой, творческой искрой и ощущением, что мир стал чуть лучше!
                        </div>

                        <Image src={welcomeFlowerLogo} alt="Emoji 1" className={`${s.flower} ${s.flower1}`}/>
                        <Image src={welcomeFlowerLogo} alt="Emoji 2" className={`${s.flower} ${s.flower2}`}/>
                        <Image src={welcomeFlowerLogo} alt="Emoji 3" className={`${s.flower} ${s.flower3}`}/>
                        <Image src={welcomeFlowerLogo} alt="Emoji 4" className={`${s.flower} ${s.flower4}`}/>
                        <Image src={welcomeFlowerLogo} alt="Emoji 5" className={`${s.flower} ${s.flower5}`}/>
                        <Image src={welcomeFlowerLogo} alt="Emoji 6" className={`${s.flower} ${s.flower6}`}/>
                        <Image src={welcomeFlowerLogo} alt="Emoji 7" className={`${s.flower} ${s.flower7}`}/>
                        <Image src={welcomeFlowerLogo} alt="Emoji 8" className={`${s.flower} ${s.flower8}`}/>
                        <Image src={welcomeFlowerLogo} alt="Emoji 9" className={`${s.flower} ${s.flower9}`}/>
                        <Image src={welcomeFlowerLogo} alt="Emoji 10" className={`${s.flower} ${s.flower10}`}/>
                    </div>
                </div>
                :
                <div className={sMob.sectionWrapper}>
                    <div className={sMob.contentWrapper}>
                        <div className={sMob.title}>О нас</div>

                        <div className={sMob.text1_1}>Творческая студия Les Jours была создана в 2024 году, как
                            досуговое
                            пространство для людей, желающих прикоснуться к творчеству.
                        </div>

                        <div className={sMob.imageBlock}>
                            <Image src={aboutUsImg2} alt="Фото" width={300} height={200} className={sMob.image}/>
                        </div>

                        <div className={sMob.text1_1}>Мы стремимся оказать поддержку каждому в стремлении
                            познать новое
                            и
                            раскрыть свой потенциал под руководством профессиональных мастеров.
                        </div>

                        <div className={sMob.text1_1}>Здесь вы забываете о делах,
                            проблемах и
                            просто наслаждаетесь процессом – собственноручно создаете что-то красивое, что-то
                            своё.
                            Это не только про творчество, это про состояние души: когда внутри становится легче,
                            спокойнее и теплее…
                        </div>

                        <div className={sMob.imageBlock}>
                            <Image src={aboutUsImg1} alt="Фото" width={300} height={200} className={sMob.image}/>
                        </div>

                        <div className={sMob.text}>Приходи к нам, чтобы почувствовать эту магию на себе.
                            Мы уверены, ты уйдёшь с улыбкой, творческой искрой и ощущением, что мир стал чуть лучше!
                        </div>

                        <Image src={welcomeFlowerLogo} alt="Emoji 1" className={`${sMob.flower} ${sMob.flower1}`}/>
                        <Image src={welcomeFlowerLogo} alt="Emoji 2" className={`${sMob.flower} ${sMob.flower2}`}/>
                        <Image src={welcomeFlowerLogo} alt="Emoji 3" className={`${sMob.flower} ${sMob.flower3}`}/>
                        <Image src={welcomeFlowerLogo} alt="Emoji 4" className={`${sMob.flower} ${sMob.flower4}`}/>
                        <Image src={welcomeFlowerLogo} alt="Emoji 5" className={`${sMob.flower} ${sMob.flower5}`}/>
                        <Image src={welcomeFlowerLogo} alt="Emoji 6" className={`${sMob.flower} ${sMob.flower6}`}/>
                        <Image src={welcomeFlowerLogo} alt="Emoji 7" className={`${sMob.flower} ${sMob.flower7}`}/>
                        <Image src={welcomeFlowerLogo} alt="Emoji 8" className={`${sMob.flower} ${sMob.flower8}`}/>
                        <Image src={welcomeFlowerLogo} alt="Emoji 9" className={`${sMob.flower} ${sMob.flower9}`}/>
                        <Image src={welcomeFlowerLogo} alt="Emoji 10" className={`${sMob.flower} ${sMob.flower10}`}/>
                    </div>
                </div>
            }
        </MainLayout>
    );
};

export default About;