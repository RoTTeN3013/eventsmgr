
import LoginPanel from '../components/LoginPanel';
import {useUser} from '../context/UserContext';
import {Navigate} from 'react-router-dom';

export default function Login() {
    const { user, checked } = useUser();

    if (!checked) return <div>Loading...</div>;
    if (user) return <Navigate to="/events" replace />;

    return (
        <div className="d-flex login-container">
            <div className="login-poster">

            </div>
            <LoginPanel />
        </div>
    );
}
