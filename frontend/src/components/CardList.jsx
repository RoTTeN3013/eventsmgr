import React, { useState } from 'react';
import axios from 'axios';
import Notification from './Notification.jsx'
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';

const CardList = ({collection}) => {
  return (
    <div className="container-fluid d-flex justify-content-center">
      <div className="card-list-container gap-5 d-flex flex-column flex-lg-row justify-content-start p-5">
          {collection.map((item, index) => (
              <div key={index} className="list-card d-flex flex-column">
                  <div className="list-card-header d-flex flex-column justify-content-center align-items-center">
                    <i className="fa fa-calendar-days fa-4x mb-3"></i>
                    <h5>{item.title}</h5>
                  </div>
                  <div className="list-card-info d-lfex flex-column p-4">
                    <p className="card-info-text"><i className="fa fa-calendar"></i> {item.start_at}</p>
                    <p className="card-info-text">Leírás: {item.short_description}</p>
                    <p className="card-info-text"><i className="fa fa-ticket"></i> 22</p>
                    <p className="card-info-text"><i className="fa-solid fa-location-dot"></i> {item.location}</p>
                    <Link to={`/event/:${item.id}`} className="nav-link"><i className="fa-solid fa-arrow-right "></i> Részletek</Link>
                  </div>
              </div>
          ))}
      </div>  
    </div> 
  )
}

export default CardList