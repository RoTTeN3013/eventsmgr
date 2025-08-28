import React from 'react'
import { Link } from "react-router-dom";
import { useUser } from '../context/UserContext';

const Nanvigation = () => {

  //Felhasználó adatok
  const { user } = useUser();

  //Menüpontok és jogosultságok

  const menus = [
    {
      'route' : '/events',
      'icon' : 'fa-calendar-days',
      'name' : 'Események listája',
      'permission' : ''
    },
    {
      'route' : '/own-events',
      'icon' : 'fa-calendar-plus',
      'name' : 'Saját események',
      'permission' : 'organizer'
    },
    {
      'route' : '/users',
      'icon' : 'fa-users',
      'name' : 'Felhasználók',
      'permission' : 'admin'
    },
    {
      'route' : '/manage-events',
      'icon' : 'fa-calendar-check',
      'name' : 'Események kezelése',
      'permission' : 'admin'
    }
  ];

  return (
    <div className="navbar px-4 d-flex justify-content-between align-items-center animate__animated animate__fadeInDown">
        <div className="d-flex">
          {menus.map((menu, index) => (
            (menu.permission === '' || menu.permission === user.role) && (
              <Link to={menu.route} key={index} className="nav-link"><i className={`fa-solid ${menu.icon} mx-3`}></i> {menu.name}</Link>
            )
          ))}
        </div>
        {user && (
          <div className="d-flex align-items-center">
            Helló {user.name}!
            <Link to="/log-user-out" className="nav-link"><i className="fa fa-sign-in mx-3"></i></Link>
          </div>
        )}
    </div>
  )
}

export default Nanvigation