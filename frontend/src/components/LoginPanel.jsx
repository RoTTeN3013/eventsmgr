import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';
import { useNotification } from '../context/NotificationContext';
import logClientError from '../utils/logError';

const LoginPanel = () => {

  const baseURL = import.meta.env.VITE_API_URL;

  //State változók
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useUser();

  //Navigáció
  const navigate = useNavigate();

  //Üzenetek megjelenítése
  const { showNotification } = useNotification();

  //Bejelentkezés
  const handleLoginAttempt = async () => {
    setLoading(true);
    try {
      const response = await axios.post(baseURL + '/log-user-in', {
        email, 
        password,
    },{ withCredentials: true, withXSRFToken: true });

    //Sikeres bejelentkezés
    if(response.data.success === true) {
      navigate('/events');
      setUser(response.data.user)
    }else { 
      showNotification(response.data.message)
    }

    } catch (error) {
      if (error.response) {
        //Validációs error
        if(error.response.status == 422) {
          showNotification(error.response.data.message)
        }else {
          logClientError(error);
        }
        return;
      }
      logClientError(error);
    }finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-panel d-flex flex-column align-items-start justify-content-center p-5 animate__animated animate__fadeInRight">
        <h5 className="text-uppercase">Üdv újra itt!</h5>
        <p className="mb-5">Kérlek add meg az adait a bejelentkezéshez.</p>
        <div className="form-group w-100 d-flex flex-column align-items-center gap-2 mb-3">
          <input type="email" className="form-control" placeholder="Email cím" value={email || ''}
            onChange={(e) => {setEmail(e.target.value)}}
          />
        </div>
        <div className="form-group w-100 d-flex flex-column align-items-center gap-2 mb-4">
          <input type="password" className="form-control" placeholder="Jelszó" value={password || ''}
            onChange={(e) => {setPassword(e.target.value)}}
          />
        </div>
          <button className="btn btn-dark" onClick={handleLoginAttempt} disabled={loading}>Bejelentkezés</button>
      </div>
    </>
  )
}

export default LoginPanel