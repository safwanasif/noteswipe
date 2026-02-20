function NavBar({ current, setCurrent }) {
  const tabs = ['upload', 'swipe', 'leaderboard']

  return (
    <div className="navbar">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setCurrent(tab)}
          className={`nav-btn ${current === tab ? 'active' : ''}`}
        >
          {tab.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

export default NavBar