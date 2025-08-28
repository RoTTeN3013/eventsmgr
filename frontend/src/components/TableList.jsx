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
                    {Object.values(tr.actions).map((action, index) => (
                        <button key={index} onClick={action.handler} className="btn-dark btn">{action.title} <i className={`fa-solid ${action.icon}`}></i></button>
                    ))}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default TableList