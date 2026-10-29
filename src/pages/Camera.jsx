import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CameraIcon as Camera, RotateCw, ArrowLeft } from 'lucide-react'

export default function CameraPage() {
  const navigate = useNavigate()
  const [stream, setStream] = useState(null)
  const [photos, setPhotos] = useState({ left: null, right: null })
  const [current, setCurrent] = useState('left')
  const [previewImage, setPreviewImage] = useState(null)
  const [facingMode, setFacingMode] = useState('environment')
  const videoRef = useRef(null)

  useEffect(() => {
    let activeStream = null
    async function startCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } }
        })
        activeStream = s
        setStream(s)
      } catch (e) {
        alert('Tidak dapat mengakses kamera. Pastikan izin kamera diberikan.')
      }
    }
    startCamera()

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [facingMode])

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  function capture() {
    if (!videoRef.current) return
    const canvas = document.createElement('canvas')
    const v = videoRef.current
    canvas.width = v.videoWidth || 640
    canvas.height = v.videoHeight || 480
    const ctx = canvas.getContext('2d')
    ctx.drawImage(v, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
    setPreviewImage(dataUrl)
  }

  function confirmPhoto() {
    if (!previewImage) return
    const updatedPhotos = { ...photos, [current]: previewImage }
    setPhotos(updatedPhotos)
    setPreviewImage(null)

    if (current === 'left') {
      setCurrent('right')
    } else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
      navigate('/result', { state: { photos: updatedPhotos } })
    }
  }

  function retake() {
    setPreviewImage(null)
  }

  function handleBack() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
    navigate('/guide')
  }

  return (
    <div className="min-h-screen bg-black flex flex-col justify-between py-6">
      <div className="px-4 flex justify-between items-center z-10">
        <button onClick={handleBack} className="p-2 bg-white/10 rounded-full backdrop-blur text-white hover:bg-white/20 transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-white font-semibold text-sm bg-white/10 px-3 py-1 rounded-full">
          Ambil Foto Kaki {current === 'left' ? 'Kiri' : 'Kanan'}
        </span>
      </div>

      <div className="relative w-full h-[60vh] max-w-md mx-auto my-auto px-4">
        {previewImage ? (
          <img src={previewImage} alt="Pratinjau" className="w-full h-full rounded-2xl object-cover border-2 border-primary" />
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full rounded-2xl object-cover bg-gray-800" />
        )}

        {!previewImage && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="border-2 border-primary/50 rounded-3xl w-3/4 h-4/5 animate-pulse flex items-center justify-center">
              <span className="text-white/60 text-xs text-center px-4">Posisikan kaki {current === 'left' ? 'KIRI' : 'KANAN'} di dalam kotak</span>
            </div>
          </div>
        )}

        {previewImage && (
          <div className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center p-6 z-20">
            <p className="text-white mb-4 text-sm font-medium">Gunakan foto kaki {current === 'left' ? 'kiri' : 'kanan'} ini?</p>
            <div className="flex gap-3">
              <button onClick={retake} className="bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-xl font-semibold transition">
                Ulangi
              </button>
              <button onClick={confirmPhoto} className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-semibold transition">
                Gunakan Foto
              </button>
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="flex justify-center gap-4 mb-4">
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border text-white ${current === 'left' ? 'border-primary ring-1 ring-primary' : 'border-white/20'}`}>
            <div className={`w-2 h-2 rounded-full ${photos.left ? 'bg-emerald-400' : 'bg-white/40'}`} />
            <span className="text-xs font-medium">1. Kaki Kiri {photos.left ? '✓' : ''}</span>
          </div>
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border text-white ${current === 'right' ? 'border-primary ring-1 ring-primary' : 'border-white/20'}`}>
            <div className={`w-2 h-2 rounded-full ${photos.right ? 'bg-emerald-400' : 'bg-white/40'}`} />
            <span className="text-xs font-medium">2. Kaki Kanan {photos.right ? '✓' : ''}</span>
          </div>
        </div>

        <div className="flex justify-center items-center gap-6">
          <button onClick={() => setFacingMode(facingMode === 'environment' ? 'user' : 'environment')} className="p-3 bg-white/10 rounded-full backdrop-blur text-white hover:bg-white/20 transition">
            <RotateCw className="w-5 h-5" />
          </button>
          <button onClick={capture} disabled={!!previewImage} className="w-16 h-16 bg-primary disabled:opacity-50 rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition">
            <Camera className="w-7 h-7 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
