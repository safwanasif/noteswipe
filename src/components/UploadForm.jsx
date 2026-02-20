import { useState } from 'react'
import { createNote } from '../api/notes'
import { extractNoteFromImage } from '../api/gemini'

function UploadForm({ refresh }) {
  const [username, setUsername] = useState('')
  const [course, setCourse] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const [imageFile, setImageFile] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [scanError, setScanError] = useState('')

  const readFileAsDataURL = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  const handleScanWithGemini = async () => {
    if (!imageFile) return
    setScanError('')
    setScanning(true)

    try {
      const dataUrl = await readFileAsDataURL(imageFile)
      const [meta, base64] = dataUrl.split(',')
      const mimeType =
        meta?.match(/data:(.*);base64/)?.[1] ||
        imageFile.type ||
        'image/png'

      const extracted = await extractNoteFromImage({ base64, mimeType })

      setCourse(extracted?.course || course)
      setTitle(extracted?.title || title)
      setContent(extracted?.content || content)
    } catch (e) {
      setScanError('Scan failed. Try a clearer image.')
      console.error(e)
    } finally {
      setScanning(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { error } = await createNote({
      username,
      course,
      title,
      content
    })

    if (!error) {
      setUsername('')
      setCourse('')
      setTitle('')
      setContent('')
      setImageFile(null)
      setScanError('')
      refresh()
    } else {
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

      {/* Username */}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        style={{
          padding: '12px',
          borderRadius: '10px',
          border: '1px solid #333',
          background: '#111',
          color: 'white',
        }}
      />

      {/* Image Scan */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
      />

      <button
        type="button"
        onClick={handleScanWithGemini}
        disabled={!imageFile || scanning}
        style={{
          padding: '12px',
          borderRadius: '10px',
          background: scanning
            ? '#222'
            : 'linear-gradient(135deg, #0ea5e9, #22c55e)',
          color: 'white',
          fontWeight: 600,
          cursor: 'pointer'
        }}
      >
        {scanning ? '🔍 Scanning...' : '📸 Scan Notes with Gemini'}
      </button>

      {scanError && (
        <div style={{ color: '#f87171' }}>{scanError}</div>
      )}

      {/* Course */}
      <input
        type="text"
        placeholder="Course (CHEM151)"
        value={course}
        onChange={(e) => setCourse(e.target.value)}
        required
        style={{
          padding: '12px',
          borderRadius: '10px',
          border: '1px solid #333',
          background: '#111',
          color: 'white',
        }}
      />

      {/* Title */}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={{
          padding: '12px',
          borderRadius: '10px',
          border: '1px solid #333',
          background: '#111',
          color: 'white',
        }}
      />

      {/* Content */}
      <textarea
        placeholder="Paste notes here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows="7"
        required
        style={{
          padding: '12px',
          borderRadius: '10px',
          border: '1px solid #333',
          background: '#111',
          color: 'white',
        }}
      />

      <button
        type="submit"
        style={{
          padding: '14px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
          color: 'white',
          fontWeight: 700,
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Upload Note
      </button>
    </form>
  )
}

export default UploadForm