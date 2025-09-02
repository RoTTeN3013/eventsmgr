import React from 'react'

//status show vagy '' mindenképp megkapja class-ként

const Notification = ({status, message}) => {
  return (
    <div className={`${status} d-flex justify-content-center align-items-center notification_container animate__animated animate__fadeInRight`}>
        <p className="text-white fs-6 p-0 m-0"> <i className="fa fa-circle-info"></i> {message}</p>
    </div>
  )
}

export default Notification