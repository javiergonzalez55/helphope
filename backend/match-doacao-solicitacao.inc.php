<?php
$doacao_id = (int)$_POST["doacao_id"];
$solicitacao_id = (int)$_POST["solicitacao_id"];

// Verificar doação
$sql = "SELECT * FROM $nomeDaTabelaDoacoes WHERE id = $doacao_id AND status = 'Disponível'";
$resultado = $conexao->query($sql);
if ($resultado->num_rows === 0) {
    $resposta = ['success' => false, 'error' => 'Doação não disponível'];
    echo json_encode($resposta);
    exit;
}
$doacao = $resultado->fetch_assoc();

// Verificar solicitação
$sql = "SELECT * FROM $nomeDaTabelaSolicitacoes WHERE id = $solicitacao_id AND status = 'Aberta'";
$resultado = $conexao->query($sql);
if ($resultado->num_rows === 0) {
    $resposta = ['success' => false, 'error' => 'Solicitação não encontrada ou já encerrada'];
    echo json_encode($resposta);
    exit;
}
$solicitacao = $resultado->fetch_assoc();

// Verificar categorias
if ($doacao['categoria'] !== $solicitacao['categoria']) {
    $resposta = ['success' => false, 'error' => 'Categorias não coincidem'];
    echo json_encode($resposta);
    exit;
}

// Atualizar doação
$sql = "UPDATE $nomeDaTabelaDoacoes 
        SET status = 'Concluída', 
            concluida = 1, 
            instituicao_id = {$solicitacao['instituicao_id']}, 
            instituicao_nome = '{$solicitacao['instituicao_nome']}',
            data_conclusao = NOW()
        WHERE id = $doacao_id";

if ($conexao->query($sql)) {
    // Fechar solicitação
    $sql2 = "UPDATE $nomeDaTabelaSolicitacoes 
             SET status = 'Encerrada', encerrada = 1 
             WHERE id = $solicitacao_id";
    $conexao->query($sql2);
    
    $resposta = ['success' => true, 'message' => 'Match realizado com sucesso!'];
    echo json_encode($resposta);
    exit;
} else {
    $resposta = ['success' => false, 'error' => 'Erro ao fazer match: ' . $conexao->error];
    echo json_encode($resposta);
    exit;
}
