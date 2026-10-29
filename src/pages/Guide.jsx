import { useNavigate } from 'react-router-dom'
import { Smartphone, Sun, Image as ImageIcon, CheckCircle2, ArrowLeft } from 'lucide-react'

const steps = [
  { icon: <Smartphone className="w-6 h-6" />, title: 'Bersihkan Kaki', desc: 'Lepas sepatu dan kaus kaki. Pastikan kaki bersih dan tidak terhalang pakaian.' },
  { icon: <Sun className="w-6 h-6" />, title: 'Pencahayaan Cukup', desc: 'Foto di ruangan terang dengan pencahayaan merata. Hindari bayangan keras.' },
  { icon: <ImageIcon className="w-6 h-6" />, title: 'Sudut Tegak Lurus', desc: 'Ambil foto dari atas (top-down) dengan posisi kamera sejajar di atas kaki.' },
  { icon: <CheckCircle2 className="w-6 h-6" />, title: 'Foto Kiri & Kanan', desc: 'Ambil foto kaki kiri dan kanan bergantian dari jarak yang sama (sekitar 30-40 cm).' },
]

export default function Guide() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-surface px-6 py-8">
      <header className="mb-8">
        <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition font-medium text-sm mb-3">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Panduan Foto Kaki</h1>
        <p className="text-slate-500 text-sm mt-1">Ikuti petunjuk ini agar hasil deteksi lebih akurat</p>
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
