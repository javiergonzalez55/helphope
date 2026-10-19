import React, { useState } from 'react'
import { postJSON } from '../services/api'

export default function Login({ onLogin }){
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  async function handleSubmit(e){
    e.preventDefault()
    setLoading(true)
    setError(null)
    try{
      const res = await postJSON('login.php', { email, senha }, false)
      if (res.success) {
        setMessage('Login realizado. Bem-vindo ' + res.user.nome)
        if (onLogin) onLogin(res.user)
      } else {
        setError(res.error || 'Erro')
      }
    } catch(err){
      setError('Erro de conexão')
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>Login</h2>
      <input type="email" placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)} required />
      <input type="password" placeholder="Senha" value={senha} onChange={e=>setSenha(e.target.value)} required />
      <button type="submit" disabled={loading}>{loading? 'Entrando...':'Entrar'}</button>
      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}
    </form>
  )
}
