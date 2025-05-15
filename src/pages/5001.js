import React, {useEffect, useState} from 'react';
import MainLayout from "@/layout/MainLayout";
import s from '@/styles/500.module.css'
import Link from "next/link";
import Cookies from "js-cookie";
import {parse} from "cookie";
import {fetchOneProduct, fetchPrices, fetchProductsTemp} from "@/http/productsApi";
import jwtDecode from "jwt-decode";
import {fetchUserInfo} from "@/http/userApi";
import {observer} from "mobx-react-lite";

export const getServerSideProps = async (context) => {
    const cookies = parse(context.req.headers.cookie || '');
    const token = cookies['access_token'];

    // Получение IP-адреса пользователя из заголовка X-Forwarded-For
    const ip = context.req.headers['x-forwarded-for'] || context.req.connection.remoteAddress;

    const products = await fetchProductsTemp(token, ip);

    return {props: {products}};
};

const Error5001 = ({products}) => {
    console.log(products)
    const [selectedGender, setSelectedGender] = useState("any")
    useEffect(() => {
        if (Cookies.get('selected_gender')) {
            setSelectedGender(Cookies.get('selected_gender'))
        }
    }, []);
    return (
        <MainLayout>
            <div className={s.cont}>
                <h1 className={'text-center'}>Кажется, произошла какая-то ошибка...</h1>
                <div className={'d-flex justify-content-center'}>
                    <Link href={selectedGender === 'M' ? '/men' : selectedGender === 'F' ? '/women' : '/'}
                          className={s.link}>На главную страницу</Link>
                </div>
            </div>
        </MainLayout>
    );
};

export default observer(Error5001);