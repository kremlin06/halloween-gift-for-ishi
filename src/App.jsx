import { useRef, useState } from 'react'
import MusicPlayer from './MusicPlayer.jsx'
import { letterTitle, letterParagraphs, closingLine } from './config.js'

const floaters = [
  { symbol: '👻', left: '8%', top: '12%', size: '1.6rem', delay: '0s' },
  { symbol: '✦', left: '85%', top: '8%', size: '1rem', delay: '1s' },
  { symbol: '🍬', left: '90%', top: '40%', size: '1.3rem', delay: '2s' },
  { symbol: '👻', left: '80%', top: '78%', size: '1.4rem', delay: '1.5s' },
  { symbol: '✦', left: '12%', top: '60%', size: '0.9rem', delay: '0.5s' },
  { symbol: '🍭', left: '6%', top: '85%', size: '1.3rem', delay: '2.5s' },
]

function App() {
  const [scene, setScene] = useState('start')
  const [trickShown, setTrickShown] = useState(false)
  const musicRef = useRef(null)

  const openTreat = () => {
    musicRef.current?.start()
    setTrickShown(false)
    setScene('opening')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setTimeout(() => setScene('letter'), reduced ? 0 : 1100)
  }

  const showTrick = () => {
    musicRef.current?.start()
    setTrickShown(true)
  }

  const returnToStart = () => {
    setTrickShown(false)
    setScene('start')
  }

  return (
    <main className="page">
      <div className="floaters" aria-hidden="true">
        {floaters.map((item, index) => (
          <span
            key={index}
            className="floater"
            style={{
              left: item.left,
              top: item.top,
              fontSize: item.size,
              animationDelay: item.delay,
            }}
          >
            {item.symbol}
          </span>
        ))}
      </div>

      {scene === 'start' && (
        <section className="scene scene-start">
          <div className="big-ghost" aria-hidden="true">👻</div>
          <h1 className="boo">BOOOO! 👻 hehe</h1>
          <p className="greeting">happy halloween, shie.</p>
          <p className="hint">someone left a little treat for you.</p>

          <div className="choices" role="group" aria-label="trick or treat">
            <button type="button" className="choice" onClick={showTrick}>
              Trick
            </button>
            <button type="button" className="choice choice-treat" onClick={openTreat}>
              Treat
            </button>
          </div>

          {trickShown && (
            <div className="trick" role="status">
              <span className="trick-ghost" aria-hidden="true">👻</span>
              <p>hehe, just a little scare for you. 👻</p>
              <div className="trick-actions">
                <button type="button" className="small-button" onClick={() => setTrickShown(false)}>
                  try again
                </button>
                <button type="button" className="small-button small-button-main" onClick={openTreat}>
                  take the treat
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {scene === 'opening' && (
        <section className="scene scene-opening" aria-label="opening the treat">
          <div className="envelope" aria-hidden="true">
            <div className="envelope-letter" />
            <div className="envelope-flap" />
            <div className="envelope-front" />
          </div>
        </section>
      )}

      {scene === 'letter' && (
        <section className="scene scene-letter">
          <article className="letter">
            <h2 className="letter-title">{letterTitle}</h2>
            {letterParagraphs.map((text, index) => (
              <p key={index} className="letter-text" style={{ animationDelay: `${index * 0.25}s` }}>
                {text}
              </p>
            ))}
          </article>
          <p className="closing">{closingLine}</p>
        </section>
      )}

      <MusicPlayer ref={musicRef} showControls={scene === 'letter'} onBackToStart={returnToStart} />
    </main>
  )
}

export default App
