// import { response } from "../../../../api/src/app"

export const GET_ALL_DOGS = "GET_ALL_DOGS"
export const GET_DOG_DETAILS = "GET_DOG_DETAILS"
export const CREATE_DOG = "CREATE_DOG"
export const GET_TEMPERAMENTS = "GET_TEMPERAMENTS"
export const CLEAN_DETAIL = "CLEAN_DETAIL"
export const GET_DOGS_FOR_TEMPERAMENTS = "GET_DOGS_FOR_TEMPERAMENTS"
export const ADD_TEMPERAMENT_FILTER = "ADD_TEMPERAMENT_FILTER"
export const ORDER_ABC = "ORDER_ABC"
export const ORDER_WEIGHT = "ORDER_WEIGHT"
export const UPDATE_TEMPERAMENTS = "UPDATE_TEMPERAMENTS"
export const KEE_DOGS = "KEE_DOGS"
export const UPDATE_FILTERS = "UPDATE_FILTERS"
export const UPDATE_SEARCHBAR = "UPDATE_SEARCHBAR"
export const UPDATE_ORDER = "UPDATE_ORDER"
export const ORDER_WEIGHT_TOTAL = "ORDER_WEIGHT_TOTAL"
export const ORDER_ABC_TOTAL = "ORDER_ABC_TOTAL"

// export const probando = () => {
//     return fetch('http://localhost:3001/dogs')
//         .then((response) => response.json())
//         .then((data) => ({ type: GET_ALL_DOGS, payload: data}))
// }

export const getAllDogs = (name) => {
    if (!name) {
        return fetch(`http://localhost:3001/dogs`)
            .then(data => data.json())
            .then(data => {
                if (typeof(data) === "string") {
                    return ({payload: data})
                }
                else {
                    return {type: GET_ALL_DOGS, payload:data}
                }
            })      
    }
    else {
        return fetch(`http://localhost:3001/dogs?name=${name}`)
            .then((response) => response.json())
            .then((data) => { 
                // console.log("lo que me retorno el servidor", data)
                return {type: GET_ALL_DOGS, payload: data}
            })
            .catch(data => {
                // console.log("en caso de no un error en el action-generator retorno", data)
                return {payload: "Ha ocurrido un problema en el enlace con el servidor de la aplicación"}
            });
            
    }
}

export const getDogsForLocation = (location, dogs) => {
    if (!dogs) {    
        return function (dispatch) {
            return fetch(`http://localhost:3001/dogs?location=${location}`)
            .then((response) => response.json())
            .then((data) => ({ type: GET_ALL_DOGS, payload: data}));
        }
    } 
    else  {
        let dogsFiltered
        if (location === "API") {
            dogsFiltered = dogs.filter(dog => {
                return !dog.id.toString().includes("db")? true:null 
            })
        }
        else if (location === "DB") {
            dogsFiltered = dogs.filter(dog => {
                return dog.id.toString().includes("db")? true:null 
        })}
        return { type: GET_ALL_DOGS, payload: dogsFiltered}
    }
    // let dogsFiltered
    // if (!dogs) {    
    //     dogsFiltered = await fetch(`http://localhost:3001/dogs?location=${location}`)
    //         .then((response) => response.json())
    //         .then((data) => data);
    // } 
    // else  {
    //     if (location === "API") {
    //         dogsFiltered = dogs.filter(dog => {
    //             return !dog.id.toString().includes("db")? true:null 
    //         })
    //     }
    //     else if (location === "DB") {
    //         dogsFiltered = dogs.filter(dog => {
    //             return dog.id.toString().includes("db")? true:null 
    //     })}
    //     return { type: GET_ALL_DOGS, payload: dogsFiltered}
    // }
}

export const getDogDetail = (raza_perro) => {
    // return fetch(`http://localhost:3001/dogs/${raza_perro}`)
    //     .then((response) => response.json())
    //     .then(data => ({ type: GET_DOG_DETAILS, payload: data}))
    //     .catch(error => ({ payload:"Ha ocurrido un problema en el enlace con el servidor de la aplicación"}));
    return function(dispatch) {
        fetch(`http://localhost:3001/dogs/${raza_perro}`)
            .then((response) => response.json())
            .then(data => {
                if (typeof(data) === "string") {throw new Error(data)}
                else {dispatch({type: GET_DOG_DETAILS, payload:data})}
            })
            .catch(error => alert(error.message))
    }
};

