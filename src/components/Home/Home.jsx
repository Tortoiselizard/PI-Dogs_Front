import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { NavLink } from 'react-router-dom'

import Nav from '../Nav/Nav'
import DogsContainer from '../DogsContainer/DogsContainer'
import Filter from '../Filter/Filter'
import Order from '../Order/Order'
import Paginated from '../Paginated/Paginated'

import { updateShowDogs } from '../../redux/actions/index'

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

  const currentShowDogs = useRef(showDogs)

  useEffect(() => {
    currentShowDogs.current = showDogs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDogs])

  useEffect(() => {
    function compare (array1, array2) {
      if (array1.length !== array2.length) return true
      for (let index = 0; index < array1.length; index++) {
        if (array1[index].name !== array2[index].name) return true
      }
      return false
    }
    if (compare(showDogs.list, store.showDogs.list)) {
      setShowDogs({
        ...store.showDogs
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.showDogs])

  useEffect(() => {
    return () => {
      dispatch(updateShowDogs(currentShowDogs.current))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
