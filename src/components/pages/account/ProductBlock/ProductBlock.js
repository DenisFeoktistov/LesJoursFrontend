import React from 'react';
import s from './ProductBlock.module.css'
import Image from "next/image";
import Link from "next/link";
import certificateImg from "@/static/img/certificateImg.png";

const ProductBlock = ({unit}) => {
    const addSpacesToNumber = (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

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

    return (
        <>
            {unit.type === "master_class" &&
                <div className={s.row}>
                    <Link href={`/products/${unit.slug}`} className={s.col1}>
                        {unit.bucket_link[0] &&
                            <Image
                                src={unit.bucket_link[0].url}
                                alt=''
                                className={s.img}
                                width={400}
                                height={400}
                            />}
                    </Link>
                    <div className={s.inner_row}>
                        <div className={s.inner_row2}>
                            <div className={s.col2}>
                                <div>
                                    <div className={s.brand}>Мастер-класс</div>
                                    <div className={s.text}>{unit.name}</div>
                                </div>

                                <div className={s.number_block}>
                                    <div className={s.brand}>Дата проведения</div>
                                    <div
                                        className={s.text}>{formatDateTime(unit.date.start_datetime, unit.date.end_datetime)}</div>
                                </div>
                            </div>
                            <div className={s.col}>
                                <div>
                                    <div className={s.brand}>Число гостей</div>
                                    <div className={s.text}>{unit.guestsAmount}</div>
                                </div>
                                {unit.contacts &&
                                    <div className={s.number_block}>
                                        <div className={s.brand}>Контакты локации</div>
                                        <div className={s.text}>{unit.contacts}</div>
                                    </div>
                                }
                            </div>
                            <div className={s.col}>
                                <div>
                                    <div className={s.brand}>Общая стоимость</div>
                                    <div
                                        className={s.text}>{addSpacesToNumber(unit.price.final_price * unit.guestsAmount)} ₽
                                    </div>
                                </div>
                            </div>
                        </div>

                        {unit.address &&
                            <div className={s.number_block}>
                                <div className={s.brand}>Адрес проведения</div>
                                <div className={s.text}>{unit.address}</div>
                            </div>
                        }
                    </div>
                </div>
            }
            {unit.type === "certificate" &&
                <div className={s.row}>
                    <Link href={`/certificate`} className={s.col1}>
                        <Image
                            src={certificateImg}
                            alt=''
                            className={s.img}
                            width={400}
                            height={400}
                        />
                    </Link>
                    <div className={s.inner_row}>
                        <div className={s.inner_row2}>
                            <div className={s.col2}>
                                <div>
                                    <div className={s.brand}>Сертификат на сумму:</div>
                                    <div className={s.text}>{unit.amount}₽</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>

    );

};

export default ProductBlock;