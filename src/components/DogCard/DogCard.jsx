// import { useEffect, useRef } from 'react'
// import { Link } from 'react-router-dom'
import style from './DogCard.module.css'

const DogCard = (props) => {
  // return (
  //   <div className={style.DogCard}>
  //     <div>
  //       <Link to={`/dog/${props.name}`}><label className={style.name}>{props.name}</label></Link>
  //     </div>
  //     <img src={props.image} alt={props.name} className={style.imagen} />
  //     <div className={style.textoDogCard}>
  //       <p className={style.parrafos}><span className={style.encabezadoTexto}>Temperament:</span> <span>{props.temperament}</span></p>
  //       <p className={style.parrafos}><span className={style.encabezadoTexto}>Weight (Lb):</span> <span>{props.weight}</span></p>
  //     </div>
  //   </div>
  // )

  return (
    <div className={style.DogCardContainer} style={{ backgroundImage: `url(${props.image})` }}>
      <div className={style.OverviewContainer}>
        <h2>{props.name}</h2>
        <div>
          <h3>Temperament</h3>
          <p>{props.temperament}</p>
        </div>
        <label>Weight (Lb): {props.weight}</label>
      </div>
    </div>
  )
}

export default DogCard
