// import './home.css';
import React, { Component } from 'react';
import DogCard from "../DogCard/DogCard"
import {useSelector, useDispatch} from "react-redux"
import SearchDog from '../SearchDog/SearchDog';
import Filter from '../Filter/Filter';
import Order from "../Order/Order"
import * as actions from "../../redux/actions/index"
import style from "./Home.module.css"

function Home() {

    const [showDogs, setShowDogs] = React.useState({
        start:0,
        list:[]
    })
    const dogsGlobalState = useSelector((state) => state.dogs)
    const dispatch = useDispatch()

    // React.useEffect(async ()=> {
    //     const action = await actions.getAllDogs()
    //     if (typeof(action) === "string") {return alert(action)}
    //     dispatch(action)
    // }, [dispatch])

    React.useEffect(()=> {
        setShowDogs((showDogs) => ({
            ...showDogs,
            list:dogsGlobalState.slice(showDogs.start, showDogs.start+8)
        }))
    },[dogsGlobalState, showDogs.start])

    React.useEffect(()=> {
        setShowDogs((showDogs) => ({
            ...showDogs,
            start:0
        }))
    },[dogsGlobalState])

    function changeDogs(event) {
        switch (event.target.name) {
            case "siguiente":
                if (dogsGlobalState.length>showDogs.start+8) {
                    setShowDogs(showDogs => ({
                        ...showDogs,
                        start: showDogs.start + 8,
                    
                    }))
                }
                
                break
            case "anterior":
                if (showDogs.start - 8 >= 0) {
                    setShowDogs(showDogs => ({
                        ...showDogs,
                        start: showDogs.start - 8,
                        
                    }))
                }
                break
        }
        setShowDogs(showDogs => ({
            ...showDogs,
            list: dogsGlobalState.slice(showDogs.start, showDogs.start+9)
        }))
    }

    return <div className={style.Home}>

        {/* <div className={style.Titulo}> 
            <h1>Elige a tu perro</h1>
        </div> */}

        <div className={style.Filter}>
            <Filter></Filter>
            <Order></Order>
                    
        </div>
        <div className={style.DogCards}>
            {
                dogsGlobalState.length>8? <div className={style.ContenedorBotones}>
                <button className={style.botonesIzquierda} name='anterior' onClick={changeDogs}></button>
                <button className={style.botonesDerecha} name='siguiente' onClick={changeDogs}></button>
                </div>:null
            }
            {
                showDogs.list.length? showDogs.list.map((dog, index) => <DogCard 
                    name={dog.name}
                    image={dog.image}
                    temperament={dog.temperament}
                    weight={dog.weight}
                    id={dog.id}
                    key={dog.id}
                />): null
            }
            {
                dogsGlobalState.length>8? <div className={style.ContenedorBotones}>
                <button className={style.botonesIzquierda} name='anterior' onClick={changeDogs}></button>
                <button className={style.botonesDerecha} name='siguiente' onClick={changeDogs}></button>
                </div>:null
            }
        </div>
       
        
    </div>
}

export default Home