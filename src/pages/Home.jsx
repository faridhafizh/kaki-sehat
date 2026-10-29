import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, Clock, Plus, ChevronRight } from 'lucide-react'
import RiskBadge from '../components/RiskBadge'
import MetricCard from '../components/MetricCard'
import db from '../db'

export default function Home() {
  const navigate = useNavigate()
  const [last, setLast] = useState(null)
  const [recentList, setRecentList] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const all = await db.detections.orderBy('createdAt').reverse().toArray()
    if (all.length > 0) {
      setLast(all[0])
      setRecentList(all.slice(0, 3))
    }
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
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">KakiSehat</h1>
          <p className="text-muted text-sm">Self-check visual bengkak kaki</p>
        </div>
        <div className="p-2.5 bg-emerald-50 text-primary rounded-2xl border border-emerald-100">
          <Activity className="w-7 h-7" />
        </div>
      </header>

      {last ? (
        <>
          <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="font-semibold text-slate-800">Hasil Deteksi Terakhir</h2>
                <p className="text-xs text-muted mt-0.5">{new Date(last.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <RiskBadge riskLevel={last.riskLevel} score={last.score} />
            </div>

            <div className="grid grid-cols-3 gap-2.5 mb-5">
              <MetricCard label="Selisih Ukuran" value={`${Math.abs(last.leftSize - last.rightSize).toFixed(1)} px`} type="size" />
              <MetricCard label="Warna Kulit" value="Normal" type="color" />
              <MetricCard label="Simetri" value={`${last.symmetry}%`} type="symmetry" />
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 mb-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Rekomendasi</h3>
              <p className="text-sm text-slate-700 leading-relaxed">{getRecommendation(last.riskLevel)}</p>
            </div>

            <button onClick={() => navigate('/guide')} className="w-full bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-xl font-semibold shadow-sm flex items-center justify-center gap-2 transition">
              <Plus className="w-5 h-5" />
              Mulai Deteksi Baru
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Riwayat Deteksi Terakhir</span>
              </div>
              <button onClick={() => navigate('/history')} className="text-xs text-primary font-medium hover:underline flex items-center">
                Lihat Semua ({recentList.length}) <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              {recentList.map(item => (
                <div key={item.id} className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 text-slate-500 rounded-lg">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{new Date(item.date).toLocaleDateString('id-ID')}</p>
                      <p className="text-xs text-slate-400">{new Date(item.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <RiskBadge riskLevel={item.riskLevel} score={item.score} className="text-xs px-2.5 py-1" />
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white p-8 rounded-2xl shadow-sm mb-6 border border-slate-100 text-center">
          <div className="w-16 h-16 bg-emerald-50 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8" />
          </div>
          <h2 className="font-bold text-lg text-slate-800 mb-2">Belum ada deteksi</h2>
          <p className="text-muted text-sm mb-6">Mulai deteksi pertama untuk menganalisis simetri, ukuran, dan warna kulit kaki Anda.</p>
          <button onClick={() => navigate('/guide')} className="w-full bg-primary hover:bg-primary-dark text-white px-6 py-3.5 rounded-xl font-semibold shadow-sm transition">
            Mulai Deteksi Kaki Sekarang
          </button>
        </div>
      )}
    </div>
  )
}
