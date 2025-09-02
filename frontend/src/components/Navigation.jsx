import React from 'react'
import { Link, Navigate } from "react-router-dom";
import { useUser } from '../context/UserContext';
import axios from 'axios';
import logClientError from '../utils/logError';

const Nanvigation = () => {

  const baseURL = import.meta.env.VITE_API_URL;

  //Felhasználó adatok
  const { user } = useUser();

  //Menüpontok és jogosultságok

  const menus = [
    {
      'route' : '/events',
      'icon' : 'fa-calendar-days',
      'name' : 'Események listája',
      'permission' : []
    },
    {
      'route' : '/own-tickets',
      'icon' : 'fa-ticket',
      'name' : 'Jegyeim',
      'permission' : []
    },
    {
      'route' : '/own-events',
      'icon' : 'fa-calendar',
      'name' : 'Saját események',
      'permission' : ['organizer', 'admin']
    },
    {
      'route' : '/users',
      'icon' : 'fa-users',
      'name' : 'Felhasználók',
      'permission' : ['admin']
    },
    {
      'route' : '/manage-events',
      'icon' : 'fa-calendar-check',
      'name' : 'Események kezelése',
      'permission' : ['admin']
    },
    {
      'route' : '/create-event',
      'icon' : 'fa-calendar-plus',
      'name' : 'Új esemény létrehozása',
      'permission' : ['admin', 'organizer']
    },
    {
      'route' : '/cart',
      'icon' : 'fa-shopping-cart',
      'name' : 'Kosár',
      'permission' : []
    }
  ];

  const { setUser } = useUser();

  //Bejelentkezés
  const handleLogOut = async () => {
    try {
      const response = await axios.post(
        baseURL + '/log-user-out',
        {},
        { withCredentials: true, withXSRFToken: true }
      );

      if(response.data.success === true) {
        setUser(null);
        <Navigate to="/" replace />
      } 
    } catch (error) {
      logClientError(error);
    }
  };

  return (
    <div className="navbar px-4 d-flex justify-content-between align-items-center">
        <div className="d-flex">
          {menus.map((menu, index) => (
            (menu.permission.length === 0 || menu.permission.includes(user.role)) && (
              <Link to={menu.route} key={index} className="nav-link"><i className={`fa-solid ${menu.icon} mx-3`}></i> {menu.name}</Link>
            )
          ))}
        </div>
        {user && (
          <div className="d-flex align-items-center">
            Helló {user.name}!
            <button className="nav-link"  onClick={handleLogOut}><i className="fa fa-sign-in mx-3"></i></button>
          </div>
        )}
    </div>
  )
}

export default Nanvigation