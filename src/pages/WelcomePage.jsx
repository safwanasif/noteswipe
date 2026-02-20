import { useState } from 'react'

function WelcomePage({ onEnter }) {
  const [username, setUsername] = useState('')

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `
        radial-gradient(circle at 20% 0%, rgba(124,58,237,0.25), transparent 40%),
        radial-gradient(circle at 80% 0%, rgba(34,197,94,0.18), transparent 40%),
        #0e0e0e
      `,
      color: 'white'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        padding: '40px',
        borderRadius: '24px',
        background: 'rgba(20,20,20,0.95)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>
          📚 NoteSwipe
        </h1>

        <p style={{ opacity: 0.7, marginBottom: '30px' }}>
          AI‑Enhanced Academic Discovery
        </p>

        <input
          type="text"
          placeholder="Choose a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '14px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: '#111',
            color: 'white',
            marginBottom: '20px',
            fontSize: '15px'
          }}
        />

        <button
          onClick={() => username && onEnter(username)}
          disabled={!username}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '16px',
            border: 'none',
            background: username
              ? 'linear-gradient(135deg, #7c3aed, #4f46e5)'
              : '#333',
            color: 'white',
            fontWeight: 600,
            cursor: username ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease'
          }}
        >
          Enter
        </button>
      </div>
    </div>
  )
}

export default WelcomePage