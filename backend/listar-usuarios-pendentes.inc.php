<?php
$sql = "SELECT * FROM $nomeDaTabelaUsuarios WHERE validado = 0 AND tipo = 'instituicao' ORDER BY created_at ASC";
$resultado = $conexao->query($sql);
$usuarios = [];

while ($row = $resultado->fetch_assoc()) {
    unset($row['senha']);
    $usuarios[] = $row;
}

echo json_encode($usuarios);
exit;
