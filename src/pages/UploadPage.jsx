import { useEffect, useState } from 'react'
import { fetchNotes } from '../api/notes'
import UploadForm from '../components/UploadForm'
import NoteCard from '../components/NoteCard'

function UploadPage() {
  const [notes, setNotes] = useState([])

  const loadNotes = async () => {
    const { data } = await fetchNotes()
    if (data) setNotes(data)
  }

  useEffect(() => {
    loadNotes()
  }, [])

  return (
    <div style={{
      width: '100%',
      maxWidth: '920px',
      margin: '0 auto',
      padding: '40px 20px 80px'
    }}>
      <h1 style={{ marginBottom: '10px' }}>NoteSwipe</h1>
      <div className="header-accent" />

      {/* Upload Section */}
      <h2 style={{
        marginTop: '30px',
        fontSize: '22px',
        fontWeight: 600,
        opacity: 0.9
      }}>
        Upload Note
      </h2>

      <UploadForm refresh={loadNotes} />

      <div style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
        margin: '60px 0'
      }} />

      {/* Top Notes */}
      <h2 style={{
        fontSize: '22px',
        fontWeight: 600,
        marginBottom: '25px'
      }}>
        🔥 Top Notes
      </h2>

      {notes.map((note) => (
        <NoteCard key={note.id} note={note} refresh={loadNotes} />
      ))}
    </div>
  )
}

export default UploadPage