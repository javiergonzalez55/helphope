<?php
$doador_id = (int)$_POST["doador_id"];
$doador_nome = $conexao->real_escape_string(trim($_POST["doador_nome"]));
$categoria = $conexao->real_escape_string(trim($_POST["categoria"]));
$descricao = $conexao->real_escape_string(trim($_POST["descricao"]));
$quantidade = (int)$_POST["quantidade"];
$observacao = isset($_POST["observacao"]) ? $conexao->real_escape_string(trim($_POST["observacao"])) : '';

$sql = "INSERT INTO $nomeDaTabelaDoacoes 
        (doador_id, doador_nome, categoria, descricao, quantidade, observacao) 
        VALUES 
        ($doador_id, '$doador_nome', '$categoria', '$descricao', $quantidade, '$observacao')";

if ($conexao->query($sql)) {
    $id = $conexao->insert_id;
    $resposta = ['success' => true, 'message' => 'Doação cadastrada com sucesso!', 'id' => $id];
    echo json_encode($resposta);
    exit;
} else {
    $resposta = ['success' => false, 'error' => 'Erro ao cadastrar: ' . $conexao->error];
    echo json_encode($resposta);
    exit;
}
