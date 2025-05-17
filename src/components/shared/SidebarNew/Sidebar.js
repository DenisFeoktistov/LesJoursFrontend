import React, {useEffect, useRef, useState} from 'react';
import s from './Sidebar.module.css'
import tg from '@/static/icons/tg.svg'
import tgBlack from '@/static/icons/tg_black.svg'
import Image from "next/image";
import {observer} from "mobx-react-lite";
import logo from '@/static/icons/les-jours-logo-desktop.png'
import arrow from '@/static/icons/chevron-right.svg'
import Link from "next/link";
import ContactModal from "@/components/shared/ContactModal/ContactModal";
import TextModal from "@/components/shared/UI/TextModal/TextModal";
import payment from "@/static/icons/payment.svg";
import refund from "@/static/icons/arrow-return-left.svg";
import LoyaltyFAQ from "@/components/pages/account/LoyaltyFAQ/LoyaltyFAQ";
import igBlack from "@/static/icons/igImg.svg";
import igWhite from "@/static/icons/igImgWhite.svg";
import {desktopStore} from "@/store/DesktopStore";
import styles from "@/styles/MobileMenuMen.module.css";
import cross from "@/static/icons/x-lg.svg";
import {Col, Row} from "react-bootstrap";
import PartnershipsImg from "@/static/icons/PartnershipsImg.svg";
import mastersImg from "@/static/icons/mastersImg.svg";

