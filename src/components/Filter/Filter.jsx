import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import DropdownMenu from '../DropdownMenu/DropdownMenu'
import { getAllTemperaments, getDogsForTemperaments, getDogsForLocation2, keepDogs, updateFilters } from '../../redux/actions/index'

import style from './Filter.module.css'

function Filter () {
  const globalState = useSelector(state => state)

  const [stateFilter, setStateFilter] = useState((Object.keys(globalState.filters).length && globalState.filters) || {
    temperamentsToFilter: [],
    temperamentsAlreadyFiltered: [],
    locationToFilter: ''
  })

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllTemperaments())
  }, [dispatch, stateFilter.locationToFilter])

  useEffect(() => {
    if (Object.keys(globalState.filters).length) setStateFilter(globalState.filters)
  }, [globalState.filters])

  function addTemperamentToFilter () {
    const input = document.getElementsByName('inputFilter')
    let temperament = input[0].value
    temperament = temperament[0].toUpperCase() + temperament.slice(1).toLowerCase()
    if (globalState.temperaments.includes(temperament)) {
      // setStateFilter(stateFilter => ({
      //   ...stateFilter,
      //   temperamentsToFilter: [...stateFilter.temperamentsToFilter, temperament]
      // }))
      filter({ ...stateFilter, temperamentsAlreadyFiltered: [...stateFilter.temperamentsAlreadyFiltered, temperament] })
    } else {
      alert(`El temperamento ${temperament} no existe`)
    }
  }

  function restTemperamentToFilter (event) {
    const indexTemperament = event.target.name.slice(19)
    setStateFilter(stateFilter => {
      const newTemperamentToFilter = [...stateFilter.temperamentsToFilter]
      newTemperamentToFilter.splice(indexTemperament, 1)
      return {
        ...stateFilter,
        temperamentsToFilter: [...newTemperamentToFilter]
      }
    })
  }

  async function filterForTemperament (listDogs, state) {
    if (state.temperamentsAlreadyFiltered.length > 0) {
      const dogsToFilter = [...listDogs]
      if (dogsToFilter.length) {
        const action = await getDogsForTemperaments(state.temperamentsAlreadyFiltered, dogsToFilter)
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

  async function filter (state = stateFilter, dogsGS = globalState.totaDogs) {
    let dogs = [...dogsGS]
    dogs = dogs.filter(dog => !!dog.name.toLowerCase().includes(globalState.searchBar.toLowerCase()))
    const arrayFilter = [filterForLocation, filterForTemperament]
    let action
    for (let i = 0, acc = [{ payload: dogs }, state]; i < arrayFilter.length; i++) {
      const listDogsFiltered = await arrayFilter[i](acc[0].payload, acc[1])
      acc = listDogsFiltered
      action = acc
    }
    setStateFilter(action[1])
    dispatch(updateFilters(action[1]))
    dispatch(keepDogs(action[0].payload))
  }

  async function goBack (event) {
    const buttonCloseFiltered = event.target.name.slice(19)
    if (buttonCloseFiltered[0] === 'T') {
      const newTemperamentsFiltered = [...stateFilter.temperamentsAlreadyFiltered]
      newTemperamentsFiltered.splice(buttonCloseFiltered.slice(1), 1)
      const newState = {
        ...stateFilter,
        temperamentsAlreadyFiltered: newTemperamentsFiltered
      }
      setStateFilter(state => newState)
      filter(newState)
    } else if (buttonCloseFiltered[0] === 'L') {
      const inputsLocation = document.getElementsByName('inputFilterLocation')
      inputsLocation.forEach(input => { input.checked = false })
      const newState = {
        ...stateFilter,
        locationToFilter: ''
      }
      setStateFilter(state => newState)
      filter(newState)
    }
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
                stateFilter.temperamentsAlreadyFiltered.length || stateFilter.locationToFilter
                  ? <p>Se esta filtrando por: </p>
                  : null
            }
        {
                stateFilter.temperamentsAlreadyFiltered.length
                  ? (
                    <div>
                      <label>Temperamentos: </label>
                      <div className={style.divParaFiltrar}>
                        {
                            stateFilter.temperamentsAlreadyFiltered.map((temperament, index) =>
                              <div key={index} className={style.filtradoTemperamentos}>
                                <label>{temperament}</label>
                                <button onClick={goBack} name={`buttonCloseFilteredT${index}`} className={style.botonCancelarFiltrado}>x</button>
                              </div>)
                        }
                      </div>
                    </div>)
                  : null
            }
        {
                stateFilter.locationToFilter
                  ? (
                    <div>
                      <label>Ubicacion: </label>
                      <div className={style.filtradoTemperamentos}>
                        <label>{stateFilter.locationToFilter}</label>
                        <button className={style.botonCancelarFiltrado} onClick={goBack} name={`buttonCloseFilteredL${stateFilter.locationToFilter}`}>x</button>
                      </div>
                    </div>)
                  : null
            }
      </div>

      <div className={style.addTemperament}>
        <label>Por temperamento: </label>
        <DropdownMenu temperaments={globalState.temperaments} action={addTemperamentToFilter} />
      </div>

      {
            stateFilter.temperamentsToFilter.length ? <label>Temeramentos para filtrar: </label> : null
        }
      <div className={style.divParaFiltrar}>
        {
            stateFilter.temperamentsToFilter.length > 0
              ? stateFilter.temperamentsToFilter.map((temperament, index) => (
                <div key={index} className={style.filtradoTemperamentos}>
                  <label>{temperament}</label>
                  <button className={style.botonCancelarFiltrado} onClick={restTemperamentToFilter} name={`temperamentToFilter${index}`}>x</button>
                </div>))
              : null
            }
      </div>
      <div className={style.place}>
        <label>Por Ubicación: </label>
        <select id='selectFilterForLocation'>
          <option value='Both'>Both</option>
          <option value='API'>API</option>
          <option value='DB'>DB</option>
        </select>
      </div>

      <button
        className={style.botonFiltrar} onClick={() => {
          filter({ ...stateFilter, temperamentsToFilter: [], temperamentsAlreadyFiltered: [...stateFilter.temperamentsAlreadyFiltered, ...stateFilter.temperamentsToFilter] })
        }}
      >Filtrar
      </button>
      <br />

    </div>
  )
}

export default Filter
