-- Update exercise 1 with properly formatted description with indentation
UPDATE exercicios
SET description = 'Crie um banco de dados chamado BibliotecaDB e, dentro dele, crie as seguintes tabelas:

1. Livros
   - id_livro (inteiro, chave primária)
   - titulo (texto, até 150 caracteres)
   - ano_publicacao (inteiro)'
WHERE id = 1;