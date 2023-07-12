import { useState, useEffect } from 'react'

import style from './DropdownMenu.module.css'

function DropdownMenu ({ refresh, temperaments, action, alreadyAdded }) {
  const [input, setInput] = useState('')

  const [possibleTemperaments, setPossibleTemperaments] = useState([])
  useEffect(() => {
    if (refresh.refresh && temperaments.length) {
      setPossibleTemperaments(temperaments.map(temperament => temperament.name))
      refresh.setRefresh(false)
    }
  }, [temperaments, refresh])

  useEffect(() => {
    if (alreadyAdded && possibleTemperaments.length) {
      handleAlreadyAdded()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alreadyAdded])

  function handleInput (value) {
    setInput(value)
  }

  function selectTemperament (event) {
    const value = event.target.innerText
    setInput(value)
    const input = document.getElementsByName('inputFilter')[0]
    input.focus()
  }

  function addTemperament () {
    const input = document.getElementsByName('inputFilter')[0]
    console.log(input)
    console.log(input.value)
    if (!input.value) return null
    action()
    handleInput('')
    const newArraytemperaments = [...possibleTemperaments]
    newArraytemperaments.splice(possibleTemperaments.indexOf(input), 1)
    setPossibleTemperaments(newArraytemperaments)
  }

  function handleAlreadyAdded () {
    const newArraytemperaments = temperaments.map(t => t.name)
    alreadyAdded.forEach(temp => {
      newArraytemperaments.splice(newArraytemperaments.indexOf(temp), 1)
    })
    setPossibleTemperaments(newArraytemperaments)
  }

  return (
    <div className={style.DropdownMenu}>
      <div className={style.dropDownMenuOptionsContainer}>
        <input onKeyPress={(event) => { if (event.key === 'Enter') addTemperament() }} className={style.inputAddTemperament} type='text' placeholder='temperament...' name='inputFilter' value={input} onChange={(event) => { handleInput(event.target.value) }} />
        {
        input && possibleTemperaments.filter(temperament => temperament.toLowerCase().includes(input.toLocaleLowerCase())).length && possibleTemperaments.filter(temperament => temperament.toLowerCase().includes(input.toLocaleLowerCase()))[0].toLowerCase() !== input.toLowerCase()
          ? possibleTemperaments.filter(temperament => temperament.toLowerCase().includes(input.toLocaleLowerCase())).map((temperament, index) => (
            <label onClick={selectTemperament} key={`temperament${index}`}>{temperament}</label>
          ))
          : null
      }
      </div>
      <button onClick={addTemperament} className={style.botonAddTemperament}>+</button>
    </div>
  )
}

export default DropdownMenu
