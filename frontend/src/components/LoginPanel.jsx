import React, { useState } from 'react';
import axios from 'axios';
import Notification from './Notification.jsx'
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';

const LoginPanel = () => {

  //State változók
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //Notification state
  const [notifStatus, setNotifStatus] = useState('');
  const [notifMsg, setNotifMSG] = useState('');
  const { user, setUser } = useUser();

  //Navigáció
  const navigate = useNavigate();

  //Üzenetek megjelenítése
  const showNotification = (message) => {
    setNotifStatus('show');
    setNotifMSG(message);

    setTimeout(() => {
      setNotifStatus('');
      setNotifMSG('');
    }, 5000);
  }

  //Bejelentkezés
  const handleLoginAttempt = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/log-user-in', {
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
        }
      } else if (error.request) { //Response error
        console.log("No response received:", error.request);
      } else { //Request error
        console.log("Axios error:", error.message);
      }
    }
  };

  return (
    <>
      <div className="login-panel d-flex flex-column align-items-start justify-content-center p-5">
        <h5 className="text-uppercase">Üdv újra itt!</h5>
        <p className="mb-5">Kérlek add meg az adait a bejelentkezéshez.</p>
        <div className="form-group w-100 d-flex flex-column align-items-center gap-2 mb-3">
          <input type="email" className="form-control" placeholder="Email cím" value={email || ''}
            onChange={(e) => {setEmail(e.target.value)}}
          />
        </div>
        <div className="form-group w-100 d-flex flex-column align-items-center gap-2 mb-4">
          <input type="text" className="form-control" placeholder="Jelszó" value={password || ''}
            onChange={(e) => {setPassword(e.target.value)}}
          />
        </div>
          <button className="btn btn-dark" onClick={handleLoginAttempt}>Bejelentkezés</button>
      </div>
      <Notification status={notifStatus} message={notifMsg} />
    </>
  )
}

export default LoginPanel