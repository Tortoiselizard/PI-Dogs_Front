import React from 'react';
import DogCard from "../DogCard/DogCard"
import { useSelector, useDispatch } from "react-redux"
import Filter from '../Filter/Filter';
import Order from "../Order/Order"
import {keepDogs, getAllDogs2, updateShowDogs} from "../../redux/actions/index"
import style from "./Home.module.css"

function Home() {

    const globalState = useSelector(state => state)
    const dispatch = useDispatch()
    
    const [showDogs, setShowDogs] = React.useState({
        start: 0,
        list: []
    })

    const currentShowDogs = React.useRef(showDogs)
    
    //Cuando se carga la página por 1ra vez desde /home se modifica la lista de perros
    React.useEffect(() => {
        if (!globalState.totaDogs.length) {
            dispatch(getAllDogs2())
        } else if (!globalState.dogs.length) {
            dispatch(keepDogs(globalState.totaDogs))
        } else if (globalState.dogs.length) {
            setShowDogs({
                list: globalState.dogs.slice(0,8),
                start: 0
            })
        }
    }, [globalState.totaDogs, globalState.dogs])

    React.useEffect(() => {
        return function() {
            dispatch(updateShowDogs(currentShowDogs.current))
        }
    }, [])

    function handlePaging(event) {
        switch (event.target.name) {
            case "siguiente":
                if (globalState.dogs.length > showDogs.start + 8) {
                    setShowDogs(showDogs => ({
                        list: globalState.dogs.slice(showDogs.start+8, showDogs.start + 16),
                        start: showDogs.start + 8,
                    }))
                    currentShowDogs.current={
                        list: globalState.dogs.slice(showDogs.start+8, showDogs.start + 16),
                        start: showDogs.start + 8,
                    }
                }
                break
            case "anterior":
                if (showDogs.start - 8 >= 0) {
                    setShowDogs(showDogs => ({
                        list: globalState.dogs.slice(showDogs.start-8, showDogs.start),
                        start: showDogs.start - 8
                    }))
                    currentShowDogs.current={
                        list: globalState.dogs.slice(showDogs.start-8, showDogs.start),
                        start: showDogs.start - 8
                    }
                }
                break
        }
    }

    return <div className={style.Home}>

        <div className={style.Filter}>
            <Filter></Filter>
            <Order></Order>

        </div>
        <div className={style.DogCards}>
            {
                globalState.dogs.length > 8 ? <div className={style.ContenedorBotones}>
                    <button className={style.botonesIzquierda} name='anterior' onClick={handlePaging}></button>
                    <button className={style.botonesDerecha} name='siguiente' onClick={handlePaging}></button>
                </div> : null
            }
            {
                showDogs.list.length ? showDogs.list.map((dog, index) => <DogCard
                    name={dog.name}
                    image={dog.image}
                    temperament={dog.temperament}
                    weight={dog.weight}
                    id={dog.id}
                    key={dog.id}
                />) : null
            }
            {
                globalState.dogs.length > 8 ? <div className={style.ContenedorBotones}>
                    <button className={style.botonesIzquierda} name='anterior' onClick={handlePaging}></button>
                    <button className={style.botonesDerecha} name='siguiente' onClick={handlePaging}></button>
                </div> : null
            }
        </div>

    </div>
}

export default Home