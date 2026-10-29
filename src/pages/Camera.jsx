import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CameraIcon as Camera, RotateCw, ArrowLeft } from 'lucide-react'

export default function CameraPage() {
  const navigate = useNavigate()
  const [stream, setStream] = useState(null)
  const [photos, setPhotos] = useState({ left: null, right: null })
  const [current, setCurrent] = useState('left')
  const [facingMode, setFacingMode] = useState('environment')
  const videoRef = useRef(null)

  useEffect(() => {
    startCamera()
  }, [facingMode])

  async function startCamera() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } }
      })
      setStream(s)
    } catch (e) {
      alert('Tidak dapat mengakses kamera. Pastikan izin diberikan.')
    }
  }

  function capture() {
    if (!videoRef.current) return
    const canvas = document.createElement('canvas')
    const v = videoRef.current
    canvas.width = v.videoWidth
    canvas.height = v.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(v, 0, 0)

    setPhotos(prev => ({ ...prev, [current]: canvas.toDataURL('image/jpeg', 0.8) }))

    if (current === 'left') {
      setCurrent('right')
    } else {
      navigate('/result', { state: { photos } })
    }
  }

  function retake() {
    setPhotos(prev => ({ ...prev, [current]: null }))
  }

  if (!stream) return <div className="min-h-screen flex items-center justify-center text-white">Memuat kamera...</div>

  return (
    <div className="min-h-screen bg-black">
      <div className="absolute top-4 left-4 z-10">
        <button onClick={() => navigate('/guide')} className="p-2 bg-white/10 rounded-full backdrop-blur text-white hover:bg-white/20 transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="relative w-full h-[70vh] max-w-md mx-auto mt-4">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full rounded-2xl object-cover bg-gray-800" srcObject={stream} />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="border-2 border-primary/50 rounded-full w-3/4 h-3/4 animate-pulse" />
        </div>

        {photos[current] && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
            <button onClick={retake} className="bg-white text-black px-6 py-2 rounded-xl font-semibold mr-2">Ulangi</button>
            <button onClick={capture} className="bg-green-500 text-white px-6 py-2 rounded-xl font-semibold">Gunakan Foto</button>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white ${current === 'left' ? 'ring-2 ring-primary' : ''}`}>
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-sm font-medium">Kaki Kiri</span>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white ${current === 'right' ? 'ring-2 ring-primary' : ''}`}>
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-sm font-medium">Kaki Kanan</span>
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <button onClick={() => setFacingMode(facingMode === 'environment' ? 'user' : 'environment')} className="p-3 bg-white/10 rounded-full backdrop-blur text-white hover:bg-white/20 transition">
          <RotateCw className="w-5 h-5" />
        </button>
        <button onClick={capture} className="w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition">
          <Camera className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  )
}
