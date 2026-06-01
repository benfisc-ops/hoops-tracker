import { NavLink } from 'react-router-dom'

const styles = {
  nav: {
    background: '#fff',
    borderBottom: '1px solid #e0e0e0',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '0.75rem 0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  link: {
    textDecoration: 'none',
    color: '#888',
    fontSize: 13,
    fontWeight: 500,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 3,
  },
  active: {
    color: '#2563eb',
  },
}

export default function Nav() {
  const linkStyle = ({ isActive }) => ({
    ...styles.link,
    ...(isActive ? styles.active : {}),
  })

  return (
    <nav style={styles.nav}>
      <NavLink to="/roster" style={linkStyle}>Roster</NavLink>
      <NavLink to="/new-game" style={linkStyle}>New Game</NavLink>
      <NavLink to="/history" style={linkStyle}>History</NavLink>
    </nav>
  )
}