import DogCard from '../DogCard/DogCard'
import DogNotFound from '../DogNotFound/DogNotFound'

import style from './DogsContainer.module.css'

function DogsContainer ({ dogs }) {
  return (
    <div className={style.DogsContainer}>
      {
                dogs && dogs.list.length
                  ? dogs.list.filter(dog => dog.image).map((dog, index) => <DogCard
                      name={dog.name}
                      image={dog.image}
                      temperament={dog.temperament}
                      weight={dog.weight}
                      id={dog.id}
                      key={dog.id}
                                                                           />)
                  : <DogNotFound />
            }
    </div>
  )
}

export default DogsContainer
