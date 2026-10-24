Contexto

O proprietário e idealizadores do projeto HelpHope – Sistema de Intermediação de Doações identificaram a necessidade de criar uma plataforma digital capaz de conectar empresas, pessoas físicas e instituições que desejam doar ou necessitam de apoio, promovendo organização, acessibilidade, reaproveitamento de recursos, segurança e transparência no processo de doação. Atualmente, muitas empresas possuem materiais excedentes ou recursos disponíveis para doação, mas enfrentam dificuldades para direcioná-los corretamente. Da mesma forma, instituições sociais frequentemente necessitam de recursos e possuem limitações para alcançar potenciais doadores. 

Backlog

●	Cadastrar usuário (pessoas, empresas e instituições).
●	Fazer login.
●   Cadastrar doações.
●	Gerenciar doações no painel do doador
●   Registrar solicitações de doação por instituições
●   Gerenciar solicitações no painel da instituição beneficiária
●   Relacionamento entre doação e solicitação
●	Categorizar doações.
●	Visualizar histórico de doações.
●	Visualizar ranking de doações.
●	Validar instituição.
●	Confirmar recebimento de doação.
●	Acompanhar doação

História 01 - Cadastrar Usuário 
Cadastro – Pessoa doadora
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

Cadastro – Empresa doadora
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

Cadastro – Instituição beneficiária
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

História 04 – Gerenciar doações no painel do doador

EU, como pessoa física ou empresa doadora, QUERO acessar meu painel para consultar, adicionar, editar e excluir minhas doações, PARA QUE eu possa controlar os itens disponíveis para doação e responder às solicitações compatíveis com minha categoria.

Regras de Negócio
● O doador deve visualizar, em tabela, todas as suas doações cadastradas.
● A tabela deve conter as informações: categoria, descrição, quantidade, unidade e status.
● A unidade deve ser apresentada de acordo com a categoria selecionada, com as opções válidas para aquela categoria.
● Os status da doação devem ser: disponível, solicitada e concluída.
● O doador deve poder adicionar uma nova doação.
● O doador deve poder editar uma doação já cadastrada.
● O doador deve poder excluir uma doação cadastrada.
● A doação deve permanecer vinculada ao doador que a cadastrou.
● O doador deve consultar todas as solicitações de doação disponíveis apenas na sua categoria.
● A tabela de solicitações deve conter as informações: nome da instituição, CNPJ da instituição, categoria, descrição, quantidade e unidade.
● A unidade deve ser apresentada conforme a categoria da solicitação.
● O doador deve poder selecionar uma solicitação compatível e realizar a doação.
● A doação deve ser vinculada à solicitação escolhida quando houver compatibilidade de categoria.
● Doações fora da categoria do doador não devem aparecer na lista de oportunidades.
● O sistema deve impedir que o doador altere ou exclua registros que não pertençam ao seu perfil.

Conceito de pronto
● Painel do doador funcional.
● Consulta das doações próprias em tabela.
● Cadastro de nova doação implementado.
● Edição e exclusão de doações implementadas.
● Lista de solicitações compatíveis exibida de acordo com a categoria.
● Seleção de solicitação e confirmação de doação implementada.
● Status atualizado corretamente conforme o fluxo.
● Dados persistidos no banco de dados.
● Regras de visibilidade e categoria aplicadas corretamente.

Conceito de pronto
●	Cadastro de doações funcionando corretamente.
●	Alteração e exclusão implementadas.
●	Status da doação atualizado automaticamente.
●	Dados registrados no banco de dados.
●	Doações disponíveis para consulta das instituições.

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

História 06 – Gerenciar solicitações no painel da instituição beneficiária

EU, como instituição beneficiária, QUERO acessar meu painel para consultar, adicionar, editar e excluir minhas solicitações, PARA QUE eu possa controlar as minhas necessidades e solicitar doações compatíveis com minha categoria.

Regras de Negócio
● A instituição beneficiária deve acessar o sistema com autenticação válida.
● A instituição deve visualizar, em tabela, todas as suas solicitações cadastradas.
● A tabela deve conter as informações: categoria, descrição, quantidade, unidade e status.
● A unidade deve ser apresentada de acordo com a categoria selecionada, com as opções válidas para aquela categoria.
● Os status da solicitação devem ser: aberta e encerrada.
● A instituição deve poder adicionar uma nova solicitação.
● A instituição deve poder editar uma solicitação já cadastrada.
● A instituição deve poder excluir uma solicitação cadastrada.
● A solicitação deve permanecer vinculada à instituição que a criou.
● A instituição deve consultar todas as doações disponíveis apenas na sua categoria.
● A tabela de doações deve conter as informações: nome do doador, CPF ou CNPJ do doador, categoria, descrição, quantidade e unidade.
● A unidade deve ser apresentada conforme a categoria da doação.
● A instituição deve poder selecionar uma doação compatível e solicitar a doação.
● A solicitação deve ser vinculada à doação escolhida quando houver compatibilidade de categoria.
● Doações fora da categoria da instituição não devem aparecer na lista de oportunidades.
● O sistema deve impedir que a instituição altere ou exclua solicitações que não pertençam ao seu perfil.

Conceito de pronto
● Painel da instituição funcional.
● Consulta das solicitações próprias em tabela.
● Cadastro de nova solicitação implementado.
● Edição e exclusão de solicitações implementadas.
● Lista de doações compatíveis exibida de acordo com a categoria.
● Seleção de doação e confirmação de solicitação implementada.
● Status atualizado corretamente conforme o fluxo.
● Dados persistidos no banco de dados.
● Regras de visibilidade e categoria aplicadas corretamente.

História 07 – Relacionamento entre doação e solicitação

EU, como doador ou instituição beneficiária, QUERO que o sistema relacione apenas itens com categoria compatível, PARA QUE o processo de doação seja consistente, transparente e válido para o tipo de material solicitado.

Regras de Negócio
● A associação entre doação e solicitação deve ocorrer somente quando as categorias forem iguais.
● O sistema deve validar a categoria antes de permitir a seleção e confirmação.
● A unidade da doação ou da solicitação deve seguir o padrão da categoria escolhida.
● O status da doação deve mudar de disponível para solicitada quando houver seleção compatível.
● O status da solicitação deve permanecer aberta enquanto a demanda estiver ativa.
● Quando a doação for concluída, o status correspondente deve ser atualizado para concluída ou encerrada, conforme o contexto.
● A operação deve ser registrada para rastreabilidade do processo.

Conceito de pronto
● Compatibilidade por categoria validada no fluxo.
● Visibilidade de itens filtrada corretamente.
● Status alterados conforme a etapa do processo.
● Relacionamento entre doação e solicitação funcionando.
● Processo rastreável e consistente.

História 08 – Categorizar doações

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

História 09 – Visualizar histórico de doações

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

História 10 – Visualizar ranking de doadores

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

História 11 – Gerenciar e validar usuário / organização

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

História 12 – Confirmar recebimento da doação

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

História 13 – Acompanhar doação

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

