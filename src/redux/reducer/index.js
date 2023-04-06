import {GET_ALL_DOGS, GET_DOG_DETAILS, CLEAN_DETAIL, CREATE_DOG, GET_TEMPERAMENTS, UPDATE_TEMPERAMENTS, GET_DOGS_FOR_TEMPERAMENTS, ADD_TEMPERAMENT_FILTER, ORDER_ABC, ORDER_WEIGHT, KEE_DOGS, UPDATE_FILTERS, UPDATE_SEARCHBAR, UPDATE_ORDER, ORDER_ABC_TOTAL, ORDER_WEIGHT_TOTAL} from "../actions/index"

const initialState = {
    totaDogs: [],
    dogs: [],
    searchBar: "",
    filters: {},
    order: {},
    dogDetail: {},
    temperaments: []
}

const rootReducer = (state = initialState, action) => {
    const {type, payload} = action
    switch (type) {
        case GET_ALL_DOGS:
            return {
                ...state,
                totaDogs: payload
            }
        case GET_DOG_DETAILS:
            return {
                ...state,
                dogDetail: payload
            }
        case KEE_DOGS:
            return {
                ...state,
                dogs: payload
            }
        case CLEAN_DETAIL:
            return {
                ...state,
                dogDetail: payload
            }

        case CREATE_DOG:
            return {
                ...state,
                dogs: [...state.dogs, payload]
            }
        case GET_TEMPERAMENTS:
            return {
                ...state,
                temperaments: payload
            }
        case GET_DOGS_FOR_TEMPERAMENTS:
            return {
                ...state,
                dogs: payload
            }
        case ADD_TEMPERAMENT_FILTER:
            return {
                ...state,
                temperaments: [...state.temperaments, payload]
            }
        case UPDATE_TEMPERAMENTS:
            return {
                ...state,
                temperaments: [...state.temperaments, ...payload]
            }
        case ORDER_ABC:
            return {
                ...state,
                dogs: payload
            }
        case ORDER_ABC_TOTAL:
            return {
                ...state,
                totaDogs: payload
            }
        case ORDER_WEIGHT:
            return {
                ...state,
                dogs: payload
            }
        case ORDER_WEIGHT_TOTAL:
            return {
                ...state,
                totaDogs: payload
            }
        case UPDATE_FILTERS:
            return {
                ...state,
                filters: payload
            }
        case UPDATE_SEARCHBAR:
            return {
                ...state,
                searchBar: payload
            }
        case UPDATE_ORDER:
            return {
                ...state,
                order: payload
            }
        default:
            return state
    }
}

export default rootReducer