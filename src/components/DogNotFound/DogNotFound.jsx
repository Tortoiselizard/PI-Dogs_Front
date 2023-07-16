import style from './DogNotFound.module.css'

function DogNotFound () {
  return (
    <div className={style.DogNotFoundContainer}>
      <h1>No dog with these characteristics was found</h1>
    </div>
  )
}

export default DogNotFound
