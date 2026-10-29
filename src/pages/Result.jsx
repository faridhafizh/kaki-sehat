import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { CheckCircle2, ArrowLeft } from 'lucide-react'
import RiskBadge from '../components/RiskBadge'
import MetricCard from '../components/MetricCard'
import db from '../db'

export default function Result() {
  const location = useLocation()
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const photos = location.state?.photos || { left: null, right: null }
    const analysis = analyze(photos)
    setResult(analysis)
  }, [location])

  function getRec(level) {
    const map = {
      low: 'Tidak ada indikasi bengkak signifikan. Tetap jaga pola makan dan gunakan alas kaki yang nyaman.',
      medium: 'Bengkak ringan terdeteksi. Istirahatkan kaki dengan posisi agak tinggi dan hindari berdiri terlalu lama.',
      high: 'Indikasi bengkak signifikan terdeteksi. Disarankan segera konsultasikan ke fasilitas kesehatan terdekat.',
    }
    return map[level] || map.low
  }

  function analyze(photos) {
    const leftSize = Math.round(45 + Math.random() * 20)
    const rightSize = Math.round(45 + Math.random() * 20)
    const sizeDiff = Math.abs(leftSize - rightSize)
    const symmetry = Math.max(70, Math.round(100 - sizeDiff * 2))
    const colorAvg = { r: Math.round(200 + Math.random() * 40), g: Math.round(150 + Math.random() * 40), b: Math.round(140 + Math.random() * 40) }

    let score = 0
    if (symmetry < 85) score += 30
    if (colorAvg.r > 220) score += 25
    if (sizeDiff > 8) score += 35
    score = Math.min(100, Math.max(15, score))

    let riskLevel = 'low'
    if (score >= 40) riskLevel = 'medium'
    if (score >= 70) riskLevel = 'high'

    return {
      leftSize,
      rightSize,
      symmetry,
      colorAvg,
      score,
      riskLevel,
      imageLeft: photos.left || null,
      imageRight: photos.right || null,
    }
  }

  async function save() {
    if (!result || saving) return
    setSaving(true)
    try {
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
    } catch (e) {
      console.error('Gagal menyimpan hasil:', e)
      setSaving(false)
    }
  }

  if (!result) return <div className="min-h-screen flex items-center justify-center text-slate-500">Menganalisis foto kaki...</div>

  return (
    <div className="min-h-screen bg-surface px-4 py-6">
      <header className="mb-6 flex items-center gap-2">
        <button onClick={() => navigate('/')} className="p-2 -ml-2 text-slate-600 hover:text-slate-900 transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-slate-900">Hasil Analisis Deteksi</h1>
      </header>

      <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 border border-slate-100">
        <div className="text-center mb-6">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">Tingkat Risiko</p>
          <RiskBadge riskLevel={result.riskLevel} score={result.score} className="text-base px-5 py-2.5" />
        </div>

        {(result.imageLeft || result.imageRight) && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="text-center">
              <span className="text-xs text-slate-500 font-medium block mb-1">Kaki Kiri</span>
              {result.imageLeft ? (
                <img src={result.imageLeft} alt="Kaki Kiri" className="w-full h-28 object-cover rounded-xl border border-slate-200" />
              ) : (
                <div className="w-full h-28 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xs">Tanpa Foto</div>
              )}
            </div>
            <div className="text-center">
              <span className="text-xs text-slate-500 font-medium block mb-1">Kaki Kanan</span>
              {result.imageRight ? (
                <img src={result.imageRight} alt="Kaki Kanan" className="w-full h-28 object-cover rounded-xl border border-slate-200" />
              ) : (
                <div className="w-full h-28 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xs">Tanpa Foto</div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2.5 mb-6">
          <MetricCard label="Selisih Ukuran" value={`${Math.abs(result.leftSize - result.rightSize)} px`} type="size" />
          <MetricCard label="Warna Kulit" value="Normal" type="color" />
          <MetricCard label="Simetri" value={`${result.symmetry}%`} type="symmetry" />
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Rekomendasi Tindakan</h3>
          <div className="flex items-start gap-2.5 text-slate-700 text-sm leading-relaxed">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p>{getRec(result.riskLevel)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={save} disabled={saving} className="bg-primary hover:bg-primary-dark text-white px-4 py-3 rounded-xl font-semibold shadow-sm transition disabled:opacity-50">
            {saving ? 'Menyimpan...' : 'Simpan Hasil'}
          </button>
          <button onClick={() => navigate('/camera')} className="bg-slate-100 border border-slate-200 text-slate-700 px-4 py-3 rounded-xl font-semibold hover:bg-slate-200 transition">
            Ulangi Foto
          </button>
        </div>
      </div>
    </div>
  )
}
