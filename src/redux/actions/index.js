export const GET_ALL_DOGS = 'GET_ALL_DOGS'
export const GET_DOG_DETAILS = 'GET_DOG_DETAILS'
export const CREATE_DOG = 'CREATE_DOG'
export const GET_TEMPERAMENTS = 'GET_TEMPERAMENTS'
export const CLEAN_DETAIL = 'CLEAN_DETAIL'
export const GET_DOGS_FOR_TEMPERAMENTS = 'GET_DOGS_FOR_TEMPERAMENTS'
export const ADD_TEMPERAMENT_FILTER = 'ADD_TEMPERAMENT_FILTER'
export const ORDER_ABC = 'ORDER_ABC'
export const ORDER_WEIGHT = 'ORDER_WEIGHT'
export const UPDATE_TEMPERAMENTS = 'UPDATE_TEMPERAMENTS'
export const KEE_DOGS = 'KEE_DOGS'
export const UPDATE_FILTERS = 'UPDATE_FILTERS'
export const UPDATE_SEARCHBAR = 'UPDATE_SEARCHBAR'
export const UPDATE_ORDER = 'UPDATE_ORDER'
export const ORDER_WEIGHT_TOTAL = 'ORDER_WEIGHT_TOTAL'
export const ORDER_ABC_TOTAL = 'ORDER_ABC_TOTAL'
export const UPDATE_SHOWDOGS = 'UPDATE_SHOWDOGS'

// const PATH = "http://localhost:3001"
const PATH = 'https://pi-dogs-back-90f5.onrender.com'

export const getAllDogs = (name) => {
  if (!name) {
    return fetch(`${PATH}/dogs`)
      .then(data => data.json())
      .then(data => {
        if (typeof (data) === 'string') {
          return ({ payload: data })
        } else {
          return { type: GET_ALL_DOGS, payload: data }
        }
      })
  } else {
    return fetch(`${PATH}/dogs?name=${name}`)
      .then((response) => response.json())
      .then((data) => {
        return { type: GET_ALL_DOGS, payload: data }
      })
      .catch(data => {
        return { payload: 'Ha ocurrido un problema en el enlace con el servidor de la aplicación' }
      })
  }
}

export const getAllDogs2 = (name, setLoading) => {
  showLoading(setLoading)
  if (!name) {
    return function (dispatch) {
      return fetch(`${PATH}/dogs`)
        .then((response) => response.json())
        .then((data) => {
          if (typeof (data) === 'string') {
            return alert(data)
          } else {
            dispatch({ type: GET_ALL_DOGS, payload: data })
          }
          quitLoading(setLoading)
        })
        .catch(error => {
          quitLoading(setLoading)
          alert(error.message)
        })
    }
  } else {
    return function (dispatch) {
      return fetch(`${PATH}/dogs?name=${name}`)
        .then((response) => response.json())
        .then((data) => {
          if (typeof (data) === 'string') alert(data)
          else {
            dispatch({ type: GET_ALL_DOGS, payload: data })
          }
          quitLoading(setLoading)
        })
        .catch(error => {
          quitLoading(setLoading)
          alert(error.message)
        })
    }
  }
}

export const updateShowDogs = (object) => {
  return function (dispatch) {
    return dispatch({ type: UPDATE_SHOWDOGS, payload: object })
  }
}

export const getDogsForLocation = (location, dogs) => {
  if (!dogs) {
    return function (dispatch) {
      return fetch(`${PATH}/dogs?location=${location}`)
        .then((response) => response.json())
        .then((data) => ({ type: GET_ALL_DOGS, payload: data }))
    }
  } else {
    let dogsFiltered
    if (location === 'API') {
      dogsFiltered = dogs.filter(dog => {
        return !dog.id.toString().includes('db') ? true : null
      })
    } else if (location === 'DB') {
      dogsFiltered = dogs.filter(dog => {
        return dog.id.toString().includes('db') ? true : null
      })
    }
    return { type: GET_ALL_DOGS, payload: dogsFiltered }
  }
}

export const getDogsForLocation2 = (location, dogs) => {
  let dogsFiltered
  if (location === 'API') {
    dogsFiltered = dogs.filter(dog => !dog.id.toString().includes('db') ? true : null)
  } else {
    dogsFiltered = dogs.filter(dog => dog.id.toString().includes('db') ? true : null)
  }
  return { type: GET_ALL_DOGS, payload: dogsFiltered }
}

