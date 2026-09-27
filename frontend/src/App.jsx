import { BrowserRouter, Navigate, Route, Routes } from 'react-router'

function PlaceholderPage({ title }) {
  return <main><h1>{title}</h1></main>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/classify" replace />} />
        <Route path="/classify" element={<PlaceholderPage title="Classify" />} />
        <Route path="/history" element={<PlaceholderPage title="History" />} />
        <Route path="/about" element={<PlaceholderPage title="About" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
