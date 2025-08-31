import React, { useState } from 'react';
import axios from 'axios';
import Notification from './Notification.jsx'
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';
import { useNavigate } from 'react-router-dom';

const CardList = ({collection, pagination}) => {
  const navigate = useNavigate();

  const extractPageFromUrl = (url) => {
    try {
      return new URL(url).searchParams.get('page');
    } catch {
      return null;
    }
  };

  return (
    <div className="container-fluid d-flex align-items-center flex-column">
      <div className="card-list-container gap-5 d-flex flex-column flex-lg-row justify-content-start p-5">
          {Object.values(collection).map((item, index) => (
              <div key={index} className="list-card d-flex flex-column">
                  <div className="list-card-header d-flex flex-column justify-content-center align-items-center">
                    <i className={`fa-solid ${item.icon} fa-4x mb-3`}></i>
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
                      {item.buttons && Object.values(item.buttons).map((button, button_index) => (
                          <Link to={button.route} key={button_index} className="btn btn-dark"><i className={`fa-solid ${button.icon}`}></i> {button.title}</Link>
                      ))}
                      {item.cations }
                      {item.actions && Object.values(item.actions).map((action, action_index) => (
                          <button key={action_index} onClick={action.handler} className="btn btn-dark"><i className={`fa-solid ${action.icon}`}></i> {action.title}</button>
                      ))}
                    </div>
                  </div>
              </div>
          ))}
      </div>  
      <div className="d-flex align-items-center gap-3">
            
            {pagination?.prev_page_url && (
              <button
                className="btn btn-dark"
                onClick={() => {
                    const page = extractPageFromUrl(pagination.prev_page_url);
                    if (page) navigate(`/events?page=${page}`);
                  }}
                >
                <i className="fa fa-arrow-left"></i>
              </button>
            )}

            {pagination && (
              <span>
                Oldal {pagination.current_page} / {pagination.last_page}
              </span>
            )}

            {pagination?.next_page_url && (
              <button
                className="btn btn-dark"
                  onClick={() => {
                    const page = extractPageFromUrl(pagination.next_page_url);
                    if (page) navigate(`/events?page=${page}`);
                  }}
                >
                <i className="fa fa-arrow-right"></i>
              </button>
            )}
      </div>
    </div> 
  )
}

export default CardList