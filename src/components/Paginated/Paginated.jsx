import { useState, useEffect } from 'react'

import style from './Paginated.module.css'

function Paginated ({ totalDogs, currentPage, setShowDogs }) {
  const [paginatedShow, setPaginatedShow] = useState({
    start: 0,
    list: []
  })

  useEffect(() => {
    function countPaginate () {
      const n = Math.ceil(totalDogs.length / 9)
      return Array(n).fill(null).map((e, i) => i)
    }
    setPaginatedShow({
      start: 0,
      list: countPaginate().slice(0, 10)
    })
  }, [totalDogs])

  function countPaginate () {
    const n = Math.ceil(totalDogs.length / 9)
    return Array(n).fill(null).map((e, i) => i)
  }

  function handlePaging (event) {
    switch (event.target.name) {
      case 'siguiente':
        if (totalDogs.length > currentPage.start + 9) {
          setShowDogs(currentPage => ({
            list: totalDogs.slice(currentPage.start + 9, currentPage.start + 18),
            start: currentPage.start + 9
          }))
          findPaginated(currentPage.start + 9)
        }
        break
      case 'anterior':
        if (currentPage.start - 9 >= 0) {
          setShowDogs(currentPage => ({
            list: totalDogs.slice(currentPage.start - 9, currentPage.start),
            start: currentPage.start - 9
          }))
          findPaginated(currentPage.start - 9)
        }
        break
      default:
        return null
    }
  }

  function changePaginateForNumber (event) {
    const n = (Number(event.target.innerText) - 1) * 9
    setShowDogs(() => ({
      list: totalDogs.slice(n, n + 9),
      start: n
    }))
  }

  function changeNumberPaginatedShowed (name) {
    if (name === 'before' && paginatedShow.start - 10 >= 0) {
      setPaginatedShow(paginatedShow => ({
        start: paginatedShow.start - 10,
        list: countPaginate().slice(paginatedShow.start - 10, paginatedShow.start)
      }))
    } else if (name === 'after' && paginatedShow.start + 10 < countPaginate().length) {
      setPaginatedShow(paginatedShow => ({
        start: paginatedShow.start + 10,
        list: countPaginate().slice(paginatedShow.start + 10, paginatedShow.start + 20)
      }))
    }
  }

  function findPaginated (currentPage) {
    const positonPaginated = currentPage / 9
    const totalPaginated = countPaginate()
    const arrayTotalPaginated = []
    Array(Math.ceil(totalPaginated.length / 10)).fill(null).forEach((n, index) => {
      arrayTotalPaginated.push(totalPaginated.slice(index * 10, index * 10 + 10))
    })
    let WhereIs = null
    arrayTotalPaginated.forEach(list => {
      if (list.includes(positonPaginated)) {
        WhereIs = list
      }
    })
    setPaginatedShow({
      start: WhereIs[0],
      list: WhereIs
    })
  }

  return (
    paginatedShow.list.length > 1
      ? (
        <div className={style.ContenedorBotones}>
          <button className={style.botonesIzquierda} name='anterior' onClick={handlePaging} />
          <div className={style.postionButtons}>
            <button className={paginatedShow.start === 0 ? style.threePointsOFF : null} onClick={() => { changeNumberPaginatedShowed('before') }} name='before'>...</button>
            {
          paginatedShow.list.map((n, index) => <button onClick={changePaginateForNumber} className={currentPage.start / 9 === n ? style.currentPage : null} key={`buttonPaginate${index}`}>{n + 1}</button>)
      }
            <button className={paginatedShow.list[paginatedShow.list.length - 1] >= countPaginate()[countPaginate().length - 1] ? style.threePointsOFF : null} onClick={() => { changeNumberPaginatedShowed('after') }} name='after'>...</button>
          </div>
          <button className={style.botonesDerecha} name='siguiente' onClick={handlePaging} />
        </div>)
      : null
  )
}

export default Paginated
