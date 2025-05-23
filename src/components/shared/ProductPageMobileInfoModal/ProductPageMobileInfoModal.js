import React, {useEffect, useRef, useState} from 'react';
import sMob from './ProductPageMobileInfoModalMob.module.css'
import {Modal} from "react-bootstrap";
import Image from "next/image";
import close from "@/static/icons/x-lg.svg";
import logo from '@/static/icons/les-jours-logo-desktop.png'
import ProductDetailsMob from "@/components/shared/ProductDetailsMob/ProductDetailsMob";
import {desktopStore} from "@/store/DesktopStore";
import s from "@/styles/OneProductPage.module.css";
import TextModalDesktopProductPage
    from "@/components/shared/UI/TextModalDesktopProductPage/TextModalDesktopProductPage";
import Link from "next/link";
import igBlack from "@/static/icons/igImg.svg";
import tgBlack from "@/static/icons/tg_black.svg";
import LoyaltyFAQ from "@/components/pages/account/LoyaltyFAQ/LoyaltyFAQ";
import refund from '@/static/icons/arrow-return-left.svg';
import how from '@/static/icons/question-circle.svg';
import payment from '@/static/icons/credit-card.svg';
import returnImg from '@/static/icons/arrow-return-left.svg'
import headphones from "@/static/icons/headphones-circle.svg";

