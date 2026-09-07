<?php
$doador_id = isset($_POST["doador_id"]) ? (int)$_POST["doador_id"] : (isset($_GET["doador_id"]) ? (int)$_GET["doador_id"] : 0);

if ($doador_id > 0) {
    $sql = "SELECT * FROM $nomeDaTabelaDoacoes WHERE doador_id = $doador_id ORDER BY created_at DESC";
} else {
    $sql = "SELECT * FROM $nomeDaTabelaDoacoes ORDER BY created_at DESC";
}

$resultado = $conexao->query($sql);
$doacoes = [];

if ($resultado) {
    while ($row = $resultado->fetch_assoc()) {
        $doacoes[] = $row;
    }
}

echo json_encode($doacoes);
exit;
?>