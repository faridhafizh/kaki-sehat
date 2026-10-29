import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Trash2, ArrowLeft } from 'lucide-react'
import RiskBadge from '../components/RiskBadge'
import db from '../db'

export default function History() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const all = await db.detections.orderBy('createdAt').reverse().toArray()
    setItems(all)
  }

  async function remove(id) {
    if (!confirm('Hapus riwayat ini?')) return
    await db.detections.delete(id)
    load()
  }

  return (
    <div className="min-h-screen bg-surface px-4 py-6">
      <header className="flex justify-between items-center mb-6">
        <button onClick={() => navigate('/')} className="p-2 -ml-2 text-slate-600 hover:text-slate-900 transition flex items-center gap-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-600" />
          <h1 className="text-xl font-bold text-slate-900">Riwayat Deteksi</h1>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold">Belum ada riwayat</h3>
          <p className="text-muted">Mulai deteksi pertama Anda</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-muted">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">{new Date(item.date).toLocaleDateString('id-ID')}</p>
                  <p className="text-xs text-muted">{new Date(item.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RiskBadge riskLevel={item.riskLevel} score={item.score} className="text-xs px-3 py-1.5" />
                <button onClick={() => remove(item.id)} className="p-2 text-muted hover:text-danger">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
