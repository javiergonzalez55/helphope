<?php
session_start();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$host = $_ENV['DB_HOST'] ?? '127.0.0.1';
$db   = $_ENV['DB_NAME'] ?? 'helphope';
$user = $_ENV['DB_USER'] ?? 'root';
$pass = $_ENV['DB_PASS'] ?? '';

try {
    $pdo = new PDO(
        "mysql:host={$host};dbname={$db};charset=utf8mb4",
        $user,
        $pass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro ao conectar ao banco de dados.'
    ]);
    exit;
}

function json_response(bool $success, string $message, array $data = [], int $status = 200): void
{
    http_response_code($status);
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data,
    ]);
    exit;
}

function normalize_string(?string $value): string
{
    return trim((string) ($value ?? ''));
}

function require_auth(): array
{
    if (empty($_SESSION['user'])) {
        json_response(false, 'Usuário não autenticado.', [], 401);
    }

    return $_SESSION['user'];
}

function require_admin(): void
{
    $user = require_auth();

    if (($user['type'] ?? '') !== 'admin') {
        json_response(false, 'Acesso restrito ao administrador.', [], 403);
    }
}

function ensure_default_categories(): void
{
    global $pdo;

    $count = (int) $pdo->query('SELECT COUNT(*) FROM categories')->fetchColumn();
    if ($count > 0) {
        return;
    }

    $defaultCategories = ['Alimentos', 'Materiais', 'Dinheiro', 'Educação', 'Saúde', 'Esporte'];

    $stmt = $pdo->prepare('INSERT INTO categories (name) VALUES (:name)');
    foreach ($defaultCategories as $name) {
        $stmt->execute([':name' => $name]);
    }
}

function ensure_default_admin(): void
{
    global $pdo;

    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = :email LIMIT 1');
    $stmt->execute([':email' => 'admin@helphope.com']);

    if ($stmt->fetch()) {
        return;
    }

    $pdo->prepare('INSERT INTO users (name, document, email, phone, password_hash, type, status, is_validated, terms_accepted, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())')->execute([
        'Administrador HelpHope',
        '00000000000',
        'admin@helphope.com',
        '11999999999',
        password_hash('Admin@123', PASSWORD_DEFAULT),
        'admin',
        'ativo',
        1,
        1,
    ]);
}

ensure_default_categories();
ensure_default_admin();
