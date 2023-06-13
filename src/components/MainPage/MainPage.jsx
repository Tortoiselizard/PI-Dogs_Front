import React from "react";
import { Link } from 'react-router-dom';
import { getAllTemperaments, getAllDogs2} from "../../redux/actions/index"
import {useDispatch} from "react-redux"
import styles from "./MainPage.module.css"

function MainPage() {

    const dispatch = useDispatch()

    React.useEffect(() => {
        dispatch(getAllTemperaments())
        dispatch(getAllDogs2())
    }, [dispatch])

    return <div className={styles.MainPage}>
        <h1>Henry Dogs</h1>        
        <Link to="/home"><button className={styles.buttonMainPage}>Burcar un Perro</button></Link>
    </div>
}

export default MainPage