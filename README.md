1. Contexto

O proprietário e idealizadores do projeto HelpHope – Sistema de Intermediação de Doações identificaram a necessidade de criar uma plataforma digital capaz de conectar empresas, pessoas físicas e instituições que desejam doar ou necessitam de apoio, promovendo organização, acessibilidade, reaproveitamento de recursos, segurança e transparência no processo de doação. Atualmente, muitas empresas possuem materiais excedentes ou recursos disponíveis para doação, mas enfrentam dificuldades para direcioná-los corretamente. Da mesma forma, instituições sociais frequentemente necessitam de recursos e possuem limitações para alcançar potenciais doadores. 
	
2. Backlog
  ●	Cadastrar usuário (pessoas, empresas e instituições).
  ●	Fazer login.
  ●	Cadastrar doações.
  ●	Categorizar doações.
  ●	Registrar solicitações de doação por instituições.
  ●	Visualizar histórico de doações.
  ●	Visualizar ranking de doações.
  ●	Validar instituição.
  ●	Confirmar recebimento de doação.
  ●	Acompanhar doação

História 01 - Cadastrar Usuário 

  1.1. Cadastro – Pessoa doadora
  EU, como pessoa doadora, QUERO QUE o sistema permita meu cadastro com dados pessoais e de contato, PARA QUE eu possa realizar e acompanhar doações.

  Regras de Negócio
    ●	O cadastro deve exigir nome completo, CPF, e-mail, telefone e senha.
    ●	O CPF deve ser único no sistema.
    ●	O e-mail deve possuir formato válido.
    ●	A senha deve possuir no mínimo 8 caracteres.
    ●	O usuário deve aceitar os termos de uso e política de privacidade.
    ●	Após o cadastro, o sistema deve permitir acesso ao login.

  Conceito de pronto
    ●	Cadastro realizado com sucesso.
    ●	Validação de CPF duplicado implementada.
    ●	Validação de campos obrigatórios implementada.
    ●	Dados persistidos no banco de dados.
    ●	Usuário apto a acessar o sistema.

  1.2. Cadastro – Empresa doadora
  EU, como empresa doadora, QUERO QUE o sistema permita cadastrar minha organização, PARA QUE eu possa disponibilizar recursos e materiais para doação.

  Regras de Negócio
    ●	O cadastro deve exigir razão social, CNPJ, e-mail corporativo, telefone e senha.
    ●	O CNPJ deve ser único no sistema.
    ●	O sistema deve validar o formato do CNPJ.
    ●	O usuário deve aceitar os termos de uso.
    ●	O cadastro deve ficar disponível para validação do administrador.

  Conceito de pronto
    ●	Cadastro da empresa realizado com sucesso.
    ●	Validação de CNPJ implementada.
    ●	Dados armazenados corretamente.
    ●	Perfil disponível para aprovação do administrador.
    ●	Empresa apta a acessar funcionalidades após validação.

  1.3 Cadastro – Instituição beneficiária
  EU, como instituição beneficiária, QUERO QUE o sistema permita cadastrar minha instituição, PARA QUE eu possa solicitar e acompanhar doações.

  Regras de Negócio
    ●	O cadastro deve exigir nome da instituição, CNPJ, responsável, e-mail, telefone e senha.
    ●	O CNPJ deve ser único no sistema.
    ●	O sistema deve permitir anexar documentos comprobatórios.
    ●	O cadastro deve ser validado pelo administrador antes da liberação do acesso.
    ●	Somente instituições validadas poderão solicitar doações.

  Conceito de pronto
    ●	Cadastro da instituição realizado com sucesso.
    ●	Upload de documentos funcionando corretamente.
    ●	Fluxo de validação pelo administrador implementado.
    ●	Instituição apta a acessar o sistema após aprovação.

História 02 – Fazer login
EU, como usuário cadastrado, QUERO QUE o sistema permita realizar login com minhas credenciais, PARA QUE eu possa acessar as funcionalidades do sistema de acordo com meu perfil.

  Regras de Negócio
    ●	O login deve ser realizado com e-mail e senha.
    ●	O sistema deve validar as credenciais antes do acesso.
    ●	Usuários não validados não poderão acessar funcionalidades restritas.
    ●	O sistema deve permitir recuperação e alteração de senha.
    ●	Após múltiplas tentativas inválidas, o acesso deve ser temporariamente bloqueado.
    
  Conceito de pronto
    ●	Autenticação implementada e funcional.
    ●	Perfis de acesso diferenciados funcionando.
    ●	Recuperação de senha implementada.
    ●	Mensagens de erro exibidas corretamente.
    ●	Sessão iniciada com segurança.

