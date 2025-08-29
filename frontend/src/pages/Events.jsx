
import CardList from '../components/CardList';
import BaseLayout from '../layouts/BaseLayout';
import { useEffect, useState } from 'react';
import axios from 'axios'
import Loader from '../components/Loader';

export default function Events() {

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const collection = {};

    useEffect(() => {
        axios.get('http://localhost:8000/api/get-event-list', { withCredentials: true })
            .then(res => {
                //Így a dinamikusan megadott értékekkel újrhasznosítható teljesen a komponens
                res.data.events.forEach(event => {
                    collection[event.id] = {
                        id: event.id,
                        title: event.title,
                        icon: 'fa-facalendar-days',
                        details: [
                            { value: event.short_description, icon: 'fa-file-lines'},
                            {value: event.start_at, icon: 'fa-calendar'},
                            {value: 22 + ' db', icon: 'fa-ticket'},
                            {value: event.price  + ' Ft', icon: 'fa-money-bill'},
                            {value: event.limit_per_person + ' db', icon: 'fa-user'},
                        ],
                        buttons: [
                            {title: 'Részletek', icon: 'fa-arrow-right', route: '/event/' + event.id},
                            {title: 'Jegyvásárlás', icon: 'fa-money-bill', route: '/buy-ticket/' + event.id},
                        ],  
                    };
                });
                setEvents(collection);
            })
            .catch(() => setEvents([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <BaseLayout>
            {loading ? <Loader /> : <CardList collection={events} />}
        </BaseLayout>
    );
}


