import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Events from '../pages/Events.jsx'
import Login from '../pages/Login.jsx'
import Event from '../pages/Event.jsx'
import Users from '../pages/Users.jsx'
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
                <ProtectedRoute>
                    <Users />
                </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default AppRouter;
