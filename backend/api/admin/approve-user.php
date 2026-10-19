<?php
// admin/approve-user.php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../db.php';
require_once __DIR__ . '/../../auth.php';

require_admin();
$admin_id = $_SESSION['user']['id'] ?? null;

$input = json_decode(file_get_contents('php://input'), true);
$usuario_id = (int)($input['usuario_id'] ?? 0);
$action = $input['action'] ?? '';
$reason = trim($input['reason'] ?? '');

if (!$usuario_id || !in_array($action, ['approve','reject'])) {
    echo json_encode(['success' => false, 'error' => 'Parâmetros inválidos']);
    exit;
}

if ($action === 'approve') {
    $stmt = $mysqli->prepare("UPDATE usuarios SET validado = 1 WHERE id = ?");
    $stmt->bind_param('i', $usuario_id);
    if ($stmt->execute()) {
        $stmt->close();
        $detail = 'Aprovado pelo admin_id=' . ($admin_id ?? 'unknown') . '; motivo: ' . $reason;
        $stmt2 = $mysqli->prepare("INSERT INTO auditoria (usuario_id, acao, detalhe) VALUES (?, 'aprovar_usuario', ?)");
        $stmt2->bind_param('is', $usuario_id, $detail);
        $stmt2->execute();
        $stmt2->close();
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $mysqli->error]);
    }
    exit;
} else {
    // reject -> bloquear e registrar motivo
    $stmt = $mysqli->prepare("UPDATE usuarios SET bloqueado = 1 WHERE id = ?");
    $stmt->bind_param('i', $usuario_id);
    if ($stmt->execute()) {
        $stmt->close();
        $detail = 'Rejeitado pelo admin_id=' . ($admin_id ?? 'unknown') . '; motivo: ' . $reason;
        $stmt2 = $mysqli->prepare("INSERT INTO auditoria (usuario_id, acao, detalhe) VALUES (?, 'rejeitar_usuario', ?)");
        $stmt2->bind_param('is', $usuario_id, $detail);
        $stmt2->execute();
        $stmt2->close();
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $mysqli->error]);
    }
    exit;
}