História 03 – Cadastrar doações
EU, como pessoa ou empresa doadora, QUERO QUE o sistema permita cadastrar doações, PARA QUE instituições possam visualizar e solicitar os recursos disponíveis.

  Regras de Negócio
    ●	A doação deve possuir categoria, descrição, quantidade e status.
    ●	Apenas usuários autenticados poderão cadastrar doações.
    ●	O sistema deve permitir alteração e exclusão da doação pelo doador.
    ●	Toda doação deve iniciar com status “Disponível”.
    ●	O sistema deve registrar data e responsável pelo cadastro.

  Conceito de pronto
    ●	Cadastro de doações funcionando corretamente.
    ●	Alteração e exclusão implementadas.
    ●	Status da doação atualizado automaticamente.
    ●	Dados registrados no banco de dados.
    ●	Doações disponíveis para consulta das instituições.
    
História 04 – Categorizar doações
EU, como administrador, QUERO QUE o sistema permita cadastrar e gerenciar categorias de doações, PARA QUE os itens sejam organizados de forma padronizada.

  Regras de Negócio
    ●	Apenas administradores poderão cadastrar, alterar e excluir categorias.
    ●	Cada categoria deve possuir nome único.
    ●	Uma categoria não poderá ser excluída se existir doação vinculada.
    ●	O sistema deve manter histórico de alterações das categorias.

  Conceito de pronto
    ●	Cadastro de categorias implementado.
    ●	Alteração e exclusão funcionando corretamente.
    ●	Validação de categoria duplicada implementada.
    ●	Categorias disponíveis para seleção no cadastro de doações.
    
História 05 – Registrar solicitações de doação por instituições
EU, como instituição beneficiária, QUERO QUE o sistema permita registrar solicitações de doações, PARA QUE eu possa demonstrar minhas necessidades e receber apoio.

  Regras de Negócio
    ●	Apenas instituições validadas poderão registrar solicitações.
    ●	A solicitação deve possuir categoria, descrição e quantidade necessária.
    ●	O sistema deve permitir alteração e exclusão da solicitação.
    ●	Solicitações encerradas devem permanecer registradas para histórico.
    ●	O sistema deve permitir consulta das solicitações pelos doadores.
  
  Conceito de pronto
    ●	Cadastro de solicitações implementado.
    ●	Alteração e exclusão funcionando corretamente.
    ●	Solicitações disponíveis para consulta.
    ●	Histórico de solicitações armazenado.
    ●	Fluxo validado pelo dono do produto.

História 06 – Visualizar histórico de doações
EU, como doador (pessoa física ou jurídica), instituição ou administrador, QUERO visualizar o histórico das doações realizadas, PARA QUE exista rastreabilidade e transparência das operações.

  Regras de Negócio
    ●	Toda doação concluída deve gerar um registro no histórico.
    ●	O histórico deve armazenar dados do doador, instituição, item doado e data.
    ●	Cada usuário poderá visualizar apenas seu próprio histórico. 
    ●	Apenas administradores poderão visualizar todos os registros históricos.
    ●	O sistema deve permitir consulta do histórico pelos usuários envolvidos.
    ●	Registros históricos não poderão ser excluídos.
    
  Conceito de pronto
    ●	Histórico sendo gerado automaticamente.
    ●	Consulta de histórico funcionando.
    ●	Dados armazenados corretamente.
    ●	Informações exibidas de forma transparente.

História 07 – Visualizar ranking de doadores
EU, como administrador e usuário do sistema, QUERO QUE o sistema gere um ranking de doadores, PARA QUE seja possível acompanhar e incentivar a participação dos usuários na plataforma.

  Regras de Negócio
    ●	O ranking deve considerar quantidade ou volume de doações realizadas.
    ●	O sistema deve atualizar o ranking automaticamente.
    ●	Usuários poderão consultar o ranking publicamente.
    ●	O ranking deve respeitar regras de privacidade definidas pelo usuário.
  
  Conceito de pronto
    ●	Ranking calculado automaticamente.
    ●	Consulta ao ranking implementada.
    ●	Atualização de posições funcionando.
    ●	Critérios de cálculo configuráveis pelo administrador.
    ●	Funcionalidade validada pelo dono do produto.

