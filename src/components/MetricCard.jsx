import { ArrowUpRight, Palette, Scale } from 'lucide-react'

const icons = {
  size: <ArrowUpRight className="w-5 h-5" />,
  color: <Palette className="w-5 h-5" />,
  symmetry: <Scale className="w-5 h-5" />,
}

export default function MetricCard({ label, value, type }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-slate-50 text-slate-600">{icons[type]}</div>
        <span className="text-xs text-muted uppercase tracking-wider font-semibold">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
}
