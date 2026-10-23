import { Route, Routes } from 'react-router'
import Navbar from './components/Navbar'
import RequireAuth from './components/RequireAuth'
import BacklogPage from './pages/BacklogPage'
import GameDetailPage from './pages/GameDetailPage'
import GamesList from './pages/GamesList'
import ImportPage from './pages/ImportPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Routes>
          <Route path="/" element={<GamesList />} />
          <Route path="/games/:id" element={<GameDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/backlog"
            element={
              <RequireAuth>
                <BacklogPage />
              </RequireAuth>
            }
          />
          <Route
            path="/import"
            element={
              <RequireAuth>
                <ImportPage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<p className="text-gray-400">Page not found.</p>} />
        </Routes>
      </main>
    </div>
  )
}

export default App
