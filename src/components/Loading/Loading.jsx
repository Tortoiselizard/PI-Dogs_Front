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
    let isMounted = true
    if (!totalDogs.length && isMounted) window.setTimeout(() => { showLoading(isMounted) }, 3000)
    return () => {
      isMounted = false
    }
  }, [totalDogs.length])

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
    if (showLoad && isMounted) {
      window.setTimeout(() => { handleMessage(isMounted) }, 60000)
    }
    return () => {
      isMounted = false
    }
  }, [showLoad])

  function showLoading (isMounted) {
    if (isMounted) {
      setShowLoad(true)
    }
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
