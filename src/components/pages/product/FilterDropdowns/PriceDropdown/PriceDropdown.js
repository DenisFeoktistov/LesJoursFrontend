import React, {useContext, useEffect, useState} from 'react';
import s from './PriceDropdown.module.css'
import RangeSlider from "@/components/shared/UI/RangeSlider/RangeSlider";
import Arrow from "@/components/shared/UI/Arrow/Arrow";
import {Context} from "@/context/AppWrapper";
import {observer} from "mobx-react-lite";
import {useRouter} from "next/router";

const PriceDropdown = () => {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    const {filterStore} = useContext(Context)

    const handleFrom = (e) => {
        let raw = e.target.value;
        raw = raw.replace(/\D/g, '');
        raw = raw.replace(/^0+/, '');

        e.target.value = raw;

        // filterStore.setPriceFrom(e.target.value)
        const {pathname} = router
        const query = {...router.query}
        query.price_min = filterStore.price[0]
        query.price_max = filterStore.price[1]
        if (filterStore.price[0]) {
            query.price_min = filterStore.price[0]
        }
        if (filterStore.price[1]) {
            query.price_max = filterStore.price[1]
        }
        query.page = 1
        // router.push({pathname, query}, undefined, {scroll: false})
    }
    const handleTo = (e) => {
        let raw = e.target.value;
        raw = raw.replace(/\D/g, '');
        raw = raw.replace(/^0+/, '');

        e.target.value = raw;

        // filterStore.setPriceTo(e.target.value)
        const {pathname} = router
        const query = {...router.query}
        if (filterStore.price[0]) {
            query.price_min = filterStore.price[0]
        }
        if (filterStore.price[1]) {
            query.price_max = filterStore.price[1]
        }
        query.page = 1
        // router.push({pathname, query}, undefined, {scroll: false})
    }

    useEffect(() => {
        const {query} = router
        const {price_min, price_max} = query
        filterStore.setPriceBoth([price_min, price_max])
    }, [])
    return (
        <div>
            <div className={s.dropdown}
                 style={isOpen ? {borderRadius: '7px 7px 0 0'} : {borderRadius: '7px'}}
            >
                <div
                    onClick={() => toggleDropdown()}
                    className={s.dropdown_toggle}
                >
                    <div className={s.dropdown_toggle_text}>
                        Цена
                        <Arrow isOpen={isOpen}/>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className={s.dropdown_text}>
                    <div className={s.input_group}>
                        <div className='d-flex align-items-center'>
                            <label htmlFor="From">От</label>
                            <input type="number" id='From' inputMode={'decimal'}
                                   className={s.dropdown_input}
                                   placeholder={filterStore.minMaxPrice[0]}
                                   onChange={(e) => handleFrom(e)}
                            />
                        </div>
                        <div className='d-flex align-items-center'>
                            <label htmlFor="To">До</label>
                            <input type="number" id='To' inputMode="decimal"
                                   className={s.dropdown_input}
                                   placeholder={filterStore.minMaxPrice[1]}
                                   onChange={(e) => handleTo(e)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
};

export default observer(PriceDropdown);