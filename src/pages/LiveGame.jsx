import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const s = {
  scoreboard: { background: '#fff', borderRadius: 12, border: '1px solid #e0e0e0', padding: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  teamScoreBlock: { textAlign: 'center', flex: 1 },
  teamLabel: { fontSize: 12, color: '#888', marginBottom: 4 },
  bigScore: { fontSize: 44, fontWeight: 500 },
  divider: { fontSize: 20, color: '#ccc' },
  sectionLabel: { fontSize: 11, fontWeight: 500, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 },
  playerCard: { background: '#fff', borderRadius: 12, border: '1px solid #e0e0e0', padding: '0.75rem 1rem', marginBottom: 8 },
  playerTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  playerName: { fontWeight: 500, fontSize: 15 },
  playerStats: { fontSize: 12, color: '#888' },
  btnRow: { display: 'flex', gap: 6, marginBottom: 6 },
  btn2: { padding: '7px 14px', borderRadius: 8, border: '1px solid #bfdbfe', background: '#eff6ff', color: '#1d4ed8', fontWeight: 500, fontSize: 14 },
  btn1: { padding: '7px 14px', borderRadius: 8, border: '1px solid #e0e0e0', background: '#f5f5f5', color: '#444', fontWeight: 500, fontSize: 14 },
  statGroup: { display: 'flex', alignItems: 'center', gap: 4 },
  statLabel: { fontSize: 11, color: '#888', minWidth: 22, textAlign: 'center' },
  statVal: { fontSize: 14, fontWeight: 500, minWidth: 20, textAlign: 'center' },
  plusBtn: { padding: '4px 8px', borderRadius: 6, border: '1px solid #e0e0e0', background: '#f5f5f5', color: '#444', fontSize: 13 },
  minusBtn: { padding: '4px 8px', borderRadius: 6, border: '1px solid #e0e0e0', background: '#fff', color: '#e53e3e', fontSize: 13 },
  undoBtn: { background: 'none', border: '1px solid #e0e0e0', borderRadius: 8, padding: '0.6rem 1rem', fontSize: 13, color: '#888' },
  endBtn: { flex: 1, background: '#16a34a', color: '#fff', border: 'none', borderRadius: 10, padding: '0.75rem', fontSize: 15, fontWeight: 500 },
  footerRow: { display: 'flex', gap: 8, marginTop: '1rem' },
}

export default function LiveGame() {
  const [game, setGame] = useState(null)
  const [log, setLog] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const saved = localStorage.getItem('hoops-current-game')
    if (saved) setGame(JSON.parse(saved))
    else navigate('/new-game')
  }, [])

  function addStat(team, pi, stat, val, label) {
    setGame(prev => {
      const g = JSON.parse(JSON.stringify(prev))
      const player = g[team][pi]
      const newVal = player[stat] + val
      if (newVal < 0) return prev
      player[stat] = newVal
      if (stat === 'pts') {
        if (team === 'teamA') g.scoreA = Math.max(0, g.scoreA + val)
        else g.scoreB = Math.max(0, g.scoreB + val)
      }
      const entry = { team, pi, stat, val, label, name: player.name }
      setLog(l => [entry, ...l])
      localStorage.setItem('hoops-current-game', JSON.stringify(g))
      return g
    })
  }

  function undo() {
    if (!log.length) return
    const last = log[0]
    setLog(l => l.slice(1))
    setGame(prev => {
      const g = JSON.parse(JSON.stringify(prev))
      g[last.team][last.pi][last.stat] = Math.max(0, g[last.team][last.pi][last.stat] - last.val)
      if (last.stat === 'pts') {
        if (last.team === 'teamA') g.scoreA = Math.max(0, g.scoreA - last.val)
        else g.scoreB = Math.max(0, g.scoreB - last.val)
      }
      localStorage.setItem('hoops-current-game', JSON.stringify(g))
      return g
    })
  }

  function endGame() {
    const g = { ...game, finished: true }
    const history = JSON.parse(localStorage.getItem('hoops-history') || '[]')
    history.unshift(g)
    localStorage.setItem('hoops-history', JSON.stringify(history))
    localStorage.removeItem('hoops-current-game')
    navigate('/history')
  }

  if (!game) return null

  const statCats = ['reb', 'ast', 'stl', 'blk']

  const renderTeam = (teamKey, color) => {
    const players = game[teamKey]
    return (
      <div style={{ marginBottom: '1rem' }}>
        <div style={s.sectionLabel}>{teamKey === 'teamA' ? 'Team A' : 'Team B'}</div>
        {players.map((p, pi) => (
          <div key={p.id} style={s.playerCard}>
            <div style={s.playerTop}>
              <div style={{ ...s.playerName, color }}>{p.name}</div>
              <div style={s.playerStats}>
                {p.pts}pts · {p.reb}reb · {p.ast}ast · {p.stl}stl · {p.blk}blk
              </div>
            </div>

            <div style={s.btnRow}>
              <button style={s.btn2} onClick={() => addStat(teamKey, pi, 'pts', 2, '+2')}>+2</button>
              <button style={s.btn1} onClick={() => addStat(teamKey, pi, 'pts', 1, '+1')}>+1</button>
              <button style={{ ...s.minusBtn, marginLeft: 4 }} onClick={() => addStat(teamKey, pi, 'pts', -1, '-1')}>−1</button>
              <button style={s.minusBtn} onClick={() => addStat(teamKey, pi, 'pts', -2, '-2')}>−2</button>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {statCats.map(stat => (
                <div key={stat} style={s.statGroup}>
                  <button style={s.minusBtn} onClick={() => addStat(teamKey, pi, stat, -1, `-${stat}`)}>−</button>
                  <div style={{ textAlign: 'center' }}>
                    <div style={s.statVal}>{p[stat]}</div>
                    <div style={s.statLabel}>{stat}</div>
                  </div>
                  <button style={s.plusBtn} onClick={() => addStat(teamKey, pi, stat, 1, `+${stat}`)}>+</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div style={s.scoreboard}>
        <div style={s.teamScoreBlock}>
          <div style={s.teamLabel}>Team A</div>
          <div style={{ ...s.bigScore, color: '#2563eb' }}>{game.scoreA}</div>
        </div>
        <div style={s.divider}>–</div>
        <div style={s.teamScoreBlock}>
          <div style={s.teamLabel}>Team B</div>
          <div style={{ ...s.bigScore, color: '#ea580c' }}>{game.scoreB}</div>
        </div>
      </div>

      {renderTeam('teamA', '#2563eb')}
      {renderTeam('teamB', '#ea580c')}

      {log.length > 0 && (
        <div style={{ fontSize: 12, color: '#888', marginBottom: '0.5rem' }}>
          Last: {log[0].name} — {log[0].label}
        </div>
      )}

      <div style={s.footerRow}>
        <button style={s.undoBtn} onClick={undo}>↩ Undo</button>
        <button style={s.endBtn} onClick={endGame}>End Game</button>
      </div>
    </div>
  )
}