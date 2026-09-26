<?php
header('Content-Type: application/json');

require_once "dados-conexao.inc.php";
require_once "conectar.inc.php";
require_once "criar-banco.inc.php";
require_once "abrir-banco.inc.php";
require_once "definir-utf8.inc.php";
require_once "criar-tabela.inc.php";

$acao = isset($_POST['acao']) ? $_POST['acao'] : (isset($_GET['acao']) ? $_GET['acao'] : '');
$resposta = [];

switch($acao) {
    case 'cadastrar_usuario':
        require_once "cadastrar-usuario.inc.php";
        break;
    case 'login':
        require_once "login.inc.php";
        break;
    case 'cadastrar_doacao':
        require_once "cadastrar-doacao.inc.php";
        break;
    case 'cadastrar_solicitacao':
        require_once "cadastrar-solicitacao.inc.php";
        break;
    case 'listar_doacoes':
        require_once "listar-doacoes.inc.php";
        break;
    case 'listar_doacoes_disponiveis':
        require_once "listar-doacoes-disponiveis.inc.php";
        break;
    case 'listar_solicitacoes':
        require_once "listar-solicitacoes.inc.php";
        break;
    case 'listar_solicitacoes_abertas':
        require_once "listar-solicitacoes-abertas.inc.php";
        break;
    case 'listar_ranking':
        require_once "listar-ranking.inc.php";
        break;
    case 'listar_historico':
        require_once "listar-historico.inc.php";
        break;
    case 'excluir_doacao':
        require_once "excluir-doacao.inc.php";
        break;
    case 'excluir_solicitacao':
        require_once "excluir-solicitacao.inc.php";
        break;
    case 'listar_usuarios_pendentes':
        require_once "listar-usuarios-pendentes.inc.php";
        break;
    case 'validar_usuario':
        require_once "validar-usuario.inc.php";
        break;
    case 'rejeitar_usuario':
        require_once "rejeitar-usuario.inc.php";
        break;
    case 'match_doacao_solicitacao':
        require_once "match-doacao-solicitacao.inc.php";
        break;
    default:
        $resposta = ['success' => false, 'error' => 'Ação não reconhecida'];
        echo json_encode($resposta);
        exit;
}

require_once "desconectar.inc.php";

if (empty($resposta)) {
    $resposta = ['success' => true, 'message' => 'Operação realizada com sucesso'];
    echo json_encode($resposta);
}
