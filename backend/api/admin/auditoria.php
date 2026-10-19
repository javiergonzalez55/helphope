<?php
// admin/auditoria.php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../db.php';
require_once __DIR__ . '/../../auth.php';

require_admin();

$limit = 100;
$sql = "SELECT a.id, a.usuario_id, a.acao, a.detalhe, a.criado_em, u.nome as usuario_nome FROM auditoria a LEFT JOIN usuarios u ON a.usuario_id = u.id ORDER BY a.criado_em DESC LIMIT ?";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param('i', $limit);
$stmt->execute();
$res = $stmt->get_result();
$rows = [];
while ($r = $res->fetch_assoc()) {
    $rows[] = $r;
}
$stmt->close();

echo json_encode(['success' => true, 'auditoria' => $rows]);
