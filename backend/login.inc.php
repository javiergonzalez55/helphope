<?php
$email = $_POST["email"];
$senha = $_POST["senha"];

$email = trim($email);
$senha = trim($senha);

$email = $conexao->real_escape_string($email);
$senha = $conexao->real_escape_string($senha);

$sql = "SELECT * FROM $nomeDaTabelaUsuarios WHERE email = '$email' AND senha = '$senha'";
$resultado = $conexao->query($sql);

if ($resultado->num_rows > 0) {
    $usuario = $resultado->fetch_assoc();
    
    if ($usuario['bloqueado'] == 1) {
        $resposta = ['success' => false, 'error' => 'Usuário bloqueado. Contate o administrador.'];
        echo json_encode($resposta);
        exit;
    }
    
    if ($usuario['validado'] == 0) {
        $resposta = ['success' => false, 'error' => 'Aguardando validação do administrador.'];
        echo json_encode($resposta);
        exit;
    }
    
    unset($usuario['senha']);
    $resposta = ['success' => true, 'user' => $usuario];
    echo json_encode($resposta);
    exit;
} else {
    $resposta = ['success' => false, 'error' => 'E-mail ou senha inválidos'];
    echo json_encode($resposta);
    exit;
}
?>