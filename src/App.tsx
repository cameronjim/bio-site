import { Routes, Route } from 'react-router-dom'
import TokenGate from './pages/TokenGate'
import Expired from './pages/Expired'
import Admin from './pages/Admin'
import Portfolio from './components/Portfolio'

function App() {
  return (
    <Routes>
      {/* Dev-only: preview the gated portfolio without a token at "/" or "/preview".
          Both are stripped from production builds, where "/" falls through to the
          catch-all (Expired) just like before. */}
      {import.meta.env.DEV && <Route path="/" element={<Portfolio />} />}
      {import.meta.env.DEV && <Route path="/preview" element={<Portfolio />} />}
      <Route path="/t/:token" element={<TokenGate />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/expired" element={<Expired />} />
      {/* Vanity / root-path tokens, e.g. /mygfsname — validated like /t/:token.
          Static routes above (admin, expired) rank higher and still win; the admin
          Lambda's RESERVED_SLUGS list rejects slugs that would collide here. */}
      <Route path="/:token" element={<TokenGate />} />
      <Route path="*" element={<Expired />} />
    </Routes>
  )
}

export default App
