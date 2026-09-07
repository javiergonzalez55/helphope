<?php
$usuario_id = (int)$_POST["usuario_id"];

$sql = "DELETE FROM $nomeDaTabelaUsuarios WHERE id = $usuario_id AND tipo = 'instituicao'";

if ($conexao->query($sql)) {
    $resposta = ['success' => true, 'message' => 'Usuário rejeitado e removido.'];
    echo json_encode($resposta);
    exit;
} else {
    $resposta = ['success' => false, 'error' => 'Erro ao rejeitar: ' . $conexao->error];
    echo json_encode($resposta);
    exit;
}
?>