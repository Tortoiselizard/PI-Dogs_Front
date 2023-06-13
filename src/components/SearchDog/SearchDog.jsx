import React from "react";
import {useDispatch} from "react-redux"
import {getAllDogs, getAllDogs2, keepDogs, updateSearchBar, updateFilters, updateOrder} from "../../redux/actions/index"
import style from "./SearchDog.module.css"

function SearchDog() {
    const [input, setInput] = React.useState({
        search:""
    })

    const dispatch = useDispatch()

    function handleChange(event) {
        setInput((input) => ({search: event.target.value}))
    }

    async function searchDispatch() {
        dispatch(getAllDogs2(input.search))
    }
    
    async function showAllDogs(){
            const allDogs = await getAllDogs()
            if (typeof(allDogs.payload)=== "string") {return alert(allDogs.payload)}
            else {
                await dispatch(updateFilters({
                    temperamentsToFilter: [],
                    temperamentsFiltered: [],
                    locationToFilter:""
                    }))
                await dispatch(updateSearchBar(""))
                await dispatch(updateOrder({
                    type: "",
                    sense: "",
                }))
                await dispatch(allDogs)
                await dispatch(keepDogs(allDogs.payload))
        }
    }

    return <div className={style.SearchDog}>
        <button className={style.buttonSearchAll} onClick={showAllDogs}>More Popular</button>
        <input type="text" onChange={handleChange} value={input.search} placeholder="Search..." onKeyPress={(event) => {if (event.key === "Enter") searchDispatch()}} className={style.input}></input>
        <button onClick={searchDispatch} className={style.buttonToSearch}>🔍</button>
    </div>
}

export default SearchDog