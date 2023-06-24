import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import DropdownMenu from '../DropdownMenu/DropdownMenu'
import * as actions from './../../redux/actions/index'
import { validate, allGood, prepareRequest, restartState } from '../../controllers/controllers'

import style from './CreateDog.module.css'

const PATH = 'http://localhost:3001'
// const PATH = 'https://pi-dogs-back-90f5.onrender.com'

const initialStateInputs = {
  name: '',
  height: { min: '', max: '' },
  weight: { min: '', max: '' },
  lifeSpan: { min: '', max: '' },
  image: '',
  temperaments: []
}

const initialStateErrors = {
  name: '',
  height: { min: '', max: '' },
  weight: { min: '', max: '' },
  lifeSpan: { min: '', max: '' },
  image: ''
}

const CreateDog = () => {
  const [inputs, setInputs] = useState({
    name: '',
    height: { min: '', max: '' },
    weight: { min: '', max: '' },
    lifeSpan: { min: '', max: '' },
    image: '',
    temperaments: []
  })
  const [errors, setErrors] = useState({
    name: '',
    height: { min: '', max: '' },
    weight: { min: '', max: '' },
    lifeSpan: { min: '', max: '' },
    image: ''
  })

  const [refresh, setRefresh] = useState(true)

  const [whatShow, setWhatShow] = useState(false)

  const [dogFinded, setDogFinded] = useState({})

  const temperamentsGS = useSelector((state) => state.temperaments)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(actions.getAllTemperaments())
  }, [dispatch])

  useEffect(() => {
    if (whatShow === 'image') {
      const arrayTemperamentsFrom = dogFinded.temperament.split(', ')
      const arrayTemperamentsTo = temperamentsGS.filter(t => { return arrayTemperamentsFrom.includes(t.name) })
      const height = { min: dogFinded.height.split('-')[0].trim(), max: dogFinded.height.split('-')[1].trim() }
      const weight = { min: dogFinded.weight.split('-')[0].trim(), max: dogFinded.weight.split('-')[1].trim() }
      const lifeSpan = { min: dogFinded.lifeSpan.split('-')[0].trim(), max: dogFinded.lifeSpan.split('-')[1].split('years')[0].trim() }
      const newDog = {
        name: dogFinded.name,
        height,
        weight,
        lifeSpan,
        image: '',
        temperaments: arrayTemperamentsTo
      }
      setInputs(newDog)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dogFinded])

  function handleChange (event) {
    setInputs((inputs) => {
      if (event.target.name.slice(-3) === 'min' || event.target.name.slice(-3) === 'max') {
        return {
          ...inputs,
          [event.target.name.split('-')[0]]: {
            ...inputs[event.target.name.split('-')[0]],
            [event.target.name.split('-')[1]]: event.target.value
          }
        }
      } else {
        return { ...inputs, [event.target.name]: event.target.value }
      }
    })
    setErrors(() => {
      if (event.target.name.slice(-3) === 'min' || event.target.name.slice(-3) === 'max') {
        return validate({
          ...inputs,
          [event.target.name.split('-')[0]]: {
            ...inputs[event.target.name.split('-')[0]],
            [event.target.name.split('-')[1]]: event.target.value
          }
        })
      } else {
        return validate({ ...inputs, [event.target.name]: event.target.value })
      }
    })
  }

  function addTemperament () {
    const input = document.getElementsByName('inputFilter')[0]
    const temperament = input.value
    const temperamentObject = temperamentsGS.filter(t => t.name === temperament)[0]
    if (temperamentObject) {
      if (!inputs.temperaments.filter(t => t.name === temperament).length) {
        setInputs(inputs => ({
          ...inputs,
          temperaments: [...inputs.temperaments, temperamentObject]
        }))
      } else {
        alert('Este temperamento no existe')
      }
    } else {
      alert('Este temperamento no existe')
    }
  }

  function popTemperament (event) {
    const id = event.target.name.slice(16)
    setInputs(inputs => {
      const temperaments = [...inputs.temperaments]
      temperaments.splice(id, 1)
      return {
        ...inputs,
        temperaments
      }
    })
    setRefresh(true)
  }

  async function handleSubmit (event) {
    event.preventDefault()
    const errorsObj = validate(inputs)
    setErrors(errorsObj)

    if (allGood(errorsObj)) {
      const { data } = prepareRequest(inputs, undefined, 'POST')

      const response = await fetch(`${PATH}/dogs`, data)
        .then((data) => data.json())
        .then(data => data)
        .catch(error => error.message)
      if (typeof (response) === 'string') { return alert(response) } else {
        alert(`La raza de perro ${inputs.name} fue creada exitosamente`)

        restartState(initialStateInputs, setInputs)
        restartState(initialStateErrors, setErrors)
        setWhatShow(false)
        setDogFinded({})
        setRefresh(true)
      }
    } else {
      alert('Debes corregir los errores antes de crear el nuevo perro')
    }
  }

  function searchDog () {
    const newName = inputs.name.split(' ').map(name => name[0].toUpperCase() + name.slice(1).toLowerCase()).join(' ')
    fetch(`${PATH}/dogs/${newName}`)
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text()
          throw new Error(errorMessage)
        }
        return response.json()
      })
      .then(data => {
        if (data.message) {
          setWhatShow('form')
        } else if (data[0].image) {
          alert(`El perro ${newName} ya existe`)
        } else {
          setWhatShow('image')
          setDogFinded(data[0])
        }
      })
      .catch(error => alert(error))
    const inputName = document.getElementsByName('name')[0]
    inputName.disabled = true
  }

  function changeName () {
    const inputName = document.getElementsByName('name')[0]
    inputName.disabled = false
    setWhatShow(false)
  }

  return (
    <div className={style.CreateDog}>
      <h1>Create a new dog</h1>

      <div className={style.seccioName}>
        <label>Nombre de la Raza : </label>
        <input onKeyPress={(event) => { if (event.key === 'Enter') searchDog() }} className={errors.name && style.warning} onChange={handleChange} value={inputs.name} name='name' type='text' placeholder='Escribe el nombre...' />

        <p className={style.danger}>{errors.name}</p>
      </div>

      {
        whatShow === false ? <button onClick={searchDog}>Search</button> : <button onClick={changeName}>Change Name</button>
      }

      {
        whatShow === 'form' &&
           (
             <>
               <div className={style.secciones}>
                 <label>Altura</label>

                 <span>min (cm) : </span>
                 <input className={errors.height.min && style.warning} onChange={handleChange} value={inputs.height.min} name='height-min' type='text' placeholder='altura minima...' />

                 <span>max (cm) : </span>
                 <input className={errors.height.max && style.warning} onChange={handleChange} value={inputs.height.max} name='height-max' type='text' placeholder='altura máxima...' />

                 <p>{errors.height.min}</p>
                 <p>{errors.height.max}</p>

               </div>

               <div className={style.secciones}>
                 <label>Peso</label>

                 <span>min (kg) : </span>
                 <input className={errors.weight.min && style.warning} onChange={handleChange} value={inputs.weight.min} name='weight-min' type='text' placeholder='peso minimo...' />

                 <span>max (kg) : </span>
                 <input className={errors.weight.max && style.warning} onChange={handleChange} value={inputs.weight.max} name='weight-max' type='text' placeholder='peso minimo...' />

                 <p>{errors.weight.min}</p>
                 <p>{errors.weight.max}</p>

               </div>

               <div className={style.secciones}>
                 <label>Años de vida</label>

                 <span>min :</span>
                 <input className={errors.lifeSpan.min && style.warning} onChange={handleChange} value={inputs.lifeSpan.min} name='lifeSpan-min' type='text' placeholder='edad mínima...' />

                 <span>max :</span>
                 <input className={errors.lifeSpan.max && style.warning} onChange={handleChange} value={inputs.lifeSpan.max} name='lifeSpan-max' type='text' placeholder='edad máxima...' />

                 <p>{errors.lifeSpan.min}</p>
                 <p>{errors.lifeSpan.max}</p>

               </div>
             </>
           )
      }
      {
        (whatShow === 'image' || whatShow === 'form') && (
          <>
            <div className={style.secconImagen}>
              <label>Imagen</label>
              <input className={errors.image && style.warning} onChange={handleChange} value={inputs.image} name='image' type='text' placeholder='URL...' />
              <p className={style.danger}>{errors.image}</p>
            </div>
          </>
        )
      }
      {
        whatShow === 'form' && (
          <>
            <div className={style.seccionTemperamentos}>
              <label>Temperamentos</label>

              <div className={style.seccionTemperamentosInputContainer}>
                <DropdownMenu refresh={{ refresh, setRefresh }} temperaments={temperamentsGS} action={addTemperament} />
              </div>
              <div>
                {
                  inputs.temperaments.map(temperament => temperament.name).map((temperament, index) => (
                    <span key={index} className={style.divTemperamentoAnadido}>

                      <label name={`temperamentAdded${index}`}>{temperament}  </label>
                      <button onClick={popTemperament} name={`temperamentAdded${index}`} className={style.botonCerrarTemperamento}>x</button>
                    </span>))
              }
              </div>
            </div>
          </>
        )
      }
      {
        (whatShow === 'image' || whatShow === 'form') && <button className={style.botonCreateDog} type='submit' onClick={handleSubmit} />
      }

    </div>
  )
}

export default CreateDog
