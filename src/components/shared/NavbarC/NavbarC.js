import React, {useContext, useEffect, useState} from 'react';
import s from './NavbarC.module.css'
import like from '@/static/icons/heart.svg'
import person from '@/static/icons/person-circle.svg'
import AuthModal from "..//AuthModal/AuthModal";
import Image from "next/image";
import logo from '@/static/icons/les-jours-logo-desktop.png'
import {useRouter} from "next/router";
import {Context} from "@/context/AppWrapper";
import {observer} from "mobx-react-lite";
import CartIcon from "@/components/shared/CartIcon/CartIcon";
import Link from "next/link";
import ContactModal from "@/components/shared/ContactModal/ContactModal";
import cn from 'classnames';

import cartNotSelected from "@/static/icons/CertMobileNavBarNotSelected.svg";
import accountNotSelected from "@/static/icons/AccountMobileNavBarNotSelected.svg";
import favouriteNotSelected from "@/static/icons/FavouriteMobileNavBarNotSelected.svg";
import searchNotSelected from "@/static/icons/SearchMobileNavBarNotSelected.svg";

import cartSelected from "@/static/icons/CertMobileNavBarSelected.svg";
import accountSelected from "@/static/icons/AccountMobileNavBarSelected.svg";
import favouriteSelected from "@/static/icons/FavouriteMobileNavBarSelected.svg";
import searchSelected from "@/static/icons/SearchMobileNavBarSelected.svg";
import Sidebar from "@/components/shared/SidebarNew/Sidebar";


