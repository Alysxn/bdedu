# Manual de Manutenção da Plataforma - Guia Completo

## Introdução

Este manual contém instruções detalhadas sobre como adicionar e atualizar conteúdos na plataforma de ensino de SQL. 

**IMPORTANTE:** A plataforma agora utiliza um backend completo com banco de dados real (Lovable Cloud). Todas as alterações de conteúdo são feitas através de consultas SQL no banco de dados, não mais em arquivos de código-fonte. O progresso dos usuários, pontos, moedas e conquistas são todos armazenados e gerenciados pelo backend.

## Estrutura do Backend

### Banco de Dados

O backend utiliza PostgreSQL com as seguintes tabelas principais:

- **profiles** - Perfis dos usuários (pontos, moedas, ícone)
- **aulas** - Catálogo de aulas disponíveis
- **exercicios** - Catálogo de exercícios
- **desafios** - Catálogo de desafios
- **materiais** - Catálogo de materiais (PDFs)
- **user_progress** - Progresso individual de cada usuário
- **achievements** - Conquistas disponíveis
- **user_achievements** - Conquistas dos usuários
- **store_items** - Itens disponíveis na loja
- **user_purchases** - Compras realizadas pelos usuários

### Autenticação

A autenticação é gerenciada pelo backend com:
- Registro de usuários através de `/register`
- Login através de `/login`
- Senhas criptografadas automaticamente
- Sessões seguras gerenciadas pelo backend

### Acessando o Backend

Para acessar o backend e fazer consultas SQL, você precisa usar a interface do Lovable Cloud. Todas as operações de banco de dados devem ser feitas através de consultas SQL executadas no backend.

**Como Executar Consultas SQL:**

1. Acesse a aba "Cloud" no painel do Lovable
2. Clique em "Database" para acessar o gerenciador de banco de dados
3. Execute suas consultas SQL diretamente no editor
4. As alterações serão aplicadas imediatamente ao banco de dados

**Consultas Úteis:**

```sql
-- Ver todas as tabelas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Ver estrutura de uma tabela
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'exercicios' 
ORDER BY ordinal_position;

-- Contar registros
SELECT COUNT(*) FROM public.aulas;
SELECT COUNT(*) FROM public.exercicios;
SELECT COUNT(*) FROM public.desafios;
```

### Backup e Restauração

**IMPORTANTE:** Antes de fazer alterações significativas no banco de dados, sempre faça um backup:

```sql
-- Backup de uma tabela (copie o resultado)
SELECT * FROM public.exercicios;

-- Para restaurar, use INSERT statements com os dados salvos
```

---

## 1. Como Adicionar e Atualizar Exercícios

### Localização no Banco de Dados
Tabela: `public.exercicios`

### Estrutura de Dados
Cada exercício possui a seguinte estrutura:

```sql
CREATE TABLE public.exercicios (
  id SERIAL PRIMARY KEY,
  aula_id INTEGER REFERENCES public.aulas(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  validation_rules JSONB NOT NULL,
  hint TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Passo a Passo para Adicionar um Exercício

Execute a seguinte consulta SQL no backend para adicionar um novo exercício:

```sql
INSERT INTO public.exercicios (aula_id, title, description, validation_rules, hint)
VALUES (
  1,  -- ID da aula associada
  'Exercício 3 - Uso de JOINs',
  'Crie consultas SQL utilizando INNER JOIN para relacionar duas tabelas e buscar informações combinadas.',
  '{"keywords": ["INNER", "JOIN", "ON"]}',  -- Palavras-chave que devem aparecer na solução
  'Use INNER JOIN para conectar duas tabelas e especifique a condição de junção com ON.'
);
```

### Validation Rules (Regras de Validação)

O campo `validation_rules` é um JSONB que define como validar a resposta do aluno:

```json
{
  "keywords": ["SELECT", "FROM", "WHERE", "GROUP BY"]
}
```

O sistema verifica se todas as palavras-chave estão presentes no código SQL submetido pelo aluno (não diferencia maiúsculas/minúsculas).

### Visualizando Exercícios Existentes

```sql
SELECT * FROM public.exercicios ORDER BY id;
```

### Atualizando um Exercício

```sql
UPDATE public.exercicios
SET 
  title = 'Novo Título',
  description = 'Nova descrição do exercício',
  validation_rules = '{"keywords": ["SELECT", "JOIN", "WHERE"]}',
  hint = 'Nova dica'
