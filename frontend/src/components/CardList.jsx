import React, { useState } from 'react';
import axios from 'axios';
import Notification from './Notification.jsx'
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';

const CardList = ({collection}) => {
  return (
    <div className="container-fluid d-flex justify-content-center">
      <div className="card-list-container gap-5 d-flex flex-column flex-lg-row justify-content-start p-5">
          {Object.values(collection).map((item, index) => (
              <div key={index} className="list-card d-flex flex-column">
                  <div className="list-card-header d-flex flex-column justify-content-center align-items-center">
                    <i className="fa fa-calendar-days fa-4x mb-3"></i>
                    <h5>{item.title}</h5>
                  </div>
                  <div className="p-3 d-flex flex-column justify-content-center gap-2">
                    {Object.values(item.details).map((item_detail, detail_index) => (
                        <div key={detail_index} className="d-flex align-items-center justify-content-between gap-1">
                          <i className={`fa-solid ${item_detail.icon}`}></i>
                          <p className="m-0 p-0">{item_detail.value}</p>
                        </div>
                    ))}
                    <div className="d-flex flex-column mt-3 gap-2">
                    {Object.values(item.buttons).map((button, button_index) => (
                        <Link to={button.route} key={button_index} className="btn btn-dark"><i className={`fa-solid ${button.icon}`}></i> {button.title}</Link>
                    ))}
                    </div>
                  </div>
              </div>
          ))}
      </div>  
    </div> 
  )
}

export default CardList