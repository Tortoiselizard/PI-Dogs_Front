import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getDogDetail, cleanDetail } from '../../redux/actions/index'
import style from './DogDetail.module.css'

const PATH = 'http://localhost:3001'
// const PATH = 'https://pi-dogs-back-90f5.onrender.com'

function DogDetail () {
  const dogDetail = useSelector(state => state.dogDetail)
  console.log('dogDetail', dogDetail)

  const { razaPerro } = useParams()
  const dispatch = useDispatch()

  const [editMode, setEditMode] = useState(false)

  const [inputs, setInputs] = useState(false)

  useEffect(() => {
    dispatch(getDogDetail(razaPerro))
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
            console.log('Fue creado desde cero')
            setInputs({
              name: dogDetail[0].name,
              height: { min: dogDetail[0].height.split('-')[0].trim(), max: dogDetail[0].height.split('-')[1].trim() },
              weight: { min: dogDetail[0].weight.split('-')[0].trim(), max: dogDetail[0].weight.split('-')[1].trim() },
              lifeSpan: dogDetail[0].lifeSpan && { min: dogDetail[0].lifeSpan.split('-')[0].trim(), max: dogDetail[0].lifeSpan.split('-')[1].trim() },
              image: dogDetail[0].image,
              temperaments: dogDetail[0].temperament.split(', ')
            })
          } else if (data[0].image) {
            console.log('Viene de la API y tienen imagen')
          } else {
            console.log('Vienen de la API pero no tiene imagen')
            setInputs({
              image: dogDetail[0].image
            })
          }
        })
        .catch(error => alert(error.message))
    }
  }, [razaPerro, dogDetail])

  function changeEditMode () {
    setEditMode(editMode => !editMode)
  }

  return (
    <div>
      {Object.keys(dogDetail).length
        ? (
          <div className={style.DogDetail}>
            <label>
              <img className={style.imagen} src={dogDetail[0].image} alt={dogDetail.name} />
              {
                editMode && inputs.image && <input value={inputs.image} />
              }
            </label>
            <div>
              <h1 className={style.name}>{dogDetail[0].name}</h1>
              <label className={style.temperamentos}>
                <span>Temperaments:</span>
                {
                  editMode && inputs.temperament ? <input value={dogDetail[0].temperament} /> : <p>{dogDetail[0].temperament}</p>
                }

              </label>
              <label className={style.alto}>
                <span>Height (In):</span>
                {
                  editMode && inputs.height ? inputs.height.min && <input value={dogDetail[0].height} /> : <p>{dogDetail[0].height}</p>
                }
              </label>
              <label className={style.peso}>
                <span>Weight (Lb): </span>
                {
                  editMode ? <input value={dogDetail[0].weight} /> : <p>{dogDetail[0].weight}</p>
                }
              </label>
              <label className={style.years}>
                <span>years: </span>
                {
                 editMode ? <input value={dogDetail[0].lifeSpan} /> : <p>{dogDetail[0].lifeSpan}</p>
                }
              </label>
              {
                inputs && <button onClick={changeEditMode}>{editMode ? 'Show' : 'Edit'}</button>
              }
            </div>
          </div>)
        : null}
    </div>
  )
};

export default DogDetail
