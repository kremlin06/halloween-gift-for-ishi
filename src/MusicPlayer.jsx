import { useEffect, useRef, useState } from 'react'
import { musicFile, musicButtonText, musicVolume } from './config.js'

const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function MusicPlayer() {
  const audioRef = useRef(null)
  const fadeRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    return () => clearInterval(fadeRef.current)
  }, [])

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

  const handleClick = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (playing) {
      audio.pause()
      clearInterval(fadeRef.current)
      setPlaying(false)
      return
    }

    try {
      audio.volume = 0
      await audio.play()
      setPlaying(true)
      setStarted(true)
      fadeIn(audio)
    } catch (error) {
      // Playback was refused or the file cannot be played: hide the button.
      setMissing(true)
    }
  }

  if (missing) return null

  const label = !started ? musicButtonText : playing ? 'pause the song' : 'play the song again'

  return (
    <div className="music">
      <audio
        ref={audioRef}
        src={import.meta.env.BASE_URL + musicFile}
        preload="metadata"
        loop
        onError={() => setMissing(true)}
      />
      <button type="button" className="music-button" onClick={handleClick}>
        {label}
      </button>
    </div>
  )
}

export default MusicPlayer
