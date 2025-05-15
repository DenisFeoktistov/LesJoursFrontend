import React, {useEffect, useState} from 'react';
import Image from "next/image";
import s from './WelcomeMainPage.module.css'
import {observer} from "mobx-react-lite";
import Link from "next/link";
import welcomeImg from "@/static/img/welcomeImg.png";
import welcomeFlowerLogo from "@/static/img/welcomeFlowerLogo.png";

const WelcomeMainPage = () => {
    return (
        <div className={s.main}>
            <div className={s.title}>Les Jours</div>
            <div className={s.text2}>Твои любимые мастер-классы</div>
            <div className={s.wrapper}>
                <Image
                    src={welcomeImg}
                    alt="Фотография"
                    width={500}
                    height={500}
                    className={s.image}
                    loading={"eager"}
                />
            </div>

            <Image src={welcomeFlowerLogo} alt="Emoji 1" className={`${s.emoji} ${s.topLeft}`} />
            <Image src={welcomeFlowerLogo} alt="Emoji 2" className={`${s.emoji} ${s.topRight}`} />
            <Image src={welcomeFlowerLogo} alt="Emoji 3" className={`${s.emoji} ${s.bottomLeft}`} />
            <Image src={welcomeFlowerLogo} alt="Emoji 4" className={`${s.emoji} ${s.bottomRight}`} />
        </div>
    );
};

export default observer(WelcomeMainPage);