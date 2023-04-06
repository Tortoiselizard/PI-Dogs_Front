// import './nav.css';
import React from 'react';
import SearchDog from '../SearchDog/SearchDog.jsx';
import { NavLink, useLocation} from 'react-router-dom';
import styles from "./Nav.module.css"

function Nav () {
    const location = useLocation()
    
    return <div className={styles.Nav}>
        {/* <p>Barra de navegación</p> */}
        <div className={styles.links}>    
            <NavLink to="/home"><button className={styles.buttonHome}></button></NavLink>
            <NavLink to="/dog/create"><button className={styles.buttonDog}></button></NavLink>
        </div>
        {location.pathname==="/home"?<SearchDog></SearchDog>:null} 
    </div>
};

export default Nav;