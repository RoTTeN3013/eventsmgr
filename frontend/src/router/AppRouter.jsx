import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Events from '../pages/Events.jsx'
import Login from '../pages/Login.jsx'
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
        </Routes>
    );
}

export default AppRouter;
