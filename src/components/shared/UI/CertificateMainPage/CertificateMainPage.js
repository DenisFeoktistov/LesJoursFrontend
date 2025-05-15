import React, {useEffect, useState} from 'react';
import Image from "next/image";
import s from './CertificateMainPage.module.css'
import {observer} from "mobx-react-lite";
import Link from "next/link";
import certificateImg from "@/static/img/certificateImg.png";

const CertificateMainPage = () => {
    return (
        <div>
            <div className={s.title}>Сертификаты</div>
            <div className={s.text2}>Не знаете что подарить своим близким? Дарите эмоции!</div>
            <div className={s.text2}>Сертификат - это возможность подарить не просто вещь, а настоящие эмоции, время для
                себя и новый опыт!
            </div>
            <div className={s.wrapper}>
                <div className={s.frame}>
                    <Image
                        src={certificateImg}
                        alt="Фотография"
                        width={500}
                        height={500}
                        className={s.image}
                    />
                </div>
            </div>
            <div className={s.customButton}>
                <Link href={'/certificate'} className={s.link}>
                    Подробнее
                </Link>
            </div>
        </div>
    );
};

export default observer(CertificateMainPage);