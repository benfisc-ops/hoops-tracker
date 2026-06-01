import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const s = {
  heading: { fontSize: 22, fontWeight: 500, marginBottom: '0.5rem' },
  sub: { fontSize: 14, color: '#888', marginBottom: '1.25rem' },
  teamCard: { background: '#fff', borderRadius: 12, border: '1px solid #e0e0e0', padding: '1rem', marginBottom: '1rem' },
  teamLabel: { fontWeight: 500, fontSize: 15, marginBottom: '0.75rem' },
  playerBtn: { width: '100%', textAlign: 'left', padding: '0.6rem 0.75rem', borderRadius: 8, border: '1px solid #e0e0e0', background: '#f9f9f9', fontSize: 14, marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  selectedA: { background: '#eff6ff', borderColor: '#2563eb', color: '#1d4ed8' },
  selectedB: { background: '#fff7ed', borderColor: '#ea580c', color: '#c2410c' },
  startBtn: { width: '100%', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, padding: '0.85rem', fontSize: 16, fontWeight: 500, marginTop: '0.5rem' },
  disabledBtn: { width: '100%', background: '#ccc', color: '#fff', border: 'none', borderRadius: 10, padding: '0.85rem', fontSize: 16, fontWeight: 500, marginTop: '0.5rem' },
  error: { color: '#e53e3e', fontSize: 13, marginBottom: '0.5rem' },
}

export default function NewGame() {
  const [players, setPlayers] = useState([])
  const [teamA, setTeamA] = useState([])
  const [teamB, setTeamB] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const saved = localStorage.getItem('hoops-players')
    if (saved) setPlayers(JSON.parse(saved))
  }, [])

  function togglePlayer(player, team, setTeam, otherTeam) {
    if (team.find(p => p.id === player.id)) {
      setTeam(team.filter(p => p.id !== player.id))
    } else {
      if (otherTeam.find(p => p.id === player.id)) return
      if (team.length >= 4) return
      setTeam([...team, player])
    }
    setError('')
  }

  function startGame() {
    if (teamA.length < 2 || teamB.length < 2) {
      setError('Each team needs at least 2 players')
      return
    }
    const game = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      teamA: teamA.map(p => ({ ...p, pts: 0, reb: 0, ast: 0, stl: 0, blk: 0 })),
      teamB: teamB.map(p => ({ ...p, pts: 0, reb: 0, ast: 0, stl: 0, blk: 0 })),
      scoreA: 0,
      scoreB: 0,
      finished: false,
    }
    localStorage.setItem('hoops-current-game', JSON.stringify(game))
    navigate('/live-game')
  }

  function teamTag(player) {
    if (teamA.find(p => p.id === player.id)) return 'A'
    if (teamB.find(p => p.id === player.id)) return 'B'
    return null
  }

  return (
    <div>
      <div style={s.heading}>New Game</div>
      <div style={s.sub}>Tap a player to add them to a team. Max 4 per team (3 + sub).</div>

      <div style={s.teamCard}>
        <div style={{ ...s.teamLabel, color: '#1d4ed8' }}>Team A — {teamA.length} players</div>
        {players.length === 0 && <div style={{ fontSize: 13, color: '#888' }}>No players in roster yet</div>}
        {players.map(p => {
          const tag = teamTag(p)
          const inA = tag === 'A'
          const inB = tag === 'B'
          return (
            <button
              key={p.id}
              style={{ ...s.playerBtn, ...(inA ? s.selectedA : {}), opacity: inB ? 0.35 : 1 }}
              onClick={() => togglePlayer(p, teamA, setTeamA, teamB)}
              disabled={inB}
            >
              {p.name}
              {inA && <span>✓</span>}
            </button>
          )
        })}
      </div>

      <div style={s.teamCard}>
        <div style={{ ...s.teamLabel, color: '#c2410c' }}>Team B — {teamB.length} players</div>
        {players.map(p => {
          const tag = teamTag(p)
          const inA = tag === 'A'
          const inB = tag === 'B'
          return (
            <button
              key={p.id}
              style={{ ...s.playerBtn, ...(inB ? s.selectedB : {}), opacity: inA ? 0.35 : 1 }}
              onClick={() => togglePlayer(p, teamB, setTeamB, teamA)}
              disabled={inA}
            >
              {p.name}
              {inB && <span>✓</span>}
            </button>
          )
        })}
      </div>

      {error && <div style={s.error}>{error}</div>}

      <button
        style={teamA.length >= 2 && teamB.length >= 2 ? s.startBtn : s.disabledBtn}
        onClick={startGame}
      >
        Start Game
      </button>
    </div>
  )
}