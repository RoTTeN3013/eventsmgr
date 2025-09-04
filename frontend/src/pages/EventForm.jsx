
import {useUser} from '../context/UserContext';
import Form from '../components/Form';
import Loader from '../components/Loader';
import BaseLayout from '../layouts/BaseLayout';
import { useNavigate, useParams } from "react-router-dom";
import {useState, useEffect} from 'react'
import axios from 'axios'
import { useNotification } from '../context/NotificationContext';
import logClientError from '../utils/logError';

export default function EventForm() {

    const baseURL = import.meta.env.VITE_API_URL;

    const { showNotification } = useNotification();
    const { id = 0 } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(id > 0 ? true : false);
    const [inputs, setInputs] = useState({
            title: '',
            start_at: null,
            short_description: '',
            description: '',
            capacity: '',
            limit_per_person: 5,
            location: '',
            price: 1,
            email_requested: false,
            status: 'published'
        });

    useEffect(() => {
        if (id) { 
            getEventDetails();
        }
    }, [id]);

    const getEventDetails = async () => {
        try {
            const response = await axios.get(
                baseURL + '/get-event-form-details', {
                    params: {id},           
                    withCredentials: true,
                    withXSRFToken: true
                }
            );

            if (response.data.success) {
                setInputs(
                    response.data.event
                );
            } else {
                showNotification(response.data.message);
            }
        } catch (error) {
            logClientError(error);
        }finally {
            setLoading(false);
        }
    };

    const handleUpdateInputs = (fieldName, value) => {
        setInputs(prev => ({
            ...prev,
            [fieldName]: value
        }));
    }

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await axios.post(baseURL + '/create-event', 
                inputs
            ,{ withCredentials: true, withXSRFToken: true });

            //Sikeres létrehozás
            if(response.data.success === true) {
                navigate('/events');
            }else { 
                showNotification(response.data.message);
                setLoading(false);
            }

            } catch (error) {
            if (error.response) {
                //Validációs error
                if(error.response.status == 422) {
                    showNotification(error.response.data.errors)
                }else {
                    logClientError(error);
                }
                return;
            } 
            logClientError(error);
        }finally {
            setLoading(false);
        }
    }

     const handleEditSubmit = async (eventID) => {
        setLoading(true);
        try {
            const response = await axios.post(baseURL + '/update-event/' + eventID, 
                inputs
            ,{ withCredentials: true, withXSRFToken: true });

            //Sikeres update
            if(response.data.success === true) {
                navigate('/events');
            }else { 
                showNotification(response.data.message);
            }

            } catch (error) {
            if (error.response) {
                //Validációs error
                if(error.response.status == 422) {
                    showNotification(error.response.data.errors)
                }else {
                    logClientError(error);
                }
                return;
            } 
            logClientError(error);
        }finally {
            setLoading(false);
        }
    }

    const header = {icon: id > 0 ? 'fa-calendar-day' : 'fa-calendar-plus', title: id > 0 ? 'Esemény Módosítása' : 'Esemény létrehozása'};

    const formInputs = [
        {label: 'Megnevezés', type: 'text', value: inputs.title, handler: (e) => handleUpdateInputs('title', e.target.value)},
        {label: 'Dátum / Időpont', type: 'datetime-local', value: inputs.start_at, handler: (e) => handleUpdateInputs('start_at', e.target.value)},
        {label: 'Rövid leírás', type: 'text', value: inputs.short_description, handler: (e) => handleUpdateInputs('short_description', e.target.value)},
        {label: 'Leírás', type: 'textarea', rows: 8, value: inputs.description, handler: (e) => handleUpdateInputs('description', e.target.value)},
        {label: 'Kapacitás', type: 'number', value: inputs.capacity, handler: (e) => handleUpdateInputs('capacity', e.target.value)},
        {label: 'Személyenkénti limit (jegyek száma)', type: 'number', value: inputs.limit_per_person, handler: (e) => handleUpdateInputs('limit_per_person', e.target.value)},
        {label: 'Helyszín', type: 'text', value: inputs.location, handler: (e) => handleUpdateInputs('location', e.target.value)},
        {label: 'Jegyár (Forint)', type: 'number', value: inputs.price, handler: (e) => handleUpdateInputs('price', e.target.value)},
        {label: 'Email küldése vásárlás esetén', type: 'select', value: inputs.email_requested, handler: (e) => handleUpdateInputs('email_requested', e.target.value),
            options: [
                {value: false, label: 'Nem'},
                {value: true, label: 'Igen'},
            ]
        },
        {label: 'Státusz', type: 'select', value: inputs.status, handler: (e) => handleUpdateInputs('status', e.target.value),
            options: [
                {value: 'published', label: 'Publikus'},
                {value: 'draft', label: 'Vázlat'},
                 ...(id > 0 ? [{ value: 'cancelled', label: 'Törölt esemény' }] : [])
            ]
        },
        {label: id > 0 ? 'Módosítás' : 'Létrehozás', type: 'submit', handler: id > 0 ? (e) => handleEditSubmit(id) : (e) => handleSubmit()},
    ];

    return (
        <BaseLayout>
            {loading 
                ? <Loader /> 
                : <Form inputs={formInputs} header={header} />
            }
        </BaseLayout>
    );
}
