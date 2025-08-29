
import {useUser} from '../context/UserContext';
import Form from '../components/Form';
import BaseLayout from '../layouts/BaseLayout';
import {Navigate} from 'react-router-dom';
import {useState} from 'react'
import axios from 'axios'

export default function EventForm({values}) {

    const [inputs, setInputs] = useState({
        title: values.title ? values.title : '',
        start_at: values.start_at ? values.start_at : null,
        short_description: values.short_description ? values.short_description : '',
        description: values.description ? values.description : '',
        capacity: values.capacity ? values.capacity : '',
        limit_per_person: values.limit_per_person ? values.limit_per_person : 5,
        location: values.location ? values.location : '',
        price: values.price ? values.price : 1
    });

    const handleUpdateInputs = (fieldName, value) => {
        setInputs(prev => ({
            ...prev,
            [fieldName]: value
        }));
    }

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/create-event', {
                inputs
            },{ withCredentials: true, withXSRFToken: true });

            //Sikeres létrehozás
            if(response.data.success === true) {
                <Navigate to="/events" />
            }else { 
                showNotification(response.data.message)
            }

            } catch (error) {
            if (error.response) {
                //Validációs error
                if(error.response.status == 422) {
                    showNotification(error.response.data.message)
                }
            } else if (error.request) { //Response error
                console.log("No response received:", error.request);
            } else { //Request error
                console.log("Axios error:", error.message);
            }
        }
    }

    const header = {icon: 'fa-calendar-plus', title: 'Esemény létrehozása'};

    const formInputs = [
        {label: 'Megnevezés', type: 'text', value: inputs.title, handler: (e) => handleUpdateInputs('title', e.target.value)},
        {label: 'Dátum / Időpont', type: 'datetime', value: inputs.start_at, handler: (e) => handleUpdateInputs('start_at', e.target.value)},
        {label: 'Rövid leírás', type: 'text', value: inputs.short_description, handler: (e) => handleUpdateInputs('short_description', e.target.value)},
        {label: 'Leírás', type: 'textarea', rows: 8, value: inputs.description, handler: (e) => handleUpdateInputs('description', e.target.value)},
        {label: 'Kapacitás', type: 'number', value: inputs.capacity, handler: (e) => handleUpdateInputs('capacity', e.target.value)},
        {label: 'Személyenkénti limit (jegyek száma)', type: 'number', value: inputs.limit_per_person, handler: (e) => handleUpdateInputs('limit_per_person', e.target.value)},
        {label: 'Helyszín', type: 'text', value: inputs.location, handler: (e) => handleUpdateInputs('location', e.target.value)},
        {label: 'Jegyár (Forint)', type: 'number', value: inputs.price, handler: (e) => handleUpdateInputs('price', e.target.value)},
        {label: 'Létrehozás', type: 'submit', handler: (e) => handleSubmit()},
    ];

    return (
        <BaseLayout>
            <Form inputs={formInputs} header={header} />
        </BaseLayout>
    );
}
