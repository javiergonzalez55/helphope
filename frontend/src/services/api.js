import { useEffect, useState } from 'react';
import { apiRequest } from './services/api';

const defaultAuth = {
  name: '',
  document: '',
  email: '',
  phone: '',
  password: '',
  type: 'doador',
  terms_accepted: false,
};

const defaultDonation = {
  category_id: '',
  title: '',
  description: '',
  quantity: '',
  unit: 'unidade',
};

const defaultRequest = {
  category_id: '',
  title: '',
  description: '',
  quantity: '',
  unit: 'unidade',
};

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('helphope_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState(defaultAuth);
  const [categories, setCategories] = useState([]);
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [dashboard, setDashboard] = useState({ stats: {}, ranking: [], history: [] });
  const [donationForm, setDonationForm] = useState(defaultDonation);
  const [requestForm, setRequestForm] = useState(defaultRequest);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem('helphope_user', JSON.stringify(user));
    loadAllData();
  }, [user]);

  const loadCategories = async () => {
    const response = await apiRequest('categories.php', 'GET');
    setCategories(response.data?.categories || []);
  };

  const loadDonations = async () => {
    const response = await apiRequest('donations.php?mode=mine', 'GET');
    setDonations(response.data?.donations || []);
  };

  const loadRequests = async () => {
    const response = await apiRequest('requests.php?mode=mine', 'GET');
    setRequests(response.data?.requests || []);
  };

  const loadPendingUsers = async () => {
    if (user?.type !== 'admin') return;
    const response = await apiRequest('admin.php', 'GET');
    setPendingUsers(response.data?.users || []);
  };

  const loadDashboard = async () => {
    const response = await apiRequest('dashboard.php', 'GET');
    setDashboard(response.data || { stats: {}, ranking: [], history: [] });
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      await loadCategories();
      await loadDonations();
      await loadRequests();
      await loadPendingUsers();
      await loadDashboard();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAuthForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await apiRequest('auth.php', 'POST', {
        email: authForm.email,
        password: authForm.password,
      });

      const currentUser = response.data?.user;
      setUser(currentUser);
      setMessage('Login realizado com sucesso.');
      setAuthForm(defaultAuth);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await apiRequest('users.php', 'POST', {
        name: authForm.name,
        document: authForm.document,
        email: authForm.email,
        phone: authForm.phone,
        password: authForm.password,
        type: authForm.type,
        terms_accepted: authForm.terms_accepted ? 1 : 0,
      });

      setMessage('Cadastro realizado com sucesso.');
      setAuthMode('login');
      setAuthForm(defaultAuth);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiRequest('donations.php', 'POST', {
        ...donationForm,
        quantity: Number(donationForm.quantity),
      });
      setDonationForm(defaultDonation);
      await loadDonations();
      await loadDashboard();
      setMessage('Doação cadastrada com sucesso.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiRequest('requests.php', 'POST', {
        ...requestForm,
        quantity: Number(requestForm.quantity),
      });
      setRequestForm(defaultRequest);
      await loadRequests();
      await loadDashboard();
      setMessage('Solicitação cadastrada com sucesso.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDonation = async (id) => {
    await apiRequest('donations.php', 'DELETE', { id });
    await loadDonations();
    await loadDashboard();
  };

  const handleDeleteRequest = async (id) => {
    await apiRequest('requests.php', 'DELETE', { id });
    await loadRequests();
    await loadDashboard();
  };

  const handleAdminAction = async (userId, action) => {
    await apiRequest('admin.php', 'POST', { action, user_id: userId });
    await loadPendingUsers();
    await loadDashboard();
  };

  const handleLogout = () => {
    localStorage.removeItem('helphope_user');
    setUser(null);
    setMessage('Sessão encerrada.');
  };

  if (!user) {
    return (
      <div className="app-shell auth-shell">
        <div className="auth-card">
          <div className="brand-row">
            <div className="brand-mark">❤️</div>
            <div>
              <h1>HelpHope</h1>
              <small>Conectando doadores e instituições</small>
            </div>
          </div>

          <div className="tabs">
            <button className={authMode === 'login' ? 'tab active' : 'tab'} onClick={() => setAuthMode('login')}>Entrar</button>
            <button className={authMode === 'register' ? 'tab active' : 'tab'} onClick={() => setAuthMode('register')}>Cadastrar</button>
          </div>

          {authMode === 'login' ? (
            <form onSubmit={handleLogin} className="stack-form">
              <input name="email" type="email" placeholder="E-mail" value={authForm.email} onChange={handleAuthChange} required />
              <input name="password" type="password" placeholder="Senha" value={authForm.password} onChange={handleAuthChange} required />
              <button className="primary-btn" type="submit" disabled={loading}>Entrar</button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="stack-form">
              <select name="type" value={authForm.type} onChange={handleAuthChange}>
                <option value="doador">Pessoa Doadora</option>
                <option value="empresa">Empresa Doadora</option>
                <option value="instituicao">Instituição Beneficiária</option>
              </select>
              <input name="name" type="text" placeholder="Nome / Razão Social" value={authForm.name} onChange={handleAuthChange} required />
              <input name="document" type="text" placeholder="CPF / CNPJ" value={authForm.document} onChange={handleAuthChange} required />
              <input name="email" type="email" placeholder="E-mail" value={authForm.email} onChange={handleAuthChange} required />
              <input name="phone" type="tel" placeholder="Telefone" value={authForm.phone} onChange={handleAuthChange} required />
              <input name="password" type="password" placeholder="Senha (mínimo 8 caracteres)" value={authForm.password} onChange={handleAuthChange} required />
              <label className="checkbox-row">
                <input type="checkbox" name="terms_accepted" checked={authForm.terms_accepted} onChange={handleAuthChange} />
                Aceito os termos e políticas.
              </label>
              <button className="primary-btn" type="submit" disabled={loading}>Cadastrar</button>
            </form>
          )}

          {message && <div className="success-box">{message}</div>}
          {error && <div className="error-box">{error}</div>}
        </div>
      </div>
    );
  }

  const isDoador = user.type === 'doador' || user.type === 'empresa';
  const isInstitution = user.type === 'instituicao';
  const isAdmin = user.type === 'admin';

  return (
    <div className="app-shell dashboard-shell">
      <header className="topbar">
        <div>
          <strong>HelpHope</strong>
          <small>{user.name}</small>
        </div>
        <button className="ghost-btn" onClick={handleLogout}>Sair</button>
      </header>

      <div className="dashboard-grid">
        <aside className="side-panel">
          <h3>Resumo</h3>
          <div className="stat-box">
            <span>{dashboard.stats?.my_donations ?? 0}</span>
            <label>Minhas doações</label>
          </div>
          <div className="stat-box">
            <span>{dashboard.stats?.my_requests ?? 0}</span>
            <label>Minhas solicitações</label>
          </div>
          <div className="stat-box">
            <span>{dashboard.stats?.available_donations ?? 0}</span>
            <label>Disponíveis</label>
          </div>
          <div className="stat-box">
            <span>{dashboard.stats?.open_requests ?? 0}</span>
            <label>Abertas</label>
          </div>
        </aside>

        <main className="main-panel">
          {isAdmin && (
            <section className="panel-block">
              <h3>Painel Administrativo</h3>
              <div className="admin-panel">
                {pendingUsers.length === 0 ? (
                  <p>Nenhum usuário pendente.</p>
                ) : (
                  pendingUsers.map((person) => (
                    <div className="card-item" key={person.id}>
                      <div>
                        <strong>{person.name}</strong>
                        <small>{person.type} · {person.email}</small>
                      </div>
                      <div className="inline-actions">
                        <button className="small-btn success" onClick={() => handleAdminAction(person.id, 'validate')}>Validar</button>
                        <button className="small-btn danger" onClick={() => handleAdminAction(person.id, 'reject')}>Rejeitar</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {isDoador && (
            <section className="panel-block">
              <h3>Nova Doação</h3>
              <form onSubmit={handleDonationSubmit} className="stack-form compact">
                <select name="category_id" value={donationForm.category_id} onChange={(e) => setDonationForm({ ...donationForm, category_id: e.target.value })} required>
                  <option value="">Selecione a categoria</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
                <input name="title" type="text" placeholder="Título" value={donationForm.title} onChange={(e) => setDonationForm({ ...donationForm, title: e.target.value })} required />
                <textarea name="description" placeholder="Descrição" value={donationForm.description} onChange={(e) => setDonationForm({ ...donationForm, description: e.target.value })} required />
                <div className="double-field">
                  <input name="quantity" type="number" min="1" step="0.01" placeholder="Quantidade" value={donationForm.quantity} onChange={(e) => setDonationForm({ ...donationForm, quantity: e.target.value })} required />
                  <input name="unit" type="text" placeholder="Unidade" value={donationForm.unit} onChange={(e) => setDonationForm({ ...donationForm, unit: e.target.value })} required />
                </div>
                <button className="primary-btn" type="submit" disabled={loading}>Cadastrar doação</button>
              </form>
            </section>
          )}

          {isInstitution && (
            <section className="panel-block">
              <h3>Nova Solicitação</h3>
              <form onSubmit={handleRequestSubmit} className="stack-form compact">
                <select name="category_id" value={requestForm.category_id} onChange={(e) => setRequestForm({ ...requestForm, category_id: e.target.value })} required>
                  <option value="">Selecione a categoria</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
                <input name="title" type="text" placeholder="Título" value={requestForm.title} onChange={(e) => setRequestForm({ ...requestForm, title: e.target.value })} required />
                <textarea name="description" placeholder="Descrição da necessidade" value={requestForm.description} onChange={(e) => setRequestForm({ ...requestForm, description: e.target.value })} required />
                <div className="double-field">
                  <input name="quantity" type="number" min="1" step="0.01" placeholder="Quantidade" value={requestForm.quantity} onChange={(e) => setRequestForm({ ...requestForm, quantity: e.target.value })} required />
                  <input name="unit" type="text" placeholder="Unidade" value={requestForm.unit} onChange={(e) => setRequestForm({ ...requestForm, unit: e.target.value })} required />
                </div>
                <button className="primary-btn" type="submit" disabled={loading}>Registrar solicitação</button>
              </form>
            </section>
          )}

          <section className="panel-block">
            <h3>Doações</h3>
            {donations.length === 0 ? <p>Nenhuma doação cadastrada.</p> : (
              donations.map((item) => (
                <div className="card-item" key={item.id}>
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.category_name} · {item.quantity} {item.unit}</small>
                  </div>
                  {isDoador && <button className="small-btn danger" onClick={() => handleDeleteDonation(item.id)}>Excluir</button>}
                </div>
              ))
            )}
          </section>

          <section className="panel-block">
            <h3>Solicitações</h3>
            {requests.length === 0 ? <p>Nenhuma solicitação encontrada.</p> : (
              requests.map((item) => (
                <div className="card-item" key={item.id}>
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.category_name} · {item.quantity} {item.unit}</small>
                  </div>
                  {isInstitution && <button className="small-btn danger" onClick={() => handleDeleteRequest(item.id)}>Excluir</button>}
                </div>
              ))
            )}
          </section>

          <section className="panel-block">
            <h3>Ranking</h3>
            {dashboard.ranking?.length ? dashboard.ranking.map((item, index) => (
              <div className="rank-item" key={index}><span>{index + 1}º</span> <strong>{item.name}</strong> <small>{item.total} doações</small></div>
            )) : <p>Ranking indisponível.</p>}
          </section>

          <section className="panel-block">
            <h3>Histórico</h3>
            {dashboard.history?.length ? dashboard.history.map((item, index) => (
              <div className="card-item" key={index}>
                <div>
                  <strong>{item.title}</strong>
                  <small>{item.category_name} · {item.donor_name}</small>
                </div>
              </div>
            )) : <p>Nenhum histórico.</p>}
          </section>
        </main>
      </div>

      {(message || error) && (
        <div className="toast">
          {error || message}
        </div>
      )}
    </div>
  );
}
