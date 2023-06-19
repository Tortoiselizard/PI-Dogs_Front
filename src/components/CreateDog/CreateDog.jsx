import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import DropdownMenu from '../DropdownMenu/DropdownMenu'
import * as actions from './../../redux/actions/index'

import style from './CreateDog.module.css'

const regexName = /[^A-Za-zÁ-Úá-úñ ]/
const regexNumber = /[^0-9.]/
const regexURL = /^https:\/\/[^\0]+\.jpg|png$/
// const PATH = "http://localhost:3001"
const PATH = 'https://pi-dogs-back-90f5.onrender.com'

function validate (inputs) {
  const errors = {
    name: '',
    height: { min: '', max: '' },
    weight: { min: '', max: '' },
    lifeSpan: { min: '', max: '' },
    image: '',
    temperaments: ''
  }
  const { name, height, weight, lifeSpan, image } = inputs

  if (name[0] === ' ') { errors.name = 'El nombre debe comenzar por una letra' } else if (regexName.test(name)) { errors.name = 'El nombre solo puede contener letras y/o espacios' } else if (name.length < 3 || name.length > 20) { errors.name = 'El nombre debe estar comprendido entre 3-20 caracteres' }

  if (!height.min) { errors.height.min = 'Este espacio no puede estar vacio' } else if (regexNumber.test(height.min)) { errors.height.min = 'Debes escribir solo números en esta casilla' } else if (height.min <= 0) { errors.height.min = 'La altura mínima del perro no puede ser un número negativo o cero' }

  if (regexNumber.test(height.max)) { errors.height.max = 'Debes escribir solo números en esta casilla' } else if (height.max < 0) { errors.height.max = 'La altura máxima del perro no puede ser un número negativo' } else if (height.max !== '' && Number(height.min) >= Number(height.max)) { errors.height.max = 'La altura máxima no puede ser menor o igual a la altura mínima' }

  if (!weight.min) { errors.weight.min = 'Este espacio no puede estar vacio' } else if (regexNumber.test(weight.min)) { errors.weight.min = 'Debes escribir solo números en esta casilla' } else if (weight.min <= 0) { errors.weight.min = 'El peso mínimo del perro no puede ser un número negativo o cero' }

  if (regexNumber.test(weight.max)) { errors.weight.max = 'Debes escribir solo números en esta casilla' } else if (weight.max < 0) { errors.weight.max = 'El peso máxima del perro no puede ser un número negativo' } else if (weight.max !== '' && Number(weight.min) >= Number(weight.max)) { errors.weight.max = 'El peso máximo no puede ser menor o igual al peso mínimo' }

  if (regexNumber.test(lifeSpan.min) && lifeSpan.min.length) { errors.lifeSpan.min = 'Debes escribir solo números en esta casilla' } else if (lifeSpan.min < 0 || lifeSpan.min === '0') { errors.lifeSpan.min = 'Los años mínimos de vida del perro no puede ser un número negativo o cero' }

  if (regexNumber.test(lifeSpan.max) && lifeSpan.max.length) { errors.lifeSpan.max = 'Debes escribir solo números en esta casilla' } else if (lifeSpan.max < 0 || lifeSpan.max === '0') { errors.lifeSpan.max = 'Los años máximos de vida del perro no puede ser un número negativo' } else if (lifeSpan.max !== '' && Number(lifeSpan.min) >= Number(lifeSpan.max)) { errors.lifeSpan.max = 'La edad máxima no puede ser menor o igual a la edad mínima' }

  if (!regexURL.test(image) && image.length) { errors.image = 'Debe corresponder a una URL que comieza con https:// y termine con . seguido de cualquier formato de imagen' }

  return errors
}

