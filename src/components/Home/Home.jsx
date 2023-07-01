import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Nav from '../Nav/Nav'
import DogsContainer from '../DogsContainer/DogsContainer'
import Filter from '../Filter/Filter'
import Order from '../Order/Order'
import Paginated from '../Paginated/Paginated'

import { keepDogs, updateShowDogs } from '../../redux/actions/index'

import style from './Home.module.css'

function Home () {
  const { totaDogs, dogs } = useSelector(state => state)
  const dispatch = useDispatch()

  const [showDogs, setShowDogs] = useState({
    start: 0,
    list: []
  })

  // Cargar información del estado global "dogs"
  useEffect(() => {
    dispatch(keepDogs(totaDogs))
  }, [totaDogs, dispatch])

  // Cargar información del estado global "showDogs"
  useEffect(() => {
    setShowDogs({
      list: dogs.slice(0, 9),
      start: 0
    })
  }, [dogs])

  useEffect(() => {
    return () => {
      dispatch(updateShowDogs(showDogs))
    }
  }, [dispatch, showDogs])

  return (
    <div className={style.Home}>

      <Nav />

      <div className={style.CardHandlerContainer}>
        <div>
          <Filter />
          <Order />
        </div>
        <div className={style.DeployContainer}>
          <label>{'>'}</label>
        </div>
      </div>

      <div className={style.renderDogs}>
        <Paginated totalDogs={dogs} currentPage={showDogs} setShowDogs={setShowDogs} />
        <DogsContainer dogs={showDogs} />
      </div>
    </div>
  )
}

export default Home
