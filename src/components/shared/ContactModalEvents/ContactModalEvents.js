import React, {useContext} from 'react';
import s from './ContactModalEvents.module.css'
import {Modal} from "react-bootstrap";
import cross from '@/static/icons/x-lg.svg'
import Image from "next/image";
import headphones from '@/static/icons/headphones-circle.svg'
import Link from "next/link";
import tg from "@/static/icons/tg_black.svg";
import vk from "@/static/icons/vk_black.svg";
import inst_star from "@/static/icons/instagram_star.svg";
import igBlack from "@/static/icons/igImg.svg";
import tgBlack from "@/static/icons/tg_black.svg";
import {Context} from "@/context/AppWrapper";
import LoyaltyFAQ from "@/components/pages/account/LoyaltyFAQ/LoyaltyFAQ";

const ContactModalEvents = ({isOpen, handleClose}) => {
    const {desktopStore} = useContext(Context)

    return (
        <Modal
            show={isOpen}
            onHide={handleClose}
            centered={true}
            fullscreen={!desktopStore.isDesktop}
            size={'lg'}
        >
            <Modal.Body>
                <div className={'d-flex justify-content-end'}>
                    <Image src={cross} alt='' onClick={handleClose} style={{cursor: 'pointer'}}/>
                </div>
                <div className={s.content}>
                    <Image src={headphones} alt='' width={60}/>
                    <div className={s.text_cont}>
                        <h5>Свяжитесь с нами, и мы подберем для вас лучшее предложение по Вашему мероприятию!</h5>
                        <div>
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
                                        <Image src={igBlack} height={40} alt=""
                                               className={s.icon}/>
                                    </a>
                                    <span className={s.mainSocialsText}>
                                                  Запретграм: <br/> @les_jours
                                            </span>
                                </div>

                                <div className={s.socialsCont}>
                                    <a href={'https://t.me/les_jours'} style={{height: '37px'}}>
                                        <Image src={tgBlack} height={37} alt=""
                                               className={s.icon}/>
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
                        <div className={s.faq_block}>
                            <h5 className={'text-center'}>Часто задаваемые вопросы</h5>
                            <LoyaltyFAQ
                                title={'Где будет проходить мероприятие?'}>
                                Мы можем провести мероприятие как в нашей студии, так и организовать его в любом удобном
                                для вас месте. Это может быть ресторан, парк и даже яхта!
                            </LoyaltyFAQ>
                            <LoyaltyFAQ
                                title={'На какое количество человек вы проводите мероприятие?'}>
                                Мы можем организовать как свидание на 2 человека, так и корпоратив или день рождения на
                                20+ человек.
                            </LoyaltyFAQ>
                            <LoyaltyFAQ title={'Как рассчитывается стоимость мероприятия?'}>
                                Стоимость мероприятия рассчитывается по многим факторам: место проведения, количество
                                человек, выбранный формат мастер-класса и наличие дополнительных факторов - декорации,
                                закуски и др.
                            </LoyaltyFAQ>
                            <LoyaltyFAQ title={'Можно ли приносить с собой еду и напитки?'}>
                                Да, можно. В отличии от обычного мастер-класса, здесь вы можете принести свою еду.
                            </LoyaltyFAQ>
                            <LoyaltyFAQ
                                title={'Какие существуют тарифы на мероприятие?'}>
                                Вы можете заказать как обычное мероприятие, так и выездное. Более того, за
                                дополнительную плату мы сможем организовать для вас декорации, предоставить кейтеринг и
                                даже заказать торт!
                            </LoyaltyFAQ>
                        </div>
                        <h5>Ответы на большинство вопросов вы найдете здесь: <Link href={'/faq'}
                                                                                   className={s.link}
                                                                                   target={'_blank'}>FAQ</Link>
                        </h5>

                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ContactModalEvents;