import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import MainPage from '../MainPage/MainPage'
import Home from '../Home/Home'
import DogDetail from '../DogDetail/DogDetail'
import CreateDog from '../CreateDog/CreateDog'

import styles from './SlideComponents.module.css'

const moveRoutes = {
  '/': <MainPage />,
  '/home': <Home />,
  '/dog/create': <CreateDog />,
  '/dog/:razaPerro': <DogDetail />
}

function SlideComponents ({ routes }) {
  const { pathname } = useLocation()
  const n = 8

  const [currentSlide, setCurrentSlide] = useState(() => {
    if (routes && routes.come) return routes.come
    return pathname
  })

  useEffect(() => {
    if (n === 5) {
      console.log(currentSlide)
      handleSlide()
    }
  })

  function handleSlide () {
    setCurrentSlide(true)
  }

  return (
    <div className={styles.slideContainer}>
      <div className={styles.firstSlide}>
        {
        moveRoutes[routes.come]
    }
      </div>
      <div className={styles.firstSlide}>
        {
            moveRoutes[routes.go]
        }
      </div>
    </div>
  )
}

export default SlideComponents
