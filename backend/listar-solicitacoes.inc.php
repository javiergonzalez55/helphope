<?php
$instituicao_id = isset($_POST["instituicao_id"]) ? (int)$_POST["instituicao_id"] : (isset($_GET["instituicao_id"]) ? (int)$_GET["instituicao_id"] : 0);

if ($instituicao_id > 0) {
    $sql = "SELECT * FROM $nomeDaTabelaSolicitacoes WHERE instituicao_id = $instituicao_id ORDER BY created_at DESC";
} else {
    $sql = "SELECT * FROM $nomeDaTabelaSolicitacoes ORDER BY created_at DESC";
}

$resultado = $conexao->query($sql);
$solicitacoes = [];

while ($row = $resultado->fetch_assoc()) {
    $solicitacoes[] = $row;
}

echo json_encode($solicitacoes);
exit;
