import React from 'react'
import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'

const CardDetails = ({item}) => {
  return (
    <div className="container-fluid d-flex flex-column align-items-center gap-4 card-details-container">
        <div className="card-details-card header p-3 d-flex align-items-center gap-2">
            <i className={`fa ${item.title.icon} fa-2x`}></i>
            <h3 className="m-0 p-0">{item.title.value}</h3>
        </div>
        {Object.values(item.details).map((detail, index) => (
            <div key={index} className="card-details-card p-3 d-flex align-items-center justify-content-between">
                <i className={`fa ${detail.icon} fa-2x`}></i>
                <p className="m-0 p-0">{detail.value}</p>
            </div>
        ))}
        {Object.values(item.buttons).map((button, button_index) => (
            <Link to={button.route} key={button_index} className="btn btn-dark"><i className={`fa ${button.icon}`}></i> {button.title} </Link>
        ))}
    </div>
  )
}

export default CardDetails