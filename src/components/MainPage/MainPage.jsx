import React from "react";
import { Link } from 'react-router-dom';
import {updateTemperaments, getAllTemperaments, getAllDogs, keepDogs, getAllDogs2} from "../../redux/actions/index"
import {useDispatch, useSelector} from "react-redux"
import styles from "./MainPage.module.css"

function MainPage() {

    const dispatch = useDispatch()
    const dogs_Temperaments = useSelector(state => ({
        dogs: state.totaDogs,
        temperaments: state.temperaments
    }))

    // React.useEffect(async () => {
    //     await dispatch(updateTemperaments())
    //     await dispatch(getAllTemperaments())
    //     const dogs = await getAllDogs()
    //     if (typeof(dogs.payload)==="string") {alert(dogs.payload)}
    //     else {
    //         await dispatch(dogs)
    //         await dispatch(keepDogs(dogs.payload))
    //     }
    // }, [dispatch])

    React.useEffect(() => {
        // dispatch(updateTemperaments())
        if (!dogs_Temperaments.dogs.length) dispatch(getAllDogs2())
        if (!dogs_Temperaments.temperaments.length) dispatch(getAllTemperaments())
    }, [])

    return <div className={styles.MainPage}>
        <h1>Henry Dogs</h1>        
        <Link to="/home"><button className={styles.buttonMainPage}>Burcar un Perro</button></Link>
    </div>
}

export default MainPage