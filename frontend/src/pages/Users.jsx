
import TableList from '../components/TableList';
import Loader from '../components/Loader';
import Filter from '../components/Filter';
import BaseLayout from '../layouts/BaseLayout';
import { useEffect, useState } from 'react';
import axios from 'axios'
import { useNotification } from '../context/NotificationContext';
import {useSearchParams} from 'react-router-dom' 

export default function Users() {

    //Pagination oldal id kinyerése az url-ből
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page') || 1;

    const [pagination, setPagination] = useState({
        current_page: 1,
        prev_page_url: null,
        next_page_url: null,
        last_page: 1,
    })

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [update, setUpdate] = useState(false);
    const { showNotification } = useNotification();
    const [filters, setFilters] = useState([]);

    const roleTitles = {
        user: 'Felhasználó',
        organizer: 'Szervező',
        admin: 'Adminisztrátor'
    }

    const handleUpdateFilters = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    }

    const filterInputs = [
        {label: 'Felhasználónév', type: 'text', handler: (e) => handleUpdateFilters('username', e.target.value)},
        {label: 'Státusz', type: 'select', handler: (e) => handleUpdateFilters('status', e.target.value), options:[
            {value: true, label: 'Tiltiott'},
            {value: false, label: 'Nem tiltott'},
        ]},
    ]

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
        axios.get(`http://localhost:8000/api/get-all-users?page=${page}`, { withCredentials: true,  params: filters })
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
                res.data.users.data.forEach(user => {
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
                setPagination({
                    current_page: res.data.users.current_page,
                    prev_page_url: res.data.users.prev_page_url,
                    next_page_url: res.data.users.next_page_url,
                    last_page: res.data.users.last_page,
                })
            })
            .catch(() => setUsers([]))
            .finally(() =>  {
                setLoading(false); 
                setUpdate(false);
            }
        );
    }, [update, filters, page]);

    return (
        <BaseLayout>
            {loading ? <Loader /> : 
                <>
                    <Filter filters={filterInputs}/> 
                    <TableList collection={users} pagination={pagination}/>
                </>
            }
        </BaseLayout>
    );
}


