<?php
// seed_admin.php - script para criar usuario admin com senha segura
require_once __DIR__ . '/db.php';

$email = 'admin@helphope.com';
$senha = 'admin123';
$nome = 'Administrador';
$documento = '00000000000';
$tipo = 'admin';
$telefone = '';
$validado = 1;

// verificar existencia
$stmt = $mysqli->prepare("SELECT id FROM usuarios WHERE email = ?");
$stmt->bind_param('s', $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    echo "Admin ja existe.\n";
    exit;
}
$stmt->close();

$senha_hash = password_hash($senha, PASSWORD_DEFAULT);
$insert = $mysqli->prepare("INSERT INTO usuarios (tipo, nome, documento, email, telefone, senha_hash, validado) VALUES (?, ?, ?, ?, ?, ?, ?)");
$insert->bind_param('ssssssi', $tipo, $nome, $documento, $email, $telefone, $senha_hash, $validado);
if ($insert->execute()) {
    echo "Admin criado com sucesso: $email (senha: $senha)\n";
} else {
    echo "Erro ao criar admin: " . $mysqli->error . "\n";
}
