import { generateStudyMode } from '../api/gemini'
import { useEffect, useState } from 'react'
import { fetchNotes, voteNote } from '../api/notes'
import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import 'katex/dist/katex.min.css'
import '../styles/swipe.css'

function SwipePage({ onProfileClick, initialCourse = 'all' }) {
  const [notes, setNotes] = useState([])
  const [filteredNotes, setFilteredNotes] = useState([])
  const [index, setIndex] = useState(0)
  const [selectedCourse, setSelectedCourse] = useState(initialCourse)

  const [studyOutput, setStudyOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [direction, setDirection] = useState(null)

  // 🔥 Load notes
  const loadNotes = async () => {
    const { data } = await fetchNotes()
    if (data) {
      setNotes(data)
    }
  }

  useEffect(() => {
    loadNotes()
  }, [])

  // 🔥 Sync course if coming from leaderboard
  useEffect(() => {
    setSelectedCourse(initialCourse)
  }, [initialCourse])

  // 🔥 Filter logic
  useEffect(() => {
    let updated =
      selectedCourse === 'all'
        ? notes
        : notes.filter(n => n.course === selectedCourse)

    setFilteredNotes(updated)
    setIndex(0)
  }, [selectedCourse, notes])

  // 🔥 Voting (Optimistic UI)
  const handleVote = async (type) => {
    const currentNote = filteredNotes[index]
    if (!currentNote) return

    setDirection(type === 'up' ? 'right' : 'left')

    const updatedNotes = filteredNotes.map((note, i) => {
      if (i !== index) return note

      return {
        ...note,
        upvotes: type === 'up' ? note.upvotes + 1 : note.upvotes,
        downvotes: type === 'down' ? note.downvotes + 1 : note.downvotes,
      }
    })

    setFilteredNotes(updatedNotes)

    await voteNote(currentNote, type)

    setTimeout(() => {
      if (index < updatedNotes.length - 1) {
        setIndex(index + 1)
      } else {
        setIndex(0)
      }

      setStudyOutput('')
      setDirection(null)
    }, 300)
  }

  const handleStudyMode = async () => {
    const currentNote = filteredNotes[index]
    if (!currentNote) return

    setLoading(true)
    const output = await generateStudyMode(currentNote.content)
    setStudyOutput(output)
    setLoading(false)
  }

  const uniqueCourses = ['all', ...new Set(notes.map(n => n.course))]

  if (filteredNotes.length === 0) {
    return (
      <div style={{ padding: '40px' }}>
        <h2>No notes available</h2>
      </div>
    )
  }

  const currentNote = filteredNotes[index]

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '920px',
        margin: '0 auto',
        padding: '40px 20px 80px'
      }}
    >
      <h1 style={{ marginBottom: '12px' }}>Swipe Notes</h1>
      <div className="header-accent" />

      {/* 🔥 Course Filter */}
      <select
        className="select-dark"
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
        style={{ marginBottom: '30px' }}
      >
        {uniqueCourses.map(course => (
          <option key={course} value={course}>
            {course.toUpperCase()}
          </option>
        ))}
      </select>

      <div
        className={`swipe-card ${
          direction === 'left'
            ? 'swipe-left'
            : direction === 'right'
            ? 'swipe-right'
            : ''
        }`}
        style={{
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '32px',
          borderRadius: '20px',
          background: 'linear-gradient(145deg, #171717, #101010)',
          boxShadow: '0 18px 50px rgba(0,0,0,0.5)',
        }}
      >
        <h2 style={{ marginBottom: '12px' }}>{currentNote.title}</h2>

        <p style={{ opacity: 0.7, marginBottom: '10px' }}>
          Posted by{" "}
          <span
            onClick={() => onProfileClick(currentNote.username)}
            style={{
              color: '#60a5fa',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            @{currentNote.username}
          </span>
        </p>

        <p style={{ marginBottom: '10px' }}>
          <strong>Course:</strong> {currentNote.course}
        </p>

        <p style={{ lineHeight: 1.6 }}>{currentNote.content}</p>

        <div
          style={{
            marginTop: '30px',
            display: 'flex',
            justifyContent: 'center',
            gap: '25px'
          }}
        >
          <button onClick={() => handleVote('up')} className="vote-btn up">
            👍
          </button>
          <button onClick={() => handleVote('down')} className="vote-btn down">
            👎
          </button>
        </div>

        <div style={{ marginTop: '25px', textAlign: 'center' }}>
          <button
            onClick={handleStudyMode}
            disabled={loading}
            className="study-btn"
          >
            🧠 Generate Study Mode
          </button>
        </div>

        {loading && (
          <div className="ai-loading">
            <div className="brain">🧠</div>
            <div className="spinner" />
            <p>Generating…</p>
          </div>
        )}

        {studyOutput && (
          <div
            style={{
              marginTop: '30px',
              background: '#111',
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {studyOutput}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}

export default SwipePage