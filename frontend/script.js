// ============ CONFIGURAÇÃO ============
const API_URL = '../backend/recebe-dados.php';

// ============ ESTADO GLOBAL ============
let currentUser = null;

// ============ INICIALIZAÇÃO ============
document.addEventListener('DOMContentLoaded', () => {
    const savedUser = sessionStorage.getItem('helphope_user');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            showDashboard();
            loadData();
        } catch {
            currentUser = null;
            showAuth();
        }
    } else {
        showAuth();
    }
    setupEvents();
});

function setupEvents() {
    // Abas de login/cadastro
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const tab = btn.dataset.tab;
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.getElementById(tab === 'login' ? 'tabLogin' : 'tabRegister').classList.add('active');
        });
    });

    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);

    // Navegação
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const page = btn.dataset.page;
            document.querySelectorAll('.dashboard-page').forEach(p => p.classList.remove('active'));
            const target = document.getElementById('page' + page.charAt(0).toUpperCase() + page.slice(1));
            if (target) target.classList.add('active');
        });
    });

    // Abas do Admin
    document.querySelectorAll('.admin-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.admin-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const tab = btn.dataset.adminTab;
            document.querySelectorAll('.admin-content').forEach(c => c.classList.remove('active'));
            document.getElementById('admin' + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.add('active');
        });
    });

    // Botão Logout
    document.getElementById('btnLogout').addEventListener('click', logout);
}

// ============ FUNÇÕES AJAX ============
function callAPI(data, callback) {
    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data)
    })
    .then(response => response.json())
    .then(json => callback(json))
    .catch(error => callback({ success: false, error: 'Erro de conexão: ' + error.message }));
}

// ============ AUTENTICAÇÃO ============
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    callAPI({ acao: 'login', email, senha: password }, (response) => {
        if (response.success) {
            currentUser = response.user;
            sessionStorage.setItem('helphope_user', JSON.stringify(currentUser));
            showDashboard();
            loadData();
            document.getElementById('loginForm').reset();
        } else {
            alert(response.error || 'Erro ao fazer login');
        }
    });
}

function handleRegister(e) {
    e.preventDefault();
    const type = document.getElementById('regType').value;
    const name = document.getElementById('regName').value.trim();
    const doc = document.getElementById('regDoc').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value;

    if (password.length < 8) {
        alert('A senha deve ter no mínimo 8 caracteres.');
        return;
    }

    callAPI({
        acao: 'cadastrar_usuario',
        tipo: type,
        nome: name,
        documento: doc,
        email: email,
        telefone: phone,
        senha: password
    }, (response) => {
        if (response.success) {
            alert(response.message);
            document.getElementById('registerForm').reset();
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('.tab-btn[data-tab="login"]').classList.add('active');
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.getElementById('tabLogin').classList.add('active');
        } else {
            alert(response.error || 'Erro ao cadastrar');
        }
    });
}

// ============ NAVEGAÇÃO ============
function showAuth() {
    document.getElementById('authSection').classList.add('active');
    document.getElementById('dashboardSection').classList.remove('active');
    document.getElementById('headerUser').textContent = 'Visitante';
    document.getElementById('btnLogout').classList.remove('show');
}

function showDashboard() {
    document.getElementById('authSection').classList.remove('active');
    document.getElementById('dashboardSection').classList.add('active');
    document.getElementById('headerUser').textContent = currentUser?.nome || 'Usuário';
    document.getElementById('btnLogout').classList.add('show');
    document.getElementById('userNameDisplay').textContent = currentUser?.nome || 'Usuário';
    
    const typeLabels = {
        'doador': '👤 Pessoa Doadora',
        'empresa': '🏢 Empresa Doadora',
        'instituicao': '🏥 Instituição Beneficiária',
        'admin': '👑 Administrador'
    };
    document.getElementById('userTypeDisplay').textContent = typeLabels[currentUser?.tipo] || '';

    setupUserInterface();

    if (currentUser?.tipo === 'admin') {
        document.body.classList.add('logged-as-admin');
        document.querySelector('.nav-btn[data-page="admin"]').style.display = 'inline-block';
        loadAdminData();
    } else {
        document.body.classList.remove('logged-as-admin');
        document.querySelector('.nav-btn[data-page="admin"]').style.display = 'none';
    }
}

