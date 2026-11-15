<?php
$sql = "SELECT 
            doador_id as id,
            doador_nome as nome,
            COUNT(*) as total_doacoes,
            SUM(quantidade) as total_itens
        FROM $nomeDaTabelaDoacoes
        WHERE concluida = 1
        GROUP BY doador_id, doador_nome
        ORDER BY total_itens DESC";

$resultado = $conexao->query($sql);
$ranking = [];

while ($row = $resultado->fetch_assoc()) {
    $ranking[] = $row;
}

echo json_encode($ranking);
exit;
?>