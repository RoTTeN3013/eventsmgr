
import TableList from '../components/TableList';
import Loader from '../components/Loader';
import Filter from '../components/Filter';
import BaseLayout from '../layouts/BaseLayout';
import { useEffect, useState } from 'react';
import axios from 'axios'
import { useNotification } from '../context/NotificationContext';

export default function EventList({listType}) {

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState([]);
    const { showNotification } = useNotification();

    const statusTitles = {
        draft: 'Vázlat',
        published: 'Publikált',
        cancelled: 'Törölt esemény'
    }

    const handleUpdateFilters = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    }

    useEffect(() => {
        axios.get('http://localhost:8000/api/get-all-events', { withCredentials: true, params: filters })
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
                        { title: 'Létrehozva' },
                        { title: 'Utoljára szerkesztve' },
                        { title: 'Műveletek' },
                    ],
                    table_rows: [] 
                    };
                    res.data.events.forEach(event => {
                        collection.table_rows.push({
                            id: event.id,
                            tds: [
                                { value: event.title },
                                { value: statusTitles[event.status] },
                                ...(listType === 'admin' ?
                                        [{ value: event.organizer.name },]
                                : []), 
                                { value: event.start_at},
                                { value: event.created_at },
                                { value: event.updated_at },
                            ],
                            buttons: [
                                { icon: 'fa-pen', route: `/edit-event/${event.id}` },
                            ],
                        });
                    });
                    setEvents(collection);
                }else {
                    showNotification(res.data.message);
                }
            })
            .catch(() => setEvents([]))
            .finally(() =>  {
                setLoading(false); 
            }
        );
    }, [filters]);

    return (
        <BaseLayout>
            {loading ? <Loader /> : 
                <>
                    <Filter filters={filterInputs}/> 
                    <TableList collection={events} />
                </>
            }
        </BaseLayout>
    );
}


