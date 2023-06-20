import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import DropdownMenu from '../DropdownMenu/DropdownMenu'
import { getAllTemperaments, getDogsForTemperaments2, getDogsForLocation2, keepDogs, updateFilters } from '../../redux/actions/index'

import style from './Filter.module.css'

function Filter () {
  const globalState = useSelector(state => state)

  const [stateFilter, setStateFilter] = useState({
    filteredTemperaments: [],
    locationToFilter: ''
  })

  const [refresh, setRefresh] = useState(true)

  const dispatch = useDispatch()

  // Actualizar la global State con todos los temperaments
  useEffect(() => {
    dispatch(getAllTemperaments())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      {
            globalState.searchBar
              ? (
                <div>
                  <h3 className={style.titulo}>Busqueda</h3>
                  <label>{globalState.searchBar}</label>
                </div>)
              : null
        }
      <h3 className={style.titulo}>Filtrar</h3>
      <div className={style.showFiltrado}>
        {
                stateFilter.filteredTemperaments.length || stateFilter.locationToFilter
                  ? <p>Se esta filtrando por: </p>
                  : null
            }
        {
                stateFilter.filteredTemperaments.length
                  ? (
                    <div>
                      <label>Temperamentos: </label>
                      <div className={style.divParaFiltrar}>
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
      </div>

      <div className={style.addTemperament}>
        <label>Por temperamento: </label>
        <DropdownMenu refresh={{ refresh, setRefresh }} temperaments={globalState.temperaments} action={addTemperamentToFilter} />
      </div>

      <div className={style.divParaFiltrar} />
      <div className={style.place}>
        <label>Por Ubicación: </label>
        <select onChange={() => filter()} id='selectFilterForLocation'>
          <option value='Both'>Both</option>
          <option value='API'>API</option>
          <option value='DB'>DB</option>
        </select>
      </div>
      <br />

    </div>
  )
}

export default Filter
