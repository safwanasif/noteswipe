import { useEffect, useState } from 'react'
import { fetchNotes } from '../api/notes'

function LeaderboardPage({ onOpenCourse }) {
  const [notes, setNotes] = useState([])
  const [selectedCourse, setSelectedCourse] = useState('all')
  const [sortType, setSortType] = useState('upvotes')

  const loadNotes = async () => {
    const { data } = await fetchNotes()
    if (data) setNotes(data)
  }

  useEffect(() => {
    loadNotes()
  }, [])

  const uniqueCourses = ['all', ...new Set(notes.map(n => n.course))]

  let filtered =
    selectedCourse === 'all'
      ? notes
      : notes.filter(n => n.course === selectedCourse)

  let sorted = [...filtered]

  if (sortType === 'upvotes') {
    sorted.sort((a, b) => {
      if (b.upvotes === a.upvotes) return a.downvotes - b.downvotes
      return b.upvotes - a.upvotes
    })
  } else if (sortType === 'newest') {
    sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  } else if (sortType === 'leastDownvotes') {
    sorted.sort((a, b) => a.downvotes - b.downvotes)
  }

  return (
    <div style={{
      width: '100%',
      maxWidth: '920px',
      margin: '0 auto',
      padding: '40px 20px 80px'
    }}>
      <h1 style={{ marginBottom: '10px' }}>Leaderboard</h1>
      <div className="header-accent" />

      <div style={{ display: 'flex', gap: '15px', marginBottom: '28px' }}>
        <select
          className="select-dark"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          {uniqueCourses.map(course => (
            <option key={course} value={course}>
              {course.toUpperCase()}
            </option>
          ))}
        </select>

        <select
          className="select-dark"
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="upvotes">Most Upvotes</option>
          <option value="newest">Newest</option>
          <option value="leastDownvotes">Least Downvotes</option>
        </select>
      </div>

      {sorted.map((note, index) => (
        <div
          key={note.id}
          onClick={() => onOpenCourse && onOpenCourse(note.course)}
          style={{
            cursor: onOpenCourse ? 'pointer' : 'default',
            border: index === 0 ? '2px solid gold' : '1px solid rgba(255,255,255,0.08)',
            padding: '24px',
            marginBottom: '20px',
            borderRadius: '18px',
            background: 'linear-gradient(145deg, #171717, #101010)',
            boxShadow: '0 14px 40px rgba(0,0,0,0.45)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          <h3 style={{ marginBottom: '14px' }}>
            #{index + 1} — {note.title}
            {index === 0 && (
              <span style={{ marginLeft: '12px', color: 'gold', fontWeight: 700, fontSize: '13px' }}>
                🏆 Top Contributor
              </span>
            )}
          </h3>

          <p style={{ opacity: 0.9, marginBottom: '10px' }}>
            <strong>Course:</strong> {note.course}
          </p>

          <p style={{ opacity: 0.9 }}>
            👍 {note.upvotes} &nbsp; 👎 {note.downvotes}
          </p>

          {onOpenCourse && (
            <p style={{ marginTop: '10px', opacity: 0.6, fontSize: '13px' }}>
              Click to jump to {note.course} in Swipe
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

export default LeaderboardPage