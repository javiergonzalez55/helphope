<?php
// auth.php - gerencia sessao e autorizacao minima
session_start();
header('Content-Type: application/json; charset=utf-8');

function require_admin() {
    if (empty($_SESSION['user']) || ($_SESSION['user']['tipo'] ?? '') !== 'admin') {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Acesso nao autorizado.']);
        exit;
    }
}
