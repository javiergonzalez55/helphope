<?php
$sql = "CREATE DATABASE IF NOT EXISTS $nomeDoBanco";
$conexao->query($sql) or exit($conexao->error);
