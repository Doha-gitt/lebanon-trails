import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeProvider'
import { AuthProvider } from './context/AuthProvider'
import { HikesProvider } from './context/HikesProvider'
import Layout from './components/Layout'
import RequireAuth from './components/RequireAuth'
import Home from './pages/Home'
import TrailList from './pages/TrailList'
import TrailDetail from './pages/TrailDetail'
import GroupHikeDetail from './pages/GroupHikeDetail'
import HikeForm from './pages/HikeForm'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HikesProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/trails" element={<TrailList />} />
                <Route path="/trails/:trailId" element={<TrailDetail />} />
                <Route
                  path="/group-hikes/new"
                  element={
                    <RequireAuth>
                      <HikeForm />
                    </RequireAuth>
                  }
                />
                <Route path="/group-hikes/:hikeId" element={<GroupHikeDetail />} />
                <Route
                  path="/group-hikes/:hikeId/edit"
                  element={
                    <RequireAuth>
                      <HikeForm />
                    </RequireAuth>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </HikesProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