const ProductPageMobileInfoModal = ({show, onHide, product}) => {
    const [isDesktop, setIsDesktop] = useState(true)
    useEffect(() => {
        const width = window.innerWidth
        if (width <= 1000) {
            setIsDesktop(false)
        }
    }, [isDesktop])

    const [moreOpen, setMoreOpen] = useState(false)
    const [contentHeight, setContentHeight] = useState("250px");
    const contentRef = useRef(null);
    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(moreOpen ? contentRef.current.scrollHeight + "px" : desktopStore.isDesktop ? '145px' : "250px");
            setTimeout(() => {
                setContentHeight(moreOpen ? contentRef.current.scrollHeight + "px" : desktopStore.isDesktop ? '145px' : "250px");
            }, 400)

        }
    }, [moreOpen]);

    return (<>
        <Modal
            centered={true}
            fullscreen={true}
            show={show}
            onHide={onHide}
            contentClassName={sMob.modalContent}
        >
            <Modal.Body style={{padding: 0, position: 'relative', overflowX: 'hidden'}}>
                <div className={sMob.close}>
                    <Image src={close} alt="" onClick={onHide} style={{cursor: 'pointer'}}/>
                </div>

                {/* Логотип по центру сверху */}
                <div className={sMob.logoContainer}>
                    <Image src={logo} alt="Logo" className={sMob.logo} width={235} height={170}/>
                </div>

                {/* Контент модалки */}
                <div style={{marginRight: '10px', marginLeft: '10px'}}>
                    <ProductDetailsMob key={product.id} product={product} ref={contentRef}
                                       style={{maxHeight: contentHeight}}></ProductDetailsMob>
                    <hr style={{marginTop: '0'}}/>
                    <div style={{display: 'flex', width: '100%'}}>
                        <TextModalDesktopProductPage title={'Оплата'} img={payment}>
                            <Image src={payment} alt='' width={60}/>
                            <h4 className={'my-3'}>Оплата</h4>
                            <p className={s.text}>
                                При оплате товара средства с вашей карты замораживаются эквайрингом, а не
                                списываются. Далее мы должны подтвердить ваш заказ, и только после этого
                                деньги поступят к нам. Обычно
                                подтверждение заказа происходит в кратчайшие сроки. Обо всех изменениях
                                статуса
                                заказа вы можете получать уведомления удобным для вас способом, а также
                                следить
                                за
                                ними в личном кабинете. В случае, если заказ не удастся подтвердить, вся
                                сумма
                                будет
                                незамедлительно разморожена и снова станет доступной на вашем счету.

                            </p>
                            <div className={s.faq_block}>
                                <h5 className={'text-center'}>Часто задаваемые вопросы</h5>
                                <LoyaltyFAQ title={'Безопасная оплата'}>
                                    При оплате заказа банковской картой, обработка платежа (включая ввод
                                    номера
                                    карты) происходит на защищенной странице процессинговой системы, которая
                                    прошла
                                    международную сертификацию. Это значит, что Ваши конфиденциальные данные
                                    (реквизиты карты, регистрационные данные и др.) не поступают в
                                    интернет-магазин,
                                    их обработка полностью защищена и никто, в том числе наш
                                    интернет-магазин,
                                    не
                                    может получить персональные и банковские данные клиента. При работе с
                                    карточными
                                    данными применяется стандарт защиты информации, разработанный
                                    международными
                                    платёжными системами Visa и Masterсard-Payment Card Industry Data
                                    Security
                                    Standard (PCI DSS), что обеспечивает безопасную обработку реквизитов
                                    Банковской
                                    карты Держателя. Применяемая технология передачи данных гарантирует
                                    безопасность
                                    по сделкам с Банковскими картами путем использования протоколов Secure
                                    Sockets
                                    Layer (SSL), Verifiedby Visa, Secure Code, и закрытых банковских сетей,
                                    имеющих
                                    высшую степень защиты.
                                </LoyaltyFAQ>
                                <LoyaltyFAQ title={'Какие есть способы оплаты?'}>
                                    Мы принимаем всевозможные способы оплаты: МИР, Visa, Mastercard, СБП.
                                </LoyaltyFAQ>
                                <LoyaltyFAQ title={'Безопасность данных'}>
                                    Мы собираем и не разглашаем третьим лицам конфиденциальную информацию.
                                    Более
                                    подробно с политикой обработки персональных данных можно
                                    ознакомиться <a href="/docs/Политика%20конфиденциальности.pdf"
                                                    target={"_blank"}
                                                    className={'text-black'}>
                                    здесь</a>
                                    <br/>
                                    Все платежи проходят через интернет-эквайринг с использованием защиты
                                    3d-secure.
                                    <br/>
                                    Интернет-эквайринг защищен всеми нужными протоколами и имеет
                                    сертификации
                                    для
                                    создания безопасной связи между доменами при оплате. Более того,
                                    интернет-эквайринг позволяет отслеживать данные по каждой транзакции
                                    (пункт
                                    товара, сумма транзакции, статус транзакции, данные покупателя) и
                                    вовремя
                                    заподозрить вредоносные операции со стороны сотрудников, покупателей или
                                    сторонних людей (мошенников).
                                </LoyaltyFAQ>
                                <LoyaltyFAQ title={'Возврат средств в случае отмены заказа'}>
                                    В большинстве случаев средства при оплате не списываются, а
                                    замораживаются
                                    на
                                    вашем счете и списываются лишь после окончательного подтверждения
                                    заказа.
                                    Если
                                    нам не удастся подтвердить заказ, то деньги моментально разморозятся и
                                    вернутся
                                    на ваш счет. Вам для этого ничего делать не потребуется. Если деньги уже
                                    списались с вашего счета, то при отмене заказа деньги вернутся в течение
                                    3-10
                                    рабочих дней в зависимости от банка.

                                </LoyaltyFAQ>
                                <LoyaltyFAQ title={'Правила возврата средств при частичной отмене заказа'}>
                                    В большинстве случаев средства при оплате не списываются, а
                                    замораживаются
                                    на
                                    вашем счете и списываются лишь после окончательного подтверждения
                                    заказа.
                                    Если
                                    нам не удастся подтвердить заказ частично, то часть денег, которая
                                    подлежит
                                    возврату, моментально разморозится и вернется на ваш счет. Вам для этого
                                    ничего
                                    делать не потребуется. Если деньги уже списались с вашего счета, то при
                                    частичной отмене заказа часть денег вернется в течение 3-10 рабочих дней
                                    в
                                    зависимости от банка.
                                    <br/>
                                    Оплата за ту часть заказа, которая успешна подтверждена, будет списана с
                                    вашего
                                    счета.
                                </LoyaltyFAQ>
                                <LoyaltyFAQ title={'Возможна ли оплата криптовалютой?'}>
                                    На сайте не предусмотрена оплата криптовалютой. В Российской Федерации
                                    запрещено
                                    принимать цифровые деньги.
                                </LoyaltyFAQ>
                            </div>
                        </TextModalDesktopProductPage>
                    </div>

                    <div style={{display: 'flex', width: '100%'}}>
                        <TextModalDesktopProductPage title={'Отмена записи'} img={returnImg}>
                            <Image src={refund} alt='' width={60}/>
                            <h4 className={'my-3'}>Отмена записи на мастер-класс</h4>
                            <p className={s.text}>
                                Мы ценим Ваше время и стараемся обеспечить наилучший опыт на каждом нашем
                                мастер-классе. Поэтому, если у Вас возникла необходимость отменить участие,
                                пожалуйста, предупредите нас <span
                                style={{fontWeight: 700}}>не менее чем за 3 дня</span> до запланированной
                                даты
                                проведения.
                                Если отмена происходит менее чем за 3 дня до мастер-класса, стоимость
                                участия не
                                возвращается. Это связано с тем, что наши мастера и мы начинаем подготовку
                                заранее:
                                закупаем и готовим материалы, планируем рабочее место и, в случае кулинарных
                                мастер-классов, начинаем делать заготовки на определенное количество
                                человек, чтобы
                                все было свежим и идеально подходило для вашего творчества.
                            </p>
                            <p className={s.text}>
                                Мы благодарим Вас за понимание и ценим Ваше уважение к нашему труду!
                            </p>
                            <div className={s.faq_block}>
                                <h5 className={'text-center'}>Часто задаваемые вопросы</h5>
                                <LoyaltyFAQ title={'Почему нужно предупреждать об отмене именно за 3 дня?'}>
                                    Мы с мастерами начинаем подготовку заранее — закупаем необходимые
                                    материалы,
                                    планируем и готовим заготовки. Например, для бенто-тортов мы выпекаем
                                    коржи за
                                    день-два до мастер-класса, чтобы на занятии все было свежим и
                                    качественным.
                                </LoyaltyFAQ>
                                <LoyaltyFAQ
                                    title={'Если я не смогу прийти, можно ли просто перенести участие на другой день?'}>
                                    Да, при условии, что вы предупредите нас не менее чем за 3 дня. В
                                    противном
                                    случае стоимость участия не возвращается, и перенос будет невозможен.
                                </LoyaltyFAQ>
                                <LoyaltyFAQ title={'Могу ли я пригласить другого человека на свое место?'}>
                                    Конечно! Вы можете передать свое место другому человеку, просто сообщите
                                    нам его
                                    имя и контакты.
                                </LoyaltyFAQ>
                                <LoyaltyFAQ title={'Почему не вернуть деньги, если материалы остаются?'}>
                                    К сожалению, многие материалы индивидуальны и готовятся специально под
                                    каждого
                                    участника. В случае отмены за короткий срок, они уже подготовлены, и в
                                    некоторых
                                    случаях их невозможно использовать повторно.

                                </LoyaltyFAQ>
                                <LoyaltyFAQ
                                    title={'Как быстро вернутся деньги, если я отменил мастер-класс вовремя?'}>
                                    Возврат производится в течение 3 рабочих дней с момента получения
                                    запроса на
                                    отмену. Менеджер обязательно проконсультирует Вас.
                                </LoyaltyFAQ>
                            </div>
                            <h5>Ответы на большинство вопросов вы найдете здесь: <Link href={'/faq'}
                                                                                       className={s.link}
                                                                                       target={'_blank'}>FAQ</Link>
                            </h5>
                        </TextModalDesktopProductPage>
                    </div>
                    <div style={{display: 'flex', width: '100%'}}>
                        <TextModalDesktopProductPage title={'Остались вопросы?'} img={how}>
                            <div className={s.content}>
                                <Image src={headphones} alt='' width={60}/>
                                <div className={s.text_cont}>
                                    <h5>Если у вас остались вопросы в том числе по данному мастер-классу, вы
                                        всегда
                                        можете
                                        написать в службу поддержки, и мы будем рады вам помочь!</h5>
                                    <div>
                                        <div>
                                            WhatsApp: <a href={'https://wa.me/message/79832858399'}
                                                         target={'_blank'}
                                                         className={s.link}>+7 983 285-83-99</a>
                                        </div>
                                        <div>
                                            Telegram: <a href={'https://t.me/les_jour_mk'}
                                                         target={'_blank'}
                                                         className={s.link}>@les_jour_mk</a>
                                        </div>
                                    </div>
                                    <div className={s.faq_block}>
                                        <h5 className={'text-center'}>Часто задаваемые вопросы</h5>

                                        <LoyaltyFAQ
                                            title={'Можно ли оформить заказ, позвонив или написав нам?'}>
                                            Да, вы всегда можете написать нам в службу поддержки, и мы
                                            поможем
                                            вам и
                                            выбрать мастер-класс, и оформить заказ.
                                            Вы также можете написать нам, какой мастер-класс ищете, и мы
                                            сами
                                            найдем
                                            его
                                            для вас и предложим к заказу!

                                        </LoyaltyFAQ>
                                        <LoyaltyFAQ title={'Где узнать больше информации о мастер-классе?'}>
                                            Если вы хотите узнать больше о мастер-классе, вы всегда можете
                                            обратиться к нам, и
                                            наши
                                            специалисты ответят на все вопросы и
                                            предоставят исчерпывающую информацию о мастер-классе!

                                        </LoyaltyFAQ>
                                    </div>
                                    <h5>Ответы на большинство вопросов вы найдете здесь: <Link href={'/faq'}
                                                                                               className={s.link}
                                                                                               target={'_blank'}>FAQ</Link>
                                    </h5>
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
                                </div>
                            </div>
                        </TextModalDesktopProductPage>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    </>);
};

export default ProductPageMobileInfoModal;