const CreateDog = () => {
  const [inputs, setInputs] = React.useState({
    name: '',
    height: { min: '', max: '' },
    weight: { min: '', max: '' },
    lifeSpan: { min: '', max: '' },
    image: '',
    temperaments: []
  })
  const [errors, setErrors] = React.useState({
    name: '',
    height: { min: '', max: '' },
    weight: { min: '', max: '' },
    lifeSpan: { min: '', max: '' },
    image: '',
    temperaments: ''
  })

  const temperamentsGS = useSelector((state) => state.temperaments)
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(actions.getAllTemperaments())
  }, [dispatch])

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
    setErrors(errors => {
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

  async function addTemperament () {
    const input = document.getElementsByName('inputFilter')[0]
    const temperament = input.value
    if (temperamentsGS.includes(temperament)) {
      if (!inputs.temperaments.includes(temperament)) {
        setInputs(inputs => ({
          ...inputs,
          temperaments: [...inputs.temperaments, temperament]
        }))
        setErrors(erros => ({
          ...errors,
          temperaments: ''
        }))
        input.value = ''
      } else {
        setErrors(errors => ({
          ...errors,
          temperaments: 'Este temperamento ya fué anexado'
        }))
      }
    } else {
      setErrors(errors => ({
        ...errors,
        temperaments: 'Este temperamento no existe'
      }))
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
  }

  async function handleSubmit (event) {
    event.preventDefault()
    const errorsObj = validate(inputs)
    setErrors(errors => errorsObj)
    let allGood = true
    for (const error in errorsObj) {
      if (typeof (errorsObj[error]) === 'string') {
        if (errorsObj[error].length) {
          allGood = false
        }
      } else if (typeof (errorsObj[error]) === 'object') {
        if (errorsObj[error].min.length) {
          allGood = false
        }
        if (errorsObj[error].max.length) {
          allGood = false
        }
      }
    }
    if (allGood) {
      const newDog = {
        name: inputs.name.includes(' ')
          ? inputs.name.split(' ').map(nombre => nombre[0].toUpperCase() + nombre.slice(1).toLowerCase()).join(' ')
          : inputs.name[0].toUpperCase() + inputs.name.slice(1).toLowerCase(),
        height: inputs.height.min + (inputs.height.max ? ' - ' + inputs.height.max : ''),
        weight: inputs.weight.min + (inputs.weight.max ? ' - ' + inputs.weight.max : ''),
        lifeSpan: inputs.lifeSpan.min + (inputs.lifeSpan.max ? ' - ' + inputs.lifeSpan.max : ''),
        temperaments: inputs.temperaments.join(', '),
        image: inputs.image
      }
      const data = {
        method: 'Post',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(newDog)
      }

      const response = await fetch(`${PATH}/dogs`, data)
        .then((data) => data.json())
        .then(data => data)
        .catch(error => error.message)
      if (typeof (response) === 'string') { return alert(response) } else {
        alert(`La raza de perro ${inputs.name} fue creada exitosamente`)
        setInputs((inputs) => ({
          name: '',
          height: { min: '', max: '' },
          weight: { min: '', max: '' },
          lifeSpan: { min: '', max: '' },
          image: '',
          temperaments: []
        }))
        setErrors((errors) => ({
          name: '',
          height: { min: '', max: '' },
          weight: { min: '', max: '' },
          lifeSpan: { min: '', max: '' },
          image: '',
          temperaments: ''
        }))
      }
    } else {
      alert('Debes corregir los errores antes de crear el nuevo perro')
    }
  }

  return (
    <div className={style.CreateDog}>
      <h1>Create a new dog</h1>

      <div className={style.seccioName}>
        <label>Nombre de la Raza : </label>
        <input className={errors.name && style.warning} onChange={handleChange} value={inputs.name} name='name' type='text' placeholder='Escribe el nombre...' />

        <p className={style.danger}>{errors.name}</p>
      </div>

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

      <div className={style.secconImagen}>
        <label>Imagen</label>
        <input className={errors.image && style.warning} onChange={handleChange} value={inputs.image} name='image' type='text' placeholder='URL...' />
        <p className={style.danger}>{errors.image}</p>
      </div>

      <div className={style.seccionTemperamentos}>
        <label>Temperamentos</label>

        <div className={style.seccionTemperamentosInputContainer}>
          <DropdownMenu temperaments={temperamentsGS} action={addTemperament} />
        </div>
        <div>
          {
                    inputs.temperaments.map((temperament, index) => (
                      <span key={index} className={style.divTemperamentoAnadido}>

                        <label name={`temperamentAdded${index}`}>{temperament}  </label>
                        <button onClick={popTemperament} name={`temperamentAdded${index}`} className={style.botonCerrarTemperamento}>x</button>
                      </span>))
                }
        </div>
      </div>

      <button className={style.botonCreateDog} type='submit' onClick={handleSubmit} />
    </div>
  )
}

export default CreateDog
