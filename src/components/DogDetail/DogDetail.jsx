import { useEffect, useState, useRef } from 'react'
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

  const [inputEnabled, setInputEnabled] = useState(false)

  // Cargar información del detalle del perro proveniente de servidor
  useEffect(() => {
    dispatch(getDogDetail(razaPerro))
    return function () {
      dispatch(cleanDetail())
    }
  }, [razaPerro, dispatch])

  // Actualiando información para la respectiva modificación
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
          const dataTemperaments = store.dogDetail[0].temperament.split(', ')
          const dataDog = {
            name: store.dogDetail[0].name,
            height: { min: store.dogDetail[0].height.split('-')[0].trim(), max: store.dogDetail[0].height.split('-')[1].trim() },
            weight: { min: store.dogDetail[0].weight.split('-')[0].trim(), max: store.dogDetail[0].weight.split('-')[1].trim() },
            lifeSpan: store.dogDetail[0].lifeSpan
              ? {
                  min: store.dogDetail[0].lifeSpan.split('-')[0].trim(),
                  max: !store.dogDetail[0].lifeSpan.split('-')[1].includes('y')
                    ? store.dogDetail[0].lifeSpan.split('-')[1].trim()
                    : store.dogDetail[0].lifeSpan.split('-')[1].split('y')[0].trim()
                }
              : { min: '', max: '' },
            image: store.dogDetail[0].image,
            temperament: store.temperaments.filter(t => dataTemperaments.includes(t.name))
          }
          setInputs(dataDog)
          const newErrors = validate(dataDog)
          setErrors(newErrors)
          if (data.message) {
            setInputEnabled(dataDog)
          } else if (!data[0].image) {
            setInputEnabled({
              image: store.dogDetail[0].image
            })
          } else {
            setInputEnabled({})
          }
        })
        .catch(error => alert(error.message))
    }
  }, [razaPerro, store.dogDetail, store.temperaments])

  const firsTime = useRef(true)

  // Deshabilitar los inputs y botones correspondientes y volverlos todos visibles
  useEffect(() => {
    // Deshabilitar los inputs correspondientes
    const allInputs = document.querySelectorAll('input')
    allInputs.forEach(input => {
      if (!Object.keys(inputEnabled).includes(input.name.split(' ')[0]) && input.name !== 'inputFilter') {
        input.disabled = true
      }
    })

    // Deshabilitar los botones correspondientes
    if ((inputEnabled || !inputEnabled) && !inputEnabled.temperament) {
      const allButtons = document.querySelectorAll('button')
      allButtons.forEach(button => {
        if (button.name.includes('temperamentAdded')) {
          button.disabled = true
        }
      })
    }

    if (!firsTime.current && editMode) {
      const arrayContainers = ['alto', 'name', 'temperamentos', 'peso', 'lifeSpan']
      arrayContainers.forEach(id => {
        const elemento = document.getElementById(id)
        elemento.style.opacity = '1'
      })
    } else if (!firsTime.current) {
      const arrayContainers = ['alto', 'temperamentos', 'peso', 'lifeSpan']
      arrayContainers.forEach(id => {
        const elemento = document.getElementById(id)
        elemento.style.opacity = ''
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode])

  function changeEditMode () {
    setEditMode(editMode => !editMode)
    firsTime.current = false
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
      case 'lifeSpan': {
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
              <div className={style.containerInformation} style={{ backgroundImage: `url(${store.dogDetail[0].image})` }}>

                {/* Image */}
                <img src={store.dogDetail[0].image} alt={store.dogDetail.name} />
                {
                editMode && inputs.image && (
                  <div className={style.editImageContainer}>
                    <input className={inputEnabled && inputEnabled.image ? null : style.inputDisabled} onChange={handleInputs} name='image' value={inputs.image} />
                    {
                errors && editMode && <p className={style.danger}>{errors.image}</p>
              }
                  </div>)
              }
                {/* Name */}
                <div className={style.buttonName} />
                {
                editMode
                  ? (
                    <div id='name' className={style.containerName}>
                      <input onChange={handleInputs} className={inputEnabled && inputEnabled.name ? null : style.inputDisabled} name='name' value={inputs.name} />
                      {
                        errors && editMode && <p className={style.danger}>{errors.name}</p>
                      }
                    </div>)
                  : <h1 className={style.name}>{store.dogDetail[0].name}</h1>
              }

                {/* Height */}
                <div className={style.buttonHeight} />
                <div id='alto' className={style.alto}>
                  <h3>Height (In)</h3>
                  <div>
                    {
                      editMode && inputs.height
                        ? Object.values(inputs.height).map((value, index) => (
                          <div className={style.inputContainer} key={`heightContainer ${index}`}>
                            <input onChange={handleInputs} className={inputEnabled && inputEnabled.height ? null : style.inputDisabled} name={`height ${index}`} value={value} key={`height: ${index}`} />
                            {
                            errors && editMode && <p>{index === 0 ? errors.height.min : errors.height.max}</p>
                          }
                          </div>
                        ))
                        : <label>{store.dogDetail[0].height}</label>
                    }
                  </div>
                </div>
                {/* Weight */}
                <div className={style.buttonWeight} />
                <div id='peso' className={style.peso}>
                  <h3>Weight (Lb)</h3>
                  <div>
                    {
                    editMode && inputs.weight
                      ? Object.values(inputs.weight).map((value, index) => (
                        <div className={style.inputContainer} key={`weightContainer ${index}`}>
                          <input onChange={handleInputs} className={inputEnabled && inputEnabled.weight ? null : style.inputDisabled} name={`weight ${index}`} value={value} key={`weight: ${index}`} />
                          {
                            errors && editMode && <p>{index === 0 ? errors.weight.min : errors.weight.max}</p>
                          }
                        </div>
                      ))
                      : <label>{store.dogDetail[0].weight}</label>
                  }
                  </div>
                </div>
                {/* Years */}
                <div className={style.buttonYears} />
                <div id='lifeSpan' className={style.lifeSpan}>
                  <h3>Years</h3>
                  <div>
                    {
                      editMode && inputs.lifeSpan
                        ? Object.values(inputs.lifeSpan).map((value, index) => (
                          <div className={style.inputContainer} key={`lifeSpanContainer ${index}`}>
                            <input onChange={handleInputs} className={inputEnabled && inputEnabled.lifeSpan ? null : style.inputDisabled} name={`lifeSpan ${index}`} value={value} key={`lifeSpan: ${index}`} />
                            {
                              errors && editMode && <p>{index === 0 ? errors.lifeSpan.min : errors.lifeSpan.max}</p>
                            }
                          </div>
                        ))
                        : <label>{store.dogDetail[0].lifeSpan}</label>
                    }
                  </div>
                </div>
                {/* Temperaments */}
                <div className={style.buttonTemperaments} />
                <div id='temperamentos' className={style.temperamentos}>
                  <h3>Temperaments:</h3>
                  <div className={style.containerTemperamentos_Input}>
                    {
                      editMode && inputEnabled.temperament ? <DropdownMenu refresh={{ refresh, setRefresh }} temperaments={store.temperaments} action={addTemperament} alreadyAdded={inputs.temperament.map(temperament => temperament.name)} /> : <label>{store.dogDetail[0].temperament}</label>
                    }
                    <div className={style.contianerOptionsTemperaments}>
                      {
                        editMode && inputs && inputs.temperament && inputs.temperament.map(temperament => temperament.name).map((temperament, index) => (
                          <div key={`labelTemperament${index}`} className={style.divTemperamentoAnadido}>
                            <label name={`temperamentAdded${index}`}>{temperament}</label>
                            <button onClick={popTemperament} name={`temperamentAdded${index}`} className={style.botonCerrarTemperamento}>x</button>
                          </div>))
                      }
                    </div>
                  </div>
                </div>
              </div>
              <div>

                {/* Button Edit */}
                {
                inputs && <button onClick={changeEditMode} className={style.buttonToUpdate}>{editMode ? 'Show' : 'Edit'}</button>
              }
                {
                editMode && <button onClick={sendUpdate} className={style.buttonToUpdate}>Update</button>
              }
              </div>
            </div>)
          : null}
      </main>
    </div>
  )
};

export default DogDetail
