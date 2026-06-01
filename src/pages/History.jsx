import { useState, useEffect } from 'react'

const s = {
  heading: { fontSize: 22, fontWeight: 500, marginBottom: '1rem' },
  tabs: { display: 'flex', gap: 8, marginBottom: '1rem' },
  tab: { padding: '6px 16px', borderRadius: 8, border: '1px solid #e0e0e0', background: '#f5f5f5', fontSize: 13, fontWeight: 500, color: '#888' },
  activeTab: { padding: '6px 16px', borderRadius: 8, border: '1px solid #2563eb', background: '#eff6ff', fontSize: 13, fontWeight: 500, color: '#2563eb' },
  card: { background: '#fff', borderRadius: 12, border: '1px solid #e0e0e0', padding: '1rem', marginBottom: '0.75rem' },
  gameHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  date: { fontSize: 12, color: '#888' },
  score: { fontWeight: 500, fontSize: 18 },
  winner: { fontSize: 12, color: '#16a34a', fontWeight: 500 },
  statRow: { display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0', borderBottom: '1px solid #f0f0f0' },
  statName: { fontWeight: 500 },
  statVal: { color: '#888' },
  empty: { color: '#888', fontSize: 14, textAlign: 'center', marginTop: '2rem' },
  leaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f0f0f0' },
  rank: { fontSize: 13, color: '#888', minWidth: 24 },
  lName: { fontWeight: 500, fontSize: 14, flex: 1 },
  lStat: { fontSize: 13, color: '#2563eb', fontWeight: 500 },
  catBtn: { padding: '4px 10px', borderRadius: 6, border: '1px solid #e0e0e0', background: '#f5f5f5', fontSize: 12, color: '#888' },
  activeCat: { padding: '4px 10px', borderRadius: 6, border: '1px solid #2563eb', background: '#eff6ff', fontSize: 12, color: '#2563eb' },
  delBtn: { background: 'none', border: 'none', color: '#e53e3e', fontSize: 13, padding: '2px 6px', borderRadius: 6, cursor: 'pointer' },
  confirmRow: { display: 'flex', gap: 8, marginTop: 10, paddingTop: 10, borderTop: '1px solid #f0f0f0' },
  confirmBtn: { flex: 1, background: '#e53e3e', color: '#fff', border: 'none', borderRadius: 8, padding: '6px', fontSize: 13, cursor: 'pointer' },
  cancelBtn: { flex: 1, background: '#f5f5f5', color: '#444', border: '1px solid #e0e0e0', borderRadius: 8, padding: '6px', fontSize: 13, cursor: 'pointer' },
}

export default function History() {
  const [history, setHistory] = useState([])
  const [tab, setTab] = useState('games')
  const [cat, setCat] = useState('pts')
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('hoops-history')
    if (saved) setHistory(JSON.parse(saved))
  }, [])

  function deleteGame(id) {
    const updated = history.filter(g => g.id !== id)
    setHistory(updated)
    localStorage.setItem('hoops-history', JSON.stringify(updated))
    setConfirmDelete(null)
  }

  function getLeaderboard(stat) {
    const totals = {}
    const games = {}
    history.forEach(g => {
      ;[...g.teamA, ...g.teamB].forEach(p => {
        if (!totals[p.name]) { totals[p.name] = 0; games[p.name] = 0 }
        totals[p.name] += p[stat] || 0
        games[p.name] += 1
      })
    })
    return Object.entries(totals)
      .map(([name, total]) => ({ name, avg: (total / games[name]).toFixed(1), total }))
      .sort((a, b) => b.total - a.total)
  }

  function winnerLabel(g) {
    if (g.scoreA > g.scoreB) return 'Team A wins'
    if (g.scoreB > g.scoreA) return 'Team B wins'
    return 'Tie'
  }

  const leaders = getLeaderboard(cat)

  return (
    <div>
      <div style={s.heading}>History</div>

      <div style={s.tabs}>
        <button style={tab === 'games' ? s.activeTab : s.tab} onClick={() => setTab('games')}>Games</button>
        <button style={tab === 'stats' ? s.activeTab : s.tab} onClick={() => setTab('stats')}>Leaderboard</button>
      </div>

      {tab === 'games' && (
        <>
          {history.length === 0 && <div style={s.empty}>No games yet — finish a game to see it here</div>}
          {history.map(g => (
            <div key={g.id} style={s.card}>
              <div style={s.gameHeader}>
                <div style={s.date}>{g.date}</div>
                <div style={s.score}>{g.scoreA} – {g.scoreB}</div>
                <div style={s.winner}>{winnerLabel(g)}</div>
                <button
                  style={s.delBtn}
                  onClick={() => setConfirmDelete(confirmDelete === g.id ? null : g.id)}
                >
                  ✕ delete
                </button>
              </div>

              {[...g.teamA, ...g.teamB].map(p => (
                <div key={p.id} style={s.statRow}>
                  <div style={s.statName}>{p.name}</div>
                  <div style={s.statVal}>{p.pts}pts · {p.reb}reb · {p.ast}ast · {p.stl}stl · {p.blk || 0}blk</div>
                </div>
              ))}

              {confirmDelete === g.id && (
                <div style={s.confirmRow}>
                  <button style={s.cancelBtn} onClick={() => setConfirmDelete(null)}>Cancel</button>
                  <button style={s.confirmBtn} onClick={() => deleteGame(g.id)}>Yes, delete this game</button>
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {tab === 'stats' && (
        <>
          <div style={{ display: 'flex', gap: 6, marginBottom: '1rem' }}>
            {['pts', 'reb', 'ast', 'stl', 'blk'].map(c => (
              <button key={c} style={cat === c ? s.activeCat : s.catBtn} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
          {history.length === 0 && <div style={s.empty}>No stats yet</div>}
          <div style={s.card}>
            {leaders.map((p, i) => (
              <div key={p.name} style={s.leaderRow}>
                <div style={s.rank}>#{i + 1}</div>
                <div style={s.lName}>{p.name}</div>
                <div style={{ fontSize: 12, color: '#888', marginRight: 8 }}>{p.avg}/game</div>
                <div style={s.lStat}>{p.total} total</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}