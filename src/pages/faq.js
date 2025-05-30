import React from 'react';
import MainLayout from "@/layout/MainLayout";
import s from '@/styles/FAQ.module.css'
import Head from "next/head";
import Section from "@/components/pages/faq/Section/Section";
import Text from "@/components/pages/faq/Text/Text";

const Faq = () => {
    return (
        <MainLayout>
            <Head>
                <title>FAQ — ответы на часто задаваемые вопросы</title>
            </Head>
            <div className={s.cont + ' custom_cont'}>
                <h4>FAQs</h4>
                <Section label={'Оплата'} id={'payment'}>
                    <Text title={'В каком порядке происходит оплата?'}>
                        При оплате товара средства с вашей карты замораживаются эквайрингом, а не списываются. Далее мы
                        должны подтвердить ваш заказ, провести дополнительный ряд проверок, если требуется, и только
                        после этого деньги поступят к нам. Обычно подтверждение заказа происходит в кратчайшие сроки.
                        Обо всех изменениях статуса заказа вы можете получать уведомления удобным для вас способом, а
                        также следить за ними в личном кабинете. В случае, если заказ не удастся подтвердить, вся сумма
                        будет незамедлительно разморожена и снова станет доступной на вашем счету.

                    </Text>
                    <Text title={'Безопасная оплата'}>
                        При оплате заказа банковской картой, обработка платежа (включая ввод номера
                        карты) происходит на защищенной странице процессинговой системы, которая прошла
                        международную сертификацию. Это значит, что Ваши конфиденциальные данные
                        (реквизиты карты, регистрационные данные и др.) не поступают в интернет-магазин,
                        их обработка полностью защищена и никто, в том числе наш интернет-магазин, не
                        может получить персональные и банковские данные клиента. При работе с карточными
                        данными применяется стандарт защиты информации, разработанный международными
                        платёжными системами Visa и Masterсard-Payment Card Industry Data Security
                        Standard (PCI DSS), что обеспечивает безопасную обработку реквизитов Банковской
                        карты Держателя. Применяемая технология передачи данных гарантирует безопасность
                        по сделкам с Банковскими картами путем использования протоколов Secure Sockets
                        Layer (SSL), Verifiedby Visa, Secure Code, и закрытых банковских сетей, имеющих
                        высшую степень защиты.<br/>
                        Уважаемые клиенты, информируем Вас о том, что при запросе возврата денежных средств при отказе
                        от покупки, возврат производится исключительно на ту же банковскую карту, с которой была
                        произведена оплата.
                    </Text>
                    <Text title={'Какие есть способы оплаты?'}>
                        Мы принимаем всевозможные способы оплаты: МИР, Visa, Mastercard, СБП.
                    </Text>
                    <Text title={'Безопасность данных'}>
                        Мы собираем и не разглашаем третьим лицам конфиденциальную информацию. Более подробно с
                        политикой обработки персональных данных можно
                        ознакомиться <a href="/docs/Политика%20конфиденциальности.pdf" target={"_blank"}
                                        className={s.underline}>
                        здесь</a>
                        <br/>
                        Все платежи проходят через интернет-эквайринг с использованием защиты 3d-secure.
                        <br/>
                        Интернет-эквайринг защищен всеми нужными протоколами и имеет сертификации для
                        создания безопасной связи между доменами при оплате. Более того, интернет-эквайринг
                        позволяет отслеживать данные по каждой транзакции (пункт товара, сумма транзакции, статус
                        транзакции, данные покупателя) и вовремя заподозрить вредоносные операции со стороны
                        сотрудников, покупателей или сторонних людей (мошенников).
                    </Text>
                    <Text title={'Возврат средств в случае отмены заказа'}>
                        В большинстве случаев средства при оплате не списываются, а замораживаются на вашем счете и
                        списываются лишь после окончательного подтверждения заказа. Если нам не удастся подтвердить
                        заказ, то деньги моментально разморозятся и вернутся на ваш счет. Вам для этого ничего делать не
                        потребуется. Если деньги уже списались с вашего счета, то при отмене заказа деньги вернутся в
                        течение 3-10 рабочих дней в зависимости от банка.

                    </Text>
                    <Text title={'Правила возврата средств при частичной отмене заказа'}>
                        В большинстве случаев средства при оплате не списываются, а замораживаются на вашем счете и
                        списываются лишь после окончательного подтверждения заказа. Если нам не удастся подтвердить
                        заказ частично, то часть денег, которая подлежит возврату, моментально разморозится и вернется
                        на ваш счет. Вам для этого ничего делать не потребуется. Если деньги уже списались с вашего
                        счета, то при частичной отмене заказа часть денег вернется в течение 3-10 рабочих дней в
                        зависимости от банка.
                        <br/>
                        Оплата за ту часть заказа, которая успешна подтверждена, будет списана с вашего счета.
                    </Text>
                    <Text title={'Возможна ли оплата криптовалютой?'}>
                        На сайте не предусмотрена оплата криптовалютой. В Российской Федерации запрещено принимать
                        цифровые деньги.
                    </Text>
                </Section>

                <Section label={'Отмена мастер-класса'}>
                    <Text title={''}>
                        Мы ценим Ваше время и стараемся обеспечить наилучший опыт на каждом нашем мастер-классе.
                        Поэтому, если у Вас возникла необходимость отменить участие, пожалуйста, предупредите нас <span
                        style={{fontWeight: 700}}>не менее чем за 3 дня</span> до запланированной даты проведения.
                        Если отмена происходит менее чем за 3 дня до мастер-класса, стоимость участия не возвращается.
                        Это связано с тем, что наши мастера и мы начинаем подготовку заранее: закупаем и готовим
                        материалы, планируем рабочее место и, в случае кулинарных мастер-классов, начинаем делать
                        заготовки на определенное количество человек, чтобы все было свежим и идеально подходило для
                        вашего творчества.
                    </Text>
                </Section>

                <Section label={'Как связаться с нами?'}>
                    <Text title={'Вы всегда можете обратиться в службу поддержки и мы будем рады вам помочь!'}>
                        <div>
                            <div>
                                WhatsApp: <a href={'https://wa.me/message/79832858399'}
                                             target={'_blank'}
                                             className={s.underline}>+7 983 285-83-99</a>
                            </div>
                            <div>
                                Telegram: <a href={'https://t.me/les_jour_mk'}
                                             target={'_blank'}
                                             className={s.underline}>@les_jour_mk</a>
                            </div>
                        </div>
                    </Text>
                    <Text title={'Мы в социальных сетях:'}>
                        <div>
                            <div>
                                <a href={'https://t.me/les_jours'}
                                   target={'_blank'}
                                   className={s.underline}>Telegram</a>
                            </div>
                            <div>
                                Запретграм: @les_jours
                            </div>
                        </div>
                    </Text>
                </Section>


                <Section label={'Аккаунт'}>
                    <Text title={'Нужен ли аккаунт для совершения заказа?'}>
                        Да, для оформления заказа требуется либо войти в свой аккаунт, либо создать новый. Благодаря
                        этому вы всегда сможете с легкостью отслеживать статусы
                        заказов в
                        личном кабинете, а также вы точно не перепутаете указанные данные и мы всегда сможем связаться с
                        вами!
                    </Text>
                    <Text title={'Как создать аккаунт?'}>
                        Чтобы создать аккаунт вам требуется нажать в верхнем правом углу сайта “Войдите” на компьютерной
                        версии, либо на меню в левом верхнем углу мобильной версии. После успешного ввода
                        данных вам потребуется подтвердить почту, чтобы совершать заказы.
                    </Text>
                    <Text title={'Защищены ли ваши персональные данные?'}>
                        Безусловно. Ваши персональные данные находятся в абсолютной безопасности
                        и используются исключительно в
                        рамках <a href="/docs/Политика%20конфиденциальности.pdf" target={"_blank"}
                                  className={s.underline}>политики конфиденциальности.</a>
                    </Text>
                    <Text title={'Как подписаться или отписаться от рассылки?'}>
                        Мы советуем подписаться на нашу рассылку, чтобы оставаться в курсе всех акций, лучших
                        предложений и трендов. Если вы до сих пор не подписаны на нашу рассылку, то вы с легкостью
                        можете сделать это в самой нижней части нашего сайта! Если вы хотите отписаться от рассылки,
                        то это можно сделать через интерфейс почтового клиента или, написав нам в службу поддержки.
                    </Text>
                    <Text title={'Как удалить аккаунт?'}>
                        Если вы хотите удалить аккаунт, напишите нам, однако будьте внимательны, в случае удаления
                        аккаунта вся
                        информация о ваших заказах, а также накопленные бонусы сгорят без права на восстановление.
                    </Text>
                </Section>


                <Section label={'Промокоды'}>
                    <Text title={'Как получить промокод?'}>
                        Мы регулярно награждаем наших клиентов промокодами. Мы постоянно сообщаем о действующих
                        промокодах и акциях в наших социальных сетях, поэтому обязательно подписывайтесь на все
                        аккаунты, чтобы не
                        пропустить и успеть совершить покупку с использованием промокода, чтобы сделать ваш шопинг еще
                        более выгодным!
                    </Text>
                    <Text title={'Где и как применить промокод?'}>
                        Чтобы применить промокод, введите его в корзине или на любом этапе оформления заказа и вы
                        автоматически получите скидку!
                    </Text>
                    <Text title={'Почему не работает промокод?'}>
                        Пожалуйста, убедитесь, что вы выполнили все условия для применения промокода и время действия
                        промокода еще не закончилось. Зачастую промокоды выдаются на первую покупку или на покупки от
                        определенной суммы, проверьте, что вы вошли в правильный аккаунт. Если вы все же считаете, что
                        произошла
                        какая-то ошибка, напишите нам в службу поддержки, и мы обязательно поможем вам разобраться в
                        ситуации!
                    </Text>
                </Section>


                <Section label={'Сохранность персональных данных и иные документы'}>
                    <Text title={'Условия обработки персональных данных можете прочитать здесь:'}>
                        <a href="/docs/Политика%20конфиденциальности.pdf" target={"_blank"}
                           className={s.underline}>
                            Политика конфиденциальности</a>
                    </Text>
                    <Text title={'Иные документы:'}>
                        <a href="/docs/Договор%20офёрты" target={"_blank"}
                           className={s.underline}>
                            Публичная оферта</a>
                    </Text>
                </Section>


                <Section label={'Контакты'}>
                    Индивидуальный предприниматель Шайхутдинов Руслан Вячеславович
                    <br/>
                    ОГРНИП 323028000121018
                    <br/>
                    ИНН 027817631986
                    <br/>
                    Город ведения деятельности: Москва
                    <br/>
                    Телефон: +7 983 285-83-99
                </Section>
            </div>
        </MainLayout>
    );
};

export default Faq;