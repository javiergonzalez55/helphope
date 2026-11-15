<?php
$sql = "SELECT * FROM $nomeDaTabelaDoacoes 
        WHERE concluida = 1 
        ORDER BY data_conclusao DESC";

$resultado = $conexao->query($sql);
$historico = [];

while ($row = $resultado->fetch_assoc()) {
    $historico[] = $row;
}

echo json_encode($historico);
exit;
?>