import MainLayout from "@/layout/MainLayout";
import React, {useContext, useEffect, useRef, useState} from "react";
import {Col, Container} from "react-bootstrap";
import s from '../styles/products.module.css'
import PageSwitch from "@/components/pages/product/PageSwitch/PageSwitch";
import FiltersBlock from "@/components/pages/product/FiltersBlock/FiltersBlock";
import SortDropdown from "@/components/pages/product/SortDropdown/SortDropdown";
import FilterDropdowns from "@/components/pages/product/FilterDropdowns/FilterDropdowns";
import ProductList from "@/components/pages/product/ProductList/ProductList";
import Cookies from "js-cookie";
import filter from '@/static/icons/filter.svg'
import Image from "next/image";
import {fetchProductsByArray, fetchProductsPage} from "@/http/productsApi";
import {useRouter} from "next/router";
import {Context} from "@/context/AppWrapper";
import {observer} from "mobx-react-lite";
import {parse} from "cookie";
import {fetchLastSeen} from "@/http/userApi";
import jwtDecode from "jwt-decode";
import Head from "next/head";
import Compilation from "@/components/shared/Compilation/Compilation";
import cross from '@/static/icons/x-lg.svg'
import cn from "classnames";

export const getServerSideProps = async (context) => {
    const cookies = parse(context.req.headers.cookie || '')
    const token = cookies['access_token']
    const url = context.query

    let lastSeen = []

    if (token) {
        const {user_id} = jwtDecode(token)
        lastSeen = await fetchLastSeen(context.req.headers.cookie, user_id)

    } else {
        let arr
        if (cookies.last_seen) {
            arr = cookies['last_seen'].trim().split(' ')
            if (arr[0] !== '') {
                lastSeen = await fetchProductsByArray(arr, token)
            }
        }
    }

    const productsAll = await fetchProductsPage(url, token);
    const productsAmount = productsAll.count;

    return {
        props: {lastSeen, productsAll, productsAmount}
    }
}
const Products = ({lastSeen, productsAll, productsAmount}) => {
    const productListRef = useRef(null)
    const router = useRouter()
    const page = Number(router.query.page) || 1
    const [totalProducts, setTotalProducts] = useState(productsAmount)
    const [isOpen, setIsOpen] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const {filterStore, desktopStore} = useContext(Context)
    const [products, setProducts] = useState(productsAll)

    const handleClick = () => {
        if (desktopStore.isDesktop) {
            setIsOpen(!isOpen)
        } else {
            if (!modalOpen) {
                document.body.classList.add('body-scroll-clip')
            } else {
                document.body.classList.remove('body-scroll-clip')
            }
            setModalOpen(!modalOpen)
            filterStore.handleScrollTo()
        }
    }
    const clearFilters = () => {
        filterStore.deactivateFilters(filterStore.filters)
        filterStore.handleScrollTo()
        filterStore.setPriceFrom('')
        filterStore.setPriceTo('')

        router.push(`/products`, undefined, {scroll: false})
    }

    useEffect(() => {
        const token = Cookies.get('access_token')
        fetchProductsPage(router.query, token).then(res => {
            setProducts(res)
            filterStore.setMinPrice(res?.min_price ?? 1)
            filterStore.setMaxPrice(res?.max_price ?? 100_000)
            setTotalProducts(res.count)
        })

        filterStore.deactivateFilters(filterStore.filters)
        filterStore.reactivateFilters(router.query)

        filterStore.setRef(productListRef)
    }, [router.asPath])


    return (
        <MainLayout>
            <Head>
                <title>
                    Мастер-классы от Les-Jours
                </title>
                <meta property="og:title" content="Мастер-классы от Les-Jours"/>
                <meta property="og:description" content="Мастер-классы от Les-Jours"
                />
                <meta name={'description'} content=
                    "Мастер-классы от Les-Jours"/>
            </Head>
            <div className={`${s.cont} custom_cont`}>
                {desktopStore.isDesktop &&
                    <div className={cn(
                        s.filter_sort_row,
                        desktopStore.navbarVisible ? s.withNavbar : s.withoutNavbar
                    )}
                    >
                        <Col lg={10} className='d-flex align-items-stretch'>
                            <button className={s.border + ' fw-bold'}
                                    onClick={() => desktopStore.setFilterOpen(!desktopStore.filtersOpen)}
                            >Фильтры
                            </button>
                            {(filterStore.activeFilters.length !== 0) &&
                                <button
                                    className={s.border}
                                    onClick={clearFilters}
                                >
                                    Сбросить фильтры
                                </button>
                            }
                            <FiltersBlock/>
                        </Col>
                        <Col lg={2} className='mt-lg-0 mt-2 d-flex justify-content-lg-end'>
                            <SortDropdown/>
                        </Col>
                    </div>
                }
                {!desktopStore.isDesktop &&
                    <div className={['d-flex justify-content-evenly align-items-center', s.mobile_sort_row].join(' ')}
                    >
                        <button className={s.filter_toggle}
                                onClick={handleClick}
                        >
                            <Image src={filter} alt="" className={s.filter_icon}/>
                            Фильтры
                        </button>
                        <SortDropdown/>
                    </div>
                }
                <div className={s.product_list_row} ref={productListRef}>
                    {desktopStore.filtersOpen &&
                        <FilterDropdowns/>
                    }
                    {products.results.length > 0 &&
                        <ProductList products={products.results} isAdmin={false}/>
                    }
                </div>
                <PageSwitch currentPage={page} totalProducts={totalProducts}/>
            </div>
            <div>
                {lastSeen.length > 0 &&
                    <Compilation arr={lastSeen} title={'Ранее просмотренные'} paddings={'regular'}/>
                }
            </div>

            {modalOpen &&
                <div className={s.modal}
                     style={desktopStore.navbarVisible ? {top: 0} : {top: 0}}
                >
                    <Container>
                        <div className='d-flex justify-content-between'>
                            <div className={s.modal_header}>
                                <div className='d-flex align-items-center'>
                                    <div className={s.modal_text}>Фильтры</div>
                                    <div className={s.number}>{filterStore.activeFilters.length}</div>
                                </div>
                                <button className={s.modal_btn}
                                        onClick={clearFilters}
                                >Сбросить все
                                </button>
                            </div>
                            <Image src={cross} alt='' onClick={handleClick} className={'cursor-pointer'}/>
                        </div>
                        <FiltersBlock/>
                        <FilterDropdowns/>
                        <div className='d-flex justify-content-center'>
                            <button className={s.results} onClick={handleClick}>Показать результаты</button>
                        </div>
                    </Container>
                </div>
            }
        </MainLayout>
    );
};

export default observer(Products);