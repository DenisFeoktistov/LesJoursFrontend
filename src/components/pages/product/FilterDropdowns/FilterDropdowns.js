import React, {useContext} from 'react';
import GenderDropdown from "./GenderDropdown/GenderDropdown";
import PriceDropdown from "./PriceDropdown/PriceDropdown";
import Sale from "./Sale/Sale";
import s from './FilterDropdowns.module.css'
import {Context} from "@/context/AppWrapper";

const FilterDropdowns = () => {
    const {desktopStore} = useContext(Context)
    return (
        <div>
            <div className={s.container}
                 style={desktopStore.navbarVisible ? {top: 200} : {top: 80, maxHeight: 'calc(100vh - 80px)'}}>
                <GenderDropdown/>
                <PriceDropdown/>
                <Sale/>
            </div>
        </div>
    );
};

export default FilterDropdowns;