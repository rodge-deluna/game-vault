import { useEffect, useState } from 'react'

// Temporary smoke test: confirms the Vite proxy reaches the Express API.
// Replaced by the real games list page in the next step.
function App() {
  const [status, setStatus] = useState('Connecting to API...')

  useEffect(() => {
    fetch('/api/games')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(() => setStatus('Connected to GameVault API'))
      .catch((err: Error) => setStatus(`API error: ${err.message}`))
  }, [])

  return (
    <main>
      <h1>GameVault</h1>
      <p>{status}</p>
    </main>
  )
}

export default App
