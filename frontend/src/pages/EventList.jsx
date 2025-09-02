
import TableList from '../components/TableList';
import Loader from '../components/Loader';
import Filter from '../components/Filter';
import BaseLayout from '../layouts/BaseLayout';
import { useEffect, useState } from 'react';
import axios from 'axios'
import { useNotification } from '../context/NotificationContext';
import {useSearchParams, useLocation } from 'react-router-dom' 
import logClientError from '../utils/logError';

export default function EventList({listType}) {

    const baseURL = import.meta.env.VITE_API_URL;

    //Pagination oldal id kinyerése az url-ből
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page') || 1;

    const location = useLocation();

    const [pagination, setPagination] = useState({
        current_page: 1,
        prev_page_url: null,
        next_page_url: null,
        last_page: 1,
    })

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [update, setUpdate] = useState(false);
    const [filters, setFilters] = useState([]);
    const { showNotification } = useNotification();

    const statusTitles = {
        draft: 'Vázlat',
        published: 'Publikus',
        cancelled: 'Törölt esemény'
    }

    const filterInputs = [
        {label: 'Esemény neve', type: 'text', handler: (e) => handleUpdateFilters('title', e.target.value)},
        
        //Csakis adminisztrátorok szűrhessenek szervezőkre
        ...(listType === 'admin' ?
                [{ label: 'Szervező', type: 'text', handler: (e) => handleUpdateFilters('organizer', e.target.value) }]
        : []),
        
        {label: 'Státusz', type: 'select', handler: (e) => handleUpdateFilters('status', e.target.value), options:[
            {value: 'draft', label: 'Vázlat'},
            {value: 'published', label: 'Publikus'},
            {value: 'cancelled', label: 'Törölt esemény'},
        ]},
        {label: 'Dátum (kezdés)', type: 'date', handler: (e) => handleUpdateFilters('start_date', e.target.value)},
        {label: 'Dátum (létrehozás', type: 'date', handler: (e) => handleUpdateFilters('date_of_create', e.target.value)},
    ]

    const filterButton = {label: 'Keresés', handler: () => setUpdate(true)};
    
    const handleUpdateFilters = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    }

    useEffect(() => {
        setLoading(true);
        axios.get(`${baseURL}/get-all-events/${listType}?page=${page}`, { withCredentials: true, params: filters })
            .then(res => {
                if(res.data.success) {
                    const collection = {
                    table_heads: [
                        { title: 'Megnevezés' },
                        { title: 'Státusz' },
                        ...(listType === 'admin' ?
                                [{ title: 'Szervező' }]
                        : []),
                        { title: 'Dátum' },
                        { title: 'Elérhető jegyek' },
                        { title: 'Létrehozva' },
                        { title: 'Utoljára szerkesztve' },
                        { title: 'Műveletek' },
                    ],
                    table_rows: [] 
                    };
                    res.data.events.data.forEach(event => {
                        collection.table_rows.push({
                            id: event.id,
                            tds: [
                                { value: event.title },
                                { value: statusTitles[event.status] },
                                ...(listType === 'admin' ?
                                        [{ value: event.organizer.name },]
                                : []), 
                                { value: event.start_at},
                                { value: event.available_tickets},
                                { value: event.created_at },
                                { value: event.updated_at },
                            ],
                            buttons: [
                                { icon: 'fa-pen', route: `/edit-event/${event.id}` },
                            ],
                        });
                    });
                    setEvents(collection);
                    setPagination({
                        current_page: res.data.events.current_page,
                        prev_page_url: res.data.events.prev_page_url,
                        next_page_url: res.data.events.next_page_url,
                        last_page: res.data.events.last_page,
                    })
                }else {
                    showNotification(res.data.message);
                }
            })
            .catch((error) => {
                setEvents([]);
                logClientError(error);
            })
            .finally(() =>  {
                setLoading(false); 
                setUpdate(false);
            }
        );
    }, [update, page, location.pathname ]);

    return (
        <BaseLayout>
            <Filter filters={filterInputs} filterButton={filterButton}/> 
            {loading ? <Loader /> :               
                <TableList collection={events} pagination={pagination}/>
            }
        </BaseLayout>
    );
}


