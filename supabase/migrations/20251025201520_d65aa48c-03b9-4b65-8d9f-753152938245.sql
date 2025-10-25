-- Update exercise 1 with improved validation logic
UPDATE exercicios
SET 
  description = 'Crie um banco de dados chamado BibliotecaDB e, dentro dele, crie as seguintes tabelas:

1. Livros
- id_livro (inteiro, chave primária)
- titulo (texto, até 150 caracteres)
- ano_publicacao (inteiro)',
  validation_rules = '{
    "keywords": [
      "CREATE",
      "DATABASE",
      "BIBLIOTECADB",
      "TABLE",
      "LIVROS",
      "ID_LIVRO",
      "TITULO",
      "ANO_PUBLICACAO",
      "PRIMARY KEY",
      "INT",
      "VARCHAR"
    ]
  }'::jsonb,
  hint = 'Lembre-se de usar CREATE DATABASE BibliotecaDB, depois USE BibliotecaDB, e então CREATE TABLE Livros com as colunas especificadas. Não esqueça de definir id_livro como PRIMARY KEY.'
WHERE id = 1;