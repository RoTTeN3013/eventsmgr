import React from 'react'
import { Link } from '@inertiajs/react';

const Nanvigation = ({user}) => {
  return (
    <div className="navbar px-4 d-flex justify-content-between align-items-center  wow animate__animated animate__fadeIn">
        {user ? (
        <div className="d-flex gap-3 justify-content-center align-items-center">
          <Link href="/" className="nav-link">Kezdőoldal</Link>
          <Link href="/pizzas" className="nav-link">Pizzák</Link>
          <Link href="/contact" className="nav-link">Kapcsolat</Link>
        </div>
        ) : (
          <div className="d-flex justify-content-center align-items-center">
            <Link href="/cart" className="nav-link"><i className="fa fa-shopping-cart"></i> Kosár</Link>
          </div>
        )}
    </div>
  )
}

export default Nanvigation