function setupUserInterface() {
    const isDoador = currentUser?.tipo === 'doador' || currentUser?.tipo === 'empresa';
    const isInstituicao = currentUser?.tipo === 'instituicao';
    const isAdmin = currentUser?.tipo === 'admin';

    // Quick Actions
    const quickActions = document.getElementById('quickActions');
    let actions = '';
    
    if (isDoador) {
        actions = `
            <button class="quick-btn" data-page="doacoes">📦 Nova Doação</button>
            <button class="quick-btn" data-page="solicitacoes">📋 Ver Solicitações</button>
            <button class="quick-btn" data-page="ranking">🏆 Ver Ranking</button>
            <button class="quick-btn" data-page="historico">📜 Meu Histórico</button>
        `;
    } else if (isInstituicao) {
        actions = `
            <button class="quick-btn" data-page="solicitacoes">📋 Nova Solicitação</button>
            <button class="quick-btn" data-page="ranking">🏆 Ver Ranking</button>
            <button class="quick-btn" data-page="historico">📜 Histórico</button>
        `;
    } else if (isAdmin) {
        actions = `
            <button class="quick-btn" data-page="admin">👑 Admin</button>
            <button class="quick-btn" data-page="ranking">🏆 Ranking</button>
            <button class="quick-btn" data-page="historico">📜 Histórico</button>
        `;
    }
    quickActions.innerHTML = actions;

    quickActions.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.dataset.page;
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.dashboard-page').forEach(p => p.classList.remove('active'));
            const target = document.getElementById('page' + page.charAt(0).toUpperCase() + page.slice(1));
            if (target) target.classList.add('active');
            document.querySelectorAll('.nav-btn').forEach(b => {
                if (b.dataset.page === page) b.classList.add('active');
            });
        });
    });

    // Página de Doações
    const doacaoArea = document.getElementById('doacaoArea');
    if (isDoador) {
        doacaoArea.innerHTML = `
            <h2>Cadastrar Doação</h2>
            <form id="doacaoForm" class="form-card">
                <select id="doacaoCategoria" required>
                    <option value="">Categoria</option>
                    <option value="Alimentos">Alimentos</option>
                    <option value="Materiais">Materiais</option>
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Educação">Educação</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Esporte">Esporte</option>
                </select>
                <input type="text" id="doacaoDescricao" placeholder="Descrição do item" required />
                <input type="number" id="doacaoQuantidade" placeholder="Quantidade" required min="1" />
                <textarea id="doacaoObservacao" placeholder="Observações (opcional)"></textarea>
                <button type="submit" class="btn-primary">Cadastrar Doação</button>
            </form>
            <h3>Minhas Doações</h3>
            <div id="listaDoacoes" class="lista-items"></div>
        `;
        document.getElementById('doacaoForm').addEventListener('submit', handleDoacao);
        document.getElementById('navDoacoes').style.display = 'inline-block';
    } else {
        doacaoArea.innerHTML = `
            <div style="text-align:center; padding:40px 20px; color:#999;">
                <p style="font-size:48px; margin-bottom:12px;">📦</p>
                <p>Apenas doadores podem cadastrar doações.</p>
            </div>
        `;
        document.getElementById('navDoacoes').style.display = isAdmin ? 'none' : 'inline-block';
    }

    // Página de Solicitações
    const solicitacaoArea = document.getElementById('solicitacaoArea');
    if (isInstituicao) {
        solicitacaoArea.innerHTML = `
            <h2>Registrar Solicitação</h2>
            <form id="solicitacaoForm" class="form-card">
                <select id="solCategoria" required>
                    <option value="">Categoria</option>
                    <option value="Alimentos">Alimentos</option>
                    <option value="Materiais">Materiais</option>
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Educação">Educação</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Esporte">Esporte</option>
                </select>
                <input type="text" id="solDescricao" placeholder="Descrição da necessidade" required />
                <input type="number" id="solQuantidade" placeholder="Quantidade necessária" required min="1" />
                <button type="submit" class="btn-primary">Registrar Solicitação</button>
            </form>
            <h3>Minhas Solicitações</h3>
            <div id="listaSolicitacoes" class="lista-items"></div>
        `;
        document.getElementById('solicitacaoForm').addEventListener('submit', handleSolicitacao);
    } else {
        solicitacaoArea.innerHTML = `
            <h2>📋 Solicitações Abertas</h2>
            <p>Solicitações de instituições beneficiárias</p>
            <div id="listaSolicitacoes" class="lista-items"></div>
        `;
    }
}

