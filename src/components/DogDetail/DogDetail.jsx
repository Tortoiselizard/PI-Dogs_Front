import React from 'react';
import { useParams } from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux'
import {getDogDetail, cleanDetail} from "../../redux/actions/index"
import style from "./DogDetail.module.css"

function DogDetail() {

    const dogDetail = useSelector(state => state.dogDetail)

    const {raza_perro} = useParams()
    // const params = useParams()
    // console.log(raza_perro)
    const dispatch = useDispatch()

    React.useEffect(()=> {
        // console.log(id)
        // console.log(raza_perro)
        // const action = await getDogDetail(raza_perro)
        // console.log(action.payload)
        // if (typeof(action.payload) === "string") {return alert(action.payload)}
        // else {dispatch(action)}
        dispatch(getDogDetail(raza_perro))
        return function() {
            dispatch(cleanDetail())
        }
    },[raza_perro])

    return <div>
        {/* <h1>Estoy en el detalle del perro DogDetail</h1> */}
        {Object.keys(dogDetail).length?<div className={style.DogDetail}>
            <label>
                <img className={style.imagen} src={dogDetail[0].image} alt={dogDetail.name}></img>
            </label>
            <div>
                <h1 className={style.name}>{dogDetail[0].name}</h1>
                <label className={style.temperamentos}><span>Temperaments: </span><p>{dogDetail[0].temperament}</p></label>
                <label className={style.alto}><span>Height (In): </span><p>{dogDetail[0].height}</p></label>
                <label className={style.peso}><span>Weight (Lb): </span><p>{dogDetail[0].weight}</p></label>
                <label className={style.years}><span>years: </span><p>{dogDetail[0].life_span}</p></label>        
            </div>
        </div>:null}
    </div>
};

export default DogDetail;