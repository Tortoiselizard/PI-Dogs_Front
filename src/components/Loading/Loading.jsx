import React, { useState, useEffect } from 'react'
import style from './Loading.module.css'

function Loading ({ loading }) {
  const [message, setMessage] = useState({
    title: 'Loading...'
  })

  // Contar el tiempo para que se solcite refrescar la página
  useEffect(() => {
    let isMounted = true
    function handleMessage (isMounted) {
      if (isMounted) {
        setMessage({
          title: 'Ups, something is wrong!',
          comment: 'Please, refresh the page to reload again the information',
          button: ['Refresh', refreshPage]
        })
      }
    }
    if (loading && isMounted) {
      window.setTimeout(() => { handleMessage(isMounted) }, 60000)
    }
    return () => {
      isMounted = false
    }
  }, [loading])

  function refreshPage () {
    window.location.reload()
  }

  return (
    <>
      {
        loading
          ? (
            <section className={style.Loading}>
              <div>
                {
                message.title ? <h1>{message.title}</h1> : null
            }
                {
                message.comment ? <p>{message.comment}</p> : null
            }
                {
                message.button ? <button onClick={() => message.button[1]()}>{message.button[0]}</button> : null
            }
              </div>
            </section>
            )
          : null
      }
    </>

  )
}

export default Loading
