import { useEffect, useState } from 'react'
import { fetchNotes } from '../api/notes'

function ProfilePage({ username, goBack }) {
  const [notes, setNotes] = useState([])
  const [matchSent, setMatchSent] = useState(false)

  const loadNotes = async () => {
    const { data } = await fetchNotes()
    if (data) {
      const userNotes = data.filter(n => n.username === username)
      setNotes(userNotes)
    }
  }

  useEffect(() => {
  loadNotes()
  setMatchSent(false)
}, [username])

  const totalUpvotes = notes.reduce((sum, n) => sum + n.upvotes, 0)

  return (
    <div style={{
  width: '100%',
  maxWidth: '920px',
  margin: '0 auto',
  padding: '40px 20px 80px 20px'
}}>
      <button
        onClick={goBack}
        style={{
          marginBottom: '20px',
          background: '#222',
          color: 'white',
          border: '1px solid #444',
          padding: '8px 14px',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        ← Back
      </button>

      <h1 style={{ marginBottom: '10px' }}>{username}</h1>
      <div className="header-accent" />
      <p>Total Notes: {notes.length}</p>
      <p>Total Upvotes: {totalUpvotes}</p>
      <div style={{ marginTop: '20px' }}>
    <button
        onClick={() => setMatchSent(true)}
        disabled={matchSent}
        style={{
        padding: '12px 20px',
        borderRadius: '14px',
        border: 'none',
        background: matchSent
        ? 'rgba(34,197,94,0.15)'
        : 'linear-gradient(135deg, #0ea5e9, #22c55e)',
        color: matchSent ? '#22c55e' : 'white',
        fontWeight: 600,
        cursor: matchSent ? 'default' : 'pointer',
        transition: 'all 0.2s ease'
    }}
  >
    {matchSent
      ? 'Request Sent ✅'
      : `💬 Request Match with @${username}`}
  </button>
</div>

      <div style={{ marginTop: '30px' }}>
        {notes.map(note => (
          <div
            key={note.id}
            style={{
              border: '1px solid #333',
              padding: '20px',
              marginBottom: '20px',
              borderRadius: '12px',
              background: '#151515'
            }}
          >
            <h3>{note.title}</h3>
            <p><strong>Course:</strong> {note.course}</p>
            <p>👍 {note.upvotes} &nbsp; 👎 {note.downvotes}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProfilePage