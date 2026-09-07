<?php
// Tabela de usuários
$sql = "CREATE TABLE IF NOT EXISTS $nomeDaTabelaUsuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(20) NOT NULL,
    nome VARCHAR(200) NOT NULL,
    documento VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    telefone VARCHAR(50) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    validado TINYINT DEFAULT 0,
    bloqueado TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB";
$conexao->query($sql) or exit($conexao->error);

// Tabela de doações
$sql = "CREATE TABLE IF NOT EXISTS $nomeDaTabelaDoacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doador_id INT NOT NULL,
    doador_nome VARCHAR(200) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    quantidade INT NOT NULL,
    observacao TEXT,
    status VARCHAR(50) DEFAULT 'Disponível',
    concluida TINYINT DEFAULT 0,
    instituicao_id INT,
    instituicao_nome VARCHAR(200),
    data_conclusao DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doador_id) REFERENCES $nomeDaTabelaUsuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB";
$conexao->query($sql) or exit($conexao->error);

// Tabela de solicitações
$sql = "CREATE TABLE IF NOT EXISTS $nomeDaTabelaSolicitacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    instituicao_id INT NOT NULL,
    instituicao_nome VARCHAR(200) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    quantidade INT NOT NULL,
    status VARCHAR(50) DEFAULT 'Aberta',
    encerrada TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instituicao_id) REFERENCES $nomeDaTabelaUsuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB";
$conexao->query($sql) or exit($conexao->error);

// Inserir usuário admin padrão
$sql = "INSERT IGNORE INTO $nomeDaTabelaUsuarios 
        (tipo, nome, documento, email, telefone, senha, validado) 
        VALUES 
        ('admin', 'Administrador', '00000000000', 'admin@helphope.com', '(00) 00000-0000', 'admin123', 1)";
$conexao->query($sql);
?>