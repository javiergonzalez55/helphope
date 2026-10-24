<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $user = require_auth();
    $mode = $_GET['mode'] ?? 'mine';

    if ($mode === 'all') {
        $stmt = $pdo->prepare('SELECT d.id, d.title, d.description, d.quantity, d.unit, d.status, d.created_at, u.name AS donor_name, c.name AS category_name FROM donations d INNER JOIN users u ON u.id = d.user_id INNER JOIN categories c ON c.id = d.category_id ORDER BY d.created_at DESC');
        $stmt->execute();
        json_response(true, 'Doações carregadas.', ['donations' => $stmt->fetchAll()], 200);
    }

    $stmt = $pdo->prepare('SELECT d.id, d.title, d.description, d.quantity, d.unit, d.status, d.created_at, c.name AS category_name FROM donations d INNER JOIN categories c ON c.id = d.category_id WHERE d.user_id = :user_id ORDER BY d.created_at DESC');
    $stmt->execute([':user_id' => $user['id']]);
    json_response(true, 'Minhas doações carregadas.', ['donations' => $stmt->fetchAll()], 200);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user = require_auth();
    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data)) {
        $data = [];
    }

    if (!in_array(($user['type'] ?? ''), ['doador', 'empresa', 'admin'], true)) {
        json_response(false, 'Apenas doadores podem cadastrar doações.', [], 403);
    }

    $categoryId = (int) ($data['category_id'] ?? 0);
    $title = normalize_string($data['title'] ?? '');
    $description = normalize_string($data['description'] ?? '');
    $quantity = (float) ($data['quantity'] ?? 0);
    $unit = normalize_string($data['unit'] ?? '');
    $status = normalize_string($data['status'] ?? 'disponivel');

    if ($categoryId <= 0 || !$title || !$description || $quantity <= 0 || !$unit) {
        json_response(false, 'Preencha todos os campos da doação.', [], 400);
    }

    $allowedStatuses = ['disponivel', 'solicitada', 'concluida', 'cancelada'];
    if (!in_array($status, $allowedStatuses, true)) {
        json_response(false, 'Status inválido.', [], 400);
    }

    $stmt = $pdo->prepare('SELECT id FROM categories WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => $categoryId]);
    if (!$stmt->fetch()) {
        json_response(false, 'Categoria não encontrada.', [], 404);
    }

    $stmt = $pdo->prepare('INSERT INTO donations (user_id, category_id, title, description, quantity, unit, status, created_at) VALUES (:user_id, :category_id, :title, :description, :quantity, :unit, :status, NOW())');
    $stmt->execute([
        ':user_id' => $user['id'],
        ':category_id' => $categoryId,
        ':title' => $title,
        ':description' => $description,
        ':quantity' => $quantity,
        ':unit' => $unit,
        ':status' => $status,
    ]);

    json_response(true, 'Doação cadastrada com sucesso.', [], 201);
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $user = require_auth();
    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data)) {
        $data = [];
    }

    $id = (int) ($data['id'] ?? 0);
    if ($id <= 0) {
        json_response(false, 'Identificador inválido.', [], 400);
    }

    $stmt = $pdo->prepare('SELECT user_id, status FROM donations WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => $id]);
    $donation = $stmt->fetch();

    if (!$donation) {
        json_response(false, 'Doação não encontrada.', [], 404);
    }

    if (($user['type'] ?? '') !== 'admin' && (int) $donation['user_id'] !== (int) $user['id']) {
        json_response(false, 'Você não pode editar esta doação.', [], 403);
    }

    $categoryId = (int) ($data['category_id'] ?? 0);
    $title = normalize_string($data['title'] ?? '');
    $description = normalize_string($data['description'] ?? '');
    $quantity = (float) ($data['quantity'] ?? 0);
    $unit = normalize_string($data['unit'] ?? '');
    $status = normalize_string($data['status'] ?? $donation['status']);

    if ($categoryId <= 0 || !$title || !$description || $quantity <= 0 || !$unit) {
        json_response(false, 'Preencha todos os campos da doação.', [], 400);
    }

    $allowedStatuses = ['disponivel', 'solicitada', 'concluida', 'cancelada'];
    if (!in_array($status, $allowedStatuses, true)) {
        json_response(false, 'Status inválido.', [], 400);
    }

    $stmt = $pdo->prepare('UPDATE donations SET category_id = :category_id, title = :title, description = :description, quantity = :quantity, unit = :unit, status = :status WHERE id = :id');
    $stmt->execute([
        ':category_id' => $categoryId,
        ':title' => $title,
        ':description' => $description,
        ':quantity' => $quantity,
        ':unit' => $unit,
        ':status' => $status,
        ':id' => $id,
    ]);

    json_response(true, 'Doação atualizada com sucesso.', [], 200);
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

    $stmt = $pdo->prepare('SELECT user_id FROM donations WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => $id]);
    $donation = $stmt->fetch();

    if (!$donation) {
        json_response(false, 'Doação não encontrada.', [], 404);
    }

    if (($user['type'] ?? '') !== 'admin' && (int) $donation['user_id'] !== (int) $user['id']) {
        json_response(false, 'Você não pode excluir esta doação.', [], 403);
    }

    $pdo->prepare('DELETE FROM donations WHERE id = :id')->execute([':id' => $id]);
    json_response(true, 'Doação removida com sucesso.', [], 200);
}

json_response(false, 'Método não permitido.', [], 405);
