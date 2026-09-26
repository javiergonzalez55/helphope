<?php
$solicitacao_id = (int)$_POST["solicitacao_id"];

$sql = "DELETE FROM $nomeDaTabelaSolicitacoes WHERE id = $solicitacao_id";

if ($conexao->query($sql)) {
    $resposta = ['success' => true, 'message' => 'Solicitação excluída com sucesso!'];
    echo json_encode($resposta);
    exit;
} else {
    $resposta = ['success' => false, 'error' => 'Erro ao excluir: ' . $conexao->error];
    echo json_encode($resposta);
    exit;
}
