
import LoginPanel from '../components/LoginPanel';
import Loader from '../components/Loader';
import {useUser} from '../context/UserContext';
import {Navigate} from 'react-router-dom';

export default function Login() {
    const { user, checked } = useUser();

    if (!checked) return <Loader />;
    if (user) return <Navigate to="/events" replace />;

    return (
        <div className="d-flex login-container">
            <div className="login-poster d-flex justify-content-center align-items-center animate__animated animate__fadeIn">
                <i className="fa fa-calendar-days fa-10x animate__animated animate__fadeInRight"></i>
                <h1 className="logo-text animate__animated animate__fadeInLeft">EventsBook</h1>
            </div>
            <LoginPanel />
        </div>
    );
}
