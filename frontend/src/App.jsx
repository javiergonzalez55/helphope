import React, { useState } from 'react'
import Register from './components/Register'
import Login from './components/Login'
import AdminPanel from './components/AdminPanel'

export default function App(){
  const [user, setUser] = useState(null)

  return (
    <div className="app">
      <h1>HelpHope - MVP</h1>
      <div className="forms">
        <Register />
        <Login onLogin={setUser} />
      </div>
      {user && user.tipo === 'admin' && (
        <div style={{marginTop:20}}>
          <h2>Painel Administrador</h2>
          <AdminPanel />
        </div>
      )}
    </div>
  )
}
