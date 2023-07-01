import { Link } from 'react-router-dom'
import style from './DogCard.module.css'

const DogCard = (props) => {
  return (
    <div className={style.DogCardContainer} style={{ backgroundImage: `url(${props.image})` }}>
      <div className={style.OverviewContainer}>
        <Link to={`/dog/${props.name}`} className={style.Link}><h2 id={style.title}>{props.name}</h2></Link>
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
