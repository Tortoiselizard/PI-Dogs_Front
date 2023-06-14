import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import MainPage from './components/MainPage/MainPage.jsx'
import Home from './components/Home/Home.jsx'
import DogDetail from './components/DogDetail/DogDetail.jsx'
import CreateDog from './components/CreateDog/CreateDog'
import Nav from './components/Nav/Nav.jsx'
import './App.css'

function App () {
  const location = useLocation()
  return (
    <div className='App'>
      {location.pathname !== '/' ? <Nav /> : null}
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/home' element={<Home />} />
        <Route path='/dog/:raza_perro' element={<DogDetail />} />
        <Route path='/dog/create' element={<CreateDog />} />
      </Routes>
    </div>
  )
}

export default App
