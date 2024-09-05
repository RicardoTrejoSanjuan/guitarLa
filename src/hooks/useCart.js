import { useState, useEffect, useMemo } from 'react';
import { db } from '../data/db';

export const useCart = () => {

    const initialCart = () => {
        const localStorageCart = localStorage.getItem('cart');
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }

    // State
    const [data] = useState(db);
    const [cart, setCart] = useState(initialCart);
    const MAX_ITEMS = 5;
    const MIN_ITEMS = 1;

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    function addToCart(item) {
        const guitarExist = cart.findIndex(element => element.id === item.id);

        if (guitarExist >= 0) {
            if (cart[guitarExist].quantity >= MAX_ITEMS) return;
            const updateCart = [...cart];
            updateCart[guitarExist].quantity++;
            setCart(updateCart);
        } else {
            item.quantity = 1;
            setCart(prevCart => [...prevCart, item]);
        }
    }

    function removeFromCart(id) {
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id));
    }

    function increaseQuantity(id) {
        const updateCart = cart.map(item => {
            if (item.id === id && item.quantity < MAX_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity + 1
                };
            }
            return item;
        });
        setCart(updateCart);
    }

    function decreaseQuantity(id) {
        const updateCart = cart.map(item => {
            if (item.id === id && item.quantity > MIN_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity - 1
                };
            }
            return item;
        });
        setCart(updateCart);
    }

    function emptyCart() {
        setCart([]);
    }


    // State Derivado

    // const esEmpty = () => cart.length === 0;
    const esEmpty = useMemo(() => cart.length === 0, [cart]);
    const cartTotal = () => cart.reduce((total, item) => total + (item.quantity * item.price), 0);

    return {
        cart,
        data,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        emptyCart,
        esEmpty,
        cartTotal
    }
}
