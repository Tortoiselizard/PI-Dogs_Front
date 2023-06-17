import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import DogsContainer from '../DogsContainer/DogsContainer'
import Filter from '../Filter/Filter'
import Order from '../Order/Order'
import Loading from '../Loading/Loading'

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

  const currentShowDogs = useRef(showDogs)

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
      list: globalState.dogs.slice(0, 8),
      start: 0
    })
  }, [globalState.dogs])

  useEffect(() => {
    return function () {
      dispatch(updateShowDogs(currentShowDogs.current))
    }
  }, [dispatch])

  function handlePaging (event) {
    switch (event.target.name) {
      case 'siguiente':
        if (globalState.dogs.length > showDogs.start + 8) {
          setShowDogs(showDogs => ({
            list: globalState.dogs.slice(showDogs.start + 8, showDogs.start + 16),
            start: showDogs.start + 8
          }))
          currentShowDogs.current = {
            list: globalState.dogs.slice(showDogs.start + 8, showDogs.start + 16),
            start: showDogs.start + 8
          }
        }
        break
      case 'anterior':
        if (showDogs.start - 8 >= 0) {
          setShowDogs(showDogs => ({
            list: globalState.dogs.slice(showDogs.start - 8, showDogs.start),
            start: showDogs.start - 8
          }))
          currentShowDogs.current = {
            list: globalState.dogs.slice(showDogs.start - 8, showDogs.start),
            start: showDogs.start - 8
          }
        }
        break
      default:
        return null
    }
  }

  return (
    <div className={style.Home}>

      <div className={style.Filter}>
        <Filter />
        <Order />

      </div>
      <div className={style.renderDogs}>
        {
                globalState.dogs.length > 8
                  ? (
                    <div className={style.ContenedorBotones}>
                      <button className={style.botonesIzquierda} name='anterior' onClick={handlePaging} />
                      <button className={style.botonesDerecha} name='siguiente' onClick={handlePaging} />
                    </div>)
                  : null
            }
        <DogsContainer dogs={showDogs} />
        {
                globalState.dogs.length > 8
                  ? (
                    <div className={style.ContenedorBotones}>
                      <button className={style.botonesIzquierda} name='anterior' onClick={handlePaging} />
                      <button className={style.botonesDerecha} name='siguiente' onClick={handlePaging} />
                    </div>)
                  : null
            }
        <Loading loading={loading} />
      </div>
      <Loading loading={loadingPage} />
    </div>
  )
}

export default Home
