import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { NavLink } from 'react-router-dom'

import Nav from '../Nav/Nav'
import DogsContainer from '../DogsContainer/DogsContainer'
import Filter from '../Filter/Filter'
import Order from '../Order/Order'
import Paginated from '../Paginated/Paginated'

import { keepDogs, updateShowDogs } from '../../redux/actions/index'
// import { keepDogs } from '../../redux/actions/index'

import style from './Home.module.css'

function Home ({ store }) {
  const dispatch = useDispatch()

  const [showDogs, setShowDogs] = useState(() => {
    if (store.showDogs && store.showDogs.list) {
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

  const firstTime = useRef(true)

  // Cargar información del estado global "store.dogs"
  useEffect(() => {
    dispatch(keepDogs(store.totaDogs))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store && store.totaDogs])

  // Actualizando showDogs
  useEffect(() => {
    console.log(firstTime.current)
    if (!firstTime.current) {
      setShowDogs({
        list: (store && store.dogs.slice(0, 9)) || [],
        start: 0
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.filters, store.searBar, store.order])

  // Cargar información del estado global "showDogs"
  useEffect(() => {
    if (!showDogs.list.length) {
      setShowDogs({
        list: (store && store.dogs.slice(0, 9)) || [],
        start: 0
      })
    }
    if (store && store.dogs.length && firstTime.current) firstTime.current = false
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.dogs])

  useEffect(() => {
    dispatch(updateShowDogs(showDogs))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDogs])

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
