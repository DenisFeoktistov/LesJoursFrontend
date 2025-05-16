import {makeAutoObservable} from "mobx";
import cn from "classnames";
import Cookies from "js-cookie";
import sizes from '@/static/jsons/size_table.json'

class FilterStore {
    constructor() {
        this._ref = null
        this._allFilters = {
            age: {
                '6': {
                    text: '6+',
                    query: '6',
                    state: false
                },
                '12': {
                    text: '12+',
                    query: '12',
                    state: false
                },
                '16': {
                    text: '16+',
                    query: '16',
                    state: false
                }
            },
            price: ['0', '1000000'],
            minMaxPrice: ['0', '1000000'],
            is_sale: {
                text: 'Скидка',
                query: 'is_sale',
                state: false,
            }
        }
        this._activeFilters = []
        makeAutoObservable(this)
    }

    get filters() {
        return this._allFilters
    }

    get activeFilters() {
        return this._activeFilters
    }

    deactivateFilters(d) {
        for (const key in d) {
            if (key === 'path') continue
            if (d[key] && typeof d[key] === 'object') {
                if (d[key].hasOwnProperty('state')) {
                    d[key]['state'] = false;
                } else {
                    this.deactivateFilters(d[key]);
                }
            }
        }

        this._activeFilters = []
    }

    reactivateFilters(query) {
        {
            for (const key in query) {
                if (key === 'page' || key === 'price' || key === 'ordering'
                    || key === 'price_min' || key === 'price_max') continue

                if (Array.isArray(query[key])) {
                    query[key].forEach(el => {
                        if (key in this.filters) {
                            this.dfsActivate(this.filters[key], el)
                        }

                    })
                } else {
                    if (key in this.filters) {
                        this.dfsActivate(this.filters[key], query[key])
                    }

                }
            }
            this.dfsPath(this.filters, [])
            this._activeFilters = this._activeFilters.filter((obj, index) => {
                return this._activeFilters.findIndex((o) => {
                    return JSON.stringify(o) === JSON.stringify(obj);
                }) === index;
            });
        }
    }

    dfsActivate(d, queryValue) {
        if (!d.hasOwnProperty('query')) {
            for (const key in d) {
                this.dfsActivate(d[key], queryValue)
            }
        } else {
            if (d.query === queryValue) {
                if (!d.state) {
                    d.state = true
                    this._activeFilters.push(d)
                }
            }
        }
    }

    dfsPath(d, path) {
        for (const key in d) {
            if (key === 'price') continue
            if (typeof d[key] === 'object') {
                path.push(key)
                this.dfsPath(d[key], path)
                path.pop()
            } else {
                d.path = path
            }
        }
    }

    toggleFilter(item) {
        let d = this.filters
        item.path.forEach(key => {
            d = d[key]
        })
        d.state = !d.state
        if (item.path[0] === 'collab') {
            const deactivateList = []
            const obj = this.filters.collab
            for (const key in obj) {
                if (item.is_all) {
                    if (!obj[key].is_all) {
                        obj[key].state = false
                        deactivateList.push(obj[key])
                    }
                } else {
                    if (obj[key].is_all) {
                        obj[key].state = false
                        deactivateList.push(obj[key])
                        break
                    }
                }
            }
            for (let i = 0; i < deactivateList.length; i++) {
                this._activeFilters = this._activeFilters.filter(el => el.query !== deactivateList[i].query)
            }
        } else {
            this.toggleAll(item)
        }
        if (d.state) {
            this._activeFilters.push(item)
        } else {
            this._activeFilters = this._activeFilters.filter(el => el.query !== item.query)
        }
        this.handleScrollTo()
    }

    toggleAll(item) {
        let isAll
        let currObj = this.filters
        if (!item.hasOwnProperty('is_all')) {
            return null
        } else {
            isAll = item.is_all
        }
        const deactivateList = []
        if (isAll && item.state) {
            for (let i = item.path.length - 2; i > 0; i--) {
                const {path} = item
                for (let j = 0; j < i; j++) {
                    currObj = currObj[path[j]]
                }
                for (const key in currObj) {
                    if (currObj[key].is_all && currObj[key].query !== item.query) {
                        currObj[key].state = false
                        deactivateList.push(currObj[key])
                    }
                }
            }

            currObj = this.filters
            for (let j = 0; j < item.path.length - 1; j++) {
                currObj = currObj[item.path[j]]
            }
            this.deactivateFiltersBelow(currObj, item.query)
        }
        if (!isAll && item.state) {
            item.path.forEach(el => {
                currObj = currObj[el]
                for (const key in currObj) {
                    if (currObj[key].hasOwnProperty('is_all') && currObj[key].is_all) {
                        currObj[key].state = false
                        deactivateList.push(currObj[key])
                    }
                }
            })
        }
        for (let i = 0; i < deactivateList.length; i++) {
            this._activeFilters = this._activeFilters.filter(el => el.query !== deactivateList[i].query)
        }
    }

    deactivateFiltersBelow(d, query) {
        for (const key in d) {
            if (key === 'path') {
                continue
            }
            if (d[key].hasOwnProperty('state')) {
                if (d[key].query !== query) {
                    d[key].state = false
                    this._activeFilters = this._activeFilters.filter(el => el.query !== d[key].query)
                }
            } else {
                this.deactivateFiltersBelow(d[key], query)
            }
        }
    }

    get age() {
        const arr = [];

        for (const key in this.filters.age) {
            arr.push({...this.filters.age[key]});
        }

        return arr;
    }

    get checkedAgesQuery() {
        const checkedAges = [];

        for (const key in this.activeFilters) {
            if (this.activeFilters[key].path[0] === 'age') {
                checkedAges.push(this.activeFilters[key].query);
            }
        }

        return checkedAges;
    }

    setPriceFrom(from) {
        this._allFilters.price[0] = from
    }

    setPriceTo(to) {
        this._allFilters.price[1] = to
    }

    setPriceBoth(values) {
        this._allFilters.price = values
    }

    get price() {
        return this._allFilters.price
    }

    setMinPrice(price) {
        this._allFilters.minMaxPrice[0] = price
    }

    setMaxPrice(price) {
        this._allFilters.minMaxPrice[1] = price
    }

    get minMaxPrice() {
        return this._allFilters.minMaxPrice
    }

    get checkedSale() {
        if (this.filters.is_sale.state) {
            return [this.filters.is_sale.query]
        } else {
            return []
        }
    }

    setRef(ref) {
        this._ref = ref
    }

    get ref() {
        return this._ref
    }

    handleScrollTo() {
        const position = this.ref.current.offsetTop - 225;
        const currentScroll = window.scrollTop || document.documentElement.scrollTop

        if (currentScroll > position) {
            window.scrollTo({
                top: position,
                behavior: 'smooth',
                duration: 1000,
            });
        }
    };
}

export const filterStore = new FilterStore()