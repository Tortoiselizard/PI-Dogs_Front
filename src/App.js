import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Routes } from 'react-router-dom'

import MainPage from './components/MainPage/MainPage.jsx'
import Home from './components/Home/Home.jsx'
import DogDetail from './components/DogDetail/DogDetail.jsx'
import CreateDog from './components/CreateDog/CreateDog'
import SlideComponents from './components/SlideComponents/SlideComponents.jsx'
import Loading from './components/Loading/Loading.jsx'

import { getAllTemperaments, getAllDogs2 } from './redux/actions/index.js'

import './App.css'

function App () {
  const dispatch = useDispatch()
  const { totaDogs, dogs, dogDetail, temperaments } = useSelector(state => state)
  const [sliding, setSliding] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleSliding (come, go) {
    setSliding({
      come,
      go
    })
  }

  // Hacer solicitudes a la DB para buscar los perros más populares
  useEffect(() => {
    dispatch(getAllDogs2(null, setLoading))
    dispatch(getAllTemperaments())
  }, [dispatch])

  useEffect(() => {
    if (sliding) {
      setTimeout(() => setSliding(false), 1500)
    }
  }, [sliding])

  return (
    <>
      {
      sliding && <SlideComponents routes={sliding} />
    }
      <div className=''>
        <Routes>
          <Route path='/' element={<MainPage sliding={handleSliding} />} />
          <Route path='/home' element={<Home sliding={handleSliding} store={{ totaDogs, dogs, temperaments }} />} />
          <Route path='/dog/:razaPerro' element={<DogDetail sliding={handleSliding} store={{ dogDetail, temperaments }} />} />
          <Route path='/dog/create' element={<CreateDog sliding={handleSliding} store={{ temperaments }} />} />
        </Routes>
      </div>
      <Loading loading={loading} />
    </>
  )
}

export default App
