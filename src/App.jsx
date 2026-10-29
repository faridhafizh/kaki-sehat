import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'
import { Home as HomeIcon, Clock, BookOpen } from 'lucide-react'
import Home from './pages/Home'
import Guide from './pages/Guide'
import Camera from './pages/Camera'
import Result from './pages/Result'
import History from './pages/History'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col max-w-md mx-auto bg-slate-50 border-x border-slate-200 shadow-lg">
        <main className="flex-1 pb-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/camera" element={<Camera />} />
            <Route path="/result" element={<Result />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto border-t border-slate-200 bg-white/95 backdrop-blur z-50">
          <div className="flex justify-around items-center px-4 py-2">
            <NavLink end to="/" className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-xs font-medium transition ${isActive ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`
            }>
              <HomeIcon className="w-5 h-5" />
              Beranda
            </NavLink>
            <NavLink to="/history" className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-xs font-medium transition ${isActive ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`
            }>
              <Clock className="w-5 h-5" />
              Riwayat
            </NavLink>
            <NavLink to="/guide" className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-xs font-medium transition ${isActive ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`
            }>
              <BookOpen className="w-5 h-5" />
              Panduan
            </NavLink>
          </div>
        </nav>
      </div>
    </Router>
  )
}