const Sidebar = () => {
    const sidebarRef = useRef(null)
    const [isClosing, setIsClosing] = useState(false);
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            desktopStore.setMobileSideBar(false)
            document.body.classList.remove('body-scroll-clip')
        }, 300);
    }

    // Сброс состояния закрытия при повторном открытии
    useEffect(() => {
        if (desktopStore.mobileSideBar) {
            setIsClosing(false);
        }
    }, [desktopStore.mobileSideBar]);


    const [contactOpen, setContactOpen] = useState(false)

    const toggleContact = () => {
        setContactOpen(!contactOpen)
    }
    const closeContact = () => {
        setContactOpen(false)
    }
    useEffect(() => {
        document.body.classList.add('body-scroll-clip')

        return () => {
            document.body.classList.remove('body-scroll-clip')
        }
    }, [])

    return (
        <>
            <div className={`${s.sidebar} ${isClosing ? s.closingSideBar : ""}`} ref={sidebarRef}>
                <div className={styles.header}>
                    {/* Первая часть: Логотип и крестик */}
                    <div className={styles.headerTop}>
                        <div className={styles.logoContainer}>
                            <Image src={logo} alt="Logo" className={styles.logo} width={235} height={170}/>
                        </div>
                        <div className={styles.closeButton} onClick={handleClose}>
                            <Image src={cross} alt="Back" className={styles.backArrow} width={24}
                                   height={24}/>
                        </div>
                    </div>
                </div>

                <div className={s.navLinksBlock}>
                    <Link href="/products" className={s.navLink} onClick={handleClose}>
                        <span>Мастер-Классы</span>
                        <Image src={arrow} alt="" className={s.arrow}/>
                    </Link>
                    <Link href="/events" className={s.navLink} onClick={handleClose}>
                        <span>Мероприятия</span>
                        <Image src={arrow} alt="" className={s.arrow}/>
                    </Link>
                    <Link href="/certificate" className={s.navLink} onClick={handleClose}>
                        <span>Сертификаты</span>
                        <Image src={arrow} alt="" className={s.arrow}/>
                    </Link>
                </div>


                <div className={`${s.sidebar_footer}`}>
                    <div style={{fontSize: 27, fontWeight: 500, marginTop: 20}}>
                        Les-Jours
                    </div>
                    <div className={s.footer_link} style={{marginTop: 0}}>
                        <Link href="/about" className={s.footer_link} onClick={handleClose}>О нас</Link>
                    </div>
                    <div className={s.footer_link}>
                        <Link href="https://t.me/lesjours_bot" className={s.footer_link}
                              target={'_blank'}>ТГ-бот</Link>
                    </div>
                    <TextModal title={'Отмена записи на мастер-класс'} img={payment}
                               titleClassname={s.footer_link}>
                        <Image src={refund} alt='' width={60}/>
                        <h4 className={'my-3'}>Отмена записи на мастер-класс</h4>
                        <p className={s.text}>
                            Мы ценим Ваше время и стараемся обеспечить наилучший опыт на каждом нашем
                            мастер-классе. Поэтому, если у Вас возникла необходимость отменить участие,
                            пожалуйста, предупредите нас <span
                            style={{fontWeight: 700}}>не менее чем за 3 дня</span> до запланированной
                            даты
                            проведения.
                            Если отмена происходит менее чем за 3 дня до мастер-класса, стоимость участия не
                            возвращается. Это связано с тем, что наши мастера и мы начинаем подготовку заранее:
                            закупаем и готовим материалы, планируем рабочее место и, в случае кулинарных
                            мастер-классов, начинаем делать заготовки на определенное количество человек, чтобы
                            все было свежим и идеально подходило для вашего творчества.
                        </p>
                        <p className={s.text}>
                            Мы благодарим Вас за понимание и ценим Ваше уважение к нашему труду!
                        </p>
                        <div className={s.faq_block}>
                            <h5 className={'text-center'}>Часто задаваемые вопросы</h5>
                            <LoyaltyFAQ title={'Почему нужно предупреждать об отмене именно за 3 дня?'}>
                                Мы с мастерами начинаем подготовку заранее — закупаем необходимые материалы,
                                планируем и готовим заготовки. Например, для бенто-тортов мы выпекаем коржи за
                                день-два до мастер-класса, чтобы на занятии все было свежим и качественным.
                            </LoyaltyFAQ>
                            <LoyaltyFAQ
                                title={'Если я не смогу прийти, можно ли просто перенести участие на другой день?'}>
                                Да, при условии, что вы предупредите нас не менее чем за 3 дня. В противном
                                случае стоимость участия не возвращается, и перенос будет невозможен.
                            </LoyaltyFAQ>
                            <LoyaltyFAQ title={'Могу ли я пригласить другого человека на свое место?'}>
                                Конечно! Вы можете передать свое место другому человеку, просто сообщите нам его
                                имя и контакты.
                            </LoyaltyFAQ>
                            <LoyaltyFAQ title={'Почему не вернуть деньги, если материалы остаются?'}>
                                К сожалению, многие материалы индивидуальны и готовятся специально под каждого
                                участника. В случае отмены за короткий срок, они уже подготовлены, и в некоторых
                                случаях их невозможно использовать повторно.

                            </LoyaltyFAQ>
                            <LoyaltyFAQ
                                title={'Как быстро вернутся деньги, если я отменил мастер-класс вовремя?'}>
                                Возврат производится в течение 3 рабочих дней с момента получения запроса на
                                отмену. Менеджер обязательно проконсультирует Вас.
                            </LoyaltyFAQ>
                        </div>
                        <h5>Ответы на большинство вопросов вы найдете здесь: <Link href={'/faq'}
                                                                                   className={s.link}
                                                                                   target={'_blank'}>FAQ</Link>
                        </h5>

                    </TextModal>
                    <TextModal title={'Партнерства и коллаборации'} img={payment}
                               titleClassname={s.footer_link}>
                        <Image src={PartnershipsImg} alt='' width={60}/>
                        <h4 className={'my-3'}>Партнерства и коллаборации</h4>
                        <p className={s.text}>
                            Мы всегда открыты к новым идеям и совместным проектам!
                            За время нашей работы у нас был успешный опыт коллабораций с ресторанами, ювелирными
                            брендами и шоурумами, салонами красоты и образовательными учреждениями, а также с
                            блогерами и инфлюенсерами. Мы с радостью поддерживаем взаимный пиар, организуем
                            совместные мероприятия и проводим мастер-классы в самых необычных местах.
                        </p>
                        <p className={s.text}>
                            Мы готовы рассмотреть самые разнообразные формы сотрудничества!
                        </p>
                        <p className={s.text}>
                            Если у вас есть идея для партнёрства или вы хотите предложить сотрудничество —
                            пишите нам! Мы всегда рады новым возможностям и готовы создавать что-то необычное
                            вместе с вами.
                        </p>
                        <div style={{marginTop: 30, marginBottom: 30}}>
                            <div>
                                WhatsApp: <a href={'https://wa.me/79832858399'}
                                             target={'_blank'}
                                             className={s.link}>+7 983 285-83-99</a>
                            </div>
                            <div>
                                Telegram: <a href={'https://t.me/les_jour_mk'}
                                             target={'_blank'}
                                             className={s.link}>@les_jour_mk</a>
                            </div>
                        </div>
                        <div>
                            <h5>Мы в социальных сетях:</h5>
                            <div className={s.icons_block}>
                                <div className={s.socialsCont}>
                                    <a style={{height: '45px'}}>
                                        <Image src={igBlack} height={40} alt="" className={s.icon}/>
                                    </a>
                                    <span className={s.mainSocialsText}>
                                                  Запретграм: <br/> @les_jours
                                            </span>
                                </div>

                                <div className={s.socialsCont}>
                                    <a href={'https://t.me/les_jours'} style={{height: '37px'}}>
                                        <Image src={tgBlack} height={37} alt="" className={s.icon}/>
                                    </a>
                                    <span className={s.mainSocialsText}>
                                                  Телеграм: <br/>
                                                  @<a href="https://t.me/les_jours" className={s.linkTgSocials}>
                                                    les_jours
                                                  </a>
                                            </span>
                                </div>
                            </div>
                        </div>
                        <h5>Ответы на большинство вопросов вы найдете здесь: <Link href={'/faq'}
                                                                                   className={s.link}
                                                                                   target={'_blank'}>FAQ</Link>
                        </h5>

                    </TextModal>
                    <TextModal title={'Информация для мастеров'} img={payment}
                               titleClassname={s.footer_link}>
                        <Image src={mastersImg} alt='' width={60}/>
                        <h4 className={'my-3'}>Информация для мастеров</h4>
                        <p className={s.text}>
                            Станьте мастером в Les Jours!<br/><br/>
                            Вы талантливый мастер, и у вас есть желание делиться своим опытом и вдохновлять
                            других? Мы всегда открыты для новых направлений и готовы к сотрудничеству!
                        </p>
                        <p className={s.text}>
                            В Les Jours мы проводим мастер-классы по самым разным тематикам: от кулинарии и
                            флористики до искусства и ремесел. Если у вас есть интересная идея или вы хотите
                            вести занятия в нашем пространстве — мы будем рады обсудить детали и организовать
                            совместный проект.
                        </p>
                        <p className={s.text}>
                            Что мы предлагаем:
                        </p>
                        <p className={s.text} style={{textAlign: "left"}}>
                            &bull; Гибкий формат сотрудничества — разовые мастер-классы или регулярные
                            занятия.<br/>
                            &bull; Организация и поддержка — мы берём на себя рекламу, поиск участников и
                            подготовку локации.<br/>
                            &bull; Продвижение в наших соцсетях — расскажем о вас и вашем мастерстве широкой
                            аудитории.<br/>
                            &bull; Взаимный рост и развитие — вместе мы создаём пространство для творчества и
                            самовыражения.
                        </p>
                        <p className={s.text}>
                            Неважно, преподаёте ли вы уже или только мечтаете об этом — напишите нам, и,
                            возможно, именно ваш мастер-класс станет следующим в расписании Les Jours!
                        </p>
                        <div style={{marginTop: 30, marginBottom: 30}}>
                            <div>
                                WhatsApp: <a href={'https://wa.me/79832858399'}
                                             target={'_blank'}
                                             className={s.link}>+7 983 285-83-99</a>
                            </div>
                            <div>
                                Telegram: <a href={'https://t.me/les_jour_mk'}
                                             target={'_blank'}
                                             className={s.link}>@les_jour_mk</a>
                            </div>
                        </div>
                        <div>
                            <h5>Мы в социальных сетях:</h5>
                            <div className={s.icons_block}>
                                <div className={s.socialsCont}>
                                    <a style={{height: '45px'}}>
                                        <Image src={igBlack} height={40} alt="" className={s.icon}/>
                                    </a>
                                    <span className={s.mainSocialsText}>
                                                  Запретграм: <br/> @les_jours
                                            </span>
                                </div>

                                <div className={s.socialsCont}>
                                    <a href={'https://t.me/les_jours'} style={{height: '37px'}}>
                                        <Image src={tgBlack} height={37} alt="" className={s.icon}/>
                                    </a>
                                    <span className={s.mainSocialsText}>
                                                  Телеграм: <br/>
                                                  @<a href="https://t.me/les_jours" className={s.linkTgSocials}>
                                                    les_jours
                                                  </a>
                                            </span>
                                </div>
                            </div>
                        </div>
                        <h5>Ответы на большинство вопросов вы найдете здесь: <Link href={'/faq'}
                                                                                   className={s.link}
                                                                                   target={'_blank'}>FAQ</Link>
                        </h5>

                    </TextModal>


                    <div style={{fontSize: 21, fontWeight: 500, marginTop: 20}}>
                        Остались вопросы?
                    </div>
                    <div>
                        <Link href="/faq" className={s.footer_link} target={'_blank'}>Ответы на большинство: <span
                            style={{textDecoration: "underline", textUnderlineOffset: 4}}>FAQ</span></Link>
                    </div>
                    <div className={s.footer_link}>
                    <span
                        onClick={toggleContact}
                    >Контакты службы поддержки</span>
                    </div>
                    <Row className={'w-100'}>
                        <Col lg={4}>
                            <div className={s.social_media2}>
                                <h4 className={s.row2} style={desktopStore.isDesktop ? {} : {fontSize: 24}}>Мы в
                                    социальных
                                    сетях:</h4>
                                <div className={s.icons_block3}>
                                    <div className={s.socialsCont}>
                                        <a>
                                            <Image src={igWhite} height={desktopStore.isDesktop ? 33 : 35} alt=""
                                                   className={s.icon}/>
                                        </a>
                                        <span className={s.mainSocialsText2}>
                                      Запретграм: <br/> @les_jours
                                </span>
                                    </div>
                                    <div className={s.socialsCont}>
                                        <a href={'https://t.me/les_jours'}>
                                            <Image src={tg} height={desktopStore.isDesktop ? 33 : 35} alt=""
                                                   className={s.icon}/>
                                        </a>
                                        <span className={s.mainSocialsText2}>
                                      Телеграм: <br/>
                                      @<a href="https://t.me/les_jours" className={s.linkTgSocials2}>
                                        les_jours
                                      </a>
                                </span>
                                    </div>

                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>

            </div>
            <ContactModal isOpen={contactOpen} handleClose={closeContact}/>
        </>
    );
};

export default observer(Sidebar);