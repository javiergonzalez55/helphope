<?php
$tipo = $_POST["tipo"];
$nome = $_POST["nome"];
$documento = $_POST["documento"];
$email = $_POST["email"];
$telefone = $_POST["telefone"];
$senha = $_POST["senha"];

$nome = trim($nome);
$documento = trim($documento);
$email = trim($email);
$telefone = trim($telefone);
$senha = trim($senha);

$nome = $conexao->real_escape_string($nome);
$documento = $conexao->real_escape_string($documento);
$email = $conexao->real_escape_string($email);
$telefone = $conexao->real_escape_string($telefone);
$senha = $conexao->real_escape_string($senha);

if (strlen($senha) < 8) {
    $resposta = ['success' => false, 'error' => 'A senha deve ter no mínimo 8 caracteres.'];
    echo json_encode($resposta);
    exit;
}

$sql = "SELECT id FROM $nomeDaTabelaUsuarios WHERE email = '$email' OR documento = '$documento'";
$resultado = $conexao->query($sql);
if ($resultado->num_rows > 0) {
    $resposta = ['success' => false, 'error' => 'E-mail ou CPF/CNPJ já cadastrado!'];
    echo json_encode($resposta);
    exit;
}

// Instituição precisa validação, doadores e empresas já validados
$validado = ($tipo == 'instituicao') ? 0 : 1;

$sql = "INSERT INTO $nomeDaTabelaUsuarios 
        (tipo, nome, documento, email, telefone, senha, validado) 
        VALUES 
        ('$tipo', '$nome', '$documento', '$email', '$telefone', '$senha', $validado)";

if ($conexao->query($sql)) {
    $mensagem = $validado ? 
        'Cadastro realizado com sucesso! Faça login.' : 
        'Cadastro realizado! Aguarde a validação do administrador.';
    $resposta = ['success' => true, 'message' => $mensagem];
    echo json_encode($resposta);
    exit;
} else {
    $resposta = ['success' => false, 'error' => 'Erro ao cadastrar: ' . $conexao->error];
    echo json_encode($resposta);
    exit;
}
?>