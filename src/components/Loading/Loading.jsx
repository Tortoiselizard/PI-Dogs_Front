import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import style from './Loading.module.css'

function Loading () {
  const totalDogs = useSelector(state => state.totaDogs)
  const [showLoad, setShowLoad] = useState(false)
  const [message, setMessage] = useState({
    title: 'Loading...'
  })

  useEffect(() => {
    if (!totalDogs.length) window.setTimeout(showLoading, 3000)
  }, [totalDogs.length])

  useEffect(() => {
    function handleMessage () {
      setMessage({
        title: 'Ups, something is wrong!',
        comment: 'Please, refresh the page to reload again the information',
        button: ['Refresh', refreshPage]
      })
    }
    if (showLoad) {
      window.setTimeout(handleMessage, 420000)
    }
  }, [showLoad])

  function showLoading () {
    setShowLoad(true)
  }

  function refreshPage () {
    window.location.reload()
  }

  const show = showLoad && !totalDogs.length
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

  return (
    <>
      {show}
    </>

  )
}

export default Loading
