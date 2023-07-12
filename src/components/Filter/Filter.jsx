import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import DropdownMenu from '../DropdownMenu/DropdownMenu'
import { getDogsForTemperaments2, getDogsForLocation2, keepDogs, updateFilters } from '../../redux/actions/index'

import style from './Filter.module.css'

function Filter () {
  const globalState = useSelector(state => state)

  const [stateFilter, setStateFilter] = useState({
    filteredTemperaments: [],
    locationToFilter: ''
  })

  const [refresh, setRefresh] = useState(true)

  const dispatch = useDispatch()

  // Actualizar Filter del store
  useEffect(() => {
    if (Object.keys(globalState.filters).length && !globalState.filters.filteredTemperaments.length && !globalState.filters.locationToFilter) setStateFilter(globalState.filters)
  }, [globalState.filters])

  function addTemperamentToFilter () {
    const input = document.getElementsByName('inputFilter')
    let temperament = input[0].value
    temperament = temperament[0].toUpperCase() + temperament.slice(1).toLowerCase()
    if (globalState.temperaments.map(temperamentObject => temperamentObject.name).includes(temperament)) {
      filter({ ...stateFilter, filteredTemperaments: [...stateFilter.filteredTemperaments, temperament] })
    } else {
      alert(`El temperamento ${temperament} no existe`)
    }
  }

  function filterForTemperament (listDogs, state) {
    if (state.filteredTemperaments.length > 0) {
      const dogsToFilter = [...listDogs]
      if (dogsToFilter.length) {
        const action = getDogsForTemperaments2(state.filteredTemperaments, dogsToFilter)
        return [action, state]
      }
      return [{ payload: listDogs }, state]
    }
    return [{ payload: listDogs }, state]
  }

  function filterForLocation (listDogs, state) {
    const dogsToFilter = [...listDogs]
    const filterLocationSelected = document.getElementById('selectFilterForLocation')

    if (dogsToFilter.length) {
      state = {
        ...state,
        locationToFilter: filterLocationSelected.value
      }
      const action = getDogsForLocation2(filterLocationSelected.value, dogsToFilter)
      return [action, state]
    }
    return [{ payload: listDogs }, state]
  }

  function filter (state = stateFilter, dogsGS = globalState.totaDogs) {
    const dogs = [...dogsGS]
    const arrayFilter = [filterForLocation, filterForTemperament]
    let action
    for (let i = 0, acc = [{ payload: dogs }, state]; i < arrayFilter.length; i++) {
      const listDogsFiltered = arrayFilter[i](acc[0].payload, acc[1])
      acc = listDogsFiltered
      action = acc
    }
    setStateFilter(action[1])
    dispatch(updateFilters(action[1]))
    dispatch(keepDogs(action[0].payload))
  }

  function goBack (event) {
    const buttonCloseFiltered = event.target.name.slice(19)
    const newTemperamentsFiltered = [...stateFilter.filteredTemperaments]
    newTemperamentsFiltered.splice(buttonCloseFiltered.slice(1), 1)
    const newState = {
      ...stateFilter,
      filteredTemperaments: newTemperamentsFiltered
    }
    setStateFilter(newState)
    filter(newState)
    setRefresh(true)
  }

  return (
    <div className={style.Filter}>
      {/* Inputs para filtrar */}
      <div className={style.inputsFilterContainer}>
        <h1>Filters</h1>
        <div className={style.addTemperament}>
          <label>Temperaments:</label>
          <DropdownMenu refresh={{ refresh, setRefresh }} temperaments={globalState.temperaments} action={addTemperamentToFilter} />
        </div>

        <div className={style.filterForPlaceContainer}>
          <label>Location: </label>
          <select onChange={() => filter()} id='selectFilterForLocation' className={style.selectFilterForLocation}>
            <option value='Both'>Both</option>
            <option value='API'>API</option>
            <option value='DB'>DB</option>
          </select>
        </div>
      </div>
      {/* Filtros hechos */}
      {
        (globalState.searchBar || stateFilter.filteredTemperaments.length)
          ? (
            <div className={style.filterOptionsContainer}>

              {
                stateFilter.filteredTemperaments.length || globalState.searchBar
                  ? <h1>Filtering by: </h1>
                  : null
            }
              {/* Filtrado por Nombre */}
              {
            globalState.searchBar
              ? (
                <div className={style.containerName}>
                  <label>Name:</label>
                  <label>{globalState.searchBar}</label>
                </div>)
              : null
        }
              {/* Filtrado por temperamento */}
              {
                stateFilter.filteredTemperaments.length
                  ? (
                    <div className={style.containerAllTemperaments}>
                      <label>Temperaments: </label>
                      <div className={style.containerTemperaments}>
                        {
                            stateFilter.filteredTemperaments.map((temperament, index) =>
                              <div key={index} className={style.filtradoTemperamentos}>
                                <label>{temperament}</label>
                                <button onClick={goBack} name={`buttonCloseFilteredT${index}`} className={style.botonCancelarFiltrado}>x</button>
                              </div>)
                        }
                      </div>
                    </div>)
                  : null
            }
            </div>)
          : null
      }
    </div>
  )
}

export default Filter
