-- Add new columns to aulas table for structured content
ALTER TABLE public.aulas 
ADD COLUMN IF NOT EXISTS objetivo_geral TEXT,
ADD COLUMN IF NOT EXISTS objetivos_especificos TEXT,
ADD COLUMN IF NOT EXISTS proximos_passos TEXT;

-- Clear existing aulas data
DELETE FROM public.aulas;

-- Insert the 5 new lessons with all structured information
INSERT INTO public.aulas (id, title, video_url, description, duration, objetivo_geral, objetivos_especificos, proximos_passos) VALUES
(1, 
 '1. Introdução à Linguagem SQL e Comandos Básicos',
 'https://www.youtube.com/watch?v=N6KsCN8kfOk',
 'Esta unidade apresenta o que é SQL (Linguagem de Consulta Estruturada) e por que ela é fundamental no mundo da tecnologia. Abordaremos a história, os diferentes "sabores" de SQL (MySQL, PostgreSQL, etc.) e introduziremos os subconjuntos da linguagem, com foco especial no DDL (Linguagem de Definição de Dados).',
 '45-60 minutos',
 'Compreender o propósito do SQL no gerenciamento de bancos de dados relacionais e aprender a criar e modificar a estrutura fundamental de um banco: as tabelas.',
 'Definir o que é um banco de dados relacional (tabelas, linhas, colunas). Identificar os principais subconjuntos do SQL (DDL, DML, DCL, TCL). Escrever o comando CREATE TABLE para definir uma nova tabela e seus tipos de dados (INTEGER, VARCHAR, DATE, etc.). Usar o comando ALTER TABLE para adicionar ou remover colunas de uma tabela existente. Usar o comando DROP TABLE para excluir permanentemente uma tabela.',
 'Agora que você sabe como criar a "caixa" (a tabela), na próxima unidade, aprenderemos os conceitos para manipular o que vai "dentro" dela (os dados).'
),
(2,
 '2. DML - Linguagem de Manipulação de Dados',
 'https://www.youtube.com/watch?v=dfoXnJKyQVs',
 'Foco no subconjunto mais utilizado do SQL: a Linguagem de Manipulação de Dados (DML). Esta unidade introduz a teoria por trás dos quatro comandos essenciais que formam o acrônimo "CRUD" (Create, Read, Update, Delete) no contexto de bancos de dados.',
 '45-60 minutos',
 'Entender o conceito de manipulação de dados e identificar quais comandos são usados para inserir, consultar, atualizar e excluir informações das tabelas.',
 'Definir o que é DML e sua diferença crucial em relação ao DDL. Explicar o propósito do comando INSERT (Create). Explicar o propósito do comando SELECT (Read). Explicar o propósito do comando UPDATE (Update). Explicar o propósito do comando DELETE (Delete). Discutir a importância de "consultar antes de alterar" para garantir a integridade dos dados.',
 'Com a teoria do DML estabelecida, a próxima unidade será 100% prática, focada em escrever a sintaxe correta para cada um desses comandos.'
),
(3,
 '3. Inserção, Consulta, Alteração e Exclusão de Dados',
 'https://www.youtube.com/watch?v=yc8RY7st7HU',
 'Mãos à obra. Esta unidade é um mergulho prático na sintaxe dos comandos DML. Você aprenderá como usar INSERT para popular tabelas, SELECT para fazer perguntas ao banco, UPDATE para corrigir dados e DELETE para remover registros, com foco especial na cláusula WHERE para garantir precisão.',
 '45-60 minutos',
 'Dominar a sintaxe e a aplicação prática dos comandos INSERT, SELECT, UPDATE e DELETE para realizar operações de CRUD em um banco de dados de forma segura.',
 'Escrever uma instrução INSERT INTO para adicionar novas linhas a uma tabela. Escrever uma instrução SELECT para buscar colunas específicas (SELECT col1, col2). Utilizar o SELECT * para buscar todas as colunas. Aplicar a cláusula WHERE para filtrar resultados em SELECT, UPDATE e DELETE. Compreender a importância vital do WHERE em comandos UPDATE e DELETE para evitar a perda catastrófica de dados. Escrever uma instrução UPDATE para modificar dados existentes em linhas específicas. Escrever uma instrução DELETE para remover linhas específicas de uma tabela.',
 'Você já sabe como consultar dados básicos, mas como organizar, agrupar e calcular esses dados? Os comandos avançados de consulta são o próximo nível.'
),
(4,
 '4. Comandos Avançados: Agregação e Ordenação',
 'https://www.youtube.com/watch?v=BBASKdGg2Wo',
 'Consultas básicas raramente são suficientes para responder perguntas de negócio. Nesta unidade, você aprenderá a processar e analisar dados diretamente no banco, usando funções de agregação para calcular totais, médias e contagens, além de ordenar e agrupar os resultados de forma lógica.',
 '45-60 minutos',
 'Aprender a realizar cálculos e análises complexas nos dados usando funções de agregação, agrupamento e ordenação para gerar relatórios significativos.',
 'Utilizar ORDER BY para classificar (ordenar) os resultados de uma consulta (ASC e DESC). Aplicar as principais funções de agregação: COUNT() (contar), SUM() (somar), AVG() (média), MAX() (máximo) e MIN() (mínimo). Usar a cláusula GROUP BY para agrupar dados e aplicar funções de agregação a cada grupo. Diferenciar o uso de WHERE (filtra linhas antes do grupo) do HAVING (filtra grupos após a agregação). Utilizar o operador LIKE para busca de padrões em textos (strings).',
 'Até agora, trabalhamos com uma tabela de cada vez. O verdadeiro poder do SQL relacional vem de conectar múltiplas tabelas, o que veremos a seguir com Subconsultas e Junções.'
),
(5,
 '5. Subconsultas e Tipos de Junção (JOINS)',
 'https://www.youtube.com/watch?v=165r4qUvp8Q',
 'Os dados em um banco relacional são "relacionados" por um motivo. Eles são distribuídos em várias tabelas para evitar redundância. Esta unidade ensina como conectar essas tabelas (JOINS) e como usar consultas dentro de outras consultas (Subconsultas) para responder perguntas complexas.',
 '45-60 minutos',
 'Dominar a habilidade de combinar dados de múltiplas tabelas (usando Chaves Primárias e Estrangeiras) e aninhar consultas para criar relatórios e buscas robustas.',
 'Entender o conceito de Chave Primária (PK) e Chave Estrangeira (FK) como a "cola" que une as tabelas. Explicar e aplicar um INNER JOIN para retornar apenas os dados que correspondem em ambas as tabelas. Diferenciar e aplicar LEFT JOIN (traz tudo da tabela da esquerda) e RIGHT JOIN (traz tudo da direita). Utilizar "Alias" (apelidos) de tabelas para simplificar as consultas com JOINs. Escrever uma subconsulta básica (subquery) dentro de uma cláusula WHERE (ex: ...WHERE id IN (SELECT ...)).',
 'Parabéns! Você completou o módulo fundamental de SQL. O próximo passo lógico é explorar tópicos mais avançados, como controle de transações (TCL), índices de performance, e normalização de dados.'
);