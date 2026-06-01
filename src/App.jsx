import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Roster from './pages/Roster'
import NewGame from './pages/NewGame'
import LiveGame from './pages/LiveGame'
import History from './pages/History'
import Nav from './components/Nav'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/roster" />} />
          <Route path="/roster" element={<Roster />} />
          <Route path="/new-game" element={<NewGame />} />
          <Route path="/live-game" element={<LiveGame />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
