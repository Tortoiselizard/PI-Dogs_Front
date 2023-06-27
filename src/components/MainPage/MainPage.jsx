import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { useDispatch } from 'react-redux'

import Loading from '../Loading/Loading'

import { getAllTemperaments, getAllDogs2 } from '../../redux/actions/index'
import styles from './MainPage.module.css'

function MainPage () {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    dispatch(getAllTemperaments())
    dispatch(getAllDogs2(null, setLoading))
  }, [dispatch])

  return (
    <>
      <div className={styles.MainPage}>
        <div>
          <h1>Find your new friend</h1>
          <Link to='/home'><button className={styles.buttonMainPage}>Search</button></Link>
        </div>

      </div>
      <Loading loading={loading} />
    </>
  )
}

export default MainPage
