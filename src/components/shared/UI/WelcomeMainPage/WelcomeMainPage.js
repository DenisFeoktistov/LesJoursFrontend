import React from 'react';
import Image from "next/image";
import s from './WelcomeMainPage.module.css'
import sMob from './WelcomeMainPageMob.module.css'
import {observer} from "mobx-react-lite";
import welcomeImg from "@/static/img/welcomeImg.png";
import welcomeImgMob from "@/static/img/welcomeImgMob.png";
import welcomeFlowerLogo from "@/static/img/welcomeFlowerLogo.png";
import {desktopStore} from "@/store/DesktopStore";

const WelcomeMainPage = () => {
    return (
        <>
            {desktopStore.isDesktop ?
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

                    <Image src={welcomeFlowerLogo} alt="Emoji 1" className={`${s.emoji} ${s.topLeft}`}/>
                    <Image src={welcomeFlowerLogo} alt="Emoji 2" className={`${s.emoji} ${s.topRight}`}/>
                    <Image src={welcomeFlowerLogo} alt="Emoji 3" className={`${s.emoji} ${s.bottomLeft}`}/>
                    <Image src={welcomeFlowerLogo} alt="Emoji 4" className={`${s.emoji} ${s.bottomRight}`}/>
                </div>
                :
                <div className={sMob.main}>
                    <div className={sMob.title}>Les Jours</div>
                    <div className={sMob.text2}>Твои любимые мастер-классы</div>
                    <div className={sMob.wrapper}>
                        <Image
                            src={welcomeImgMob}
                            alt="Фотография"
                            width={500}
                            height={500}
                            className={sMob.image}
                            loading={"eager"}
                        />
                    </div>

                    <Image src={welcomeFlowerLogo} alt="Emoji 1" className={`${sMob.emoji} ${sMob.topLeft}`}/>
                    <Image src={welcomeFlowerLogo} alt="Emoji 2" className={`${sMob.emoji} ${sMob.topRight}`}/>
                    <Image src={welcomeFlowerLogo} alt="Emoji 3" className={`${sMob.emoji} ${sMob.bottomLeft}`}/>
                    <Image src={welcomeFlowerLogo} alt="Emoji 4" className={`${sMob.emoji} ${sMob.bottomRight}`}/>
                </div>
            }
        </>


    );
};

export default observer(WelcomeMainPage);