import style from './Message.module.css'

function Message ({ setShowMessage, message }) {
  function closeMessage () {
    setShowMessage(false)
  }

  function handleAction () {
    message.action.action()
  }

  return (
    <div className={style.backgroundMessage}>
      <main className={style.containerMessage}>
        <header>
          <h1>{message.title}</h1>
        </header>
        <sectino>
          {
            // message && message.imageContent ? <img /> : null
            }
          <p>{message.contentMessage}</p>
        </sectino>
        <footer className={style.footer}>
          <button onClick={closeMessage}>Close</button>
        </footer>
        {
            message && message.action
              ? (
                <button onClick={handleAction}>{message.action.name}</button>
                )
              : null
        }

      </main>
    </div>
  )
}

export default Message
