import React from 'react';
import Link from "next/link";
import s from "@/styles/500.module.css";
import MainLayout from "@/layout/MainLayout";

const Error404 = () => {
    return (
        <MainLayout>
            <div className={s.cont}>
                <h1 className={'text-center'}>Кажется, страница не существует...</h1>
                <div className={'d-flex justify-content-center'}>
                    <Link href={'/'}
                          className={s.link}>На главную страницу</Link>
                </div>
            </div>
        </MainLayout>
    );
};

export default Error404;