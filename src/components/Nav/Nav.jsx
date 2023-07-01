// import './nav.css';
import React from 'react'
import SearchDog from '../SearchDog/SearchDog.jsx'
import { NavLink, useLocation } from 'react-router-dom'
import styles from './Nav.module.css'

function Nav ({ setLoad }) {
  const location = useLocation()

  return (
    <div className={styles.Nav}>
      <div className={styles.links}>
        <NavLink to='/home'><button className={styles.buttonHome} /></NavLink>
        <NavLink to='/dog/create'><button className={styles.buttonDog} /></NavLink>
      </div>
      {
        location.pathname === '/home' ? <SearchDog setLoad={setLoad} /> : null
      }
    </div>
  )
};

export default Nav
