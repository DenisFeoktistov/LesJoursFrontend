import React, {useContext, useEffect, useRef, useState} from 'react';
import s from './SizeChoice.module.css'
import Image from "next/image";
import {Context} from "@/context/AppWrapper";
import {userStore} from "@/store/UserStore";
import AuthModal from "@/components/shared/AuthModal/AuthModal";
import {Modal} from "react-bootstrap";
import close from "@/static/icons/x-lg.svg";
import {useRouter} from "next/router";
import {observer} from "mobx-react-lite";
import Cookies from "js-cookie";

const SizeChoice = ({prices = [], productId = -1, isDesktop, isCertificate = false}) => {
    const router = useRouter()
    const {productStore} = useContext(Context)
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const dropdownRef = useRef(null);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    const selectItem = (item) => {
        setSelectedItem(item);
        setIsOpen(false);
        if (!isCertificate) {
            productStore.setSizeChosen(item)
            const arr = Cookies.get('cart').trim().split(' ')
            productStore.setText(arr, productStore.sizeChosen.id)
        } else {
            productStore.setCertificateChosen(item)
        }
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);
    const [isShow, setIsShow] = useState(false)
    const handleClose = () => {
        setIsShow(false)
    }
    const handleOpen = () => {
        setIsShow(true)
    }

    useEffect(() => {
        if (prices.length === 1) {
            selectItem(prices[0])
        } else {
            setSelectedItem(null)
        }
    }, [router.asPath, prices])

    const formatDateTime = (isoStringStart, isoStringEnd) => {
        const date = new Date(isoStringStart);
        const dateEnd = new Date(isoStringEnd);

        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();

        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');

        const hoursEnd = String(dateEnd.getUTCHours()).padStart(2, '0');
        const minutesEnd = String(dateEnd.getUTCMinutes()).padStart(2, '0');

        return `${day}.${month}.${year} с ${hours}:${minutes} до ${hoursEnd}:${minutesEnd}`;
    }

    const getRemainingPlacesText = (free, total) => {
        const mod10 = free % 10;
        const mod100 = free % 100;

        let word;
        if (mod10 === 1 && mod100 !== 11) {
            word = 'место';
        } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
            word = 'места';
        } else {
            word = 'мест';
        }

        return `Осталось ${free} из ${total} ${word}`;
    }

    const certificateAmounts = [
        {
            "name": "Ввести свой номинал",
            "amount": ""
        },
        {
            "name": "1000₽",
            "amount": "1000"
        },
        {
            "name": "2000₽",
            "amount": "2000"
        },
        {
            "name": "3000₽",
            "amount": "3000"
        },
        {
            "name": "4000₽",
            "amount": "4000"
        },
        {
            "name": "5000₽",
            "amount": "5000"
        },
        {
            "name": "7000₽",
            "amount": "7000"
        },
        {
            "name": "10000₽",
            "amount": "10000"
        },
        {
            "name": "15000₽",
            "amount": "15000"
        }
    ]

    return (
        <>
            {!isCertificate &&
                <div ref={dropdownRef} className={s.dropdown}>
                    <div className={s.text}
                         onClick={toggleDropdown}
                         style={{
                             borderRadius: isOpen ? '7px 7px 0 0' : '7px',
                             fontSize: isDesktop ? '12pt' : '11pt',
                         }}>
                        {
                            productStore.sizeChosen
                                ?
                                <>
                                    <div className={s.size_block}>
                                        <div
                                            className={s.icons}>{formatDateTime(productStore.sizeChosen.start_datetime, productStore.sizeChosen.end_datetime)}</div>
                                    </div>
                                    <div className={s.price}>
                                        {getRemainingPlacesText(productStore.sizeChosen.available_seats, productStore.sizeChosen.available_seats + productStore.sizeChosen.occupied_seats)}
                                    </div>
                                </>
                                :
                                `Выберите дату и время мастер-класса`
                        }
                    </div>
                    <div className={s.dropdown_content}>
                        {
                            isOpen &&
                            <div>
                                {
                                    prices.map(el =>
                                        el.available_seats > 0
                                            ?
                                            <div className={s.items}
                                                 onClick={() => selectItem(el)}
                                                 key={el.id}
                                            >
                                                <div className={s.size_block}>
                                                    <div
                                                        className={s.icons}>{formatDateTime(el.start_datetime, el.end_datetime)}</div>
                                                </div>
                                                <div className={s.price}>
                                                    {getRemainingPlacesText(el.available_seats, el.available_seats + el.occupied_seats)}
                                                </div>
                                            </div>
                                            :
                                            <div className={s.items_not}
                                            >
                                                <div className={s.size_block}>
                                                    <div
                                                        className={s.icons}>{formatDateTime(el.start_datetime, el.end_datetime)}</div>
                                                </div>
                                                <div className='d-flex'>
                                                    Распродано.
                                                    {userStore.isLogged ?
                                                        <button className={s.link}
                                                                onClick={() => {
                                                                    handleOpen()
                                                                }}
                                                        >Сообщить о поступлении</button>
                                                        :
                                                        <AuthModal inline={true}
                                                                   text={'Зарегистрируйстесь, чтобы получить уведомление о поступлении'}>
                                                            <button className={s.link}>Сообщить о поступлении</button>
                                                        </AuthModal>
                                                    }
                                                </div>
                                            </div>
                                    )
                                }
                            </div>
                        }
                    </div>

                    <Modal
                        show={isShow}
                        centered={true}
                        onHide={handleClose}
                    >
                        <Modal.Body>
                            <div className='d-flex justify-content-end'>
                                <Image src={close} alt='' onClick={handleClose}/>
                            </div>
                            <div className={'text-center'}>
                                Мы сообщим о поступлении данной позиции. Уведомление придет вам на электронную почту.
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>
            }
            {isCertificate &&
                <div ref={dropdownRef} className={s.dropdown}>
                    <div className={s.text}
                         onClick={toggleDropdown}
                         style={{
                             borderRadius: isOpen ? '7px 7px 0 0' : '7px',
                             fontSize: isDesktop ? '12pt' : '11pt',
                         }}>
                        {
                            productStore.certificateChosen
                                ?
                                <>
                                    {
                                        productStore.certificateChosen.name === "Ввести свой номинал"
                                            ?
                                            <div className={s.size_block}>
                                                <div className={s.icons}>
                                                    {/*Введите свой номинал:*/}
                                                    <div>Введите свой номинал:</div>
                                                    <div className={s.inputWrapper}
                                                         onClick={(e) => e.stopPropagation()}>
                                                        <input
                                                            type="text"
                                                            className={s.input}
                                                            placeholder="5000"
                                                            onClick={(e) => e.stopPropagation()}
                                                            onChange={(e) => {
                                                                let raw = e.target.value.replace(/\D/g, ''); // убрать всё, кроме цифр
                                                                raw = raw.replace(/^0+/, '');
                                                                const num = parseInt(raw, 10);
                                                                if (!isNaN(num) && num > 0) {
                                                                    productStore.certificateChosen.amount = `${num}`;
                                                                } else {
                                                                    productStore.certificateChosen.amount = '';
                                                                }
                                                                e.target.value = raw; // обновить отображаемое значение (чисто число)
                                                            }}
                                                        />
                                                        <span className={s.ruble}>₽</span>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            <div className={s.size_block}>
                                                <div
                                                    className={s.icons}>{productStore.certificateChosen.name}</div>
                                            </div>
                                    }
                                </>
                                :
                                `Выберите номинал сертификата`
                        }
                    </div>
                    <div className={s.dropdown_content}>
                        {
                            isOpen &&
                            <div>
                                {
                                    certificateAmounts.map(el =>
                                        <div className={s.items}
                                             onClick={() => selectItem(el)}
                                             key={el.name}
                                        >
                                            <div className={s.size_block}>
                                                <div
                                                    className={s.icons}>{el.name}</div>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        }
                    </div>
                </div>
            }
        </>
    );
};

export default observer(SizeChoice);