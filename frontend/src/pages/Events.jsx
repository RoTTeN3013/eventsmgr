
import CardList from '../components/CardList';
import BaseLayout from '../layouts/BaseLayout';
import { useEffect, useState } from 'react';
import axios from 'axios'
import Loader from '../components/Loader';
import { useNotification } from '../context/NotificationContext';
import {useSearchParams} from 'react-router-dom' 
import Filter from '../components/Filter';
import logClientError from '../utils/logError';

export default function Events() {

    const baseURL = import.meta.env.VITE_API_URL;

    //Pagination oldal id kinyerése az url-ből
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page') || 1;

    const [pagination, setPagination] = useState({
        current_page: 1,
        prev_page_url: null,
        next_page_url: null,
        last_page: 1,
    })

    const [events, setEvents] = useState({});
    const [loading, setLoading] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const collection = {};
    const { showNotification } = useNotification();
    const [filters, setFilters] = useState([]);
    const [update, setUpdate] = useState(false);

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

    const handleUpdateFilters = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    }

    const filterInputs = [
        {label: 'Esemény neve', type: 'text', handler: (e) => handleUpdateFilters('title', e.target.value)},
        {label: 'Szervező', type: 'text', handler: (e) => handleUpdateFilters('organizer', e.target.value)},
        {label: 'Helyszín', type: 'text', handler: (e) => handleUpdateFilters('location', e.target.value)},
        {label: 'Dátum', type: 'date', handler: (e) => handleUpdateFilters('start_date', e.target.value)},
        {label: 'Minimum jegyár', type: 'number', handler: (e) => handleUpdateFilters('minimum_price', e.target.value)},
        {label: 'Maximum jegyár', type: 'number', handler: (e) => handleUpdateFilters('maximum_price', e.target.value)},
    ]

    const filterButton = {label: 'Keresés', handler: () => setUpdate(true)};


    useEffect(() => {
        setLoading(true);
        axios.get(`${baseURL}/get-event-list?page=${page}`, { withCredentials: true, params: filters})
            .then(res => {
                //Így a dinamikusan megadott értékekkel újrhasznosítható teljesen a komponens
                res.data.events.data.forEach(event => {
                    collection[event.id] = {
                        id: event.id,
                        title: event.title,
                        icon: 'fa-calendar-days',
                        details: [
                            {value: event.short_description, icon: 'fa-file-lines'},
                            {value: event.start_at, icon: 'fa-calendar'},
                            {value: event.available_tickets +  ' db elérhető', icon: 'fa-ticket'},
                            {value: event.price  + ' Ft', icon: 'fa-money-bill'},
                            {value: event.limit_per_person + ' db / felhasználó', icon: 'fa-ticket'},
                            {value: 'Szervező ' + event.organizer.name, icon: 'fa-user'},
                        ],
                        buttons: [
                            {title: 'Részletek', icon: 'fa-arrow-right', route: '/event/' + event.id},
                        ],  
                        actions: [
                            {title: 'Jegyvásárlás', icon: 'fa-money-bill', handler: () => handleShow({price: event.price, quantity: 1, id: event.id, title: event.title})}
                        ],   
                    };
                });
                setEvents(collection);
                setPagination({
                    current_page: res.data.events.current_page,
                    prev_page_url: res.data.events.prev_page_url,
                    next_page_url: res.data.events.next_page_url,
                    last_page: res.data.events.last_page,
                })
            })
            .catch((error) => {
                setEvents([]);
                logClientError(error);
            })
            .finally(() => setLoading(false), setUpdate(false));
    }, [page, update]);

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
            
                <Filter filters={filterInputs} filterButton={filterButton}/> 
                {loading ? <Loader /> : <CardList collection={events} pagination={pagination} />}
 
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


