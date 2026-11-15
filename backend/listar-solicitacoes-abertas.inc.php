<?php
$sql = "SELECT * FROM $nomeDaTabelaSolicitacoes WHERE status = 'Aberta' ORDER BY created_at DESC";
$resultado = $conexao->query($sql);
$solicitacoes = [];

while ($row = $resultado->fetch_assoc()) {
    $solicitacoes[] = $row;
}

echo json_encode($solicitacoes);
exit;
?>