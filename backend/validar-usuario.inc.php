<?php
$usuario_id = (int)$_POST["usuario_id"];

$sql = "UPDATE $nomeDaTabelaUsuarios SET validado = 1 WHERE id = $usuario_id";

if ($conexao->query($sql)) {
    $resposta = ['success' => true, 'message' => 'Usuário validado com sucesso!'];
    echo json_encode($resposta);
    exit;
} else {
    $resposta = ['success' => false, 'error' => 'Erro ao validar: ' . $conexao->error];
    echo json_encode($resposta);
    exit;
}
?>