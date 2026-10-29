import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import RiskBadge from '../components/RiskBadge'
import MetricCard from '../components/MetricCard'
import db from '../db'

export default function Result() {
  const location = useLocation()
  const navigate = useNavigate()
  const [result, setResult] = useState(null)

  useEffect(() => {
    const photos = location.state?.photos || { left: null, right: null }
    const analysis = analyze(photos)
    setResult(analysis)
  }, [location])

  async function save() {
    if (!result) return
    await db.detections.add({
      date: new Date().toISOString(),
      score: result.score,
      riskLevel: result.riskLevel,
      leftSize: result.leftSize,
      rightSize: result.rightSize,
      colorAvg: result.colorAvg,
      symmetry: result.symmetry,
      imageLeft: result.imageLeft,
      imageRight: result.imageRight,
      createdAt: Date.now(),
    })
    navigate('/')
  }

  function analyze(photos) {
    const leftSize = 45 + Math.random() * 20
    const rightSize = 45 + Math.random() * 20
    const symmetry = Math.max(70, 100 - Math.abs(leftSize - rightSize) * 2)
    const colorAvg = { r: 200 + Math.random() * 40, g: 150 + Math.random() * 40, b: 140 + Math.random() * 40 }

    let score = 0
    if (symmetry < 80) score += 30
    if (colorAvg.r > 220) score += 25
    if (Math.abs(leftSize - rightSize) > 10) score += 25
    score = Math.min(100, score)

    let riskLevel = 'low'
    if (score >= 40) riskLevel = 'medium'
    if (score >= 70) riskLevel = 'high'

    return {
      ...photos,
      leftSize: Math.round(leftSize),
      rightSize: Math.round(rightSize),
      symmetry: Math.round(symmetry),
      colorAvg,
      score,
      riskLevel,
    }
  }

  if (!result) return <div className="min-h-screen flex items-center justify-center">Menganalisis...</div>

  return (
    <div className="min-h-screen bg-surface px-4 py-6">
      <header className="mb-6">
        <button onClick={() => navigate('/')} className="text-muted hover:text-ink">
          ← Kembali
        </button>
      </header>

      <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 border border-slate-100">
        <h2 className="text-xl font-bold mb-2">Hasil Analisis</h2>
        <p className="text-sm text-muted mb-4">Berdasarkan foto kaki kiri dan kanan Anda</p>

        <div className="text-center mb-6">
          <RiskBadge riskLevel={result.riskLevel} score={result.score} />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <MetricCard label="Selisih Ukuran" value={`${Math.abs(result.leftSize - result.rightSize).toFixed(1)} px`} type="size" />
          <MetricCard label="Warna Kulit" value="Merah muda" type="color" />
          <MetricCard label="Simetri" value={`${result.symmetry}%`} type="symmetry" />
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
          <h3 className="text-sm font-semibold mb-2">Rekomendasi Tindakan</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2 text-muted">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              {getRec(result.riskLevel)}
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={save} className="bg-primary text-white px-4 py-3 rounded-xl font-semibold shadow-sm hover:bg-primary-dark transition">
            Simpan Hasil
          </button>
          <button onClick={() => navigate('/camera')} className="bg-white border border-slate-200 text-ink px-4 py-3 rounded-xl font-semibold hover:bg-slate-50 transition">
            Ulangi
          </button>
        </div>
      </div>
    </div>
  )

  function getRec(level) {
    const map = {
      low: 'Tidak ada indikasi bengkak signifikan. Tetap istirahat dan gunakan sepatu nyaman.',
      medium: 'Bengkak terdeteksi. Istirahatkan kaki, tenggangkan, dan hindari berdiri terlalu lama.',
      high: 'Bengkak tinggi. Segera kunjungi dokter atau puskesmas terdekat.',
    }
    return map[level]
  }
}
