import React, {useEffect, useRef, useState} from 'react';
import {useSwipeable} from 'react-swipeable';
import s from './ProductDetailsMob.module.css';
// Импортируйте ваши стили
import Notification from "@/components/shared/Notification/Notification";
import {Navigation, Pagination, Zoom} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/react";
import Arrow from "@/components/shared/UI/Arrow/Arrow";

const ProductDetails = ({product}) => {
    const [activeTab, setActiveTab] = useState("characteristics");

    const [notification, setNotification] = useState(null);
    const [moreOpen, setMoreOpen] = useState(false)
    const swiperRef = useRef(null); // Реф для Swiper

    const [contentHeight, setContentHeight] = useState('300px');

    const contentRef = useRef(null);
    useEffect(() => {
        if (contentRef.current) {
            setContentHeight("300px");
            setContentHeight(moreOpen ? (contentRef.current.scrollHeight + 10) + "px" : '300px');
            setTimeout(() => {
                setContentHeight(moreOpen ? (contentRef.current.scrollHeight + 10) + "px" : '300px');
            }, 400)

        }
    }, [moreOpen]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        if (tab === 'description') {
            swiperRef.current?.swiper.slideTo(1); // Переключаем на первый слайд
        } else if (tab === 'characteristics') {
            swiperRef.current?.swiper.slideTo(0); // Переключаем на второй слайд
        }
    };


    const renderParams = () => {
        const res = [];
        const paramsObj = product.parameters;
        const order = paramsObj.parameters_order;
        if (order) {
            const params = {};
            for (const param of order) {
                if (param in product.parameters.parameters) {
                    params[param] = paramsObj.parameters[param];
                }
            }

            for (const key in params) {
                res.push(
                    <p className={s.characteristics}>{key}:
                        <span className={s.characteristics_text}>{params[key].join(', ')}</span>
                    </p>
                );
            }
        } else {
            for (const key in paramsObj) {
                res.push(
                    <p className={s.characteristics}>{key}:
                        <span className={s.characteristics_text}>{paramsObj[key].join(', ')}</span>
                    </p>
                );
            }
        }
        return res;
    };

    const handlers = useSwipeable({
        onSwipedLeft: () => setActiveTab('description'),
        onSwipedRight: () => setActiveTab('characteristics'),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    });


    const toggle_more_open = () => {
        if (moreOpen) {
            setMoreOpen(true)
        }
        setMoreOpen(!moreOpen)
    }

    const [infoBtn, setInfoBtn] = useState(true)
    const [fadeOutInvisible, setFadeOutInvisible] = useState(false)

    useEffect(() => {
        if (contentRef && contentRef.current.clientHeight >= 300) {
            setInfoBtn(true)
        } else {
            setInfoBtn(false)
            setFadeOutInvisible(true);
        }
    }, [moreOpen])

    const renderInfo = () => {
        const res = []
        const infoList = product.details
        for (let info of infoList) {
            res.push(
                <p className={s.details}>
                    🎀&nbsp;&nbsp;{info}
                </p>
            )
        }
        return res
    }

    return (
        <div>
            {notification && (
                <Notification
                    message={notification}
                    onClose={() => setNotification(null)}
                />
            )}
            <div

                {...handlers}
                key={product.id}
            >
                <div>
                    <div>
                        <div className={s.menu} key={product.id} id={product.id}>
                            <button
                                className={`${activeTab === 'characteristics' ? s.active : s.inActive} ${!product.details ? s.fullWidth : ''}`}
                                onClick={() => handleTabClick('characteristics')}
                            >
                                Детали
                            </button>
                            {product.details && (
                                <button
                                    className={activeTab === 'description' ? s.active : s.inActive}
                                    onClick={() => handleTabClick('description')}
                                >
                                    Что вас ждет?
                                </button>
                            )}
                        </div>

                        <Swiper
                            ref={swiperRef} // Присваиваем реф Swiper
                            initialSlide={0}
                            modules={[Pagination, Zoom, Navigation]}
                            className={s.cont}
                            style={{
                                '--swiper-pagination-color': 'rgba(0,0,0,0.9)',
                                '--swiper-pagination-bullet-inactive-color': 'radial-gradient(circle, #000000 35%, rgba(255, 255, 255, 0) 50%)',
                                '--swiper-pagination-top': 'auto', // Убираем верхний отступ
                                '--swiper-pagination-progressbar-size': '2px',
                                '--swiper-pagination-bullet-size': '10px',
                                '--swiper-pagination-bullet-horizontal-gap': '12px',
                                // '--swiper-pagination-bullet-border-radius': '25%',
                                '--swiper-pagination-progressbar-bg-color': 'rgba(0,0,0,0.1)',
                                "--swiper-navigation-color": "rgba(0,0,0,0.5)",
                            }}
                        >
                            <SwiperSlide>

                                <div
                                    ref={contentRef}
                                    className={[s.more, moreOpen ? s.more_open : ""].join(" ")}
                                    style={{maxHeight: contentHeight}}
                                >
                                    <div className={activeTab === 'characteristics' ? s.tabActive : ''}>
                                        <div className={s.characteristicsTab}>
                                            {/*<div className={s.characteristics_title}>Характеристики товара:</div>*/}
                                            {renderParams()}
                                        </div>
                                        {/* Градиент для плавного исчезновения внизу */}
                                        <div
                                            className={`${moreOpen || fadeOutInvisible ? s.invisible : s.fadeOut}`}></div>
                                    </div>
                                </div>
                                {infoBtn &&
                                    <div className='d-flex justify-content-center'>
                                        <button
                                            className={s.more_btn}
                                            onClick={toggle_more_open}>
                                            <div className={s.more_text}>
                                                Подробнее
                                                <Arrow isOpen={moreOpen}/>
                                            </div>
                                        </button>
                                    </div>
                                }

                            </SwiperSlide>

                            {product.details && (
                                <SwiperSlide
                                >
                                    <div
                                        ref={contentRef}
                                        className={[s.more, moreOpen ? s.more_open : ""].join(" ")}
                                        style={{maxHeight: contentHeight}}
                                    >

                                        <div className={activeTab === 'description' ? s.tabActive : s.tabInactive}>
                                            <div className={s.descriptionTab}>
                                                <p className={s.description}>
                                                    {renderInfo()}
                                                </p>
                                            </div>
                                            {/* Градиент для плавного исчезновения внизу */}
                                            <div
                                                className={`${moreOpen || fadeOutInvisible ? s.invisible : s.fadeOut}`}></div>
                                        </div>
                                    </div>
                                    {infoBtn &&
                                        <div className='d-flex justify-content-center'>
                                            <button
                                                className={s.more_btn}
                                                onClick={toggle_more_open}>
                                                <div className={s.more_text}>
                                                    Подробнее
                                                    <Arrow isOpen={moreOpen}/>
                                                </div>
                                            </button>
                                        </div>}

                                </SwiperSlide>)}
                        </Swiper>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
