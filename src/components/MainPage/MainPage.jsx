import { useState } from 'react'
import { Link } from 'react-router-dom'

import Message from '../Message/Message'

import message from '../../controllers/message'

import logo from '../../img/dogWall2.png'
import style from './MainPage.module.css'

function MainPage ({ sliding }) {
  const [showMessage, setShowMessage] = useState(false)
  function playSlide () {
    sliding('/', '/home')
  }

  function handleMessage (event) {
    const { name } = event.target
    setShowMessage(message[name])
  }

  return (
    <main id='MainPageSlide' className={style.mainPage}>
      {/* Barra de navegación del MainPage */}
      <section className={style.navBarMainPageContainer}>
        <div className={style.navBarMainPage}>
          <div className={style.navBarOptionsMainPage}>
            <button onClick={handleMessage} name='EXPLORE'>EXPLORE</button>
            <button onClick={handleMessage} name='API'>API</button>
            <button onClick={handleMessage} name='ABOUT'>ABOUT ME</button>
            <button onClick={handleMessage} name='CONTACT'>CONTACT</button>
          </div>
          <label>Dog App</label>
          <div className={style.navBarLoginMainPage}>
            Login
          </div>
        </div>
      </section>
      {/* Contenido del MainPage */}
      <section className={style.containerMainPage}>
        <div className={style.imageContainer}>
          <figure>
            <img src={logo} alt='Dog-Wall' />
          </figure>
          <Link to='/home'><button onClick={playSlide} /></Link>
          <label className={style.buttonMainPage}>Search</label>
        </div>
        <div className={style.titleMainPage}>
          <h1>PI-Dogs</h1>
          <h2>Find the unconditional friend that will accompany you all your life</h2>
        </div>
      </section>
      {
        showMessage ? <Message setShowMessage={setShowMessage} message={showMessage} /> : null
      }
    </main>
  )
}

export default MainPage
