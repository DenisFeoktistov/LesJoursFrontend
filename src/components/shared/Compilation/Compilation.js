import React from 'react';
import s from './Compilation.module.css'
import ProductCard from "@/components/shared/ProductCard/ProductCard";
import ScrollableBlock from "@/components/shared/UI/ScrollableBlock/ScrollableBlock";

const Compilation = ({arr, title, paddings='none', rows=1, resetScrollToBeginning=false}) => {
    const tempMasterClasses = {
        "id": 43719,
        "in_wishlist": false,
        "price": {
            "start_price": 8490,
            "final_price": 8490
        },
        "short_description": "Вы сможете создать собственный тортик и чудесно провести вечер! Вы сможете создать еще один собственный тортик и опять чудесно провести вечер!",
        "slug": "vans-old-skool-blackwhite-43719",
        "location": "м. Новокузнецкая",
        "name": "Бенто-торт бенто в торте",
        "bucket_link": [
            {
                "id": 18603709,
                "url": "https://storage.yandexcloud.net/les-jours-bucket/1.png"
            },
            {
                "id": 18603710,
                "url": "https://cdn.poizon.com/pro-img/origin-img/20230721/037c574fa17445ea9a85215e6ebb63a7.jpg"
            },
            {
                "id": 18603711,
                "url": "https://cdn.poizon.com/pro-img/origin-img/20230721/df71fdc035fb40668def489de323e230.jpg"
            }
        ]
    }

    return (
        <div>
            <h3 className={`${s.title} ${paddings === 'regular' ? s.margins : ''}`}>{title}</h3>
            <ScrollableBlock paddings={paddings} rows={rows} resetScrollToBeginning={resetScrollToBeginning}>
                {
                    arr.map(el =>
                        <ProductCard
                                     product={tempMasterClasses}
                        />
                    )
                }
            </ScrollableBlock>
        </div>
    );
};

export default Compilation;