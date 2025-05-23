import React, {useEffect, useState} from 'react';
import s from './AccountNavbar.module.css'
import Arrow from "@/components/shared/UI/Arrow/Arrow";
import {useRouter} from "next/router";
import Link from "next/link";

const AccountNavbar = () => {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState('')
    const toggle = () => {
        setIsOpen(!isOpen)
    }
    const links = [
        {
            name: 'Личные данные',
            address: 'account',
            link: '/account'

        },
        {
            name: 'Заказы',
            address: 'orders',
            link: '/account/orders'

        }
    ]
    useEffect(() => {
        const arr = router.pathname.split('/')
        const page = arr[arr.length-1]
        links.forEach(el => {
            if (el.address === page) {
                setCurrentPage(el.name)
            }
        })
    })
    return (
        <div>
            <div className={s.toggle}
                 onClick={toggle}
            >
                <div>
                    {currentPage}
                </div>
                <Arrow isOpen={isOpen}/>
            </div>
            {isOpen &&
                <div>
                    <hr className={s.hr}/>
                    <div className={s.items_block}>
                        {
                            links.map(el =>
                                <Link href={el.link}
                                     className={s.item}
                                     key={el.name}
                                >
                                    {el.name}
                                </Link>
                            )
                        }
                    </div>
                </div>
            }
        </div>
    );
};

export default AccountNavbar;