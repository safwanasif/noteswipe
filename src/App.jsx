import { useState } from 'react'
import NavBar from './components/navBar'
import UploadPage from './pages/UploadPage'
import SwipePage from './pages/SwipePage'
import LeaderboardPage from './pages/LeaderboardPage'
import ProfilePage from './pages/ProfilePage'
import WelcomePage from './pages/WelcomePage'

function App() {
  const [currentPage, setCurrentPage] = useState('swipe')
  const [selectedUser, setSelectedUser] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  // optional: lets leaderboard send you to swipe filtered by a course
  const [swipeCourse, setSwipeCourse] = useState('all')

  if (!currentUser) {
    return <WelcomePage onEnter={setCurrentUser} />
  }

  const renderPage = () => {
    if (selectedUser) {
      return (
        <ProfilePage
          username={selectedUser}
          goBack={() => setSelectedUser(null)}
        />
      )
    }

    if (currentPage === 'upload') return <UploadPage />

    if (currentPage === 'leaderboard') {
      return (
        <LeaderboardPage
          onOpenCourse={(course) => {
            setSwipeCourse(course)
            setCurrentPage('swipe')
          }}
        />
      )
    }

    // NOTE: you’ll need the tiny SwipePage change below to accept initialCourse
    return <SwipePage onProfileClick={setSelectedUser} initialCourse={swipeCourse} />
  }

  return (
    <div className="app-root">
      <NavBar
        current={currentPage}
        setCurrent={(page) => {
          setSelectedUser(null)
          setCurrentPage(page)
        }}
      />

      <div className="page-wrapper">
        {renderPage()}
      </div>

      <footer className="app-footer">
        © 2026 NoteSwipe · Built for Hack Arizona · Powered by Gemini
      </footer>
    </div>
  )
}

export default App