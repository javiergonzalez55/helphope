<?php
$doacao_id = (int)$_POST["doacao_id"];

$sql = "DELETE FROM $nomeDaTabelaDoacoes WHERE id = $doacao_id";

if ($conexao->query($sql)) {
    $resposta = ['success' => true, 'message' => 'Doação excluída com sucesso!'];
    echo json_encode($resposta);
    exit;
} else {
    $resposta = ['success' => false, 'error' => 'Erro ao excluir: ' . $conexao->error];
    echo json_encode($resposta);
    exit;
}
