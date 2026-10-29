import { useNavigate } from 'react-router-dom'
import { Smartphone, Sun, Image as ImageIcon, CheckCircle2 } from 'lucide-react'

const steps = [
  { icon: <Smartphone className="w-6 h-6" />, title: 'Bersihkan kaki', desc: 'Lepas sepatu dan kaus kaki. Pastikan kaki bersih dari luka atau kotoran.' },
  { icon: <Sun className="w-6 h-6" />, title: 'Pencahayaan cukup', desc: 'Foto di tempat terang, hindari bayangan langsung di area kaki.' },
  { icon: <ImageIcon className="w-6 h-6" />, title: 'Sudut yang sama', desc: 'Ambil foto dari atas (top-down) dengan posisi kaki di tengah frame.' },
  { icon: <CheckCircle2 className="w-6 h-6" />, title: 'Kiri dan kanan', desc: 'Foto kaki kiri dan kanan secara terpisah atau dalam satu frame dengan jarak yang sama.' },
]

export default function Guide() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-surface px-6 py-8">
      <header className="mb-8">
        <button onClick={() => navigate('/')} className="text-muted hover:text-ink transition">
          ← Kembali
        </button>
        <h1 className="text-2xl font-bold mt-2">Panduan Foto</h1>
        <p className="text-muted">Ikuti langkah ini agar hasil akurat</p>
      </header>

      <div className="space-y-4">
        {steps.map((step, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
            <div className="bg-primary/10 text-primary p-2 rounded-lg shrink-0">{step.icon}</div>
            <div>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="text-sm text-muted">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => navigate('/camera')} className="w-full bg-primary text-white px-6 py-4 rounded-2xl font-bold shadow-sm mt-8 hover:bg-primary-dark transition">
        Saya Siap, Mulai Kamera
      </button>
    </div>
  )
}
