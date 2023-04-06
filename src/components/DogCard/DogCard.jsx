//import './bandCard.css';
import React from 'react';
import {getDogDetail} from "./../../redux/actions"
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import style from "./DogCard.module.css"

const DogCard = (props) => {

    return <div className={style.DogCard}>
        <div>
            <Link to={`/dog/${props.name}`}><label className={style.name}>{props.name}</label></Link>
        </div>
        <img src={props.image} alt={props.name} className={style.imagen}></img>
        <div className={style.textoDogCard}>
            <p className={style.parrafos}><span className={style.encabezadoTexto}>Temperament:</span> <span>{props.temperament}</span></p>
            <p className={style.parrafos}><span className={style.encabezadoTexto}>Weight (Lb):</span> <span>{props.weight}</span></p>
        </div>
        
    </div>
};

export default DogCard;