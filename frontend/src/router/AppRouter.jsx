import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Events from '../pages/Events.jsx'
import Login from '../pages/Login.jsx'
import Event from '../pages/Event.jsx'
import Users from '../pages/Users.jsx'
import Cart from '../pages/Cart.jsx'
import OwnTickets from '../pages/OwnTickets.jsx'
import EventForm from '../pages/EventForm.jsx'
import EventList from '../pages/EventList.jsx'
import ProtectedRoute from '../router/ProtectedRoute.jsx';

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/events" element={
                <ProtectedRoute>
                    <Events />
                </ProtectedRoute>
                }
            />
            <Route path="/event/:id" element={
                <ProtectedRoute>
                    <Event />
                </ProtectedRoute>
                }
            />
            <Route path="/users" element={
                <ProtectedRoute role={['admin']}>
                    <Users />
                </ProtectedRoute>
                }
            />
            <Route path="/manage-events" element={
                <ProtectedRoute role={['admin']}>
                    <EventList listType='admin' />
                </ProtectedRoute>
                }
            />
            <Route path="/own-events" element={
                <ProtectedRoute role={['admin', 'organizer']}>
                    <EventList listType='organizer' />
                </ProtectedRoute>
                }
            />
            <Route path="/own-tickets" element={
                <ProtectedRoute role={['admin', 'organizer']}>
                    <OwnTickets />
                </ProtectedRoute>
                }
            />
            <Route path="/create-event" element={
                <ProtectedRoute role={['admin', 'organizer']}>
                    <EventForm />
                </ProtectedRoute>
                }
            />
            <Route path="/edit-event/:id" element={
                <ProtectedRoute role={['admin', 'organizer']}>
                    <EventForm />
                </ProtectedRoute>
                }
            />
            <Route path="/cart" element={
                <ProtectedRoute >
                    <Cart />
                </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default AppRouter;