export const cleanDetail = () => {
    return {type: CLEAN_DETAIL, payload:{}}
}

export const createDog = (dog) => {
    const newDog = {
        method: 'Post',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(dog)
    }
    // return function (dispatch) {
    //     return fetch(`http://localhost:3001/dogs`, newDog)
    //     .then((data) => data.json())
    //     .then((data) => dispatch({ type: GET_DOG_DETAILS, payload: data}));
    //     }
    return fetch(`http://localhost:3001/dogs`, newDog)
        .then((data) => data.json())
        .then((data) => {
            // console.log(data)
            return {type: GET_DOG_DETAILS, payload: data}
        })
        .catch(error => alert(error.message));
};

export const getAllTemperaments = () => {
    return function (dispatch) {
        return fetch('http://localhost:3001/temperaments')
        .then((response) => response.json())
        .then((data) => {
            if (typeof(data) === "string") {return alert(data)}
            if (!data.length) {return alert("No se ha encontrado ningun temperamento en la base de datos")}
            let arrayData = data.map(temperament => temperament.name)
            dispatch({ type: GET_TEMPERAMENTS, payload: arrayData})
        });
    }
}

export const updateTemperaments = () => {
    return function(dispatch) {
        return fetch(`http://localhost:3001/temperaments?add=update`, {method: "Post", headers: {"Content-type": "application/json"}})
        .then(response => response.json())
        .then(data => {
            if (typeof(data) === "string") {return alert(data)}
            return dispatch({type: UPDATE_TEMPERAMENTS, payload: data})
            }
        )
    }
}

export const getDogsForTemperaments = (filter, dogs) => {
    if (!dogs) {
        return function (dispatch) {
            return fetch('http://localhost:3001/dogs')
            .then((response) => response.json())
            .then((data) => data.filter(dog => {
                const temperamentsDog = dog.temperament? dog.temperament.split(", "):"null"
                for (let temperamentFilter of filter) {
                    if (temperamentsDog.includes(temperamentFilter)) continue
                    else return false
                }
                return true
            }))
            .then((data) => ({ type: GET_DOGS_FOR_TEMPERAMENTS, payload: data}));
        }
    } else {
        const dogsFiltered = dogs.filter(dog => {
            const temperamentsDog = dog.temperament? dog.temperament.split(", "):"null"
                for (let temperamentFilter of filter) {
                    if (temperamentsDog.includes(temperamentFilter)) continue
                    else return false
                }
                return true
        })
        return {type: GET_DOGS_FOR_TEMPERAMENTS, payload: dogsFiltered }
    }
}

export const addTemperamentsFilter = (temperament) => {
    return {type: ADD_TEMPERAMENT_FILTER, payload: temperament}
}

export const orderAlfabetic = (data) => {
    // const sortData = data.sort((a,b) => {
    //     const wordA = a.name.toLowerCase()
    //     const wordB = b.name.toLowerCase()
    //     for (let i = 0; i < (wordA.length<wordB.length?wordA.length:wordB.length) ; i++) {
    //         if (wordA.charCodeAt(i)<wordB.charCodeAt(i)) return -1
    //         else if (wordA.charCodeAt(i)>wordB.charCodeAt(i)) return 1
    //     }
    //     return 0
    // })
    return {type: ORDER_ABC, payload: data}
}

export const orderAlfabeticTotal = (data) => {
    return {type: ORDER_ABC_TOTAL, payload: data}
}

export const orderWeight = (data) => {
    // const sortData = data.sort((a,b) => {
    //     const rangeA = a.weight.imperial.split(" - ")
    //     const rangeB = b.weight.imperial.split(" - ")
    //     if (rangeA[0]<rangeB[0]) return -1
    //     else if ((rangeA[0]>rangeB[0])) return 1
    //     else {return rangeA[1]-rangeB[1]}
    // })
    return {type: ORDER_WEIGHT, payload: data}
}

export const orderWeightTotal = (data) => {
    return {type: ORDER_WEIGHT_TOTAL, payload: data}
}

export const keepDogs = (dogs) => {
    return {type: KEE_DOGS, payload: dogs}
}

export const updateFilters = (filters) => {
    return {type: UPDATE_FILTERS, payload: filters}
}

export const updateSearchBar = (input) => {
    return {type: UPDATE_SEARCHBAR, payload: input}
}

export const updateOrder = (input) => {
    return {type: UPDATE_ORDER, payload: input}
}