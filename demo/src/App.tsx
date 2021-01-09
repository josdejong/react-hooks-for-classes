import React, { useState } from 'react'
import './App.css'
import Demo from './Demo'

// TODO: rewrite to class for consistency
function App() {
  const [showDemo, setShowDemo] = useState(true)

  return (
    <div className="App">
      <h1>react-hooks-for-classes demo</h1>
      <button onClick={() => setShowDemo(!showDemo)}>
        Toggle show demo
      </button>
      {
        showDemo && <Demo />
      }
    </div>
  );
}

export default App;
