import React from 'react'
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'
import CreatePost from "./pages/createpost"
import Feed from "./pages/feed"
import Starfield from "./components/Starfield"

const App = () => {
  return (
    <Router>
      <Starfield />
      <header className="app-header">
        <div className="header-container">
          <div className="app-brand">✨ StarShare</div>
          <nav className="nav-links">
            <NavLink
              to="/posts"
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              Feed
            </NavLink>
            <NavLink
              to="/create-post"
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              Create Post
            </NavLink>
          </nav>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/posts" element={<Feed />} />
          <Route path="/create-post" element={<CreatePost />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App