import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import Nav from '../Nav/Nav'
import DropdownMenu from '../DropdownMenu/DropdownMenu'
import { getDogDetail, cleanDetail } from '../../redux/actions/index'
import { validate, allGood, prepareRequest } from '../../controllers/controllers'
import style from './DogDetail.module.css'

const PATH = 'http://localhost:3001'
// const PATH = 'https://pi-dogs-back-90f5.onrender.com'

function DogDetail ({ store }) {
  const { razaPerro } = useParams()
  const dispatch = useDispatch()

  const [editMode, setEditMode] = useState(false)

  const [inputs, setInputs] = useState(false)

  const [errors, setErrors] = useState(false)

  const [refresh, setRefresh] = useState(true)

  useEffect(() => {
    dispatch(getDogDetail(razaPerro))
    return function () {
      dispatch(cleanDetail())
    }
  }, [razaPerro, dispatch])

  useEffect(() => {
    if (store.dogDetail[0]) {
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
            const dataTemperaments = store.dogDetail[0].temperament.split(', ')
            const dataDog = {
              name: store.dogDetail[0].name,
              height: { min: store.dogDetail[0].height.split('-')[0].trim(), max: store.dogDetail[0].height.split('-')[1].trim() },
              weight: { min: store.dogDetail[0].weight.split('-')[0].trim(), max: store.dogDetail[0].weight.split('-')[1].trim() },
              lifeSpan: store.dogDetail[0].lifeSpan
                ? { min: store.dogDetail[0].lifeSpan.split('-')[0].trim(), max: store.dogDetail[0].lifeSpan.split('-')[1].trim() }
                : { min: '', max: '' },
              image: store.dogDetail[0].image,
              temperament: store.temperaments.filter(t => dataTemperaments.includes(t.name))
            }
            setInputs(dataDog)
            const newErrors = validate(dataDog)
            setErrors(newErrors)
          } else if (!data[0].image) {
            setInputs({
              image: store.dogDetail[0].image
            })
          }
        })
        .catch(error => alert(error.message))
    }
  }, [razaPerro, store.dogDetail, store.temperaments])

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
    const temperamentObject = store.temperaments.filter(t => t.name === temperamentName)[0]
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
    const newErrors = validate(inputs)
    setErrors(newErrors)
    if (allGood(newErrors)) {
      const { data } = prepareRequest(inputs, store.dogDetail[0].id, 'PUT')

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
    <div className={style.background}>
      <main className={style.containerDogDetail}>
        <Nav />
        {Object.keys(store.dogDetail).length
          ? (
            <div className={style.DogDetail}>
              {/* Image */}
              <div className={style.containerInformation} style={{ backgroundImage: `url(${store.dogDetail[0].image})` }}>

                <img src={store.dogDetail[0].image} alt={store.dogDetail.name} />
                {
                editMode && inputs.image && <input onChange={handleInputs} name='image' value={inputs.image} />
              }
                {
                errors && editMode && <p className={style.danger}>{errors.image}</p>
              }
                {/* Name */}
                {
                editMode ? <input onChange={handleInputs} name='name' value={inputs.name} /> : <h1 className={style.name}>{store.dogDetail[0].name}</h1>
              }
                {/* Height */}
                <div className={style.alto}>
                  <h3>Height (In)</h3>
                  {
                  editMode && inputs.height
                    ? Object.values(inputs.height).map((value, index) => (
                      <input onChange={handleInputs} name={`height ${index}`} value={value} key={`height: ${index}`} />
                    ))
                    : <label>{store.dogDetail[0].height}</label>
                }
                  {
                  errors && editMode && <p>{errors.height.min}</p>
                }
                  {
                  errors && editMode && <p>{errors.height.max}</p>
                }
                </div>
                {/* Weight */}
                <div className={style.peso}>
                  <h3>Weight (Lb)</h3>
                  {
                  editMode && inputs.weight
                    ? Object.values(inputs.weight).map((value, index) => (
                      <input onChange={handleInputs} name={`weight ${index}`} value={value} key={`weight: ${index}`} />
                    ))
                    : <label>{store.dogDetail[0].weight}</label>
                }
                  {
                  errors && editMode && <p>{errors.weight.min}</p>
                }
                  {
                  errors && editMode && <p>{errors.weight.max}</p>
                }
                </div>
                {/* Years */}
                <div className={style.years}>
                  <h3>Years</h3>
                  {
                  editMode && inputs.lifeSpan
                    ? Object.values(inputs.lifeSpan).map((value, index) => (
                      <input onChange={handleInputs} name={`years ${index}`} value={value} key={`lifeSpan: ${index}`} />
                    ))
                    : <label>{store.dogDetail[0].lifeSpan}</label>
                }
                  {
                  errors && editMode && <p>{errors.lifeSpan.min}</p>
                }
                  {
                  errors && editMode && <p>{errors.lifeSpan.max}</p>
                }
                </div>
                {/* Temperaments */}
                <div className={style.temperamentos}>
                  <h3>Temperaments:</h3>
                  {
                editMode ? <DropdownMenu refresh={{ refresh, setRefresh }} temperaments={store.temperaments} action={addTemperament} alreadyAdded={inputs.temperament.map(temperament => temperament.name)} /> : <label>{store.dogDetail[0].temperament}</label>
              }
                </div>
              </div>
              <div>
                {
                errors && editMode && <p className={style.danger}>{errors.name}</p>
              }

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
      </main>
    </div>
  )
};

export default DogDetail