// ============ DOAÇÕES ============
function handleDoacao(e) {
    e.preventDefault();
    if (!currentUser) return;

    const categoria = document.getElementById('doacaoCategoria').value;
    const descricao = document.getElementById('doacaoDescricao').value.trim();
    const quantidade = parseInt(document.getElementById('doacaoQuantidade').value);
    const observacao = document.getElementById('doacaoObservacao').value.trim();

    if (!categoria || !descricao || !quantidade) {
        alert('Preencha todos os campos obrigatórios.');
        return;
    }

    callAPI({
        acao: 'cadastrar_doacao',
        doador_id: currentUser.id,
        doador_nome: currentUser.nome,
        categoria,
        descricao,
        quantidade,
        observacao
    }, (response) => {
        if (response.success) {
            alert(response.message);
            document.getElementById('doacaoForm').reset();
            loadDoacoes();
            updateStats();
        } else {
            alert(response.error || 'Erro ao cadastrar doação');
        }
    });
}

function loadDoacoes() {
    if (!currentUser) return;
    const container = document.getElementById('listaDoacoes');
    if (!container) return;

    callAPI({ acao: 'listar_doacoes', doador_id: currentUser.id }, (response) => {
        if (!Array.isArray(response)) {
            container.innerHTML = '<p style="color:#999; text-align:center; padding:20px;">Erro ao carregar doações.</p>';
            return;
        }
        if (response.length === 0) {
            container.innerHTML = '<p style="color:#999; text-align:center; padding:20px;">Nenhuma doação cadastrada.</p>';
            return;
        }

        container.innerHTML = response.map(d => `
            <div class="item-card">
                <div class="item-title">${d.categoria} - ${d.descricao}</div>
                <div class="item-meta">Quantidade: ${d.quantidade} | ${new Date(d.created_at).toLocaleDateString()}</div>
                <div class="item-meta">
                    <span class="item-status status-${d.status === 'Disponível' ? 'disponivel' : 'concluida'}">${d.status}</span>
                </div>
                ${d.status === 'Disponível' ? `
                    <div class="item-actions">
                        <button class="btn-danger" onclick="excluirDoacao(${d.id})">Excluir</button>
                    </div>
                ` : ''}
            </div>
        `).join('');
    });
}

function excluirDoacao(id) {
    if (!confirm('Tem certeza que deseja excluir esta doação?')) return;
    callAPI({ acao: 'excluir_doacao', doacao_id: id }, (response) => {
        if (response.success) {
            loadDoacoes();
            updateStats();
        } else {
            alert(response.error || 'Erro ao excluir');
        }
    });
}

// ============ SOLICITAÇÕES ============
function handleSolicitacao(e) {
    e.preventDefault();
    if (!currentUser) return;

    const categoria = document.getElementById('solCategoria').value;
    const descricao = document.getElementById('solDescricao').value.trim();
    const quantidade = parseInt(document.getElementById('solQuantidade').value);

    if (!categoria || !descricao || !quantidade) {
        alert('Preencha todos os campos obrigatórios.');
        return;
    }

    callAPI({
        acao: 'cadastrar_solicitacao',
        instituicao_id: currentUser.id,
        instituicao_nome: currentUser.nome,
        categoria,
        descricao,
        quantidade
    }, (response) => {
        if (response.success) {
            alert(response.message);
            document.getElementById('solicitacaoForm').reset();
            loadSolicitacoes();
            updateStats();
        } else {
            alert(response.error || 'Erro ao registrar solicitação');
        }
    });
}

