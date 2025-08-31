import React, { useState, useRef } from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom'
import { useNotification } from '../context/NotificationContext';

const CartItems = ({ cartItems, total }) => {

    const [cartItemList, setCartItems] = useState(cartItems);
    const [totalPrice, setTotalPrice] = useState(total);
    const [loading, setLoading] = useState(false);
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    
    //Modal 
    const [showModal, setShowModal] = useState(false);
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    //Quantity mentéshez
    const updateTimer = useRef(null);

    const setQuantity = (id, quantity) => {
        total = 0;
        const updatedList = cartItemList.map(item => {
            const updatedItem = item.id === id
                ? { ...item, quantity: quantity }
                : item;
            total += updatedItem.event.price * updatedItem.quantity;
            return updatedItem; 
        });
        setCartItems(updatedList);
        setTotalPrice(total);

        //Elkerüljük a request-ek küldését sorozatos click esetében
        if (updateTimer.current) clearTimeout(updateTimer.current);

        updateTimer.current = setTimeout(() => {
            axios.post('http://localhost:8000/api/update-user-cart', {
                id,
                quantity
            }, 
            {withCredentials: true, withXSRFToken: true }
        ).catch(() => {
                console.log('');
            });
        }, 500); 
    }

    const handleBuyTickets = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/buy-tickets',
                {},
            {withCredentials: true, withXSRFToken: true }
        );

        if (response.data.success === true) {
            navigate('/events');
        } else {
            showNotification(response.data.message);
        }

        } catch (error) {
            console.error('Error:', error);
        }
    }

  return (
    <>
        <div className="p-4">
        <div className="d-flex flex-lg-row flex-column container-fluid justify-content-center align-items-center align-items-lg-start content cart-item-container">
            <div className="p-0 mb-4 mb-lg-0 gap-4 d-flex flex-column align-items-lg-between align-items-center col-lg-8 col-12">
            {cartItemList.length > 0 ? (
                cartItemList.map((item) => (
                <div key={item.id} className="d-flex justify-content-between align-items-center cart-item-box w-100">

                    <p className="fs-6 p-0 m-0">{item.event.title} - {item.event.price} Ft / Jegy</p>  
                    <div className="d-flex gap-3 align-items-center">
                        <button className="btn btn-dark" 
                            onClick={() => {
                            if((item.quantity) > 0) {
                                setQuantity(item.id, item.quantity - 1);
                            }
                            }}
                        >
                        <i className="fa fa-minus"></i>
                        </button>
                        <p className="text-dark p-0 m-0">{item.quantity}</p>
                        <button className="btn btn-dark" 
                            onClick={() => {
                            setQuantity(item.id, item.quantity + 1);
                            }}
                        >
                        <i className="fa fa-plus"></i>
                        </button>
                        <button className="btn btn-dark" disabled={loading}
                            onClick={() => {
                            setQuantity(item.id, 0);
                            }}
                        >
                        <i className="fa fa-trash"></i>
                        </button>
                        </div>
                </div>
                ))
            ) : (
                <p className="text-left fs-3 p-0 m-0">A kosarad jelenleg üres!</p>
            )}
            </div>
            <div className="d-flex flex-column col-lg-4 col-12 gap-4 align-items-center align-items-lg-end">
            <div className="cart_total_container d-flex justify-content-start align-items-center p-3 text-white">
                <p className="total-price fs-5 p-0 m-0">Kosár végösszege: {totalPrice}Ft</p> 
            </div>
            <div className="d-flex gap-2 justify-content-end">
                <Link to="/events" className="btn btn-dark"><i className="fa fa-shopping-cart"></i> Vásárlás folytatása</Link>
                {cartItemList.length > 0 && (
                <button className="btn btn-dark" onClick={handleShow}><i className="fa fa-credit-card"></i> Megrendelés</button>
                )}
            </div>
            </div>
        </div>
        </div>
        <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1" onClick={handleClose}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Jegyvásárlás</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <p>Biztonsan szeretnéd lefoglalni a kiválasztott jegyeket? (Fizetés a helyszínen történik).</p>
                        <p className="p-0 m-0">Vásárlás végösszege: {total} Ft</p>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-dark" onClick={handleBuyTickets}>Megrendelés</button>
                    </div>
                </div>
            </div>
        </div>
        {showModal && <div className="modal-backdrop fade show"></div>}
    </>
  );
};

export default CartItems;