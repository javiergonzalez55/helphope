import React, { useEffect, useState } from 'react'
import { API_BASE } from '../services/api'
import { postJSON } from '../services/api'

export default function AdminPanel(){
  const [pendentes, setPendentes] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [auditoria, setAuditoria] = useState([])

  async function fetchPendentes(){
    setLoading(true)
    try{
      const res = await fetch(`${API_BASE}/admin/list-pending-users.php`, { credentials: 'include' })
      const json = await res.json()
      if (json.success) setPendentes(json.pendentes || [])
      else setError(json.error || 'Erro')
    } catch(err){ setError('Erro de conexao') }
    setLoading(false)
  }

  async function fetchAuditoria(){
    try{
      const res = await fetch(`${API_BASE}/admin/auditoria.php`, { credentials: 'include' })
      const json = await res.json()
      if (json.success) setAuditoria(json.auditoria || [])
    } catch(err){}
  }

  useEffect(()=>{ fetchPendentes(); fetchAuditoria(); }, [])

  async function handleAction(usuario_id, action){
    setError(null); setMessage(null)
    let reason = ''
    if (action === 'reject'){
      reason = prompt('Motivo da rejeicao (obrigatorio):') || ''
      if (!reason) { alert('Rejeicao precisa de motivo'); return }
    }
    try{
      const res = await postJSON('admin/approve-user.php', { usuario_id, action, reason })
      if (res.success) {
        setMessage('Acao realizada com sucesso')
        fetchPendentes()
        fetchAuditoria()
      } else {
        setError(res.error || 'Erro')
      }
    } catch(err){ setError('Erro de conexao') }
  }

  return (
    <div className="card">
      <h3>Usuarios Pendentes</h3>
      {loading && <div>Carregando...</div>}
      {error && <div className="error">{error}</div>}
      {message && <div className="success">{message}</div>}
      <table style={{width:'100%', borderCollapse:'collapse'}}>
        <thead><tr><th>Tipo</th><th>Nome</th><th>Documento</th><th>Email</th><th>Data</th><th>Acoes</th></tr></thead>
        <tbody>
          {pendentes.map(p => (
            <tr key={p.id} style={{borderTop:'1px solid #ddd'}}>
              <td>{p.tipo}</td>
              <td>{p.nome}</td>
              <td>{p.documento}</td>
              <td>{p.email}</td>
              <td>{p.criado_em}</td>
              <td>
                <button onClick={()=>handleAction(p.id,'approve')}>Aprovar</button>
                <button onClick={()=>handleAction(p.id,'reject')}>Rejeitar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{marginTop:20}}>Auditoria (ultimas)</h3>
      <ul>
        {auditoria.map(a => (
          <li key={a.id}>{a.criado_em} - {a.acao} - {a.detalhe}</li>
        ))}
      </ul>
    </div>
  )
}