const NavbarC = () => {
    const {userStore, desktopStore} = useContext(Context)
    const router = useRouter()
    const {pathname} = router;

    const [contactOpen, setContactOpen] = useState(false)
    const toggleContact = () => {
        setContactOpen(!contactOpen)
    }
    const closeContact = () => {
        setContactOpen(false)
    }

    const [prevScrollPos, setPrevScrollPos] = useState(0)

    const checkScroll = () => {
        if (desktopStore.isDesktop) {
            const currentScrollPos = window.pageYOffset;
            const scrolledMoreThan100Pixels = (currentScrollPos - prevScrollPos > 120) || (currentScrollPos - prevScrollPos <= 0);
            let visible = prevScrollPos > currentScrollPos;

            if (currentScrollPos <= 0) {
                visible = true;
            }

            if (scrolledMoreThan100Pixels || currentScrollPos <= 0) {
                setPrevScrollPos(currentScrollPos);
                desktopStore.setNavbarVisible(visible);
            }
        } else {
            const currentScrollPos = window.pageYOffset;
            const scrolledEnough = (prevScrollPos - currentScrollPos > 20) || (currentScrollPos - prevScrollPos > 10);
            let visible = prevScrollPos > currentScrollPos;

            if (currentScrollPos <= 0) {
                visible = true;
            }

            if (scrolledEnough || currentScrollPos <= 0) {
                desktopStore.setNavbarVisible(visible);
            }

            setPrevScrollPos(currentScrollPos);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', checkScroll);

        return () => window.removeEventListener('scroll', checkScroll);
    }, [prevScrollPos]);

    const isCart = pathname.startsWith('/cart');
    const isHome = pathname === '/';
    const isWishlist = pathname.startsWith('/wishlist');
    const isAccount = pathname.startsWith('/account');

    const handleNavigation = (path) => {
        router.push(path);
    };

    return (
        <>
            <header className={
                desktopStore.isDesktop
                    ? cn(s.header, {[s.visible]: desktopStore.navbarVisible})
                    : cn(s.headerMob, {[s.visibleMob]: desktopStore.navbarVisible})
            } id={'navbar'}>
                {desktopStore.isDesktop &&
                    <>
                        <div className={'custom_cont'}>
                            <div className={s.headerM}>
                                <div className={s.logoM}>
                                    <Link href={'/'}>
                                        <Image
                                            src={logo}
                                            alt="Логотип"
                                            width={120}
                                            height={40}
                                            className={s.logoImage}
                                        />
                                    </Link>
                                </div>
                                <div className={s.navContainer}>
                                    <nav className={s.navWrapper}>
                                        <ul className={s.navList}>
                                            <Link
                                                href={{
                                                    pathname: '/about'
                                                }}
                                                style={{textDecoration: "none"}}
                                            >
                                                <li>О нас</li>
                                            </Link>
                                            <Link
                                                href={{
                                                    pathname: '/products'
                                                }}
                                                style={{textDecoration: "none"}}
                                            >
                                                <li>Мастер-Классы</li>
                                            </Link>
                                            <Link
                                                href={{
                                                    pathname: '/events'
                                                }}
                                                style={{textDecoration: "none"}}
                                            >
                                                <li>Мероприятия</li>
                                            </Link>
                                            <Link
                                                href={{
                                                    pathname: '/certificate'
                                                }}
                                                style={{textDecoration: "none"}}
                                            >
                                                <li>Сертификаты</li>
                                            </Link>
                                            <li><span onClick={toggleContact}>Контакты</span></li>
                                        </ul>
                                    </nav>
                                    <nav className={s.navWrapper}>
                                        <ul className={s.navList}>
                                            <Link href="/wishlist">
                                                <Image width={25} src={like} alt="Wishlist" className={s.icons}
                                                       loading="eager"/>
                                            </Link>
                                            {userStore.isLogged ? (
                                                <Link href="/account" className={s.auth_block}>
                                                    <Image width={25} src={person} alt="Account" className={s.icons}
                                                           loading="eager"/>
                                                </Link>
                                            ) : (
                                                <AuthModal>
                                                    <Image width={25} src={person} alt="Login" className={s.icons}
                                                           loading="eager"/>
                                                </AuthModal>
                                            )}
                                            <CartIcon/>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </>
                }

                {!desktopStore.isDesktop &&
                    <>
                        <div className={s.bottom_nav}>
                            <div
                                className={s.nav_item}
                                onClick={() => {
                                    desktopStore.setMobileSideBar(!desktopStore.mobileSideBar)
                                }}
                            >
                                <div className={s.icon_wrapper}>
                                    <Image
                                        width={29}
                                        height={28}
                                        src={desktopStore.mobileSideBar ? searchSelected : searchNotSelected}
                                        alt="Search Icon"
                                        loading={"eager"}
                                    />
                                </div>
                            </div>


                            <div
                                className={s.nav_item}
                                onClick={() => {
                                    handleNavigation('/cart')
                                    desktopStore.setMobileSideBar(false)
                                }}
                            >
                                <div className={s.icon_wrapper}>
                                    <Image
                                        width={28}
                                        height={26}
                                        src={isCart && !desktopStore.mobileSideBar ? cartSelected : cartNotSelected}
                                        alt="Cart Icon"
                                        loading={"eager"}
                                    />
                                </div>
                            </div>

                            <div
                                className={s.nav_item}
                                onClick={() => {
                                    handleNavigation('/')
                                    desktopStore.setMobileSideBar(false)
                                }}
                            >
                                <div className={s.icon_wrapper}>
                                    <Image
                                        width={53}
                                        height={38}
                                        src={isHome && !desktopStore.mobileSideBar ? logo : logo}
                                        alt="Catalog Icon"
                                        loading={"eager"}
                                        style={{
                                            opacity: isHome && !desktopStore.mobileSideBar ? 1 : 0.4
                                        }}
                                    />
                                </div>
                            </div>
                            <div
                                className={s.nav_item}
                                onClick={() => {
                                    handleNavigation('/wishlist')
                                    desktopStore.setMobileSideBar(false)
                                }}
                            >
                                <div className={s.icon_wrapper}>
                                    <Image
                                        width={27}
                                        height={25}
                                        src={isWishlist && !desktopStore.mobileSideBar ? favouriteSelected : favouriteNotSelected}
                                        alt="Favorites Icon"
                                        loading={"eager"}
                                    />
                                </div>
                            </div>

                            {userStore.isLogged ? (
                                <div
                                    className={s.nav_item}
                                    onClick={() => {
                                        handleNavigation('/account')
                                        desktopStore.setMobileSideBar(false)
                                    }}
                                >
                                    <div className={s.icon_wrapper}>
                                        <Image
                                            width={26}
                                            height={26}
                                            src={isAccount && !desktopStore.mobileSideBar ? accountSelected : accountNotSelected}
                                            alt="Profile Icon"
                                            loading={"eager"}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className={s.nav_item}
                                >
                                    <AuthModal style={{display: 'flex', width: 'auto'}}>
                                        <Image
                                            width={26}
                                            height={26}
                                            src={isAccount && !desktopStore.mobileSideBar ? accountSelected : accountNotSelected}
                                            alt="Profile Icon"
                                        />
                                    </AuthModal>
                                </div>
                            )}
                        </div>
                    </>
                }
            </header>
            {desktopStore.mobileSideBar &&
                <Sidebar/>
            }
            <ContactModal isOpen={contactOpen} handleClose={closeContact}/>
        </>


    );
};

export default observer(NavbarC);