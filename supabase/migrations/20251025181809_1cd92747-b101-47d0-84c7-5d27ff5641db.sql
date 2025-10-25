-- Add aula_id to materiais for lesson linking
ALTER TABLE public.materiais 
  ADD COLUMN IF NOT EXISTS aula_id INTEGER REFERENCES public.aulas(id) ON DELETE SET NULL;

-- Add reward columns to exercicios if not exist
ALTER TABLE public.exercicios 
  ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 50,
  ADD COLUMN IF NOT EXISTS coins INTEGER DEFAULT 25;

-- Insert additional lessons
INSERT INTO public.aulas (id, title, description, video_url, duration) VALUES
  (1, 'Introdução a SQL', 'Aprenda os fundamentos do SQL com exemplos práticos e exercícios.', 'https://example.com/video1.mp4', '1h30'),
  (2, 'Consultas Avançadas com JOINs', 'Domine a arte de combinar tabelas para extrair informações complexas.', 'https://example.com/video2.mp4', '2h15')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  video_url = EXCLUDED.video_url,
  duration = EXCLUDED.duration;

-- Update exercicios with varying rewards based on complexity
UPDATE public.exercicios SET points = 50, coins = 25 WHERE id = 1;

-- Update desafios with varying rewards based on complexity  
UPDATE public.desafios SET points = 150, coins = 75 WHERE id = 1;

-- Insert sample materials linked to lessons
INSERT INTO public.materiais (id, title, description, category, pdf_url, aula_id) VALUES
  (1, 'Introdução ao SQL - Guia Completo', 'Aprenda os fundamentos do SQL com exemplos práticos e exercícios detalhados.', 'Basic SQL', '/sample-material.pdf', 1)
ON CONFLICT (id) DO UPDATE SET
  aula_id = EXCLUDED.aula_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- Insert additional exercises with varying complexity
INSERT INTO public.exercicios (id, title, description, aula_id, validation_rules, hint, points, coins) VALUES
  (1, 'Crie um banco de dados', 'Você foi contratado para desenvolver o sistema de gerenciamento de uma biblioteca fictícia. O primeiro passo é a criação das tabelas principais do banco de dados.', 1, '{"keywords": ["CREATE TABLE", "LIVROS"]}', 'Lembre-se de usar o comando CREATE DATABASE antes de criar a tabela com CREATE TABLE.', 50, 25),
  (2, 'Consultas SELECT Básicas', 'Aprenda a recuperar dados de uma tabela usando o comando SELECT com filtros básicos.', 2, '{"keywords": ["SELECT", "FROM", "WHERE"]}', 'Use SELECT * FROM para selecionar todas as colunas e WHERE para filtrar os resultados.', 75, 40),
  (3, 'JOIN e Relacionamentos', 'Domine a arte de combinar dados de múltiplas tabelas usando diferentes tipos de JOIN.', 2, '{"keywords": ["SELECT", "JOIN", "ON"]}', 'Para unir tabelas, use INNER JOIN, LEFT JOIN ou RIGHT JOIN com a cláusula ON para especificar a condição de junção.', 100, 50)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  aula_id = EXCLUDED.aula_id,
  validation_rules = EXCLUDED.validation_rules,
  hint = EXCLUDED.hint,
  points = EXCLUDED.points,
  coins = EXCLUDED.coins;

-- Insert additional challenges with varying complexity
INSERT INTO public.desafios (id, title, description, scenario, aula_id, validation_rules, hint, points, coins) VALUES
  (1, 'Sistema de Gestão de Biblioteca', 'Uma biblioteca municipal está modernizando seu sistema de controle. Você foi contratado como analista de dados e precisa extrair informações cruciais do banco de dados existente.', 'A diretora precisa de um relatório detalhado sobre todos os livros emprestados no último mês que ainda não foram devolvidos.', 1, '{"keywords": ["SELECT", "FROM", "JOIN", "WHERE"]}', 'Lembre-se: você precisa relacionar as três tabelas (livros, usuarios e emprestimos) e filtrar apenas os registros onde devolvido = false.', 150, 75),
  (2, 'Análise de Vendas Avançada', 'Como analista de dados de uma empresa de e-commerce, você precisa gerar relatórios complexos sobre vendas e desempenho de produtos.', 'Crie uma consulta que retorne o total de vendas por categoria de produto, ordenado do maior para o menor, incluindo apenas categorias com mais de 1000 em vendas.', 2, '{"keywords": ["SELECT", "SUM", "GROUP BY", "HAVING", "ORDER BY"]}', 'Use SUM para totalizar, GROUP BY para agrupar por categoria, HAVING para filtrar grupos e ORDER BY DESC para ordenar do maior para o menor.', 200, 100)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  scenario = EXCLUDED.scenario,
  aula_id = EXCLUDED.aula_id,
  validation_rules = EXCLUDED.validation_rules,
  hint = EXCLUDED.hint,
  points = EXCLUDED.points,
  coins = EXCLUDED.coins;

-- Create function to check if user already completed an exercise/challenge
CREATE OR REPLACE FUNCTION public.has_completed_content(
  _user_id UUID,
  _content_type TEXT,
  _content_id INTEGER
)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_progress
    WHERE user_id = _user_id
      AND content_type = _content_type
      AND content_id = _content_id
      AND completed = true
  )
$$;