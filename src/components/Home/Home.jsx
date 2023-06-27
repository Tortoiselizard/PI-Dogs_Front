import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import DogsContainer from '../DogsContainer/DogsContainer'
import Filter from '../Filter/Filter'
import Order from '../Order/Order'
import Loading from '../Loading/Loading'
import Paginated from '../Paginated/Paginated'

import { keepDogs, getAllDogs2, updateShowDogs } from '../../redux/actions/index'

import style from './Home.module.css'

function Home ({ loading }) {
  const globalState = useSelector(state => state)
  const dispatch = useDispatch()

  const [showDogs, setShowDogs] = useState({
    start: 0,
    list: []
  })

  const [loadingPage, setLoadingPage] = useState(false)

  const firstUpdateTotaDogs = useRef(true)

  // Cargar información del estado global "globalState.dogs"
  useEffect(() => {
    if (firstUpdateTotaDogs.current && !globalState.totaDogs.length) {
      dispatch(getAllDogs2(null, setLoadingPage))
    }
    firstUpdateTotaDogs.current = false
  }, [dispatch, globalState.totaDogs])

  // Cargar información del estado global "globalState.dogs"
  useEffect(() => {
    dispatch(keepDogs(globalState.totaDogs))
  }, [globalState.totaDogs, dispatch])

  // Cargar información del estado global "globalState.showDogs"
  useEffect(() => {
    setShowDogs({
      list: globalState.dogs.slice(0, 9),
      start: 0
    })
  }, [globalState.dogs])

  useEffect(() => {
    return () => {
      dispatch(updateShowDogs(showDogs))
    }
  }, [dispatch, showDogs])

  return (
    <div className={style.Home}>

      {
  false &&
    <div className={style.Filter}>
      <Filter />
      <Order />
    </div>
}
      <div className={style.renderDogs}>

        <Paginated totalDogs={globalState.dogs} currentPage={showDogs} setShowDogs={setShowDogs} />
        <DogsContainer dogs={showDogs} />
        <Loading loading={loading} />
      </div>
      <Loading loading={loadingPage} />
    </div>
  )
}

export default Home
