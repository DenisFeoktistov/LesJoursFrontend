import React, {useState} from 'react';
import Image from "next/image";
import s from './EventsMainPage.module.css'
import sMob from './EventsMainPageMob.module.css'
import {observer} from "mobx-react-lite";
import {desktopStore} from "@/store/DesktopStore";
import eventsImg1 from "@/static/img/eventsImg1.png";
import eventsImg2 from "@/static/img/eventsImg2.png";
import ContactModalEvents from "@/components/shared/ContactModalEvents/ContactModalEvents";
import aboutUsImg2 from "@/static/img/aboutUsImg2.png";
import aboutUsImg1 from "@/static/img/aboutUsImg1.png";
import welcomeFlowerLogo from "@/static/img/welcomeFlowerLogo.png";

const EventsMainPage = () => {
    const [contactOpen, setContactOpen] = useState(false);

    const toggleContact = () => {
        setContactOpen(!contactOpen);
    };

    const closeContact = () => {
        setContactOpen(false);
    };

    return (
        <>
            {
                desktopStore.isDesktop ?
                    <div className={s.sectionWrapper}>
                        <div className={s.contentWrapper}>
                            <div className={s.topBlock}>
                                <div className={s.imageBlock}>
                                    <Image src={eventsImg1} alt="Фото" width={300} height={200} className={s.image}
                                           style={{width: 235}}/>
                                </div>
                                <div className={s.textBlock}>
                                    <div className={s.title}>Мероприятия</div>
                                    <div className={s.text1}>Ищете идеальное место для празднования важного события?
                                    </div>
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
                                    <div className={s.text1} style={{marginTop: 20}}>Всё, что нужно, – это выбрать
                                        мастер-класс, а мы позаботимся о деталях: месте, обстановке, материалах и
                                        поддержке на каждом этапе!
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
                    :
                    <div className={sMob.sectionWrapper}>
                        <div className={sMob.contentWrapper}>
                            <div className={sMob.title}>Мероприятия</div>

                            <div className={sMob.text1_1}>Ищете идеальное место для празднования важного события?
                            </div>

                            <div className={sMob.text1_1}>Мы предлагаем возможность сделать ваш день по-настоящему
                                особенным!
                            </div>

                            <div className={sMob.imageBlock}>
                                <Image src={eventsImg1} alt="Фото" width={300} height={200} className={sMob.image}/>
                            </div>

                            <div className={s.textBlock} style={{marginBottom: 20}}>
                                <div className={s.text2}>-Свидания</div>
                                <div className={s.text2}>-Дни рождения</div>
                                <div className={s.text2}>-Выездные мероприятия</div>
                                <div className={s.text2}>-Корпоративные мероприятия</div>
                                <div className={s.text1_1} style={{marginTop: 20}}>Всё, что нужно, – это выбрать
                                    мастер-класс, а мы позаботимся о деталях: месте, обстановке, материалах и
                                    поддержке на каждом этапе!
                                </div>
                            </div>

                            <div className={sMob.imageBlock}>
                                <Image src={eventsImg2} alt="Фото" width={300} height={200} className={sMob.image}/>
                            </div>

                            <button className={sMob.contactButton} onClick={toggleContact}>Связаться с нами</button>

                            <Image src={welcomeFlowerLogo} alt="Emoji 1" className={`${sMob.flower} ${sMob.flower1}`}/>
                            <Image src={welcomeFlowerLogo} alt="Emoji 2" className={`${sMob.flower} ${sMob.flower2}`}/>
                            <Image src={welcomeFlowerLogo} alt="Emoji 3" className={`${sMob.flower} ${sMob.flower3}`}/>
                            <Image src={welcomeFlowerLogo} alt="Emoji 4" className={`${sMob.flower} ${sMob.flower4}`}/>
                            <Image src={welcomeFlowerLogo} alt="Emoji 5" className={`${sMob.flower} ${sMob.flower5}`}/>
                            <Image src={welcomeFlowerLogo} alt="Emoji 8" className={`${sMob.flower} ${sMob.flower8}`}/>
                            <Image src={welcomeFlowerLogo} alt="Emoji 9" className={`${sMob.flower} ${sMob.flower9}`}/>
                        </div>
                        <ContactModalEvents isOpen={contactOpen} handleClose={closeContact}/>
                    </div>
            }
        </>
    );
};

export default observer(EventsMainPage);