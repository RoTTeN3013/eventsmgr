import React, { useState } from 'react';
import axios from 'axios';
import Notification from './Notification.jsx'
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';

const TableList = ({collection}) => {
  return (
    <div className="container-fluid table-container">
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
    </div>
  )
}

export default TableList