function loadSolicitacoes() {
    const container = document.getElementById('listaSolicitacoes');
    if (!container) return;

    const isInstituicao = currentUser?.tipo === 'instituicao';
    const params = isInstituicao ? { acao: 'listar_solicitacoes', instituicao_id: currentUser.id } : { acao: 'listar_solicitacoes_abertas' };

    callAPI(params, (response) => {
        if (!Array.isArray(response)) {
            container.innerHTML = '<p style="color:#999; text-align:center; padding:20px;">Erro ao carregar solicitações.</p>';
            return;
        }
        if (response.length === 0) {
            container.innerHTML = '<p style="color:#999; text-align:center; padding:20px;">Nenhuma solicitação encontrada.</p>';
            return;
        }

        container.innerHTML = response.map(s => `
            <div class="item-card">
                <div class="item-title">${s.categoria} - ${s.descricao}</div>
                <div class="item-meta">Instituição: ${s.instituicao_nome} | Qtd: ${s.quantidade}</div>
                <div class="item-meta">${new Date(s.created_at).toLocaleDateString()}</div>
                <div class="item-meta">
                    <span class="item-status status-${s.status === 'Aberta' ? 'aberta' : 'encerrada'}">${s.status}</span>
                </div>
                ${isInstituicao && s.status === 'Aberta' ? `
                    <div class="item-actions">
                        <button class="btn-danger" onclick="excluirSolicitacao(${s.id})">Excluir</button>
                    </div>
                ` : ''}
            </div>
        `).join('');
    });
}

function excluirSolicitacao(id) {
    if (!confirm('Tem certeza que deseja excluir esta solicitação?')) return;
    callAPI({ acao: 'excluir_solicitacao', solicitacao_id: id }, (response) => {
        if (response.success) {
            loadSolicitacoes();
            updateStats();
        } else {
            alert(response.error || 'Erro ao excluir');
        }
    });
}

// ============ RANKING ============
function loadRanking() {
    callAPI({ acao: 'listar_ranking' }, (response) => {
        const container = document.getElementById('listaRanking');
        if (!Array.isArray(response)) {
            container.innerHTML = '<p style="color:#999; text-align:center; padding:20px;">Erro ao carregar ranking.</p>';
            return;
        }
        if (response.length === 0) {
            container.innerHTML = '<p style="color:#999; text-align:center; padding:20px;">Nenhuma doação concluída ainda.</p>';
            return;
        }

        container.innerHTML = response.map((r, i) => {
            let cls = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
            return `
                <div class="ranking-item">
                    <span class="ranking-position ${cls}">${i + 1}º</span>
                    <div>
                        <strong>${r.nome}</strong>
                        <div style="font-size:13px; color:#777;">${r.total_itens} itens doados</div>
                    </div>
                </div>
            `;
        }).join('');
    });
}

// ============ HISTÓRICO ============
function loadHistorico() {
    const container = document.getElementById('listaHistorico');
    if (!container) return;

    callAPI({ acao: 'listar_historico' }, (response) => {
        if (!Array.isArray(response)) {
            container.innerHTML = '<p style="color:#999; text-align:center; padding:20px;">Erro ao carregar histórico.</p>';
            return;
        }
        if (response.length === 0) {
            container.innerHTML = '<p style="color:#999; text-align:center; padding:20px;">Nenhuma doação concluída.</p>';
            return;
        }

        container.innerHTML = response.map(d => `
            <div class="item-card">
                <div class="item-title">${d.categoria} - ${d.descricao}</div>
                <div class="item-meta">Doador: ${d.doador_nome} | Qtd: ${d.quantidade}</div>
                <div class="item-meta">Instituição: ${d.instituicao_nome || 'N/A'}</div>
                <div class="item-meta">Concluída em: ${d.data_conclusao ? new Date(d.data_conclusao).toLocaleDateString() : 'N/A'}</div>
                <div class="item-meta">
                    <span class="item-status status-concluida">✅ Concluída</span>
                </div>
            </div>
        `).join('');
    });
}

// ============ ESTATÍSTICAS ============
function updateStats() {
    if (!currentUser) return;
    
    callAPI({ acao: 'listar_doacoes', doador_id: currentUser.id }, (doacoes) => {
        document.getElementById('totalDoacoes').textContent = Array.isArray(doacoes) ? doacoes.length : 0;
    });

    const isInstituicao = currentUser?.tipo === 'instituicao';
    const params = isInstituicao ? { acao: 'listar_solicitacoes', instituicao_id: currentUser.id } : { acao: 'listar_solicitacoes_abertas' };
    callAPI(params, (solicitacoes) => {
        document.getElementById('totalSolicitacoes').textContent = Array.isArray(solicitacoes) ? solicitacoes.length : 0;
    });
}

// ============ ADMIN ============
function loadAdminData() {
    if (currentUser?.tipo !== 'admin') return;
    loadUsuariosPendentes();
    loadDoacoesDisponiveis();
    loadSolicitacoesAbertas();
}

