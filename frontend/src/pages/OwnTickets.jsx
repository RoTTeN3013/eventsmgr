
import CardList from '../components/CardList';
import BaseLayout from '../layouts/BaseLayout';
import { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import axios from 'axios'

export default function OwnTickets() {

    const baseURL = import.meta.env.VITE_API_URL;

    const [tickets, setTickets] = useState({});
    const [loading, setLoading] = useState(true);
    const collection = {};

    useEffect(() => {
        axios.get(baseURL + '/get-user-tickets', { withCredentials: true })
            .then(res => {
                res.data.tickets.forEach(ticket => {
                    collection[ticket.id] = {
                        id: ticket.id,
                        title: ticket.event.title,
                        icon: 'fa-ticket',
                        details: [
                            {value: 'Darabszám: ' + ticket.quantity, icon: 'fa-layer-group'},
                            {value: 'Kezdés: ' + ticket.event.start_at, icon: 'fa-clock'},
                            ...(ticket.event.status === 'cancelled' ? [{ value: 'Törölt esemény', icon: 'fa-ban' }] : [])
                        ], 
                        buttons: [
                            {title: 'Esemény részletei', icon: 'fa-arrow-right', route: '/event/' + ticket.event.id},
                        ],  
                    };
                });
                setTickets(collection);
            })
            .catch(() => setTickets({}))
            .finally(() => setLoading(false));
    }, []);

    return (
        <BaseLayout>
            {loading ? <Loader /> : <CardList collection={tickets} />}
        </BaseLayout>
    );
}


