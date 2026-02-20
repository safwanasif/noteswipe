import { voteNote } from '../api/notes'

function NoteCard({ note, refresh }) {
  const handleVote = async (type) => {
    const { error } = await voteNote(note, type)
    if (!error) refresh()
  }

  return (
    <div
      style={{
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'linear-gradient(145deg, #171717, #101010)',
        padding: '22px',
        marginBottom: '18px',
        borderRadius: '16px',
        boxShadow: '0 12px 35px rgba(0,0,0,0.35)',
      }}
    >
      <h3 style={{ marginBottom: '10px' }}>{note.title}</h3>

      <p style={{ opacity: 0.85, marginBottom: '14px' }}>
        <strong>Course:</strong> {note.course}
      </p>

      <p style={{ lineHeight: 1.6, opacity: 0.9 }}>{note.content}</p>

      <div style={{ marginTop: '14px', opacity: 0.9 }}>
        👍 {note.upvotes} &nbsp; | &nbsp; 👎 {note.downvotes}
      </div>

      <div style={{ marginTop: '14px', display: 'flex', gap: '10px' }}>
        <button className="vote-btn up" onClick={() => handleVote('up')}>👍</button>
        <button className="vote-btn down" onClick={() => handleVote('down')}>👎</button>
      </div>
    </div>
  )
}

export default NoteCard