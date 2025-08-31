
import CardDetails from '../components/CardDetails';
import BaseLayout from '../layouts/BaseLayout';
import { useEffect, useState } from 'react';
import axios from 'axios'
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';

export default function Event() {

    const {id} = useParams();

    const [event, setEvent] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    axios.get(`http://localhost:8000/api/get-event-details/${id}`, { withCredentials: true })
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
                { icon: 'fa-ticket', value: 33 },
                { icon: 'fa-money-bill', value: res.data.event.price }
            ],
            buttons: [
                { icon: 'fa-money-bill', title: 'Jegyvásárlás', route: '/buy-ticket/' + res.data.event.id },
            ]
        };

        setEvent(list);
        })
        .catch(() => setEvent([]))
        .finally(() => setLoading(false));
    }, [id]);

    return (
        <BaseLayout>
            {loading ? <Loader /> : <CardDetails item={event} />}
        </BaseLayout>
    );
}


