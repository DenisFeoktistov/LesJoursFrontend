import React from 'react';
import s from './Compilation.module.css'
import ProductCard from "@/components/shared/ProductCard/ProductCard";
import ScrollableBlock from "@/components/shared/UI/ScrollableBlock/ScrollableBlock";

const Compilation = ({arr, title, paddings = 'none', rows = 1, resetScrollToBeginning = false}) => {
    return (
        <div>
            <h3 className={`${s.title} ${paddings === 'regular' ? s.margins : ''}`}>{title}</h3>
            <ScrollableBlock paddings={paddings} rows={rows} resetScrollToBeginning={resetScrollToBeginning}>
                {
                    arr.map(el =>
                        <ProductCard
                            product={el}
                            key={el.id}
                        />
                    )
                }
            </ScrollableBlock>
        </div>
    );
};

export default Compilation;