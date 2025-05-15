import React, {useEffect, useState} from 'react';
import s from '@/styles/AboutUs.module.css'
import MainLayout from "@/layout/MainLayout";
import Image from "next/image";
import Head from "next/head";
import aboutUsImg1 from "@/static/img/aboutUsImg1.png";
import aboutUsImg2 from "@/static/img/aboutUsImg2.png";
import welcomeFlowerLogo from "@/static/img/welcomeFlowerLogo.png";


const About = () => {
    const [isDesktop, setIsDesktop] = useState(true)
    const checkIsDesktop = () => {
        const width = window.innerWidth
        if (width <= 1200) {
            setIsDesktop(false)
        } else {
            setIsDesktop(true)
        }
    }
    useEffect(() => {
        window.addEventListener("resize", checkIsDesktop);
        // Call handler right away so state gets updated with initial window size
        checkIsDesktop();
        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", checkIsDesktop);
    })
    return (
        <MainLayout>
            <Head>
                <title>Les-Jours: Про нас</title>
                <meta name="description" content="Les-Jours: Про нас"/>
            </Head>
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
                            <div className={s.text1_2}>Мы стремимся оказать поддержку каждому в стремлении познать новое
                                и
                                раскрыть свой потенциал под руководством профессиональных мастеров.
                            </div>
                        </div>
                    </div>

                    <div className={s.bottomBlock}>
                        <div className={s.textBlock} style={{marginTop: 370}}>
                            <div className={s.text2} style={{marginTop: 20}}>Здесь вы забываете о делах, проблемах и
                                просто наслаждаетесь процессом – собственноручно создаете что-то красивое, что-то своё.
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
        </MainLayout>
    );
};

export default About;