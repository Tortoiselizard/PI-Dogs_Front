import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { NavLink } from 'react-router-dom'

import Nav from '../Nav/Nav'
import DogsContainer from '../DogsContainer/DogsContainer'
import Filter from '../Filter/Filter'
import Order from '../Order/Order'
import Paginated from '../Paginated/Paginated'

import { keepDogs, updateShowDogs } from '../../redux/actions/index'

import style from './Home.module.css'

function Home ({ store }) {
  const dispatch = useDispatch()

  const [showDogs, setShowDogs] = useState(() => {
    if (store.showDogs.list && store.showDogs.list) {
      return {
        ...store.showDogs
      }
    } else {
      return {
        start: 0,
        list: []
      }
    }
  })

  // Cargar información del estado global "store.dogs"
  useEffect(() => {
    dispatch(keepDogs(store.totaDogs))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store && store.totaDogs, dispatch])

  // Cargar información del estado global "showDogs"
  useEffect(() => {
    if (!showDogs.list.length) {
      setShowDogs({
        list: (store && store.dogs.slice(0, 9)) || [],
        start: 0
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store && store.dogs])

  useEffect(() => {
    return () => {
      dispatch(updateShowDogs(showDogs))
    }
  }, [dispatch, showDogs])

  return (
    <div className={style.BackgroundHome}>
      <div className={style.dogBarCotainer}>
        <ul>
          <li id={style.dog1} />
        </ul>
      </div>
      <div className={style.Home}>
        {/* Header */}
        <Nav />
        <section className={style.Header}>
          <div className={style.containerNewDog}>
            <NavLink to='/dog/create'><button /></NavLink>
          </div>
          {/* Filtrado */}
          <Filter />
        </section>
        {/* Content */}
        <section className={style.renderDogs}>
          <Order />
          <DogsContainer dogs={showDogs} />
          <Paginated totalDogs={(store && store.dogs) || []} currentPage={showDogs} setShowDogs={setShowDogs} />
        </section>

      </div>
    </div>
  )
}

export default Home
