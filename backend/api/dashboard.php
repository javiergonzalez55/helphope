<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    require_admin();

    $stmt = $pdo->prepare('SELECT id, name, email, document, phone, type, status, is_validated, created_at FROM users WHERE status = :status ORDER BY created_at DESC');
    $stmt->execute([':status' => 'pendente']);
    json_response(true, 'Usuários pendentes carregados.', ['users' => $stmt->fetchAll()], 200);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_admin();

    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data)) {
        $data = [];
    }

    $action = normalize_string($data['action'] ?? '');
    $userId = (int) ($data['user_id'] ?? 0);

    if (!$userId || !in_array($action, ['validate', 'reject'], true)) {
        json_response(false, 'Ação inválida.', [], 400);
    }

    $stmt = $pdo->prepare('SELECT id FROM users WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => $userId]);
    if (!$stmt->fetch()) {
        json_response(false, 'Usuário não encontrado.', [], 404);
    }

    if ($action === 'validate') {
        $pdo->prepare('UPDATE users SET status = :status, is_validated = 1 WHERE id = :id')->execute([
            ':status' => 'ativo',
            ':id' => $userId,
        ]);
        json_response(true, 'Usuário validado com sucesso.', [], 200);
    }

    $pdo->prepare('UPDATE users SET status = :status, is_validated = 0 WHERE id = :id')->execute([
        ':status' => 'inativo',
        ':id' => $userId,
    ]);
    json_response(true, 'Usuário rejeitado com sucesso.', [], 200);
}

json_response(false, 'Método não permitido.', [], 405);
