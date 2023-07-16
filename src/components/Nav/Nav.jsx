// import './nav.css';
import React, { useEffect } from 'react'
import SearchDog from '../SearchDog/SearchDog.jsx'
import { NavLink, useLocation } from 'react-router-dom'

import style from './Nav.module.css'
// import homeLogo from '../../img/'

function Nav ({ setLoad }) {
  const location = useLocation()
  useEffect(() => {
    if (location.pathname === '/home') {
      const div = document.getElementsByName('toHome')[0]
      div.classList.toggle(style.butonActiveHome)
    }
    if (location.pathname === '/dog/create') {
      const div = document.getElementsByName('toCreate')[0]
      div.classList.toggle(style.butonActiveCreate)
    }
  }, [location.pathname])

  return (
    <div className={style.Nav}>
      <div className={style.links}>
        <NavLink to='/home'>
          <div name='toHome' className={style.containerButton}>
            <button className={style.buttonHome}><img src='https://cdn-icons-png.flaticon.com/512/25/25694.png' alt='homeLogo' /></button>
          </div>
        </NavLink>
        <NavLink to='/dog/create'>
          <div name='toCreate' className={style.containerButton}>
            <button className={style.buttonDog}><img src='https://aux.iconspalace.com/uploads/dog-paw-icon-256.png' alt='CreateLogo' /></button>
          </div>
        </NavLink>
      </div>
      {
        location.pathname === '/home' ? <SearchDog setLoad={setLoad} /> : null
      }
    </div>
  )
};

export default Nav
