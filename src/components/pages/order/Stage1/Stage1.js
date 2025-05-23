import React, {useContext, useEffect} from 'react';
import s from './Stage1.module.css'
import {Context} from "@/context/AppWrapper";
import {useRouter} from "next/router";
import {observer} from "mobx-react-lite";
import InputMask from "react-input-mask";

const Stage1 = ({userData}) => {
    const router = useRouter()
    const {orderStore, desktopStore} = useContext(Context)

    useEffect(() => {
        orderStore.setName(userData.first_name)
        orderStore.setSurname(userData.last_name)
        orderStore.setEmail(userData.email)
        orderStore.setPhone(userData.phone_number)
    }, [])
    const goToCart = (e) => {
        e.preventDefault()
        router.push('/cart')
    }

    return (
        <div>
            <div className={s.stage_block}>
                <div className={s.stage}>1. Адрес доставки</div>
                <a onClick={e => goToCart(e)}
                   className={s.link}
                >Вернуться в корзину</a>
            </div>
            <hr/>
            <div>
                <h5>Контактная информация</h5>
                <div className={s.input_block}>
                    <input type="text"
                           className={s.input}
                           placeholder={'Фамилия*'}
                           value={orderStore.surname}
                           onChange={e => orderStore.setSurname(e.target.value)}
                    />
                    <input type="text"
                           className={s.input}
                           placeholder={'Имя*'}
                           value={orderStore.name}
                           onChange={e => orderStore.setName(e.target.value)}
                    />
                    <InputMask mask="+7 999 999-99-99" maskChar={null}
                               value={orderStore.phone}
                               onChange={e => orderStore.setPhone(e.target.value)}
                    >
                        {(inputProps) => <input {...inputProps} type="tel"
                                                placeholder="Номер*"
                                                className={s.input}
                        />}
                    </InputMask>
                    <input type="email"
                           className={s.input}
                           placeholder={'Почта*'}
                           value={orderStore.email}
                           onChange={e => orderStore.setEmail(e.target.value)}
                           style={{width: desktopStore.isDesktop ? '' : '100%'}}
                    />
                    <input type="text"
                           className={s.input}
                           placeholder={'Телеграм(@nickname)*'}
                           value={orderStore.telegram}
                           onChange={e => orderStore.setTelegram(e.target.value)}
                    />
                </div>
            </div>
            <div>
                <textarea
                    rows={3}
                    placeholder={'Комментарий к заказу (необязательно)'}
                    className={s.textarea}
                    value={orderStore.comment}
                    onChange={e => orderStore.setComment(e.target.value)}
                />
            </div>
        </div>
    );
};

export default observer(Stage1);