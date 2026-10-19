<?php
// admin/list-pending-users.php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../db.php';
require_once __DIR__ . '/../../auth.php';

require_admin();

$sql = "SELECT id, tipo, nome, documento, email, telefone, criado_em FROM usuarios WHERE validado = 0 ORDER BY criado_em ASC";
$res = $mysqli->query($sql);
$rows = [];
while ($r = $res->fetch_assoc()) {
    $rows[] = $r;
}

echo json_encode(['success' => true, 'pendentes' => $rows]);
