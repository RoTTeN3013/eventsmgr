
import CardDetails from '../components/CardDetails';
import BaseLayout from '../layouts/BaseLayout';
import { useEffect, useState } from 'react';
import axios from 'axios'
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import { useNotification } from '../context/NotificationContext';

export default function Event() {

    const baseURL = import.meta.env.VITE_API_URL;

    const {id} = useParams();

    const { showNotification } = useNotification();

    const [event, setEvent] = useState([]);
    const [loading, setLoading] = useState(true);
        const [disabled, setDisabled] = useState(false);

    //Modal - Jegyvásárlás (kosárba helyezés)
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({
        quantity: 1,
        id: null,
        price: 0,
        title: ''
    });
    
    const handleShow = (data) => {
        setShowModal(true);
        setModalData(data);
    }

    const handleClose = (data) => {
        setShowModal(false);
        setModalData({
            quantity: 1,
            id: null,
            price: 0,
            title: ''
        });
    }

    useEffect(() => {
    axios.get(`${baseURL}/get-event-details/${id}`, { withCredentials: true })
        .then(res => {
        const list = {
            title: {
                icon: 'fa-calendar-days',
                value: res.data.event.status === 'cancelled' ? res.data.event.title + ' - Törölt esemény' : res.data.event.title
            },
            details: [
                { icon: 'fa-file-lines', value: res.data.event.description },
                { icon: 'fa-calendar', value: res.data.event.start_at },
                { icon: 'fa-location-dot', value: res.data.event.location },
                { icon: 'fa-ticket', value: res.data.event.available_tickets + ' db elérhető'},
                { icon: 'fa-money-bill', value: 'Jegyár: ' + res.data.event.price + 'Ft' },
                { icon: 'fa-user', value: 'Szervező: ' + res.data.event.organizer.name}
            ],
            buttons: [
                { icon: 'fa-arrow-left', title: 'Események', route: '/events'},
            ],
            actions: [
                { icon: 'fa-money-bill', title: 'Jegyvásárlás', handler: () => handleShow({price: res.data.event.price, quantity: 1, id: res.data.event.id, title: res.data.event.title}) },
            ]
        };

        setEvent(list);
        })
        .catch((error) => {
            setEvent([]);
            logClientError(error);
        })
        .finally(() => setLoading(false));
    }, [id]);

    const handleAddItemToCart = async () => {
        setDisabled(true);
        try {
            const response = await axios.post(baseURL + '/add-cart-item', 
            {id: modalData.id, quantity: modalData.quantity},
            { withCredentials: true, withXSRFToken: true });

            //Sikeres létrehozás
            if(response.data.success === true) {
                handleClose();
                showNotification(response.data.message)
            }else { 
                showNotification(response.data.message)
            }

        } catch (error) {
            if (error.response) {
                //Validációs error
                if(error.response.status == 422) {
                    showNotification(error.response.data.errors)
                }else {
                    logClientError(error);
                }
            } 
        }finally {
            setDisabled(false);
        }
    }


    return (
        <BaseLayout>
            {loading ? <Loader /> : <CardDetails item={event} />}

            <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1" onClick={handleClose}>
                    <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Jegyvásárlás</h5>
                                <button type="button" className="btn-close" onClick={handleClose}></button>
                            </div>
                            <div className="modal-body">
                                <p>Add meg a darabszámot.</p>
                                <input type="number" className="form-control mb-3" min="1" value={modalData.quantity}
                                    onChange={(e) =>
                                        setModalData({ ...modalData, quantity: parseInt(e.target.value) || 1 })
                                    } />
                                <p className="p-0 m-0">Esemény: {modalData.title}</p>
                                <p className="p-0 m-0">Jegyár: {modalData.price} Ft</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-dark" disabled={disabled} onClick={handleAddItemToCart}>Kosárba helyezés</button>
                            </div>
                        </div>
                    </div>
                </div>
                {showModal && <div className="modal-backdrop fade show"></div>}
        </BaseLayout>
    );
}


