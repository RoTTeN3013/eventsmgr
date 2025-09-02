import React, { useState } from 'react';
import axios from 'axios';
import Notification from './Notification.jsx'
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';
import { useNavigate } from 'react-router-dom';

const TableList = ({collection, pagination}) => {

  const navigate = useNavigate();

  const extractPageFromUrl = (url) => {
    try {
      return new URL(url).searchParams.get('page');
    } catch {
      return null;
    }
  };

  return (
    <div className="container-fluid table-container d-flex flex-column align-items-center gap-3 animate__animated animate__fadeInUp">
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            {Object.values(collection.table_heads).map((th, index) => (
              <th key={index}>
                {th.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
            {Object.values(collection.table_rows).map((tr, index) => (
              <tr>
                {Object.values(tr.tds).map((td, index) => (
                    <td key={index}>
                        {td.value}
                    </td>
                ))}
                <td>
                    {tr.actions && tr.actions.length > 0 && ( //Amennyiben lett létrehozva
                        Object.values(tr.actions).map((action, index) => (
                            <button key={index} onClick={action.handler} className="btn-dark btn">{action.title ? action.title : ''} <i className={`fa-solid ${action.icon}`}></i></button>
                        ))
                    )}
                    {tr.buttons && tr.buttons.length > 0 && ( //Amennyiben lett létrehozva
                        Object.values(tr.buttons).map((button, index) => (
                            <Link to={button.route} key={index} className="btn-dark btn"><i className={`fa-solid ${button.icon}`}></i>{button.title ? button.title : ''}</Link>
                        ))
                    )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
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

export default TableList