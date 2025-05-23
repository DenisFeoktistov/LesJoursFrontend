import React, {useEffect, useRef, useState} from 'react';
import s from './OrderCard.module.css'
import minus from '@/static/icons/dash-lg.svg'
import plus from '@/static/icons/plus-lg.svg'
import Image from "next/image";
import ProductBlock from "@/components/pages/account/ProductBlock/ProductBlock";

const OrderCard = ({order}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isBeOpen, setIsBeOpen] = useState(false)

    const addSpacesToNumber = (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    const toggle = () => {
        if (isOpen) {
            setIsBeOpen(true)
        }
        setIsOpen(!isOpen)
    }

    const [contentHeight, setContentHeight] = useState('0');
    const contentRef = useRef(null);
    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(isOpen ? contentRef.current.scrollHeight + "px" : "0");
            setIsBeOpen(true)
            setTimeout(() => {
                setContentHeight(isOpen ? contentRef.current.scrollHeight + "px" : "0");
                setIsBeOpen(false)
            }, 400)

        }
    }, [isOpen]);

    const orderTemp = {
        "id": 1113,
        "order_units": [
            {
                "id": 1544,
                "name": "Бенто-торт",
                "bucket_link": [
                    {
                        "url": "https://storage.yandexcloud.net/les-jours-bucket/1.png"
                    }
                ],
                "slug": "vans-old-skool-blackwhite-43719",
                "price": {
                    "start_price": 3900,
                    "final_price": 3900
                },
                "guestsAmount": 2,
                "totalPrice": 7800,
                "date": {
                    "start_datetime": "2024-04-01T14:00:00Z",
                    "end_datetime": "2024-04-01T16:00:00Z"
                },
                "address": "Кремлевский дворец",
                "contacts": "+7 (007) МММ 77-77",
                "type": "master_class"
            },
            {
                "id": 1544,
                "name": "Бенто-торт",
                "bucket_link": [
                    {
                        "url": "https://storage.yandexcloud.net/les-jours-bucket/1.png"
                    }
                ],
                "slug": "vans-old-skool-blackwhite-43719",
                "price": {
                    "start_price": 3900,
                    "final_price": 3900
                },
                "guestsAmount": 2,
                "totalPrice": 7800,
                "date": {
                    "start_datetime": "2024-04-01T14:00:00Z",
                    "end_datetime": "2024-04-01T16:00:00Z"
                },
                "address": "Кремлевский дворец",
                "contacts": "+7 (007) МММ 77-77",
                "type": "master_class"
            },
            {
                "type": "certificate",
                "amount": "5000"
            }
        ],
        "formatted_date": "16.11.24",
        "number": "115536",
        "total_amount": 13190,
        "final_amount": 10640,
        "total_sale": 3100,
    }


    return (

        <div className={s.dropdown_wrapper}>

            <div className={s.dropdown} style={{borderRadius: "7px"}}
            >
                <div className={s.header}
                     style={isOpen ? {} : {}}
                     onClick={toggle}
                >
                    <div className={s.header_block}>
                        <div className={s.header_col}>
                            <div className={`${s.header_text} ${s.num}`}>
                                № {orderTemp.number}
                            </div>
                            <div className={`${s.header_text} ${s.date}`}>
                                Дата заказа: {orderTemp.formatted_date}
                            </div>
                            <div className={`${s.header_text} ${s.sum}`}>
                                Сумма: {addSpacesToNumber(orderTemp.final_amount)} ₽
                            </div>
                        </div>
                    </div>
                    <div className={s.icon_block}>
                        <Image src={isOpen ? minus : plus}
                               className={s.icon}
                               width={30}
                               alt=''
                        />
                    </div>
                </div>
                <div ref={contentRef}
                     className={[s.text_block, isOpen ? s.open : ""].join(" ")}
                     style={{maxHeight: contentHeight}}>
                    {(isOpen || isBeOpen) && <div className={s.blackDivider}></div>}
                    <div className={s.details_block}>
                        <div className={s.order}>
                            {
                                orderTemp.order_units.map((el, ind) =>
                                    <>
                                        <ProductBlock unit={el}/>
                                        {
                                            ind !== orderTemp.order_units.length - 1 &&
                                            <hr className={s.hr}/>
                                        }
                                    </>
                                )
                            }
                        </div>
                        <div className={s.final_block}>
                            <div className={s.final_col}>
                                <div className={s.prices}>
                                    <div>Товаров на сумму:</div>
                                    <div>{addSpacesToNumber(orderTemp.total_amount)} ₽</div>
                                </div>
                                {
                                    Number(orderTemp.total_sale) > 0 &&
                                    <div className={s.prices}>
                                        <div>Скидка:</div>
                                        <div>{addSpacesToNumber(orderTemp.total_sale)} ₽</div>
                                    </div>
                                }
                                <div className={s.prices}>
                                    <div>Итого:</div>
                                    <div>{addSpacesToNumber(orderTemp.final_amount)} ₽</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    );
};

export default OrderCard;