<?php
$instituicao_id = (int)$_POST["instituicao_id"];
$instituicao_nome = $conexao->real_escape_string(trim($_POST["instituicao_nome"]));
$categoria = $conexao->real_escape_string(trim($_POST["categoria"]));
$descricao = $conexao->real_escape_string(trim($_POST["descricao"]));
$quantidade = (int)$_POST["quantidade"];

$sql = "INSERT INTO $nomeDaTabelaSolicitacoes 
        (instituicao_id, instituicao_nome, categoria, descricao, quantidade) 
        VALUES 
        ($instituicao_id, '$instituicao_nome', '$categoria', '$descricao', $quantidade)";

if ($conexao->query($sql)) {
    $id = $conexao->insert_id;
    $resposta = ['success' => true, 'message' => 'Solicitação registrada com sucesso!', 'id' => $id];
    echo json_encode($resposta);
    exit;
} else {
    $resposta = ['success' => false, 'error' => 'Erro ao registrar: ' . $conexao->error];
    echo json_encode($resposta);
    exit;
}
