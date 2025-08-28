
import CardList from '../components/CardList';
import BaseLayout from '../layouts/BaseLayout';
import { useEffect, useState } from 'react';
import axios from 'axios'

export default function Events() {

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:8000/api/get-event-list', { withCredentials: true })
            .then(res => setEvents(res.data.events || []))
            .catch(() => setEvents([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <BaseLayout>
            {loading ? <div>Loading events...</div> : <CardList collection={events} />}
        </BaseLayout>
    );
}


