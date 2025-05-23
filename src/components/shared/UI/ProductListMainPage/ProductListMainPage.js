import React, {useEffect, useState} from 'react';
import ProductCard from "@/components/shared/ProductCard/ProductCard";
import s from './ProductListMainPage.module.css'
import {observer} from "mobx-react-lite";
import {desktopStore} from "@/store/DesktopStore";
import Link from "next/link";

const ProductListMainPage = ({products}) => {
    const calculateCardsPerRow = () => {
        const width = window.innerWidth;
        if (width < 650) return 2; // 2 карточки в ряду
        if (width < 1210) return 3; // 3 карточки в ряду
        if (width < 1515) return 4; // 4 карточки в ряду
        if (width < 2000) return Math.floor(0.94 * width / 356);
        if (width < 2500) return Math.floor(0.8 * width / 356);
        return Math.floor(0.7 * width / 356); // 4 карточки в ряду
    };

    const modifiedProductsPage = () => {
        const result = [];

        const rows = desktopStore.isDesktop ? 2 : 3;
        const totalCards = cardsPerRow * rows;

        const visibleProducts = products.slice(0, totalCards);

        visibleProducts.forEach((product) => {
            result.push(
                <ProductCard
                    product={product}
                    key={product.id}
                    cardList={true}
                />
            );
        });
        return result;
    };

    const [cardsPerRow, setCardsPerRow] = useState(0);
    const [productsPageBlocks, setProductsPageBlocks] = useState(modifiedProductsPage());

    useEffect(() => {
        const handleResize = () => {
            setCardsPerRow(calculateCardsPerRow());
        };

        // Устанавливаем значение при первом рендере
        handleResize();

        // Добавляем слушатель изменения размера окна
        window.addEventListener("resize", handleResize);

        // Убираем слушатель при размонтировании
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    useEffect(() => {
        setProductsPageBlocks(modifiedProductsPage())
    }, [cardsPerRow, products]);

    return (
        <div className={s.container + ' custom_cont'}>
            <div className={s.title}>Ближайшие мастер-классы</div>
            <div className={s.text2}>В мире постоянной суеты и стресса так важно находить время для себя.</div>
            <div className={s.text2}>Это не просто творчество, а возможность остановиться, побыть в моменте и услышать
                внутреннее "я"…
            </div>
            <div className={s.product_list}>
                {productsPageBlocks}
            </div>
            <div className={s.customButton}>
                <Link href={'/products'} className={s.link}>
                    Посмотреть все мастер-классы
                </Link>
            </div>
        </div>
    );
};

export default observer(ProductListMainPage);