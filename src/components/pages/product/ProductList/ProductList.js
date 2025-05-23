import React, {useEffect, useState} from 'react';
import ProductCard from "@/components/shared/ProductCard/ProductCard";
import s from './ProductList.module.css'
import {observer} from "mobx-react-lite";

const ProductList = ({products, isAdmin, showPromos=false}) => {
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
        products.forEach((product, index) => {
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
        <div className={s.container}>
            <div className={s.product_list}>
                {productsPageBlocks.length !== 0 &&
                    productsPageBlocks
                }
                {products.length === 0 &&
                    <div className={s.nothing}>
                        <div className='text-center'>
                            Товары по вашему запросу не найдены
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default observer(ProductList);