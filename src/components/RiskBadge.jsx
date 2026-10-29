import { CircleAlert, CheckCircle, AlertTriangle } from 'lucide-react'

export default function RiskBadge({ riskLevel, score, className }) {
  const config = {
    low: { color: 'bg-primary text-white', icon: <CheckCircle className="w-5 h-5" />, label: 'Rendah' },
    medium: { color: 'bg-warning text-white', icon: <AlertTriangle className="w-5 h-5" />, label: 'Sedang' },
    high: { color: 'bg-danger text-white', icon: <CircleAlert className="w-5 h-5" />, label: 'Tinggi' },
  }

  const c = config[riskLevel] || config.low

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm shadow-sm ${c.color} ${className || ''}`}>
      {c.icon}
      <span>Risiko {c.label}</span>
      <span className="opacity-80">{score}/100</span>
    </div>
  )
}
