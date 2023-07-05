import { Link } from 'react-router-dom'

import logo from '../../img/dogWall2.png'
import style from './MainPage.module.css'

function MainPage ({ sliding }) {
  function playSlide () {
    sliding('/', '/home')
  }

  return (
    <main id='MainPageSlide' className={style.mainPage}>
      {/* Barra de navegación del MainPage */}
      <section className={style.navBarMainPageContainer}>
        <div className={style.navBarMainPage}>
          <div className={style.navBarOptionsMainPage}>
            <button>API</button>
            <button>About Me</button>
            <button>Contact Us</button>
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
    </main>
  )
}

export default MainPage
