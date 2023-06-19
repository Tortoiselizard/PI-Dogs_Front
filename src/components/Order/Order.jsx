import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { orderAlfabetic, orderAlfabeticTotal, orderWeight, orderWeightTotal, updateOrder } from '../../redux/actions/index'

import style from './Order.module.css'

const regNumber = /[^0-9-. ]/

function Order () {
  const { dogs, order, totaDogs } = useSelector(state => state)

  const dispatch = useDispatch()

  const [typeOrder, setTypeOrder] = useState(() => order.type ? order : { type: '' })

  useEffect(() => {
    orderDispatch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeOrder])

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
    const orderSelected = document.getElementById('selectOrder')
    const data = [...dogs]

    if (orderSelected.value === 'Mayor peso' || orderSelected.value === 'Menor peso') {
      let sortData = mergeSort(data)
      let sortTotalDgos = mergeSort(totaDogs)

      sortData = orderSelected.value === 'Mayor peso' ? sortData.reverse() : sortData
      sortTotalDgos = orderSelected.value === 'Mayor peso' ? sortTotalDgos.reverse() : sortTotalDgos

      dispatch(orderWeight(sortData))
      dispatch(orderWeightTotal(sortTotalDgos))
    } else if (orderSelected.value === 'A-Z' || orderSelected.value === 'Z-A') {
      let sortData = [...dogs]
      let sortTotalDgos = [...totaDogs]

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

      sortData = orderSelected.value === 'Z-A' ? sortData.reverse() : sortData
      sortTotalDgos = orderSelected.value === 'Z-A' ? sortTotalDgos.reverse() : sortTotalDgos

      dispatch(orderAlfabetic(sortData))
      dispatch(orderAlfabeticTotal(sortTotalDgos))
    }
    dispatch(updateOrder({
      type: orderSelected.value
    }))
  }

  function handleOrder (event) {
    setTypeOrder(event.target.value)
  }

  return (
    <div className={style.Order}>
      <p>Ordenar por: </p>

      <select onChange={handleOrder} id='selectOrder'>
        <option value='A-Z'>A - Z</option>
        <option value='Z-A'>Z - A</option>
        <option value='Mayor peso'>Mayor peso</option>
        <option value='Menor peso'>Menor peso</option>
      </select>
    </div>
  )
}

export default Order
