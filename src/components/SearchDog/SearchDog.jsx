import React from 'react'
import { useDispatch } from 'react-redux'

import { getAllDogs2, updateSearchBar, updateFilters, updateOrder } from '../../redux/actions/index'
import style from './SearchDog.module.css'

function SearchDog ({ setLoad }) {
  const [input, setInput] = React.useState({
    search: ''
  })

  const dispatch = useDispatch()

  function handleChange (event) {
    setInput((input) => ({ search: event.target.value }))
  }

  async function searchDispatch () {
    dispatch(updateSearchBar(input.search))
    dispatch(getAllDogs2(input.search, setLoad))
  }

  async function showAllDogs () {
    dispatch(updateSearchBar(''))
    dispatch(updateFilters({
      filteredTemperaments: [],
      locationToFilter: ''
    }))
    dispatch(updateOrder({ type: 'A-Z' }))
    dispatch(getAllDogs2(null, setLoad))
  }

  return (
    <div className={style.SearchDog}>
      <button className={style.buttonSearchAll} onClick={showAllDogs}>More Popular</button>
      <div>
        <input type='text' onChange={handleChange} value={input.search} placeholder='Search...' onKeyPress={(event) => { if (event.key === 'Enter') searchDispatch() }} className={style.input} />
        <button onClick={searchDispatch} className={style.buttonToSearch} />
      </div>
    </div>
  )
}

export default SearchDog
