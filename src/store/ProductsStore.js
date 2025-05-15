import {makeAutoObservable} from "mobx";

class ProductsStore {
    constructor() {
        this._sizeChosen = null
        this._certificateChosen = null
        this._shipChosen = false
        this._anim = false
        this._shipps = []
        this._guestCounts = 0
        this._addToCartText = 'Добавить в корзину'
        makeAutoObservable(this)
    }

    clearAll() {
        this._sizeChosen = false
        this._certificateChosen = false
        this._shipChosen = false
        this._shipps = []
        this._guestCounts = 0
        this._addToCartText = 'Добавить в корзину'
    }

    setSizeChosen(bool) {
        this._sizeChosen = bool
        this._shipChosen = false
    }

    get sizeChosen() {
        return this._sizeChosen
    }

    setCertificateChosen(bool) {
        this._certificateChosen = bool
    }

    get certificateChosen() {
        return this._certificateChosen
    }

    setShipChosen(value) {
        this._shipChosen = value
    }

    get shipChosen() {
        return this._shipChosen
    }

    setAnim(value) {
        this._anim = value
    }

    get anim() {
        return this._anim
    }

    setShipps(arr) {
        this._shipps = arr
    }

    get shipps() {
        return this._shipps
    }

    setGuestCounts(count) {
        this._guestCounts = count
    }

    get guestCounts() {
        return this._guestCounts
    }

    get text() {
        return this._addToCartText
    }

    setText(arr, id) {
        const idStr = String(id);
        const isInCart = arr.some(item => item.startsWith(`${idStr}_`));

        if (isInCart) {
            this._addToCartText = 'Уже в корзине';
        } else {
            this._addToCartText = 'Добавить в корзину';
        }
    }
}

export const productStore = new ProductsStore()