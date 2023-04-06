import React from "react";
import {useSelector, useDispatch} from "react-redux"
import {orderAlfabetic, orderAlfabeticTotal,orderWeight, orderWeightTotal,updateOrder} from "../../redux/actions/index"
import style from "./Order.module.css"

const regNumber = /[^0-9-. ]/

function Order() {

    const dogs = useSelector(state => state.dogs)
    const orderGS = useSelector(state => state.order)
    const totalDogs = useSelector(state => state.totaDogs)
    const [orderState, setOrderState] = React.useState((Object.keys(orderGS).length && orderGS) || {
        type: "",
        sense: "",
    })

    const [dogsState, setDogsState] = React.useState(dogs)

    const dispatch = useDispatch()

    React.useEffect(() => {
        if (Object.keys(orderGS).length) {
            setOrderState(orderGS)
            changeInputChecked()
        }
    }, [orderGS])

    // React.useEffect(() => {
    //     if ((!dogs.every((n, index) => n===dogsState[index]) && orderState.type!=="" && orderState.sense!=="")) {
    //         orderDispatch()
    //     }
    // },[dogs])
    
    const mergeSort = (array) => {
        const pivote = Math.round(array.length/2)
        let left = array.slice(0,pivote)
        if (left.length>1) {
          left = mergeSort(left)
        }
        let right = array.slice(pivote)
        if (right.length>1) {
          right = mergeSort(right)
        }
        let newArray = []
        while (left.length || right.length) {
            if (left.length && right.length) {
                
                if (left[0].weight.includes("–")) {
                    left[0].weight = left[0].weight.replace("–","-")
                }
                if (right[0].weight.includes("–")) {
                    right[0].weight = right[0].weight.replace("–", "-")
                }
                
                const r0 = ((regNumber.test(left[0].weight.split("-")[0])? null:(left[0].weight.split("-")[0])) - (regNumber.test(right[0].weight.split("-")[0])? null:(right[0].weight.split("-")[0])))
                
                
                if (r0 < 0) {
                    newArray.push(left.shift())
                } else if (r0 > 0){
                    newArray.push(right.shift())
                } 
                else {
                    
                    const r1 = (regNumber.test(left[0].weight.split("-")[1])? null:Number(left[0].weight.split("-")[1])) - (regNumber.test(right[0].weight.split("-")[1])? null:Number(right[0].weight.split("-")[1]))
                    
                    
                    if (r1 <= 0) {
                        newArray.push(left.shift())
                    }
                    else {
                        newArray.push(right.shift())
                    }
                }
            }
            else {
                if (left.length) newArray.push(left.shift())
                if (right.length) newArray.push(right.shift())
            }
        }
        return newArray
    }

    function orderDispatch() {
        const inputsOrder = document.getElementsByName("inputOrder")
        const inputSence = document.getElementsByName("inputOrderSence")
        const data = [...dogs]
        let inputCheckedOrder
        for (let input of inputsOrder) {
            if (input.checked) {
                inputCheckedOrder = input
                break
            }
        }
        let inputCheckedSence
        for (let input of inputSence) {
            if (input.checked) {
                inputCheckedSence = input
                break
            }
        }
        // console.log("tipo:",inputCheckedOrder && inputCheckedOrder.value, "sentido:", inputCheckedSence && inputCheckedSence.value)
        if (inputCheckedOrder && inputCheckedOrder.value === "weight") {
            // const sortData = [dogs[1]]
            let sortData = mergeSort(data)
            let sortTotalDgos = mergeSort(totalDogs)
            // data.sort((a,b) => {
            //     if ((regNumber.test(a.weight.metric.split(" - ")[0])? null: Number(a.weight.metric.split(" - ")[0]))-(regNumber.test(b.weight.metric.split(" - ")[0])? null:Number(b.weight.metric.split(" - ")[0])) === 0) {
            //         return (regNumber.test(a.weight.metric.split(" - ")[1])? null:Number(a.weight.metric.split(" - ")[1]))-(regNumber.test(b.weight.metric.split(" - ")[1])? null:Number(b.weight.metric.split(" - ")[1]))
            //     }
            //     return (regNumber.test(a.weight.metric.split(" - ")[0])? null:Number(a.weight.metric.split(" - ")[0]))-(regNumber.test(b.weight.metric.split(" - ")[0])? null:Number(b.weight.metric.split(" - ")[0]))
            // })
            if (inputCheckedSence && inputCheckedSence.value==="des") {
                // console.log("entre")
                sortData = sortData.reverse()
                sortTotalDgos = sortTotalDgos.reverse()
            }
            // console.log("dogs:", [...dogs])
            // console.log("sortData", sortData)
            // console.log(Boolean(!sortData.every((n, index) => n===[...dogs][index])))
            if (!dogs.every((n, index) => n===sortData[index])) {
                // console.log(sortData)
                setDogsState(sortData)
                dispatch(orderWeight(sortData))
                dispatch(orderWeightTotal(sortTotalDgos))
            }
        }
        else if (inputCheckedOrder && inputCheckedOrder.value === "abc") {
            let sortData = [...dogs]
            let sortTotalDgos = [...totalDogs]
            sortData.sort((a,b) => {
                for (let i = 0; i<(a.name.length<b.name.length?b.name.length:a.name.length); i++) {
                    if (a.name.charCodeAt(i)-b.name.charCodeAt(i)===0) {
                        continue
                    }
                    return (a.name? a.name.charCodeAt(i):null)-(b.name? b.name.charCodeAt(i):null)
                }
            })
            sortTotalDgos.sort((a,b) => {
                for (let i = 0; i<(a.name.length<b.name.length?b.name.length:a.name.length); i++) {
                    if (a.name.charCodeAt(i)-b.name.charCodeAt(i)===0) {
                        continue
                    }
                    return (a.name? a.name.charCodeAt(i):null)-(b.name? b.name.charCodeAt(i):null)
                }
            })
            // const sortData = dogs.sort((a,b) => {
            //     const wordA = a.name.toLowerCase()
            //     const wordB = b.name.toLowerCase()
            //     for (let i = 0; i < (wordA.length<wordB.length?wordA.length:wordB.length) ; i++) {
            //         if (wordA.charCodeAt(i)<wordB.charCodeAt(i)) return -1
            //         else if (wordA.charCodeAt(i)>wordB.charCodeAt(i)) return 1
            //     }
            //     return 0
            // })
            if (inputCheckedSence && inputCheckedSence.value==="des") {
                sortData = sortData.reverse()
                sortTotalDgos = sortTotalDgos.reverse()
            }
            if (!dogs.every((n, index) => n===sortData[index])) {
                // console.log(sortData)
                setDogsState(sortData)
                dispatch(orderAlfabetic(sortData))
                dispatch(orderAlfabeticTotal(sortTotalDgos))
            }
            
        }
        dispatch(updateOrder({
            type: inputCheckedOrder?inputCheckedOrder.value:orderState.type,
            sense: inputCheckedSence?inputCheckedSence.value:orderState.sense
        }))

        setOrderState((orderState) => ({
            type: inputCheckedOrder?inputCheckedOrder.value:orderState.type,
            sense: inputCheckedSence?inputCheckedSence.value:orderState.sense
        }))
    }

    function changeInputChecked() {
        const inputsOrder = document.getElementsByName("inputOrder")
        const inputSence = document.getElementsByName("inputOrderSence")
        for (let input of inputsOrder) {
            if (input.value === orderGS.type) {
                input.checked = true
            } else {
                input.checked = false
            }
        }
        for (let input of inputSence) {
            if (input.value === orderGS.sense) {
                input.checked = true
            } else {
                input.checked = false
            }
        }
    
    }

    return <div className={style.Order}>
        <p>Ordenar por: </p>

        <div>
            <label for="inputOrderAbc">Alfaveticamente</label>
            <input type="radio" name="inputOrder" value="abc" id="inputOrderAbc"></input>
            <br></br>
            <label for="inputOrderWeight">Peso</label>
            <input type="radio" name="inputOrder" value="weight" id="inputOrderWeight"></input>
        </div>

        <div className={style.sentido}>
        <p>Sentido: </p>
        <label for="inputOrderAsc">Ascendente</label>
        <input type="radio" id="inputOrderAsc" name="inputOrderSence" value="asc"></input>
        <br></br>
        <label for="inputOrderDes">Descendente</label>
        <input type="radio" id="inputOrderDes" name="inputOrderSence" value="des"></input>
        </div>
        
        <button onClick={orderDispatch} className={style.botonOrdenar}>Ordenar</button>
    </div>
}

export default Order