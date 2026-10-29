import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import Guide from './pages/Guide'
import Camera from './pages/Camera'
import Result from './pages/Result'
import History from './pages/History'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/camera" element={<Camera />} />
            <Route path="/result" element={<Result />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>

        <nav className="border-t border-slate-200 bg-white/90 backdrop-blur sticky bottom-0 z-50">
          <div className="flex px-2 py-2">
            <NavLink to="/" className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition ${isActive ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`
            }>
              <span className="w-5 h-5">🏠</span>
              Beranda
            </NavLink>
            <NavLink to="/history" className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition ${isActive ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`
            }>
              <span className="w-5 h-5">📋</span>
              Riwayat
            </NavLink>
            <NavLink to="/" className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition ${isActive ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`
            }>
              <span className="w-5 h-5">ℹ️</span>
              Tentang
            </NavLink>
          </div>
        </nav>
      </div>
    </Router>
  )
}
