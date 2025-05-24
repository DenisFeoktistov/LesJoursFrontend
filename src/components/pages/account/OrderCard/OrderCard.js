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
                                № {order.number}
                            </div>
                            <div className={`${s.header_text} ${s.date}`}>
                                Дата заказа: {order.formatted_date}
                            </div>
                            <div className={`${s.header_text} ${s.sum}`}>
                                Сумма: {addSpacesToNumber(order.final_amount)} ₽
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
                                order.order_units.map((el, ind) =>
                                    <>
                                        <ProductBlock unit={el}/>
                                        {
                                            ind !== order.order_units.length - 1 &&
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
                                    <div>{addSpacesToNumber(order.total_amount)} ₽</div>
                                </div>
                                {
                                    Number(order.total_sale) > 0 &&
                                    <div className={s.prices}>
                                        <div>Скидка:</div>
                                        <div>{addSpacesToNumber(order.total_sale)} ₽</div>
                                    </div>
                                }
                                <div className={s.prices}>
                                    <div>Итого:</div>
                                    <div>{addSpacesToNumber(order.final_amount)} ₽</div>
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