História 08 – Gerenciar e validar usuário / organização
EU, como administrador, QUERO gerenciar e validar o cadastro de usuários (empresas e  instituições), PARA QUE apenas usuários e organizações legítimas possam fazer ou solicitar doações, e eu possa garantir segurança e integridade da plataforma..

  Regras de negócio
    ●	O administrador deve visualizar organizações pendentes.
    ●	Deve aprovar ou rejeitar o cadastro.
    ●	Administrador pode bloquear usuários.
    ●	Deve registrar motivo em caso de rejeição.
    ●	Pode visualizar usuários ativos/inativos.
    ●	Bloqueio impede login.
    ●	Somente após aprovação a organização pode fazer doações ou criar solicitações.
    ●	Ações devem ser auditadas.
  
  Conceito de pronto
    ●	Tela de validação criada.
    ●	Fluxo de aprovação funcionando.
    ●	Restrição de acesso aplicada.
    ●	Notificação enviada ao usuário.

História 09 – Confirmar recebimento da doação
EU, como instituição beneficiária, QUERO confirmar o recebimento da doação, PARA QUE o sistema registre a conclusão do processo.

  Regras de negócio
    ●	Apenas instituição destinatária pode confirmar.
    ●	Ao confirmar:
    status da doação = concluída
    	histórico é criado
    	ranking atualizado
    ●	Não pode haver confirmação duplicada.

  Conceito de pronto
    ●	Confirmação implementada.
    ●	Atualização de status funcionando.
    ●	Histórico gerado automaticamente.
    ●	Ranking recalculado.

História 10 – Acompanhar doação
EU, como usuário, QUERO acompanhar o status da doação, PARA QUE eu saiba em qual etapa do processo ela se encontra.

  Regras de negócio
  Status possíveis:
    ●	Disponível
    ●	Reservada
    ●	Em transporte
    ●	Entregue
    ●	Cancelada
  
  Conceito de pronto
    ●	Tela de acompanhamento criada.
    ●	Status atualizado em tempo real.
    ●	Permissões aplicadas.                        
                         
                         
   Modelo geral proposto                      
                         ┌──────────────────────┐                                                                                                  
                         │       Usuario        │                                                                                                  
                         ├──────────────────────┤                                                                                                  
                         │ id                   │                                                                                                  
                         │ email                │
                         │ senha                │                                                                                                  
                         │ telefone             │
                         │ status               │																								
                         │ validado             │																								
                         └──────────┬───────────┘																								
                                    │
                  ┌─────────────────┼─────────────────┐
                  │                 │                 │
                  ▼                 ▼                 ▼
        ┌─────────────────┐ ┌───────────────┐ ┌─────────────────┐
        │ PessoaDoadora   │ │    Empresa    │ │   Instituicao   │
        ├─────────────────┤ ├───────────────┤ ├─────────────────┤
        │ nomeCompleto    │ │ razaoSocial   │ │ nome            │
        │ cpf             │ │ cnpj          │ │ cnpj            │
        └─────┬───────────┘ └───────┬───────┘ │ responsavel     │
              │                     │         └────────┬────────┘
              │                     │                  │
              └───────┬─────────────┘                  │
                         │                             │
                         ▼                             ▼
                    ┌───────────────┐      ┌──────────────────┐
                    │  Doacao       │      │ SolicitacaoDoacao│
                    └─┬──────────┬──┘      └──────┬───────────┘
                      │          │                │
                      │          │                │
                      │          ▼                ▼
                      │       ┌───────────────────────┐             
                      │       │       Categoria       │ 
                      │       └───────────────────────┘             
                      │          │
                      │          │
                      ▼          ▼
                    ┌─────────────────┐
                    │ HistoricoDoacao │
                    └─────────────────┘                                                                                                                                                                                                                                        
                      Usuario
                        ▲
                        │
             A d m i n i s t r a d o r
              /     |         |     \
             /      |         |      \
            ▼       ▼         ▼       ▼
        Categoria Empresa  Pessoa   Auditoria                    
                           
