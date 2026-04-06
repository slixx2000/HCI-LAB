import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import SideNavBar from './components/SideNavBar'
import Home from './pages/Home'
import Calendar from './pages/Calendar'
import Registered from './pages/Registered'
import FeedbackHub from './pages/FeedbackHub'
import Profile from './pages/Profile'
import EventDetails from './pages/EventDetails'
import Feedback from './pages/Feedback'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-surface text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
        <Navbar />
        <div className="flex min-h-screen pt-20">
          <SideNavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/registered" element={<Registered />} />
            <Route path="/feedback" element={<FeedbackHub />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/feedback/:eventId" element={<Feedback />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
