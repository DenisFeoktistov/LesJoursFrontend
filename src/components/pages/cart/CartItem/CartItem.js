import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import s from './CartItem.module.css'
import Image from "next/image";
import close from '@/static/icons/x-lg.svg'
import {Context} from "@/context/AppWrapper";
import {useRouter} from "next/router";
import Cookies from "js-cookie";
import {removeFromCart, removeFromCartCertificate} from "@/http/cartApi";
import {addToWishlist, removeFromWishlist} from "@/http/wishlistAPI";
import like_fill from "@/static/icons/heart-fill.svg";
import like from "@/static/icons/heart.svg";
import AuthModal from "@/components/shared/AuthModal/AuthModal";
import {observer} from "mobx-react-lite";
import {
    trackAddToFavorites,
    trackRemoveToCart,
    trackRemoveToFavorites
} from "@/components/shared/YandexMetrica/YandexMetrica";
import green_gift from "@/static/icons/gift-green.svg";
import Link from "next/link";
import certificateImg from "@/static/img/certificateImg.png";

const CartItem = ({
                      price, productId, unitId, imgSrc, slug, inWL,
                      available, name, guestsAmount, date, contacts, address, type, amount, key
                  }) => {
    const {cartStore, userStore} = useContext(Context)
    const router = useRouter()

    const [isDeleted, setIsDeleted] = useState(false)


    const deleteFromCart = async () => {
        setIsDeleted(true);

        const unitIdStr = String(unitId);

        const currCart = Cookies.get('cart').trim().split(' ').filter(el => el !== ' ' && el !== '');
        const newCart = currCart.filter(el => !el.startsWith(`${unitIdStr}_`));
        Cookies.set('cart', newCart.join(' '), {expires: 2772});
        if (userStore.isLogged) {
            const data = await removeFromCart(userStore.id, unitId, Cookies.get('access_token'));
        }
        cartStore.setCartCnt(newCart.length);

        router.push('/cart', undefined, {scroll: false});
    }

    const deleteFromCartCertificate = async () => {
        setIsDeleted(true);

        const currCart = Cookies.get('cart').trim().split(' ').filter(el => el !== ' ' && el !== '');

        const target = `certificate_${amount}`;
        let removed = false;
        const newCart = currCart.filter(el => {
            if (!removed && el === target) {
                removed = true;
                return false;
            }
            return true;
        });

        Cookies.set('cart', newCart.join(' '), {expires: 2772});
        if (userStore.isLogged) {
            const data = await removeFromCartCertificate(userStore.id, amount, Cookies.get('access_token'));
        }
        cartStore.setCartCnt(newCart.length);

        router.push('/cart', undefined, {scroll: false});
    }

    const [isInWishlist, setIsInWishlist] = useState(inWL)

    const addToWL = async () => {
        setIsInWishlist(true)
        const token = Cookies.get('access_token')
        const userId = userStore.id
        const data = await addToWishlist(userId, productId, token)

    }
    const deleteFromWL = async () => {
        setIsInWishlist(false)
        const token = Cookies.get('access_token')
        const userId = userStore.id
        const data = await removeFromWishlist(userId, productId, token)

    }

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
        <div key={key} className={isDeleted ? `${s.row} ${s.slideOut}` : ""}>

            <hr/>
            {type === "master_class" &&
                <>
                    <div className={s.row}>
                        <Link href={`/products/${slug}`} className={s.col1}>
                            {imgSrc &&
                                <Image
                                    src={imgSrc}
                                    alt=''
                                    className={s.img}
                                    width={400}
                                    height={400}
                                />}
                        </Link>
                        <div className={s.inner_row}>
                            <div className={s.col}>
                                <div>
                                    <div className={s.brand}>Мастер-класс</div>
                                    <div className={s.text}>{name}</div>
                                </div>
                                <div>
                                    <div className={`${s.brand} ${s.number_block}`}>Контакты локации</div>
                                    <div className={s.text}>{contacts}</div>
                                </div>
                            </div>

                            <div className={s.col_dropdown}>
                                <div className={s.dropdowns}>
                                    <div className={s.brand}>Дата проведения</div>
                                    <div
                                        className={s.text}>{formatDateTime(date.start_datetime, date.end_datetime)}</div>
                                    <div className={s.number_block}>
                                        <div className={s.brand}>Адрес проведения</div>
                                        <div className={s.text}>{address}</div>
                                    </div>
                                </div>
                            </div>
                            <div className={`${s.col}`}>
                                <div className={s.dropdowns}>
                                    <div className={s.brand}>Число гостей</div>
                                    <div className={s.text}>{guestsAmount}</div>
                                </div>
                                <div className={`${s.dropdowns} ${s.number_block}`}>
                                    <div className={s.brand}>Общая стоимость</div>
                                    <div className={s.text}>{addSpacesToNumber(price)} ₽</div>
                                </div>

                                {userStore.isLogged
                                    ?
                                    <div className={s.like_block}
                                         onClick={(e) => {
                                             e.stopPropagation()
                                             isInWishlist ? deleteFromWL() : addToWL()
                                         }}>
                                        <Image src={isInWishlist ? like_fill : like} alt="like" className={s.like}
                                        />
                                        <div>{isInWishlist ? 'В избранном' : 'В избранное'}</div>
                                    </div>
                                    :
                                    <div onClick={e => e.stopPropagation()}>
                                        <AuthModal fromWishlist={true}>
                                            <div className={s.like_block}>
                                                <Image src={isInWishlist ? like_fill : like} alt="like"
                                                       className={s.like}
                                                />
                                                <div>{isInWishlist ? 'В избранном' : 'В избранное'}</div>
                                            </div>
                                        </AuthModal>
                                    </div>
                                }
                            </div>
                        </div>
                        <div>
                            <Image src={close} alt='' className={s.icon}
                                   onClick={deleteFromCart}
                            />
                        </div>
                    </div>
                    {
                        !available &&
                        <p className={'text-center red_text'}>К сожалению, данный мастер-класс распродан, удалите его из
                            корзины
                            <br/>
                            Вы можете добавить мастер-класс в избранное, и мы уведомим вас, как только он появится в
                            наличии!
                        </p>
                    }
                </>
            }
            {type === "certificate" &&
                <>
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
                            <div className={s.col}>
                                <div>
                                    <div className={s.brand}>Сертификат на сумму:</div>
                                    <div className={s.text}>{amount}₽</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <Image src={close} alt='' className={s.icon}
                                   onClick={deleteFromCartCertificate}
                            />
                        </div>
                    </div>
                </>
            }
        </div>
    );
};

export default observer(CartItem);