function loadUsuariosPendentes() {
    callAPI({ acao: 'listar_usuarios_pendentes' }, (response) => {
        const container = document.getElementById('listaValidacao');
        if (!Array.isArray(response) || response.length === 0) {
            container.innerHTML = '<p style="color:#999; text-align:center; padding:20px;">Nenhuma instituição aguardando validação.</p>';
            return;
        }
        container.innerHTML = response.map(u => `
            <div class="item-card">
                <div class="item-title">${u.nome}</div>
                <div class="item-meta">Tipo: ${u.tipo} | Email: ${u.email}</div>
                <div class="item-meta">Documento: ${u.documento}</div>
                <div class="item-actions">
                    <button class="btn-success" onclick="validarUsuario(${u.id})">✅ Validar</button>
                    <button class="btn-danger" onclick="rejeitarUsuario(${u.id})">❌ Rejeitar</button>
                </div>
            </div>
        `).join('');
    });
}

function validarUsuario(id) {
    if (!confirm('Validar esta instituição?')) return;
    callAPI({ acao: 'validar_usuario', usuario_id: id }, (response) => {
        if (response.success) {
            alert('Instituição validada com sucesso!');
            loadAdminData();
        } else {
            alert(response.error || 'Erro ao validar');
        }
    });
}

function rejeitarUsuario(id) {
    if (!confirm('Rejeitar esta instituição?')) return;
    callAPI({ acao: 'rejeitar_usuario', usuario_id: id }, (response) => {
        if (response.success) {
            alert('Instituição rejeitada.');
            loadAdminData();
        } else {
            alert(response.error || 'Erro ao rejeitar');
        }
    });
}

function loadDoacoesDisponiveis() {
    callAPI({ acao: 'listar_doacoes_disponiveis' }, (response) => {
        const container = document.getElementById('adminDoacoesDisponiveis');
        if (!Array.isArray(response) || response.length === 0) {
            container.innerHTML = '<p style="color:#999; text-align:center; padding:20px;">Nenhuma doação disponível.</p>';
            return;
        }
        container.innerHTML = response.map(d => `
            <div class="item-card">
                <div class="item-title">${d.categoria} - ${d.descricao}</div>
                <div class="item-meta">Doador: ${d.doador_nome} | Qtd: ${d.quantidade}</div>
                <div class="item-actions">
                    <button class="btn-secondary" onclick="matchDoacao(${d.id})">🔗 Match com Solicitação</button>
                </div>
            </div>
        `).join('');
    });
}

function loadSolicitacoesAbertas() {
    callAPI({ acao: 'listar_solicitacoes_abertas' }, (response) => {
        const container = document.getElementById('adminSolicitacoesAbertas');
        if (!Array.isArray(response) || response.length === 0) {
            container.innerHTML = '<p style="color:#999; text-align:center; padding:20px;">Nenhuma solicitação aberta.</p>';
            return;
        }
        container.innerHTML = response.map(s => `
            <div class="item-card">
                <div class="item-title">${s.categoria} - ${s.descricao}</div>
                <div class="item-meta">Instituição: ${s.instituicao_nome} | Qtd: ${s.quantidade}</div>
                <div class="item-meta">ID: ${s.id}</div>
            </div>
        `).join('');
    });
}

function matchDoacao(doacaoId) {
    const solicitacaoId = prompt('Digite o ID da solicitação que irá receber esta doação:');
    if (!solicitacaoId) return;
    
    callAPI({
        acao: 'match_doacao_solicitacao',
        doacao_id: doacaoId,
        solicitacao_id: parseInt(solicitacaoId)
    }, (response) => {
        if (response.success) {
            alert('Match realizado com sucesso!');
            loadAdminData();
            loadData();
        } else {
            alert(response.error || 'Erro ao fazer match');
        }
    });
}

// ============ CARREGAR DADOS ============
function loadData() {
    if (!currentUser) return;
    loadDoacoes();
    loadSolicitacoes();
    loadRanking();
    loadHistorico();
    updateStats();
}

// ============ LOGOUT ============
function logout() {
    if (confirm('Deseja sair?')) {
        sessionStorage.removeItem('helphope_user');
        currentUser = null;
        showAuth();
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.nav-btn[data-page="home"]').classList.add('active');
        document.querySelectorAll('.dashboard-page').forEach(p => p.classList.remove('active'));
        document.getElementById('pageHome').classList.add('active');
    }
}

console.log('🚀 HelpHope carregado!');