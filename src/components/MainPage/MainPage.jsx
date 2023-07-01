import { Link } from 'react-router-dom'
import styles from './MainPage.module.css'

function MainPage ({ sliding }) {
  function playSlide () {
    sliding('/', '/home')
  }

  return (
    <>
      <div id='MainPageSlide' className={styles.MainPage}>
        <div className={styles.verticalBar}>
          <h1>Find your new friend</h1>
          <Link to='/home'><button onClick={playSlide} className={styles.buttonMainPage}>Search</button></Link>
        </div>
      </div>
    </>
  )
}

export default MainPage
