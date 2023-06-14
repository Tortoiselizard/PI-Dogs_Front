import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { orderAlfabetic, orderAlfabeticTotal, orderWeight, orderWeightTotal, updateOrder } from '../../redux/actions/index'
import style from './Order.module.css'

const regNumber = /[^0-9-. ]/

function Order () {
  const dogs = useSelector(state => state.dogs)
  const orderGS = useSelector(state => state.order)
  const totalDogs = useSelector(state => state.totaDogs)
  const [orderState, setOrderState] = React.useState((Object.keys(orderGS).length && orderGS) || {
    type: '',
    sense: ''
  })

  const dispatch = useDispatch()

  React.useEffect(() => {
    if (Object.keys(orderGS).length) {
      setOrderState(orderGS)
      function changeInputChecked () {
        const inputsOrder = document.getElementsByName('inputOrder')
        const inputSence = document.getElementsByName('inputOrderSence')
        for (const input of inputsOrder) {
          if (input.value === orderGS.type) {
            input.checked = true
          } else {
            input.checked = false
          }
        }
        for (const input of inputSence) {
          if (input.value === orderGS.sense) {
            input.checked = true
          } else {
            input.checked = false
          }
        }
      }
      changeInputChecked()
    }
  }, [orderGS])

  const mergeSort = (array) => {
    const pivote = Math.round(array.length / 2)
    let left = array.slice(0, pivote)
    if (left.length > 1) {
      left = mergeSort(left)
    }
    let right = array.slice(pivote)
    if (right.length > 1) {
      right = mergeSort(right)
    }
    const newArray = []
    while (left.length || right.length) {
      if (left.length && right.length) {
        if (left[0].weight.includes('–')) {
          left[0].weight = left[0].weight.replace('–', '-')
        }
        if (right[0].weight.includes('–')) {
          right[0].weight = right[0].weight.replace('–', '-')
        }

        const r0 = ((regNumber.test(left[0].weight.split('-')[0]) ? null : (left[0].weight.split('-')[0])) - (regNumber.test(right[0].weight.split('-')[0]) ? null : (right[0].weight.split('-')[0])))

        if (r0 < 0) {
          newArray.push(left.shift())
        } else if (r0 > 0) {
          newArray.push(right.shift())
        } else {
          const r1 = (regNumber.test(left[0].weight.split('-')[1]) ? null : Number(left[0].weight.split('-')[1])) - (regNumber.test(right[0].weight.split('-')[1]) ? null : Number(right[0].weight.split('-')[1]))

          if (r1 <= 0) {
            newArray.push(left.shift())
          } else {
            newArray.push(right.shift())
          }
        }
      } else {
        if (left.length) newArray.push(left.shift())
        if (right.length) newArray.push(right.shift())
      }
    }
    return newArray
  }

  function orderDispatch () {
    const inputsOrder = document.getElementsByName('inputOrder')
    const inputSence = document.getElementsByName('inputOrderSence')
    const data = [...dogs]
    let inputCheckedOrder
    for (const input of inputsOrder) {
      if (input.checked) {
        inputCheckedOrder = input
        break
      }
    }
    let inputCheckedSence
    for (const input of inputSence) {
      if (input.checked) {
        inputCheckedSence = input
        break
      }
    }
    if (inputCheckedOrder && inputCheckedOrder.value === 'weight') {
      let sortData = mergeSort(data)
      let sortTotalDgos = mergeSort(totalDogs)

      if (inputCheckedSence && inputCheckedSence.value === 'des') {
        sortData = sortData.reverse()
        sortTotalDgos = sortTotalDgos.reverse()
      }
      if (!dogs.every((n, index) => n === sortData[index])) {
        dispatch(orderWeight(sortData))
        dispatch(orderWeightTotal(sortTotalDgos))
      }
    } else if (inputCheckedOrder && inputCheckedOrder.value === 'abc') {
      let sortData = [...dogs]
      let sortTotalDgos = [...totalDogs]
      sortData.sort((a, b) => {
        for (let i = 0; i < (a.name.length < b.name.length ? b.name.length : a.name.length); i++) {
          if (a.name.charCodeAt(i) - b.name.charCodeAt(i) === 0) {
            continue
          }
          return (a.name ? a.name.charCodeAt(i) : null) - (b.name ? b.name.charCodeAt(i) : null)
        }
        return null
      })
      sortTotalDgos.sort((a, b) => {
        for (let i = 0; i < (a.name.length < b.name.length ? b.name.length : a.name.length); i++) {
          if (a.name.charCodeAt(i) - b.name.charCodeAt(i) === 0) {
            continue
          }
          return (a.name ? a.name.charCodeAt(i) : null) - (b.name ? b.name.charCodeAt(i) : null)
        }
        return null
      })

      if (inputCheckedSence && inputCheckedSence.value === 'des') {
        sortData = sortData.reverse()
        sortTotalDgos = sortTotalDgos.reverse()
      }
      if (!dogs.every((n, index) => n === sortData[index])) {
        dispatch(orderAlfabetic(sortData))
        dispatch(orderAlfabeticTotal(sortTotalDgos))
      }
    }
    dispatch(updateOrder({
      type: inputCheckedOrder ? inputCheckedOrder.value : orderState.type,
      sense: inputCheckedSence ? inputCheckedSence.value : orderState.sense
    }))

    setOrderState((orderState) => ({
      type: inputCheckedOrder ? inputCheckedOrder.value : orderState.type,
      sense: inputCheckedSence ? inputCheckedSence.value : orderState.sense
    }))
  }

  return (
    <div className={style.Order}>
      <p>Ordenar por: </p>

      <div>
        <label htmlFor='inputOrderAbc'>Alfabeticamente</label>
        <input type='radio' name='inputOrder' value='abc' id='inputOrderAbc' />
        <br />
        <label htmlFor='inputOrderWeight'>Peso</label>
        <input type='radio' name='inputOrder' value='weight' id='inputOrderWeight' />
      </div>

      <div className={style.sentido}>
        <p>Sentido: </p>
        <label htmlFor='inputOrderAsc'>Ascendente</label>
        <input type='radio' id='inputOrderAsc' name='inputOrderSence' value='asc' />
        <br />
        <label htmlFor='inputOrderDes'>Descendente</label>
        <input type='radio' id='inputOrderDes' name='inputOrderSence' value='des' />
      </div>

      <button onClick={orderDispatch} className={style.botonOrdenar}>Ordenar</button>
    </div>
  )
}

export default Order
