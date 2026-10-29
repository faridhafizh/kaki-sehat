import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import RiskBadge from '../components/RiskBadge'
import MetricCard from '../components/MetricCard'
import db from '../db'

export default function Home() {
  const navigate = useNavigate()
  const [last, setLast] = useState(null)

  useEffect(() => {
    loadLast()
  }, [])

  async function loadLast() {
    const all = await db.detections.orderBy('createdAt').reverse().limit(1).toArray()
    if (all.length) setLast(all[0])
  }

  function getRecommendation(level) {
    const map = {
      low: 'Tidak ada indikasi bengkak signifikan. Tetap jaga kesehatan kaki dengan istirahat yang cukup dan sepatu nyaman.',
      medium: 'Terdapat indikasi bengkak ringan. Istirahatkan kaki, tenggangkan saat duduk, dan hindari berdiri terlalu lama.',
      high: 'Indikasi bengkak tinggi. Segera konsultasikan ke dokter atau puskesmas terdekat. Jangan menunda.',
    }
    return map[level] || map.low
  }

  return (
    <div className="min-h-screen bg-surface px-4 py-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">KakiSehat</h1>
          <p className="text-muted">Self-check bengkak kaki</p>
        </div>
        <ShieldAlert className="w-8 h-8 text-muted" />
      </header>

      {last ? (
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-8 border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="font-semibold">Hasil Terakhir</h2>
              <p className="text-sm text-muted">{new Date(last.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>
            <RiskBadge riskLevel={last.riskLevel} score={last.score} />
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <MetricCard label="Selisih Ukuran" value={`${Math.abs(last.leftSize - last.rightSize).toFixed(1)} px`} type="size" />
            <MetricCard label="Warna Kulit" value="Merah muda" type="color" />
            <MetricCard label="Simetri" value={`${last.symmetry}%`} type="symmetry" />
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <h3 className="text-sm font-semibold mb-2">Rekomendasi</h3>
            <p className="text-sm">{getRecommendation(last.riskLevel)}</p>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl shadow-sm mb-8 border border-slate-100 text-center">
          <h2 className="font-semibold mb-2">Belum ada deteksi</h2>
          <p className="text-muted text-sm mb-6">Mulai deteksi pertama untuk melihat analisis kaki Anda</p>
          <button onClick={() => navigate('/guide')} className="w-full bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow-sm hover:bg-primary-dark transition">
            Mulai Deteksi Kaki
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <span className="w-5 h-5 text-muted">📋</span>
            <span className="font-semibold">Riwayat Deteksi</span>
          </div>
          <button onClick={() => navigate('/history')} className="text-sm text-primary font-medium">Lihat Semua</button>
        </div>
        <div className="h-32 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-muted">
          Riwayat akan muncul di sini setelah deteksi pertama
        </div>
      </div>
    </div>
  )
}
