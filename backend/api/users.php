<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $user = require_auth();
    json_response(true, 'Sessão válida.', ['user' => $user], 200);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(false, 'Método não permitido.', [], 405);
}

$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) {
    $data = [];
}

$name = normalize_string($data['name'] ?? '');
$document = preg_replace('/[^0-9]/', '', (string) ($data['document'] ?? ''));
$email = normalize_string($data['email'] ?? '');
$phone = preg_replace('/[^0-9]/', '', (string) ($data['phone'] ?? ''));
$password = (string) ($data['password'] ?? '');
$type = normalize_string($data['type'] ?? '');
$termsAccepted = (int) ($data['terms_accepted'] ?? 0);

if (!$name || !$document || !$email || !$phone || strlen($password) < 8 || !$type || !$termsAccepted) {
    json_response(false, 'Preencha todos os campos obrigatórios.', [], 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(false, 'E-mail inválido.', [], 400);
}

$allowedTypes = ['doador', 'empresa', 'instituicao', 'admin'];
if (!in_array($type, $allowedTypes, true)) {
    json_response(false, 'Tipo de usuário inválido.', [], 400);
}

$stmt = $pdo->prepare('SELECT id FROM users WHERE email = :email OR document = :document LIMIT 1');
$stmt->execute([':email' => $email, ':document' => $document]);
if ($stmt->fetch()) {
    json_response(false, 'E-mail ou documento já cadastrados.', [], 409);
}

$isValidated = in_array($type, ['doador', 'admin'], true) ? 1 : 0;
$status = in_array($type, ['doador', 'admin'], true) ? 'ativo' : 'pendente';

$stmt = $pdo->prepare('INSERT INTO users (name, document, email, phone, password_hash, type, status, is_validated, terms_accepted, created_at) VALUES (:name, :document, :email, :phone, :password_hash, :type, :status, :is_validated, :terms_accepted, NOW())');
$stmt->execute([
    ':name' => $name,
    ':document' => $document,
    ':email' => $email,
    ':phone' => $phone,
    ':password_hash' => password_hash($password, PASSWORD_DEFAULT),
    ':type' => $type,
    ':status' => $status,
    ':is_validated' => $isValidated,
    ':terms_accepted' => 1,
]);

json_response(true, 'Usuário cadastrado com sucesso.', [], 201);