export const getDogDetail = (razaPerro) => {
  return function (dispatch) {
    fetch(`${PATH}/dogs/${razaPerro}`)
      .then((response) => response.json())
      .then(data => {
        if (typeof (data) === 'string') { throw new Error(data) } else { dispatch({ type: GET_DOG_DETAILS, payload: data }) }
      })
      .catch(error => alert(error.message))
  }
}

export const cleanDetail = () => {
  return { type: CLEAN_DETAIL, payload: {} }
}

export const createDog = (dog) => {
  const newDog = {
    method: 'Post',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(dog)
  }
  return fetch(`${PATH}/dogs`, newDog)
    .then((data) => data.json())
    .then((data) => {
      return { type: GET_DOG_DETAILS, payload: data }
    })
    .catch(error => alert(error.message))
}

export const getAllTemperaments = () => {
  return function (dispatch) {
    return fetch(`${PATH}/temperaments`)
      .then((response) => response.json())
      .then((data) => {
        if (typeof (data) === 'string') { return alert(data) }
        if (!data.length) { return alert('No se ha encontrado ningun temperamento en la base de datos') }
        const arrayData = data.map(temperament => temperament.name)
        dispatch({ type: GET_TEMPERAMENTS, payload: arrayData })
      })
      .catch(error => console.log(error.message))
  }
}

export const updateTemperaments = () => {
  return function (dispatch) {
    return fetch(`${PATH}/temperaments?add=update`, { method: 'Post', headers: { 'Content-type': 'application/json' } })
      .then(response => response.json())
      .then(data => {
        if (typeof (data) === 'string') { return alert(data) }
        return dispatch({ type: UPDATE_TEMPERAMENTS, payload: data })
      }
      )
  }
}

export const getDogsForTemperaments = (filter, dogs) => {
  if (!dogs) {
    return function (dispatch) {
      return fetch(`${PATH}/dogs`)
        .then((response) => response.json())
        .then((data) => data.filter(dog => {
          const temperamentsDog = dog.temperament ? dog.temperament.split(', ') : 'null'
          for (const temperamentFilter of filter) {
            if (temperamentsDog.includes(temperamentFilter)) continue
            else return false
          }
          return true
        }))
        .then((data) => ({ type: GET_DOGS_FOR_TEMPERAMENTS, payload: data }))
    }
  } else {
    const dogsFiltered = dogs.filter(dog => {
      const temperamentsDog = dog.temperament ? dog.temperament.split(', ') : 'null'
      for (const temperamentFilter of filter) {
        if (temperamentsDog.includes(temperamentFilter)) continue
        else return false
      }
      return true
    })
    return { type: GET_DOGS_FOR_TEMPERAMENTS, payload: dogsFiltered }
  }
}

export const addTemperamentsFilter = (temperament) => {
  return { type: ADD_TEMPERAMENT_FILTER, payload: temperament }
}

export const orderAlfabetic = (data) => {
  return { type: ORDER_ABC, payload: data }
}

export const orderAlfabeticTotal = (data) => {
  return { type: ORDER_ABC_TOTAL, payload: data }
}

export const orderWeight = (data) => {
  return { type: ORDER_WEIGHT, payload: data }
}

export const orderWeightTotal = (data) => {
  return { type: ORDER_WEIGHT_TOTAL, payload: data }
}

export const keepDogs = (dogs) => {
  return { type: KEE_DOGS, payload: dogs }
}

export const updateFilters = (filters) => {
  return { type: UPDATE_FILTERS, payload: filters }
}

export const updateSearchBar = (input) => {
  return { type: UPDATE_SEARCHBAR, payload: input }
}

export const updateOrder = (input) => {
  return { type: UPDATE_ORDER, payload: input }
}

export const updateAll = (name) => {
  return function (dispatch) {
    dispatch(updateFilters({
      temperamentsToFilter: [],
      temperamentsAlreadyFiltered: [],
      locationToFilter: ''
    }))
    dispatch(updateSearchBar(name))
    dispatch(updateOrder({
      type: '',
      sense: ''
    }))
  }
}

export const showLoading = (setLoading) => {
  if (setLoading) setLoading(true)
}

export const quitLoading = (setLoading) => {
  if (setLoading) setLoading(false)
}
