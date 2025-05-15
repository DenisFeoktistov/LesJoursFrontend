import React, {useEffect, useState} from 'react';
import s from '../components/shared/UI/EventsMainPage/EventsMainPage.module.css'
import MainLayout from "@/layout/MainLayout";
import Image from "next/image";
import Head from "next/head";
import eventsImg1 from "@/static/img/eventsImg1.png";
import eventsImg2 from "@/static/img/eventsImg2.png";
import ContactModalEvents from "@/components/shared/ContactModalEvents/ContactModalEvents";

const Events = () => {
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
                <title>Мероприятия от Les-Jours</title>
                <meta name="description" content="Мероприятия от Les-Jours"/>
            </Head>
            <div className={s.sectionWrapper}>
                <div className={s.contentWrapper}>
                    <div className={s.topBlock}>
                        <div className={s.imageBlock}>
                            <Image src={eventsImg1} alt="Фото" width={300} height={200} className={s.image}
                                   style={{width: 235}}/>
                        </div>
                        <div className={s.textBlock}>
                            <div className={s.title}>Мероприятия</div>
                            <div className={s.text1}>Ищете идеальное место для празднования важного события?</div>
                            <div className={s.text1}>Мы предлагаем возможность сделать ваш день по-настоящему
                                особенным!
                            </div>
                        </div>
                    </div>

                    <div className={s.bottomBlock}>
                        <div className={s.textBlock} style={{marginTop: 120}}>
                            <div className={s.text2}>-Свидания</div>
                            <div className={s.text2}>-Дни рождения</div>
                            <div className={s.text2}>-Выездные мероприятия</div>
                            <div className={s.text2}>-Корпоративные мероприятия</div>
                            <div className={s.text1} style={{marginTop: 20}}>Всё, что нужно, – это выбрать мастер-класс,
                                а мы позаботимся о деталях: месте, обстановке, материалах и поддержке на каждом этапе!
                            </div>
                        </div>
                        <div className={s.imageBlock}>
                            <Image src={eventsImg2} alt="Фото" width={300} height={200} className={s.image}
                                   style={{width: 250}}/>
                        </div>
                    </div>

                    <button className={s.contactButton} onClick={toggleContact}>Связаться с нами</button>
                </div>
                <ContactModalEvents isOpen={contactOpen} handleClose={closeContact}/>
            </div>
        </MainLayout>
    );
};

export default Events;