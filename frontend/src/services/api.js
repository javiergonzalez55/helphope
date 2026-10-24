import { useEffect, useMemo, useState } from 'react';
import { apiRequest } from './services/api';

const emptyAuth = {
  name: '',
  document: '',
  email: '',
  phone: '',
  password: '',
  type: 'doador',
  terms_accepted: false,
};

const emptyDonation = {
  category_id: '',
  title: '',
  description: '',
  quantity: '',
  unit: 'unidade',
  status: 'disponivel',
};

const emptyRequest = {
  category_id: '',
  title: '',
  description: '',
  quantity: '',
  unit: 'unidade',
  status: 'aberta',
};

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('helphope_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState(emptyAuth);
  const [categories, setCategories] = useState([]);
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [dashboard, setDashboard] = useState({ stats: {}, ranking: [], history: [] });
  const [donationForm, setDonationForm] = useState(emptyDonation);
  const [requestForm, setRequestForm] = useState(emptyRequest);
  const [editingDonationId, setEditingDonationId] = useState(null);
  const [editingRequestId, setEditingRequestId] = useState(null);
  const [categoryForm, setCategoryForm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isDoador = useMemo(() => user?.type === 'doador' || user?.type === 'empresa', [user]);
  const isInstitution = user?.type === 'instituicao';
  const isAdmin = user?.type === 'admin';

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
    if (!isAdmin) return;
    const response = await apiRequest('admin.php', 'GET');
    setPendingUsers(response.data?.users || []);
  };

  const loadDashboard = async () => {
    const response = await apiRequest('dashboard.php', 'GET');
    setDashboard(response.data || { stats: {}, ranking: [], history: [] });
  };

  const loadAllData = async () => {
    setLoading(true);
    setError('');
    try {
      await loadCategories();
      await loadDashboard();
      await loadDonations();
      await loadRequests();
      if (isAdmin) await loadPendingUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthChange = (event) => {
    const { name, value, type, checked } = event.target;
    setAuthForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
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
      setAuthForm(emptyAuth);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
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
      setAuthForm(emptyAuth);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDonationSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...donationForm,
        quantity: Number(donationForm.quantity),
      };

      if (editingDonationId) {
        await apiRequest('donations.php', 'PUT', { ...payload, id: editingDonationId });
        setMessage('Doação atualizada com sucesso.');
      } else {
        await apiRequest('donations.php', 'POST', payload);
        setMessage('Doação cadastrada com sucesso.');
      }

      setDonationForm(emptyDonation);
      setEditingDonationId(null);
      await loadDonations();
      await loadDashboard();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...requestForm,
        quantity: Number(requestForm.quantity),
      };

      if (editingRequestId) {
        await apiRequest('requests.php', 'PUT', { ...payload, id: editingRequestId });
        setMessage('Solicitação atualizada com sucesso.');
      } else {
        await apiRequest('requests.php', 'POST', payload);
        setMessage('Solicitação cadastrada com sucesso.');
      }

      setRequestForm(emptyRequest);
      setEditingRequestId(null);
      await loadRequests();
      await loadDashboard();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startDonationEdit = (item) => {
    setEditingDonationId(item.id);
    setDonationForm({
      category_id: String(item.category_id ?? ''),
      title: item.title,
      description: item.description,
      quantity: String(item.quantity),
      unit: item.unit,
      status: item.status,
    });
  };

  const startRequestEdit = (item) => {
    setEditingRequestId(item.id);
    setRequestForm({
      category_id: String(item.category_id ?? ''),
      title: item.title,
      description: item.description,
      quantity: String(item.quantity),
      unit: item.unit,
      status: item.status,
    });
  };

  const handleDeleteDonation = async (id) => {
    try {
      await apiRequest('donations.php', 'DELETE', { id });
      setMessage('Doação removida com sucesso.');
      await loadDonations();
      await loadDashboard();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteRequest = async (id) => {
    try {
      await apiRequest('requests.php', 'DELETE', { id });
      setMessage('Solicitação removida com sucesso.');
      await loadRequests();
      await loadDashboard();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateCategory = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await apiRequest('categories.php', 'POST', { name: categoryForm });
      setCategoryForm('');
      await loadCategories();
      setMessage('Categoria cadastrada com sucesso.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await apiRequest('categories.php', 'DELETE', { id });
      await loadCategories();
      setMessage('Categoria removida com sucesso.');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      await apiRequest('admin.php', 'POST', { action, user_id: userId });
      await loadPendingUsers();
      await loadDashboard();
      setMessage(action === 'validate' ? 'Usuário validado.' : 'Usuário rejeitado.');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('helphope_user');
    setUser(null);
    setError('');
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
            <button className={authMode === 'login' ? 'tab active' : 'tab'} onClick={() => setAuthMode('login')}>
              Entrar
            </button>
            <button className={authMode === 'register' ? 'tab active' : 'tab'} onClick={() => setAuthMode('register')}>
              Cadastrar
            </button>
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
              <div className="admin-section">
                <div className="mini-panel">
                  <h4>Validar usuários</h4>
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
                          <button className="small-btn success" onClick={() => handleUserAction(person.id, 'validate')}>Validar</button>
                          <button className="small-btn danger" onClick={() => handleUserAction(person.id, 'reject')}>Rejeitar</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mini-panel">
                  <h4>Categorias</h4>
                  <form onSubmit={handleCreateCategory} className="category-form">
                    <input
                      type="text"
                      value={categoryForm}
                      onChange={(event) => setCategoryForm(event.target.value)}
                      placeholder="Nova categoria"
                      required
                    />
                    <button className="primary-btn" type="submit" disabled={loading}>Salvar</button>
                  </form>

                  <div className="admin-category-list">
                    {categories.length === 0 ? (
                      <p>Nenhuma categoria cadastrada.</p>
                    ) : (
                      categories.map((category) => (
                        <div className="category-row" key={category.id}>
                          <span>{category.name}</span>
                          <button className="small-btn danger" onClick={() => handleDeleteCategory(category.id)}>Excluir</button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {isDoador && (
            <section className="panel-block">
              <h3>{editingDonationId ? 'Editar Doação' : 'Nova Doação'}</h3>
              <form onSubmit={handleDonationSubmit} className="stack-form compact">
                <select name="category_id" value={donationForm.category_id} onChange={(event) => setDonationForm({ ...donationForm, category_id: event.target.value })} required>
                  <option value="">Selecione a categoria</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
                <input name="title" type="text" placeholder="Título" value={donationForm.title} onChange={(event) => setDonationForm({ ...donationForm, title: event.target.value })} required />
                <textarea name="description" placeholder="Descrição" value={donationForm.description} onChange={(event) => setDonationForm({ ...donationForm, description: event.target.value })} required />
                <div className="double-field">
                  <input name="quantity" type="number" min="1" step="0.01" placeholder="Quantidade" value={donationForm.quantity} onChange={(event) => setDonationForm({ ...donationForm, quantity: event.target.value })} required />
                  <input name="unit" type="text" placeholder="Unidade" value={donationForm.unit} onChange={(event) => setDonationForm({ ...donationForm, unit: event.target.value })} required />
                </div>
                <select name="status" value={donationForm.status} onChange={(event) => setDonationForm({ ...donationForm, status: event.target.value })}>
                  <option value="disponivel">Disponível</option>
                  <option value="solicitada">Solicitada</option>
                  <option value="concluida">Concluída</option>
                  <option value="cancelada">Cancelada</option>
                </select>
                <div className="inline-actions">
                  <button className="primary-btn" type="submit" disabled={loading}>{editingDonationId ? 'Salvar edição' : 'Cadastrar doação'}</button>
                  {editingDonationId && (
                    <button type="button" className="ghost-btn" onClick={() => { setEditingDonationId(null); setDonationForm(emptyDonation); }}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </section>
          )}

          {isInstitution && (
            <section className="panel-block">
              <h3>{editingRequestId ? 'Editar Solicitação' : 'Nova Solicitação'}</h3>
              <form onSubmit={handleRequestSubmit} className="stack-form compact">
                <select name="category_id" value={requestForm.category_id} onChange={(event) => setRequestForm({ ...requestForm, category_id: event.target.value })} required>
                  <option value="">Selecione a categoria</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
                <input name="title" type="text" placeholder="Título" value={requestForm.title} onChange={(event) => setRequestForm({ ...requestForm, title: event.target.value })} required />
                <textarea name="description" placeholder="Descrição da necessidade" value={requestForm.description} onChange={(event) => setRequestForm({ ...requestForm, description: event.target.value })} required />
                <div className="double-field">
                  <input name="quantity" type="number" min="1" step="0.01" placeholder="Quantidade" value={requestForm.quantity} onChange={(event) => setRequestForm({ ...requestForm, quantity: event.target.value })} required />
                  <input name="unit" type="text" placeholder="Unidade" value={requestForm.unit} onChange={(event) => setRequestForm({ ...requestForm, unit: event.target.value })} required />
                </div>
                <select name="status" value={requestForm.status} onChange={(event) => setRequestForm({ ...requestForm, status: event.target.value })}>
                  <option value="aberta">Aberta</option>
                  <option value="encerrada">Encerrada</option>
                </select>
                <div className="inline-actions">
                  <button className="primary-btn" type="submit" disabled={loading}>{editingRequestId ? 'Salvar edição' : 'Registrar solicitação'}</button>
                  {editingRequestId && (
                    <button type="button" className="ghost-btn" onClick={() => { setEditingRequestId(null); setRequestForm(emptyRequest); }}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </section>
          )}

          <section className="panel-block">
            <h3>Doações</h3>
            {donations.length === 0 ? (
              <p>Nenhuma doação cadastrada.</p>
            ) : (
              donations.map((item) => (
                <div className="card-item" key={item.id}>
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.category_name} · {item.quantity} {item.unit} · {item.status}</small>
                  </div>
                  <div className="inline-actions">
                    {isDoador && (
                      <>
                        <button className="small-btn success" onClick={() => startDonationEdit(item)}>Editar</button>
                        <button className="small-btn danger" onClick={() => handleDeleteDonation(item.id)}>Excluir</button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </section>

          <section className="panel-block">
            <h3>Solicitações</h3>
            {requests.length === 0 ? (
              <p>Nenhuma solicitação encontrada.</p>
            ) : (
              requests.map((item) => (
                <div className="card-item" key={item.id}>
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.category_name} · {item.quantity} {item.unit} · {item.status}</small>
                  </div>
                  <div className="inline-actions">
                    {isInstitution && (
                      <>
                        <button className="small-btn success" onClick={() => startRequestEdit(item)}>Editar</button>
                        <button className="small-btn danger" onClick={() => handleDeleteRequest(item.id)}>Excluir</button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </section>

          <section className="panel-block">
            <h3>Ranking</h3>
            {dashboard.ranking?.length ? (
              dashboard.ranking.map((item, index) => (
                <div className="rank-item" key={`${item.name}-${index}`}>
                  <span>{index + 1}º</span>
                  <strong>{item.name}</strong>
                  <small>{item.total} doações</small>
                </div>
              ))
            ) : (
              <p>Ranking indisponível.</p>
            )}
          </section>

          <section className="panel-block">
            <h3>Histórico</h3>
            {dashboard.history?.length ? (
              dashboard.history.map((item, index) => (
                <div className="card-item" key={`${item.title}-${index}`}>
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.category_name} · {item.donor_name}</small>
                  </div>
                </div>
              ))
            ) : (
              <p>Nenhum histórico.</p>
            )}
          </section>
        </main>
      </div>

      {(message || error) && (
        <div className="toast">{error || message}</div>
      )}
    </div>
  );
}

