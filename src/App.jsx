import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeProvider'
import Layout from './components/Layout'
import Home from './pages/Home'
import Trails from './pages/Trails'
import TrailDetail from './pages/TrailDetail'
import GroupHikes from './pages/GroupHikes'
import GroupHikeDetail from './pages/GroupHikeDetail'
import About from './pages/About'
import Login from './pages/Login'
import Profile from './pages/Profile'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/trails" element={<Trails />} />
            <Route path="/trails/:trailId" element={<TrailDetail />} />
            <Route path="/group-hikes" element={<GroupHikes />} />
            <Route path="/group-hikes/:hikeId" element={<GroupHikeDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
