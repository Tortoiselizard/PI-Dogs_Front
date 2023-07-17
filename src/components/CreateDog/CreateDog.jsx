import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'

import Nav from '../Nav/Nav'
import DropdownMenu from '../DropdownMenu/DropdownMenu'
import Loading from '../Loading/Loading'
import { validate, allGood, prepareRequest, restartState, getAllDogs2 } from '../../controllers/controllers'

import style from './CreateDog.module.css'
import smallDog from '../../img/smallDog.png'
import mediumDog from '../../img/mediumDog.png'
import bigDog from '../../img/bigDog2.png'
import defaultDog from '../../img/defaultDog.png'

const PATH = 'http://localhost:3001'
// const PATH = 'https://pi-dogs-back-90f5.onrender.com'

const initialStateInputs = {
  name: '',
  height: { min: '', max: '' },
  weight: { min: '', max: '' },
  lifeSpan: { min: '', max: '' },
  image: '',
  temperament: []
}

const initialStateErrors = {
  name: '',
  height: { min: '', max: '' },
  weight: { min: '', max: '' },
  lifeSpan: { min: '', max: '' },
  image: ''
}

const CreateDog = ({ store }) => {
  const [inputs, setInputs] = useState(initialStateInputs)
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

  const [dogDetail, setDogDetail] = useState(false)

  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    if (whatShow === 'image') {
      const arrayTemperamentsFrom = dogFinded.temperament.split(', ')
      const arrayTemperamentsTo = store.temperaments.filter(t => { return arrayTemperamentsFrom.includes(t.name) })
      const height = { min: dogFinded.height.split('-')[0].trim(), max: dogFinded.height.split('-')[1].trim() }
      const weight = { min: dogFinded.weight.split('-')[0].trim(), max: dogFinded.weight.split('-')[1].trim() }
      const lifeSpan = { min: dogFinded.lifeSpan.split('-')[0].trim(), max: dogFinded.lifeSpan.split('-')[1].split('years')[0].trim() }
      const newDog = {
        name: dogFinded.name,
        height,
        weight,
        lifeSpan,
        image: '',
        temperament: arrayTemperamentsTo
      }
      setInputs(newDog)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dogFinded])

  const updateTotaDogs = useRef(false)

  // Actualiza la lista con el nuevo perro creado
  useEffect(() => {
    if (updateTotaDogs.current) {
      dispatch(getAllDogs2(null, setLoading))
      updateTotaDogs.current(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateTotaDogs.current])

  function handleChange (event) {
    const { name, value } = event.target
    let newInputs
    if (name.slice(-3) === 'min' || name.slice(-3) === 'max') {
      newInputs = {
        ...inputs,
        [name.split('-')[0]]: {
          ...inputs[name.split('-')[0]],
          [name.split('-')[1]]: value
        }
      }
    } else {
      newInputs = { ...inputs, [name]: value }
    }
    setInputs(newInputs)
    setErrors(validate(newInputs))
    setDogDetail(changeDogDetail(newInputs))
  }

  function addTemperament () {
    const input = document.getElementsByName('inputFilter')[0]
    const temperament = input.value
    const temperamentObject = store.temperaments.filter(t => t.name === temperament)[0]
    let newInputs
    if (temperamentObject) {
      if (!inputs.temperament.filter(t => t.name === temperament).length) {
        newInputs = {
          ...inputs,
          temperament: [...inputs.temperament, temperamentObject]
        }
        setInputs(newInputs)
        setDogDetail(changeDogDetail(newInputs))
      } else {
        alert('This temperament has already been added')
      }
    } else {
      alert('This temperament does not exist')
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

  async function handleSubmit (event) {
    event.preventDefault()
    const errorsObj = validate(inputs)
    setErrors(errorsObj)
    if (whatShow === 'image' && !inputs.image) {
      return alert('You must add an image')
    }

    if (allGood(errorsObj)) {
      const { data } = prepareRequest(inputs, undefined, 'POST')

      const response = await fetch(`${PATH}/dogs`, data)
        .then(data => data.json())
        .then(data => data)
        .catch(error => error.message)
      if (typeof (response) === 'string') { return alert(response) } else {
        alert(`The ${inputs.name} dog breed was successfully created`)

        restartState(initialStateInputs, setInputs)
        restartState(initialStateErrors, setErrors)
        setWhatShow(false)
        setDogFinded({})
        setRefresh(true)
        const inputName = document.getElementsByName('name')[0]
        inputName.disabled = ''
        updateTotaDogs.current = true
      }
    } else {
      alert('You must correct the errors before creating the new dog')
    }
  }

  function searchDog () {
    const newName = inputs.name.split(' ').map(name => name[0].toUpperCase() + name.slice(1).toLowerCase()).join(' ')
    fetch(`${PATH}/dogs/${newName}?location=DB`)
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text()
          throw new Error(errorMessage)
        }
        return response.json()
      })
      .then(data => {
        if (data.message) {
          fetch(`${PATH}/dogs/${newName}?location=API`)
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
                setInputs(inputs => ({
                  ...inputs,
                  name: newName
                }))
                setDogDetail(dogDetail => ({
                  ...dogDetail,
                  name: newName
                }))
                const inputName = document.getElementsByName('name')[0]
                inputName.disabled = true
              } else if (data[0].image) {
                alert(`El perro ${newName} ya existe`)
              } else {
                setWhatShow('image')
                setDogFinded(data[0])
                setDogDetail(data[0])
                const inputName = document.getElementsByName('name')[0]
                inputName.disabled = true
              }
            })
        } else {
          alert(`El perro ${newName} ya existe`)
        }
      })
      .catch(error => alert(error))
  }

  function changeName () {
    const inputName = document.getElementsByName('name')[0]
    inputName.disabled = false
    setWhatShow(false)
    setDogDetail(false)
    setInputs(initialStateInputs)
  }

  function changeDogDetail (input) {
    let image
    if (input.image) {
      image = input.image
    } else {
      const maxWeight = input.weight.max
      if (maxWeight && !isNaN(Number(maxWeight))) {
        if (Number(input.weight.max) <= 25) {
          image = smallDog
        } else if (Number(input.weight.max) <= 75) {
          image = mediumDog
        } else if (Number(input.weight.max) > 75) {
          image = bigDog
        }
      } else {
        image = defaultDog
      }
    }
    return {
      name: input.name,
      image,
      height: `${input.height.min} - ${input.height.max}`,
      weight: `${input.weight.min} - ${input.weight.max}`,
      lifeSpan: `${input.lifeSpan.min} - ${input.lifeSpan.max}`,
      temperament: input.temperament.map(t => t.name).join(', ')
    }
  }

  return (
    <div className={style.backgroundCreateDog}>
      <main className={style.containerCreateDog}>
        <Nav />
        {/* Header */}
        <section className={style.headerCreateDog}>
          <h1>ADD A NEW DOG</h1>
        </section>
        {/* Contenedor de formulario y detalle de etiqueta */}
        <section className={style.contentCreateDog}>
          {/* Fomulario */}
          <div className={style.formCreateDog}>
            <h1>Dog information</h1>

            <div className={style.seccioName}>
              <label>Dog's name:</label>
              <div>
                <input onKeyPress={(event) => { if (event.key === 'Enter') searchDog() }} className={errors.name && style.warning} onChange={handleChange} value={inputs.name} name='name' type='text' placeholder='Write the name...' />
                <p className={style.danger}>{errors.name}</p>
              </div>

              {
        whatShow === false ? <button onClick={searchDog}>Search</button> : <button onClick={changeName}>Change Name</button>
      }
            </div>

            {
        whatShow === 'form' &&
           (
             <>
               <div className={style.secciones}>
                 <label>Height:</label>
                 <div>
                   <input className={errors.height.min && style.warning} onChange={handleChange} value={inputs.height.min} name='height-min' type='text' placeholder='Minimun...' />
                   <p>{errors.height.min}</p>
                 </div>
                 <div>
                   <input className={errors.height.max && style.warning} onChange={handleChange} value={inputs.height.max} name='height-max' type='text' placeholder='Maximum...' />
                   <p>{errors.height.max}</p>
                 </div>

               </div>

               <div className={style.secciones}>
                 <label>Weight:</label>

                 <div>
                   <input className={errors.weight.min && style.warning} onChange={handleChange} value={inputs.weight.min} name='weight-min' type='text' placeholder='Minimum...' />
                   <p>{errors.weight.min}</p>
                 </div>

                 <div>
                   <input className={errors.weight.max && style.warning} onChange={handleChange} value={inputs.weight.max} name='weight-max' type='text' placeholder='Maximum...' />
                   <p>{errors.weight.max}</p>
                 </div>

               </div>

               <div className={style.secciones}>
                 <label>Years of life:</label>

                 <div>
                   <input className={errors.lifeSpan.min && style.warning} onChange={handleChange} value={inputs.lifeSpan.min} name='lifeSpan-min' type='text' placeholder='Minimum...' />
                   <p>{errors.lifeSpan.min}</p>
                 </div>

                 <div>
                   <input className={errors.lifeSpan.max && style.warning} onChange={handleChange} value={inputs.lifeSpan.max} name='lifeSpan-max' type='text' placeholder='Maximum...' />
                   <p>{errors.lifeSpan.max}</p>
                 </div>

               </div>
             </>
           )
      }
            {
        (whatShow === 'image' || whatShow === 'form') && (
          <div className={style.seccionImage}>
            <label>Image:</label>
            <div>
              <input className={errors.image && style.warning} onChange={handleChange} value={inputs.image} name='image' type='text' placeholder='URL...' />
              <p className={style.danger}>{errors.image}</p>
            </div>
          </div>
        )
      }
            {
        whatShow === 'form' && (
          <>
            <div className={style.seccionTemperamentos}>
              <div className={style.containerTemperamentsSecction}>
                <label className={style.titleTemperamentsSection}>Temperamentos:</label>
                <DropdownMenu refresh={{ refresh, setRefresh }} temperaments={store.temperaments} action={addTemperament} />
              </div>
              <div className={style.containerTemperaments}>
                {
                  inputs.temperament.map(temperament => temperament.name).map((temperament, index) => (
                    <div key={index} className={style.divTemperamentoAnadido}>
                      <label name={`temperamentAdded${index}`}>{temperament}  </label>
                      <button onClick={popTemperament} name={`temperamentAdded${index}`} className={style.botonCerrarTemperamento}>x</button>
                    </div>))
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
          {/* Detalle de etiqueta */}
          {
        dogDetail && whatShow !== false
          ? (
            <div className={style.detailDogCreateDog}>
              {/* Image */}
              <div className={style.detailDogImageContainer} style={{ backgroundImage: `url(${dogDetail.image})` }} />
              <div className={style.containerData}>
                {/* Name */}
                <h1 className={style.detailDogCreateDogName}>{dogDetail.name || 'Name'}</h1>
                {/* Height */}
                <div className={style.alto}>
                  <label>Height (In):</label>
                  <p>{dogDetail.height}</p>
                </div>
                {/* Weight */}
                <div className={style.peso}>
                  <label>Weight (Lb):</label>
                  <p>{dogDetail.weight}</p>
                </div>
                {/* Years */}
                <div className={style.years}>
                  <label>years:</label>
                  <p>{dogDetail.lifeSpan}</p>
                </div>
                {/* Temperaments */}
                <div className={style.temperamentos}>
                  <label>Temperaments:</label>
                  <p>{dogDetail.temperament}</p>
                </div>
              </div>
            </div>)
          : null
      }
        </section>
      </main>
      <Loading loading={loading} />
    </div>
  )
}

export default CreateDog
