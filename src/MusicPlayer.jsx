import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { musicFile, musicButtonText, musicVolume } from './config.js'

const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const MusicPlayer = forwardRef(function MusicPlayer({ showControls, onBackToStart }, ref) {
  const audioRef = useRef(null)
  const fadeRef = useRef(null)
  const playPromiseRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const [missing, setMissing] = useState(false)

  const fadeIn = (audio) => {
    clearInterval(fadeRef.current)
    if (reducedMotion()) {
      audio.volume = musicVolume
      return
    }
    audio.volume = 0
    fadeRef.current = setInterval(() => {
      const next = Math.min(audio.volume + 0.02, musicVolume)
      audio.volume = next
      if (next >= musicVolume) clearInterval(fadeRef.current)
    }, 100)
  }

  const startAudio = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (!audio.paused) return
    if (playPromiseRef.current) return playPromiseRef.current

    audio.volume = 0
    playPromiseRef.current = audio.play()

    try {
      await playPromiseRef.current
      setPlaying(true)
      setStarted(true)
      fadeIn(audio)
    } catch (error) {
      if (error?.name === 'NotSupportedError') setMissing(true)
    } finally {
      playPromiseRef.current = null
    }
  }

  useImperativeHandle(ref, () => ({ start: startAudio }), [])

  useEffect(() => {
    startAudio()
    return () => {
      clearInterval(fadeRef.current)
    }
  }, [])

  const handleClick = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (!audio.paused) {
      audio.pause()
      clearInterval(fadeRef.current)
      setPlaying(false)
      return
    }

    await startAudio()
  }

  const label = !started ? musicButtonText : playing ? 'pause the song' : 'play the song again'

  return (
    <>
      <audio
        ref={audioRef}
        src={import.meta.env.BASE_URL + musicFile}
        preload="auto"
        loop
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setMissing(true)}
      />
      {showControls && !missing && (
        <div className="music">
          <button type="button" className="music-button" onClick={handleClick}>
            {label}
          </button>
          <button type="button" className="music-button" onClick={onBackToStart}>
            back to start
          </button>
        </div>
      )}
    </>
  )
})

export default MusicPlayer
