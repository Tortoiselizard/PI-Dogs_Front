import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import DropdownMenu from '../DropdownMenu/DropdownMenu'
import { getDogDetail, cleanDetail, getAllTemperaments } from '../../redux/actions/index'
import { validate, allGood, prepareRequest } from '../../controllers/controllers'
import style from './DogDetail.module.css'

const PATH = 'http://localhost:3001'
// const PATH = 'https://pi-dogs-back-90f5.onrender.com'

function DogDetail () {
  const { dogDetail, temperaments } = useSelector(state => state)

  const { razaPerro } = useParams()
  const dispatch = useDispatch()

  const [editMode, setEditMode] = useState(false)

  const [inputs, setInputs] = useState(false)

  const [errors, setErrors] = useState(false)

  const [refresh, setRefresh] = useState(true)

  useEffect(() => {
    dispatch(getDogDetail(razaPerro))
    dispatch(getAllTemperaments())
    return function () {
      dispatch(cleanDetail())
    }
  }, [razaPerro, dispatch])

  useEffect(() => {
    if (dogDetail[0]) {
      const name = razaPerro.split(' ').map(name => name[0].toUpperCase() + name.slice(1).toLowerCase()).join(' ')
      fetch(`${PATH}/dogs/${name}?location=API`)
        .then(async (response) => {
          if (!response.ok) {
            const errorMessage = await response.text()
            throw new Error(errorMessage)
          }
          return response.json()
        })
        .then(data => {
          if (data.message) {
            const dataTemperaments = dogDetail[0].temperament.split(', ')
            const dataDog = {
              name: dogDetail[0].name,
              height: { min: dogDetail[0].height.split('-')[0].trim(), max: dogDetail[0].height.split('-')[1].trim() },
              weight: { min: dogDetail[0].weight.split('-')[0].trim(), max: dogDetail[0].weight.split('-')[1].trim() },
              lifeSpan: dogDetail[0].lifeSpan
                ? { min: dogDetail[0].lifeSpan.split('-')[0].trim(), max: dogDetail[0].lifeSpan.split('-')[1].trim() }
                : { min: '', max: '' },
              image: dogDetail[0].image,
              temperament: temperaments.filter(t => dataTemperaments.includes(t.name))
            }
            setInputs(dataDog)
            const newErrors = validate(dataDog)
            setErrors(newErrors)
          } else if (!data[0].image) {
            setInputs({
              image: dogDetail[0].image
            })
          }
        })
        .catch(error => alert(error.message))
    }
  }, [razaPerro, dogDetail, temperaments])

  function changeEditMode () {
    setEditMode(editMode => !editMode)
  }

  function handleInputs (event) {
    const { value, name } = event.target
    const nameArray = name.split(' ')
    let newInputs
    switch (nameArray[0]) {
      case 'image': {
        newInputs = {
          ...inputs,
          image: value
        }
        break
      }
      case 'name': {
        newInputs = {
          ...inputs,
          name: value
        }
        break
      }
      case 'temperament': {
        newInputs = {
          ...inputs
        }
        break
      }
      case 'height': {
        newInputs = nameArray[1] === '0'
          ? {
              ...inputs,
              height: { ...inputs.height, min: value }
            }
          : {
              ...inputs,
              height: { ...inputs.height, max: value }
            }
        break
      }
      case 'weight': {
        newInputs = nameArray[1] === '0'
          ? {
              ...inputs,
              weight: { ...inputs.weight, min: value }
            }
          : {
              ...inputs,
              weight: { ...inputs.weight, max: value }
            }
        break
      }
      case 'years': {
        newInputs = nameArray[1] === '0'
          ? {
              ...inputs,
              lifeSpan: { ...inputs.lifeSpan, min: value }
            }
          : {
              ...inputs,
              lifeSpan: { ...inputs.lifeSpan, max: value }
            }
        break
      }
      default: {
        newInputs = {
          ...inputs
        }
        break
      }
    }
    setInputs(newInputs)
    const newErrors = validate(newInputs)
    setErrors(newErrors)
  }

  function addTemperament () {
    const input = document.getElementsByName('inputFilter')[0]
    const temperamentName = input.value
    const temperamentObject = temperaments.filter(t => t.name === temperamentName)[0]
    if (temperamentObject) {
      if (!inputs.temperament.filter(t => t.name === temperamentName).length) {
        setInputs(inputs => ({
          ...inputs,
          temperament: [...inputs.temperament, temperamentObject]
        }))
      } else {
        alert('Este temperamento ya fue agregado')
      }
    } else {
      alert('Este temperamento no existe')
    }
  }

  function popTemperament (event) {
    const id = event.target.name.slice(16)
    setInputs(inputs => {
      const temperament = [...inputs.temperament]
      temperament.splice(id, 1)
      return {
        ...inputs,
        temperament
      }
    })
    setRefresh(true)
  }

  function sendUpdate () {
    // const errors = validate(inputs)
    // console.log(errors)
    // event.preventDefault()
    const errorsObj = validate(inputs)
    // setErrors(errorsObj)
    if (allGood(errorsObj)) {
      const { data } = prepareRequest(inputs, dogDetail[0].id, 'PUT')

      fetch(`${PATH}/dogs`, data)
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          alert(data.message)
          dispatch(getDogDetail(razaPerro))
          setEditMode(false)
        })
        .catch(error => {
          alert(error.message)
        })
    } else {
      alert('Debes corregir los errores antes de crear el nuevo perro')
    }
  }

  return (
    <div>
      {Object.keys(dogDetail).length
        ? (
          <div className={style.DogDetail}>
            {/* Image */}
            <label>
              <img className={style.imagen} src={dogDetail[0].image} alt={dogDetail.name} />
              {
                editMode && inputs.image && <input onChange={handleInputs} name='image' value={inputs.image} />
              }
              {
                errors && <p className={style.danger}>{errors.image}</p>
              }
            </label>
            <div>
              {/* Name */}
              {
                editMode && inputs.name ? <input onChange={handleInputs} name='name' value={inputs.name} /> : <h1 className={style.name}>{dogDetail[0].name}</h1>
              }
              {
                errors && <p className={style.danger}>{errors.name}</p>
              }
              {/* Height */}
              <label className={style.alto}>
                <span>Height (In):</span>
                {
                  editMode && inputs.height
                    ? Object.values(inputs.height).map((value, index) => (
                      <input onChange={handleInputs} name={`height ${index}`} value={value} key={`height: ${index}`} />
                    ))
                    : <p>{dogDetail[0].height}</p>
                }
                {
                  errors && <p>{errors.height.min}</p>
                }
                {
                  errors && <p>{errors.height.max}</p>
                }
              </label>
              {/* Weight */}
              <label className={style.peso}>
                <span>Weight (Lb): </span>
                {
                  editMode && inputs.weight
                    ? Object.values(inputs.weight).map((value, index) => (
                      <input onChange={handleInputs} name={`weight ${index}`} value={value} key={`weight: ${index}`} />
                    ))
                    : <p>{dogDetail[0].weight}</p>
                }
                {
                  errors && <p>{errors.weight.min}</p>
                }
                {
                  errors && <p>{errors.weight.max}</p>
                }
              </label>
              {/* Years */}
              <label className={style.years}>
                <span>years: </span>
                {
                  editMode && inputs.lifeSpan
                    ? Object.values(inputs.lifeSpan).map((value, index) => (
                      <input onChange={handleInputs} name={`years ${index}`} value={value} key={`lifeSpan: ${index}`} />
                    ))
                    : <p>{dogDetail[0].lifeSpan}</p>
                }
                {
                  errors && <p>{errors.lifeSpan.min}</p>
                }
                {
                  errors && <p>{errors.lifeSpan.max}</p>
                }
              </label>
              {/* Temperaments */}
              <label className={style.temperamentos}>
                <span>Temperaments:</span>
                {
                editMode ? <DropdownMenu refresh={{ refresh, setRefresh }} temperaments={temperaments} action={addTemperament} alreadyAdded={inputs.temperament.map(temperament => temperament.name)} /> : <p>{dogDetail[0].temperament}</p>
              }
              </label>
              <div>
                {
                  editMode && inputs && inputs.temperament && inputs.temperament.map(temperament => temperament.name).map((temperament, index) => (
                    <span key={`labelTemperament${index}`} className={style.divTemperamentoAnadido}>

                      <label name={`temperamentAdded${index}`}>{temperament}</label>
                      <button onClick={popTemperament} name={`temperamentAdded${index}`} className={style.botonCerrarTemperamento}>x</button>
                    </span>))
              }
              </div>
              {/* Button Edit */}
              {
                inputs && <button onClick={changeEditMode}>{editMode ? 'Show' : 'Edit'}</button>
              }
              {
                editMode && <button onClick={sendUpdate}>Update</button>
              }
            </div>
          </div>)
        : null}
    </div>
  )
};

export default DogDetail
