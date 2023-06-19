import { useState, useEffect } from 'react'

import style from './DropdownMenu.module.css'

function DropdownMenu ({ refresh, temperaments, action }) {
  const [input, setInput] = useState('')

  const [possibleTemperaments, setPossibleTemperaments] = useState([])

  useEffect(() => {
    if (refresh.refresh && temperaments.length) {
      setPossibleTemperaments(temperaments)
      refresh.setRefresh(false)
    }
  }, [temperaments, refresh])

  function handleInput (value) {
    setInput(value)
  }

  function selectTemperament (event) {
    const value = event.target.innerText
    setInput(value)
  }

  function addTemperament () {
    action()
    handleInput('')
    const newArraytemperaments = [...possibleTemperaments]
    newArraytemperaments.splice(possibleTemperaments.indexOf(input), 1)
    setPossibleTemperaments(newArraytemperaments)
  }

  return (
    <div className={style.DropdownMenu}>
      <div>
        <input onKeyPress={(event) => { if (event.key === 'Enter') addTemperament() }} className={style.inputAddTemperament} type='text' placeholder='temperamento...' name='inputFilter' value={input} onChange={(event) => { handleInput(event.target.value) }} />
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
