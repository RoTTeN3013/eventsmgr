
import BaseLayout from '../layouts/BaseLayout';
import { useEffect, useState } from 'react';
import axios from 'axios'
import Loader from '../components/Loader';
import CartItems from '../components/CartItems';

export default function Cart() {

    const baseURL = import.meta.env.VITE_API_URL;

    const [loading, setLoading] = useState(true);
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
    axios.get(`${baseURL}/get-user-cart-items`, { withCredentials: true })
        .then(res => {
            if(res.data.success) {
                setCartItems(res.data.cart_items);
                setTotal(res.data.total);
            }
        })
        .catch(() => console.log('logolni'))
        .finally(() => setLoading(false));
    }, []);

    return (
        <BaseLayout>
            {loading ? <Loader /> : <CartItems cartItems={cartItems} total={total} />}     
        </BaseLayout>
    );
}


