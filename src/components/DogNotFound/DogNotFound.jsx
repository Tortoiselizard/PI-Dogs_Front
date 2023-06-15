import style from './DogNotFound.module.css'

function DogNotFound () {
  return (
    <div className={style.DogNotFoundContainer}>
      <h1>No se encontró ningún perro con estas características</h1>
    </div>
  )
}

export default DogNotFound
