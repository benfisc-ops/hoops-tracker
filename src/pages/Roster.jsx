import { useState, useEffect } from 'react'

const s = {
  heading: { fontSize: 22, fontWeight: 500, marginBottom: '1rem' },
  card: { background: '#fff', borderRadius: 12, padding: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #e0e0e0' },
  name: { fontWeight: 500, fontSize: 15 },
  row: { display: 'flex', gap: 8, marginBottom: '1rem' },
  input: { flex: 1, padding: '0.6rem 0.75rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 15 },
  addBtn: { background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '0.6rem 1rem', fontSize: 15 },
  delBtn: { background: 'none', border: 'none', color: '#e53e3e', fontSize: 18, padding: '0 4px' },
  empty: { color: '#888', fontSize: 14, textAlign: 'center', marginTop: '2rem' },
}

export default function Roster() {
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem('hoops-players')
    return saved ? JSON.parse(saved) : []
  })
  const [name, setName] = useState('')

  useEffect(() => {
    localStorage.setItem('hoops-players', JSON.stringify(players))
  }, [players])

  function addPlayer() {
    const trimmed = name.trim()
    if (!trimmed) return
    if (players.find(p => p.name.toLowerCase() === trimmed.toLowerCase())) return
    setPlayers([...players, { id: Date.now(), name: trimmed }])
    setName('')
  }

  function deletePlayer(id) {
    setPlayers(players.filter(p => p.id !== id))
  }

  return (
    <div>
      <div style={s.heading}>Roster</div>
      <div style={s.row}>
        <input
          style={s.input}
          placeholder="Player name"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addPlayer()}
        />
        <button style={s.addBtn} onClick={addPlayer}>Add</button>
      </div>

      {players.length === 0 && (
        <div style={s.empty}>No players yet — add your crew above</div>
      )}

      {players.map(p => (
        <div key={p.id} style={s.card}>
          <div style={s.name}>{p.name}</div>
          <button style={s.delBtn} onClick={() => deletePlayer(p.id)}>✕</button>
        </div>
      ))}
    </div>
  )
}