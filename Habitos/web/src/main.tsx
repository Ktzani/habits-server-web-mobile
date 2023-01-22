import React from 'react'
import ReactDOM from 'react-dom/client' //Para utilizar o react no browser usamos o DOM
import { App }  from './App'
// import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
