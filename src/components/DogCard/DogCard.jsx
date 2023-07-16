import { Link } from 'react-router-dom'
import style from './DogCard.module.css'

const DogCard = (props) => {
  return (
    <div className={style.DogCardContainer} style={{ backgroundImage: `url(${props.image})` }}>
      <Link to={`/dog/${props.name}`} className={style.Link}>
        <div className={style.OverviewContainer}>
          <h2 id={style.title}>{props.name}</h2>
          <div>
            <h3>Temperament</h3>
            <p>{props.temperament}</p>
          </div>
          <label>Weight (Lb): <span>{props.weight}</span></label>
        </div>
      </Link>
    </div>
  )
}

export default DogCard
