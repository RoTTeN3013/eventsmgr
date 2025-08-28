
import TableList from '../components/TableList';
import Loader from '../components/Loader';
import BaseLayout from '../layouts/BaseLayout';
import { useEffect, useState } from 'react';
import axios from 'axios'
import { useNotification } from '../context/NotificationContext';

export default function Events() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [update, setUpdate] = useState(false);
    const { showNotification } = useNotification();

    const roleTitles = {
        user: 'Felhasználó',
        organizer: 'Szervező',
        admin: 'Adminisztrátor'
    }

    const handleBlockUser = (userID) => {
        setLoading(true);
        axios.post('http://localhost:8000/api/set-user-blocked-status', {user_id: userID}, { withCredentials: true, withXSRFToken: true })
            .then(res => {
                if(res.data.success) {
                    setUpdate(true);
                    const status = res.data.status ? 'letiltva' : 'feloldva';
                    showNotification(`A felhasználó sikeresen ${status}!`)
                }
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        axios.get('http://localhost:8000/api/get-all-users', { withCredentials: true })
            .then(res => {
                //Így a dinamikusan megadott értékekkel újrhasznosítható teljesen a komponens
                const collection = {
                    table_heads: [
                        { title: 'Felhasználónév' },
                        { title: 'Email cím' },
                        { title: 'Csoport' },
                        { title: 'Tiltva' },
                        { title: 'Regisztrálva' },
                        { title: 'Műveletek' },
                    ],
                    table_rows: [] 
                };
                res.data.users.forEach(user => {
                    collection.table_rows.push({
                        id: user.id,
                        tds: [
                            { value: user.name },
                            { value: user.email },
                            { value: roleTitles[user.role] },
                            { value: user.is_blocked ? 'Igen' : 'Nem'},
                            { value: user.created_at },
                        ],
                        actions: [
                            { title: user.is_blocked ? 'Feloldás' : 'Tiltás', icon: 'fa-ban', handler: () => handleBlockUser(user.id) }
                        ],
                    });
                });
                setUsers(collection);
            })
            .catch(() => setUsers([]))
            .finally(() =>  {
                setLoading(false); 
                setUpdate(false);
            }
        );
    }, [update]);

    return (
        <BaseLayout>
            {loading ? <Loader /> : <TableList collection={users} />}
        </BaseLayout>
    );
}


