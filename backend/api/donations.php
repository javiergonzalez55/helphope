<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query('SELECT id, name, created_at FROM categories ORDER BY name ASC');
    json_response(true, 'Categorias carregadas.', ['categories' => $stmt->fetchAll()], 200);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_admin();

    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data)) {
        $data = [];
    }

    $name = normalize_string($data['name'] ?? '');
    if (!$name) {
        json_response(false, 'Nome da categoria é obrigatório.', [], 400);
    }

    $stmt = $pdo->prepare('SELECT id FROM categories WHERE LOWER(name) = LOWER(:name) LIMIT 1');
    $stmt->execute([':name' => $name]);
    if ($stmt->fetch()) {
        json_response(false, 'Categoria já cadastrada.', [], 409);
    }

    $stmt = $pdo->prepare('INSERT INTO categories (name) VALUES (:name)');
    $stmt->execute([':name' => $name]);

    json_response(true, 'Categoria cadastrada com sucesso.', [], 201);
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    require_admin();

    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data)) {
        $data = [];
    }

    $id = (int) ($data['id'] ?? 0);
    $name = normalize_string($data['name'] ?? '');

    if ($id <= 0 || !$name) {
        json_response(false, 'Dados inválidos para atualizar categoria.', [], 400);
    }

    $stmt = $pdo->prepare('UPDATE categories SET name = :name WHERE id = :id');
    $stmt->execute([':name' => $name, ':id' => $id]);

    json_response(true, 'Categoria atualizada com sucesso.', [], 200);
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    require_admin();

    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data)) {
        $data = [];
    }

    $id = (int) ($data['id'] ?? 0);
    if ($id <= 0) {
        json_response(false, 'Identificador inválido.', [], 400);
    }

    $stmt = $pdo->prepare('SELECT COUNT(*) FROM donations WHERE category_id = :id');
    $stmt->execute([':id' => $id]);
    if ((int) $stmt->fetchColumn() > 0) {
        json_response(false, 'Categoria não pode ser removida porque há doações vinculadas.', [], 409);
    }

    $stmt = $pdo->prepare('SELECT COUNT(*) FROM requests WHERE category_id = :id');
    $stmt->execute([':id' => $id]);
    if ((int) $stmt->fetchColumn() > 0) {
        json_response(false, 'Categoria não pode ser removida porque há solicitações vinculadas.', [], 409);
    }

    $stmt = $pdo->prepare('DELETE FROM categories WHERE id = :id');
    $stmt->execute([':id' => $id]);

    json_response(true, 'Categoria removida com sucesso.', [], 200);
}

json_response(false, 'Método não permitido.', [], 405);
