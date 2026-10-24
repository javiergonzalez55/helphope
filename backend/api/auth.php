<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(false, 'Método não permitido.', [], 405);
}

$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) {
    $data = [];
}

$email = normalize_string($data['email'] ?? '');
$password = (string) ($data['password'] ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 8) {
    json_response(false, 'E-mail ou senha inválidos.', [], 400);
}

$stmt = $pdo->prepare('SELECT id, name, email, password_hash, type, status, is_validated FROM users WHERE email = :email LIMIT 1');
$stmt->execute([':email' => $email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    json_response(false, 'Credenciais inválidas.', [], 401);
}

if ($user['status'] !== 'ativo' || (int) $user['is_validated'] !== 1) {
    json_response(false, 'Usuário não está validado ou não está ativo.', [], 403);
}

$_SESSION['user'] = [
    'id' => (int) $user['id'],
    'name' => $user['name'],
    'email' => $user['email'],
    'type' => $user['type'],
];

json_response(true, 'Login realizado com sucesso.', [
    'user' => $_SESSION['user'],
], 200);
