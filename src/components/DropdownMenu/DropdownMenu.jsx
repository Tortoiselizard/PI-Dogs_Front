import { useState } from 'react'

import style from './DropdownMenu.module.css'

function DropdownMenu ({ temperaments, action }) {
  const [input, setInput] = useState('')

  function handleInput (event) {
    const { value } = event.target
    setInput(value)
  }

  function selectTemperament (event) {
    const value = event.target.innerText
    setInput(value)
  }

  return (
    <div className={style.DropdownMenu}>
      <input onKeyPress={(event) => { if (event.key === 'Enter') action() }} className={style.inputAddTemperament} type='text' placeholder='temperamento...' name='inputFilter' value={input} onChange={handleInput} />
      {
        input && temperaments.filter(temperament => temperament.toLowerCase().includes(input.toLocaleLowerCase())).length && temperaments.filter(temperament => temperament.toLowerCase().includes(input.toLocaleLowerCase()))[0].toLowerCase() !== input.toLowerCase()
          ? temperaments.filter(temperament => temperament.toLowerCase().includes(input.toLocaleLowerCase())).map((temperament, index) => (
            <label onClick={selectTemperament} key={`temperament${index}`}>{temperament}</label>
          ))
          : null
      }
    </div>
  )
}

export default DropdownMenu
