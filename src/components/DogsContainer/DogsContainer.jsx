import { useState, useEffect, useRef } from 'react'

import DogCard from '../DogCard/DogCard'
import DogNotFound from '../DogNotFound/DogNotFound'

import style from './DogsContainer.module.css'

function DogsContainer ({ dogs }) {
  const [showNotFound, setShowNotFound] = useState(false)

  const firstTime = useRef(true)

  useEffect(() => {
    if (firstTime && dogs.list.length) {
      handleNotFound()
    }
  }, [dogs.list])

  function handleNotFound () {
    setShowNotFound(true)
    firstTime.current = false
  }

  return (
    <div className={style.DogsContainer}>
      {
                dogs && dogs.list.length
                  ? dogs.list.filter(dog => dog.image).map(dog => (
                    <DogCard
                      name={dog.name}
                      image={dog.image}
                      temperament={dog.temperament}
                      weight={dog.weight}
                      id={dog.id}
                      key={dog.id}
                    />)
                  )
                  : showNotFound ? <DogNotFound /> : null
            }
    </div>
  )
}

export default DogsContainer
