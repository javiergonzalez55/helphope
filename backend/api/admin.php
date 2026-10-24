<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $user = require_auth();
    $mode = $_GET['mode'] ?? 'mine';

    if ($mode === 'open') {
        $stmt = $pdo->prepare('SELECT r.id, r.title, r.description, r.quantity, r.unit, r.status, r.created_at, u.name AS institution_name, c.name AS category_name FROM requests r INNER JOIN users u ON u.id = r.user_id INNER JOIN categories c ON c.id = r.category_id WHERE r.status = :status ORDER BY r.created_at DESC');
        $stmt->execute([':status' => 'aberta']);
        json_response(true, 'Solicitações abertas carregadas.', ['requests' => $stmt->fetchAll()], 200);
    }

    $userId = (int) ($user['id'] ?? 0);
    $where = 'r.user_id = :user_id';
    if (($user['type'] ?? '') === 'admin') {
        $where = '1 = 1';
    }

    $sql = "SELECT r.id, r.title, r.description, r.quantity, r.unit, r.status, r.created_at, u.name AS institution_name, c.name AS category_name FROM requests r INNER JOIN users u ON u.id = r.user_id INNER JOIN categories c ON c.id = r.category_id WHERE {$where} ORDER BY r.created_at DESC";
    $stmt = $pdo->prepare($sql);
    if (($user['type'] ?? '') !== 'admin') {
        $stmt->execute([':user_id' => $userId]);
    } else {
        $stmt->execute();
    }

    json_response(true, 'Solicitações carregadas.', ['requests' => $stmt->fetchAll()], 200);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user = require_auth();
    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data)) {
        $data = [];
    }

    if (($user['type'] ?? '') !== 'instituicao') {
        json_response(false, 'Apenas instituições podem registrar solicitações.', [], 403);
    }

    $categoryId = (int) ($data['category_id'] ?? 0);
    $title = normalize_string($data['title'] ?? '');
    $description = normalize_string($data['description'] ?? '');
    $quantity = (float) ($data['quantity'] ?? 0);
    $unit = normalize_string($data['unit'] ?? '');

    if ($categoryId <= 0 || !$title || !$description || $quantity <= 0 || !$unit) {
        json_response(false, 'Preencha todos os campos da solicitação.', [], 400);
    }

    $stmt = $pdo->prepare('SELECT id FROM categories WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => $categoryId]);
    if (!$stmt->fetch()) {
        json_response(false, 'Categoria não encontrada.', [], 404);
    }

    $stmt = $pdo->prepare('INSERT INTO requests (user_id, category_id, title, description, quantity, unit, status, created_at) VALUES (:user_id, :category_id, :title, :description, :quantity, :unit, :status, NOW())');
    $stmt->execute([
        ':user_id' => $user['id'],
        ':category_id' => $categoryId,
        ':title' => $title,
        ':description' => $description,
        ':quantity' => $quantity,
        ':unit' => $unit,
        ':status' => 'aberta',
    ]);

    json_response(true, 'Solicitação cadastrada com sucesso.', [], 201);
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $user = require_auth();
    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data)) {
        $data = [];
    }

    $id = (int) ($data['id'] ?? 0);
    if ($id <= 0) {
        json_response(false, 'Identificador inválido.', [], 400);
    }

    $stmt = $pdo->prepare('SELECT user_id FROM requests WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => $id]);
    $request = $stmt->fetch();

    if (!$request) {
        json_response(false, 'Solicitação não encontrada.', [], 404);
    }

    if (($user['type'] ?? '') !== 'admin' && (int) $request['user_id'] !== (int) $user['id']) {
        json_response(false, 'Você não pode excluir esta solicitação.', [], 403);
    }

    $pdo->prepare('DELETE FROM requests WHERE id = :id')->execute([':id' => $id]);
    json_response(true, 'Solicitação removida com sucesso.', [], 200);
}

json_response(false, 'Método não permitido.', [], 405);
