import React, {useContext, useState} from 'react';
import s from './AuthModal.module.css'
import {Container, Modal} from "react-bootstrap";
import close from '@/static/icons/x-lg.svg'
import RadioGroup from "../UI/RadioGroup/RadioGroup";
import CustomCheckbox from "../UI/CustoCheckbox/CustomCheckbox";
import Image from 'next/image'
import {login, registration} from "@/http/userApi";
import {updateCartFromCookies} from "@/http/cartApi";
import Cookies from "js-cookie";
import {useRouter} from "next/router";
import InputMask from "react-input-mask";
import {Context} from "@/context/AppWrapper";
import PasswordInput from "@/components/shared/UI/PasswordInput/PasswordInput";
import PassEmailModal from "@/components/shared/PassEmailModal/PassEmailModal";

const AuthModal = ({
                       children, style = {}, fromWishlist = false, inline = false, order = false, text = '',
                       salesLine = false, urlToGo = '', extraTasks = () => {
    }
                   }) => {
    const router = useRouter()
    const {userStore, cartStore} = useContext(Context)

    const [show, setShow] = useState(false);
    const [isReg, setIsReg] = useState(true)
    const {desktopStore} = useContext(Context)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phone, setPhone] = useState()
    const [isMailingList, setIsMailingList] = useState(true)

    const [emailBusy, setEmailBusy] = useState(false)
    const [wrong, setWrong] = useState(false)
    const [validEmail, setValidEmail] = useState(true);

    const handleChangeNumber = (e) => {
        const inputPhoneNumber = e.target.value;
        setPhone(inputPhoneNumber);
    };

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };


    const handleClose = () => {
        setShow(false)
    };
    const handleShow = () => {
        setShow(true)
    };
    const reg = async () => {
        if (!validateEmail()) {
            setValidEmail(false);
            return false
        }
        setValidEmail(true);
        const data = {
            username: email.toLowerCase().trim(),
            password: password,
            first_name: firstName,
            last_name: lastName,
            phone: phone,
            gender: userStore.gender,
            is_mailing_list: isMailingList
        }
        try {
            const res = await registration(JSON.stringify(data))
            setEmailBusy(false)
            const cookieCart = Cookies.get('cart')
            let cartFromBack
            if (cookieCart) {
                cartFromBack = await updateCartFromCookies(cookieCart, res.user_id, res.access)
            } else {
                cartFromBack = await updateCartFromCookies('', res.user_id, res.access)
            }
            cartStore.setCartCnt(cartFromBack.length)
            let newStr = ''
            cartFromBack.forEach(el => newStr += el + ' ')
            Cookies.set('cart', newStr, {expires: 2772})
            await router.push({pathname: router.pathname, query: router.query}, undefined, {scroll: false})
            userStore.setIsLogged(true)
            userStore.setId(res.user_id)
            userStore.setUsername(res.username)
            userStore.setFirstName(res.first_name)
            userStore.setLastName(res.last_name)
            userStore.setAccessToken(res.access)
            userStore.setGender(res.gender)

            setShow(false)
            if (extraTasks) {
                extraTasks()
            }
            if (urlToGo) {
                router.push(urlToGo)
            }
        } catch (e) {
            setEmailBusy(true)
        }
    }
    const log = async () => {
        if (!validateEmail()) {
            setValidEmail(false);
            return false
        }
        setValidEmail(true);
        const data = {
            username: email.toLowerCase().trim(),
            password: password,
        };
        try {
            const res = await login(JSON.stringify(data))
            setWrong(false)
            const cookieCart = Cookies.get('cart')
            let cartFromBack
            if (cookieCart) {
                cartFromBack = await updateCartFromCookies(cookieCart, res.user_id, res.access)
            } else {
                cartFromBack = await updateCartFromCookies('', res.user_id, res.access)
            }
            cartStore.setCartCnt(cartFromBack.length)
            let newStr = ''
            cartFromBack.forEach(el => newStr += el + ' ')
            Cookies.set('cart', newStr, {expires: 2772})
            await router.push({pathname: router.pathname, query: router.query}, undefined, {scroll: false})
            userStore.setIsLogged(true)
            userStore.setId(res.user_id)
            userStore.setUsername(res.username)
            userStore.setFirstName(res.first_name)
            userStore.setLastName(res.last_name)
            userStore.setAccessToken(res.access)
            userStore.setGender(res.gender)
            setShow(false)

            if (extraTasks) {
                extraTasks()
            }
            if (urlToGo) {
                router.push(urlToGo)
            }
        } catch (e) {
            setWrong(true)
        }
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        isReg ? await reg() : await log()
    };

    const [passModalShown, setPassModalShown] = useState(false)
    return (
        <>
            <button
                className={[s.toggle_btn, !salesLine ? s.w100 : s.h_auto].join(' ')}
                onClick={handleShow}
                style={inline ? {display: 'inline', ...style} : style}
            >
                {children}
            </button>
            {show && (
                <Modal show={show} style={{overflowY: 'scroll'}}
                    // centered={true}
                       onHide={handleClose}
                       fullscreen={!desktopStore.isDesktop}
                >
                    <Modal.Body className='pt-4'>
                        <div className={s.close_block}>
                            <Image src={close} alt="" style={{cursor: 'pointer'}} onClick={handleClose}/>
                        </div>
                        {
                            fromWishlist &&
                            <div className='text-center'>
                                Войдите или зарегистрируйтесь, чтобы добавлять товары в список избранного
                            </div>
                        }
                        {
                            order &&
                            <div className='text-center'>
                                Войдите или зарегистрируйтесь, чтобы оформить заказ
                            </div>
                        }
                        {text && <div className='text-center'>{text}</div>}
                        <div className={s.mode_block}>
                            <button
                                className={s.mode_btn}
                                onClick={() => setIsReg(true)}
                                style={isReg ? {borderColor: "black"} : {borderColor: '#CCCCCC'}}
                            >
                                Регистрация
                            </button>
                            <button
                                className={s.mode_btn}
                                onClick={() => setIsReg(false)}
                                style={isReg ? {borderColor: '#CCCCCC'} : {borderColor: "black"}}
                            >
                                Вход
                            </button>
                        </div>
                        <form className={s.reg_block} onSubmit={e => handleSubmit(e)}>
                            {isReg
                                ?
                                <Container>
                                    <div className={s.input_block}>
                                        <label className={s.label1}>Имя:</label>
                                        <input type="text" className={s.input}
                                               value={firstName}
                                               placeholder={"Kendall*"}
                                               name="firstName"
                                               autoComplete="given-name"
                                               onChange={(e) => setFirstName(e.target.value)}
                                        />
                                    </div>
                                    <div className={s.input_block}>
                                        <label className={s.label}>Фамилия:</label>
                                        <input type="text" className={s.input}
                                               placeholder={"Jenner*"}
                                               value={lastName}
                                               name="lastName"
                                               autoComplete="family-name"
                                               onChange={(e) => setLastName(e.target.value)}
                                        />
                                    </div>
                                    <div className={s.input_block}>
                                        <label className={s.label}>Номер телефона:</label>
                                        <InputMask mask="+7 999 999-99-99" maskChar={null}
                                                   value={phone}
                                                   onChange={e => handleChangeNumber(e)}
                                        >
                                            {(inputProps) => <input {...inputProps} type="tel"
                                                                    className={s.input} autoComplete="tel"
                                            />}
                                        </InputMask>
                                    </div>
                                    <div className={s.input_block}>
                                        <label className={s.label}>Почта:</label>
                                        <input type="text" className={s.input}
                                               value={email}
                                               name="email" autoComplete="email"
                                               placeholder={"KendallJenner@mail.ru*"}
                                               onChange={(e) => setEmail(e.target.value)}/>
                                        {!validEmail &&
                                            <p className={s.validate}>Некорректный формат почты</p>
                                        }
                                        {emailBusy &&
                                            <p className={s.validate}>Пользователь с таким email уже существует</p>
                                        }
                                    </div>
                                    <div className={s.input_block}>
                                        <label className={s.label}>Пароль:</label>
                                        <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)}
                                                       type="new-password"/>
                                    </div>
                                    <div className={s.input_block}>
                                        <label className={s.label}>Ваш пол:</label>
                                        <RadioGroup/>
                                    </div>
                                    <div className='d-flex mt-5' onClick={() => setIsMailingList(!isMailingList)}>
                                        <CustomCheckbox checked={isMailingList}
                                                        reversed={true}
                                                        labelText={isMailingList ? 'Получайте индивидуальные подборки мастер-классов и скидки' : 'Это очень зря... Не упускайте дополнительные привилегии!'}
                                                        labelClass={s.sub}
                                        />
                                    </div>
                                    <button className={s.reg_btn} type={'submit'}>Зарегистрироваться</button>
                                    <p className={'text-center'} style={{fontSize: 12, marginTop: 10}}>Нажимая кнопку
                                        “Зарегистрироваться”, вы соглашаетесь
                                        на <a href={'/docs/Политика%20конфиденциальности.pdf'} target={'_blank'}
                                              className={'text-black'}>обработку персональных данных</a></p>
                                </Container>
                                :
                                <Container>
                                    <div className={s.input_block}>
                                        <label className={s.label}>Почта:</label>
                                        <input type="email" className={s.input}
                                               value={email}
                                               onChange={(e) => setEmail(e.target.value)} name="email"
                                               autoComplete="email"
                                        />
                                        {!validEmail &&
                                            <p className={s.validate}>Некорректный формат почты</p>
                                        }
                                    </div>
                                    <div className={s.input_block}>
                                        <label className={s.label}>Пароль:</label>
                                        <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)}
                                                       type="current-password"/>
                                    </div>
                                    <button className={s.reg_btn} type={"submit"}>Войти</button>
                                    {wrong &&
                                        <p className={s.validate}>Неверный логин или пароль</p>
                                    }


                                    <div className='d-flex justify-content-center'>
                                        <button className={s.forget_pass}
                                                type={'button'}
                                                onClick={() => {
                                                    setPassModalShown(true)
                                                    setShow(false)
                                                    document.body.classList.remove('body-scroll-clip')
                                                }}
                                        >Забыли пароль?
                                        </button>
                                    </div>
                                </Container>
                            }
                        </form>
                    </Modal.Body>
                </Modal>
            )}
            {passModalShown && (
                <PassEmailModal show={passModalShown} onHide={() => setPassModalShown(false)} defEmail={email}/>
            )}
        </>
    );
};

export default AuthModal;