WHERE id = 3;
```

---

## 2. Como Adicionar e Atualizar Desafios

### Localização no Banco de Dados
Tabela: `public.desafios`

### Estrutura de Dados
Cada desafio possui:

```sql
CREATE TABLE public.desafios (
  id SERIAL PRIMARY KEY,
  aula_id INTEGER REFERENCES public.aulas(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  scenario TEXT NOT NULL,
  validation_rules JSONB NOT NULL,
  points INTEGER DEFAULT 150,
  coins INTEGER DEFAULT 75,
  hint TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Passo a Passo para Adicionar um Desafio

Execute a consulta SQL no backend:

```sql
INSERT INTO public.desafios (
  aula_id, 
  title, 
  description, 
  scenario, 
  validation_rules, 
  points, 
  coins, 
  hint
)
VALUES (
  2,  -- ID da aula
  'Desafio 2 - Sistema de E-commerce',
  'Identifique os produtos mais vendidos no último trimestre.',
  'Você é o analista de dados de um e-commerce e precisa gerar um relatório dos produtos mais vendidos. O banco contém tabelas de produtos, vendas e clientes.',
  '{"keywords": ["SELECT", "FROM", "GROUP BY", "ORDER BY", "LIMIT"]}',
  200,  -- pontos
  100,  -- moedas
  'Use GROUP BY para agrupar por produto, ORDER BY para ordenar, e LIMIT para pegar os top resultados.'
);
```

### Visualizando Desafios

```sql
SELECT * FROM public.desafios ORDER BY id;
```

### Atualizando um Desafio

```sql
UPDATE public.desafios
SET 
  title = 'Novo Título do Desafio',
  description = 'Nova descrição',
  scenario = 'Novo cenário PBL',
  points = 250,
  coins = 125
WHERE id = 2;
```

---

## 3. Como Adicionar e Atualizar Aulas

### Localização no Banco de Dados
Tabela: `public.aulas`

### Estrutura de Dados

```sql
CREATE TABLE public.aulas (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration TEXT NOT NULL,
  video_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Passo a Passo para Adicionar uma Aula

Execute a consulta SQL:

```sql
INSERT INTO public.aulas (title, description, duration, video_url)
VALUES (
  'Aula 3: Funções de Agregação',
  'Aprenda a usar COUNT, SUM, AVG, MIN, MAX e GROUP BY para análise de dados e gerar relatórios estatísticos.',
  '50 min',
  'https://www.youtube.com/embed/SEU_VIDEO_ID_AQUI'
);
```

### Como Obter o ID do Vídeo do YouTube

1. Acesse o vídeo no YouTube
2. Copie a URL do vídeo, exemplo: `https://www.youtube.com/watch?v=ABC123XYZ`
3. O ID do vídeo é a parte após `v=`, neste caso: `ABC123XYZ`
4. Use no formato: `https://www.youtube.com/embed/ABC123XYZ`

### Visualizando Aulas

```sql
SELECT * FROM public.aulas ORDER BY id;
```

### Atualizando uma Aula

```sql
UPDATE public.aulas
SET 
  title = 'Novo Título',
  description = 'Nova descrição',
  duration = '60 min',
  video_url = 'https://www.youtube.com/embed/NOVO_ID'
WHERE id = 3;
```

### Vinculando Exercícios e Desafios

Após criar uma aula, vincule exercícios e desafios através do campo `aula_id`:

```sql
-- Vincular exercício existente à aula 3
UPDATE public.exercicios SET aula_id = 3 WHERE id = 5;

-- Vincular desafio existente à aula 3
UPDATE public.desafios SET aula_id = 3 WHERE id = 2;
```

---

## 4. Como Adicionar e Atualizar Materiais

### Localização
- Lista: `src/pages/Materials.tsx`
- Detalhe: `src/pages/MaterialDetail.tsx`

### Estrutura de Dados

```javascript
{
  id: 1,
  category: "Basic SQL",           // Categoria do material
  title: "Introduction to SQL",    // Título do material
  description: "Learn the fundamentals...",  // Descrição
}
```

### Passo a Passo para Adicionar um Material

1. Abra `src/pages/Materials.tsx`
2. Localize o array `materials`
3. Adicione um novo material:

```javascript
const materials = [
  // ... materiais existentes
  {
    id: 5,
    category: "Database Design",
    title: "Modelagem de Dados Relacional",
    description: "Aprenda técnicas de modelagem de dados, normalização e design de esquemas eficientes.",
  },
];
```

### Adicionar o Arquivo PDF

1. Coloque o arquivo PDF na pasta `public/`
   - Exemplo: `public/modelagem-dados.pdf`

2. Abra `src/pages/MaterialDetail.tsx`
3. Configure o PDF para o novo material:

```javascript
// Na função que define o PDF
const getPdfUrl = (materialId: string) => {
  switch(materialId) {
    case "1":
      return "/sample-material.pdf";
    case "5":  // Novo material
      return "/modelagem-dados.pdf";
    default:
      return "/sample-material.pdf";
  }
};
```

### Organização de PDFs

Recomendação de nomenclatura:
- Use nomes descritivos e sem espaços
- Exemplo: `introducao-sql.pdf`, `joins-avancados.pdf`
- Mantenha todos os PDFs na pasta `public/`

---

## 5. Sistema de Conquistas

### Como Funciona

As conquistas são desbloqueadas automaticamente conforme o usuário:
- Completa aulas, exercícios, desafios e materiais
- Acumula pontos e moedas
- Mantém sequências de estudo

### Localização
Arquivo: `src/pages/Achievements.tsx`

### Adicionar Novas Conquistas

Localize o array `achievementsList` e adicione:

```javascript
{
  id: "new-achievement",
  title: "Mestre dos JOINs",
  description: "Complete 5 exercícios usando JOINs",
  icon: Trophy,
  target: 5,
  currentProgress: 0,  // Será calculado automaticamente
  reward: { points: 100, coins: 50 },
  type: "joins_exercises",  // Tipo para rastreamento
}
```

---

## 6. Loja de Ícones

### Localização
Arquivo: `src/pages/Store.tsx`

### Adicionar Novos Ícones

1. Escolha um ícone da biblioteca Lucide React
2. Adicione ao array de ícones disponíveis:

```javascript
{
  id: "icon-brain",
  name: "Cérebro",
  icon: Brain,  // Importe: import { Brain } from "lucide-react"
  price: 200,
  description: "Ícone exclusivo de cérebro para perfis inteligentes"
}
```

---

## 7. Dicas Importantes

### Manutenção de IDs
- **Sempre use IDs únicos e sequenciais**
- Nunca reutilize IDs de itens removidos
- Mantenha uma lista de IDs usados

### Testando Alterações
1. Após adicionar conteúdo, limpe o localStorage do navegador
2. Acesse a página específica
3. Verifique se o conteúdo aparece corretamente
4. Teste a funcionalidade (executar código, assistir vídeo, etc.)

### Backup
- Faça backup dos arquivos antes de modificá-los
- Use controle de versão (Git) para rastrear mudanças

### Validações de SQL
- As validações são case-insensitive (maiúsculas/minúsculas não importam)
- Use `.includes()` para verificar palavras-chave
- Teste múltiplas variações de solução quando possível

---

## 8. Estrutura de Arquivos Importantes

```
src/
├── pages/
│   ├── Classes.tsx          # Lista de aulas
│   ├── ClassDetail.tsx      # Detalhes da aula + vídeo
│   ├── Exercises.tsx        # Lista de exercícios
│   ├── ExerciseDetail.tsx   # Tela do exercício
│   ├── Challenges.tsx       # Lista de desafios
│   ├── ChallengeDetail.tsx  # Tela do desafio
│   ├── Materials.tsx        # Lista de materiais
│   ├── MaterialDetail.tsx   # Visualizador de PDF
│   ├── Achievements.tsx     # Sistema de conquistas
│   ├── Store.tsx            # Loja de ícones
│   └── Profile.tsx          # Perfil do usuário
public/
└── *.pdf                    # Arquivos PDF dos materiais
```

---

## 9. Suporte e Resolução de Problemas

### Problema: Vídeo não carrega
- Verifique se o ID do YouTube está correto
- Teste a URL diretamente no navegador
- Certifique-se de usar `/embed/` na URL

### Problema: PDF não aparece
- Verifique se o arquivo está em `public/`
- Confirme o nome do arquivo (case-sensitive)
- Limpe o cache do navegador

### Problema: Validação não funciona
- Revise a lógica na função `handleExecute`
- Teste a validação com console.log()
- Verifique se o ID do exercício/desafio está correto

---

## 10. Exemplo Completo: Adicionando Nova Aula

```javascript
// 1. Em Classes.tsx - adicione a aula
{
  id: 4,
  title: "Aula 4: Subconsultas e Views",
  description: "Domine o uso de subconsultas e criação de views",
  duration: "60 min",
  videoUrl: "https://www.youtube.com/embed/XYZ123",
  completed: false,
}

// 2. Em Exercises.tsx - adicione exercício relacionado
{
  id: 6,
  class: "Aula 4: Subconsultas e Views",
  title: "Exercício 6 - Subconsultas Correlacionadas",
  description: "Crie uma subconsulta correlacionada para encontrar...",
  completed: false,
}

// 3. Em ExerciseDetail.tsx - adicione validação
if (exerciseId === "6") {
  if (trimmedCode.includes("SELECT") && 
      trimmedCode.includes("WHERE") &&
      trimmedCode.includes("IN (SELECT")) {
    setShowSuccess(true);
  }
}

// 4. Em Challenges.tsx - adicione desafio relacionado
{
  id: 3,
  class: "Aula 4",
  title: "Desafio 3 - Otimização com Views",
  description: "Crie views para otimizar consultas complexas...",
  completed: false,
  points: 250,
  coins: 125,
}
```

---

## Conclusão

Este manual cobre todos os aspectos principais da manutenção da plataforma. Mantenha-o atualizado conforme adicionar novas funcionalidades ou fazer alterações significativas na estrutura do código.

Para dúvidas ou sugestões de melhorias neste manual, documente-as em um arquivo separado chamado `NOTAS.md` na raiz do projeto.
