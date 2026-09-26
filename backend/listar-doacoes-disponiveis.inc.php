<?php
$sql = "SELECT * FROM $nomeDaTabelaDoacoes WHERE status = 'Disponível' ORDER BY created_at DESC";
$resultado = $conexao->query($sql);
$doacoes = [];

while ($row = $resultado->fetch_assoc()) {
    $doacoes[] = $row;
}

echo json_encode($doacoes);
exit;
