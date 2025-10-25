# Manual de Manutenção da Plataforma - Guia Completo

## Introdução

Este manual contém instruções detalhadas sobre como adicionar e atualizar conteúdos na plataforma de ensino de SQL. Todas as alterações são feitas diretamente no código-fonte do projeto, sem necessidade de banco de dados externo.

---

## 1. Como Adicionar e Atualizar Exercícios

### Localização
Arquivo: `src/pages/Exercises.tsx`

### Estrutura de Dados
Cada exercício possui a seguinte estrutura:

```javascript
{
  id: 1,                                    // ID único do exercício
  class: "Aula 1: Introdução a SQL",       // Aula associada
  title: "Exercício 1 - Crie um banco de dados",  // Título do exercício
  description: "Descrição completa...",     // Descrição do problema
  completed: false,                         // Status inicial (sempre false)
}
```

### Passo a Passo para Adicionar um Exercício

1. Abra o arquivo `src/pages/Exercises.tsx`
2. Localize o array `exercises` (linhas 7-22)
3. Adicione um novo objeto ao final do array:

```javascript
const exercises = [
  // ... exercícios existentes
  {
    id: 3,  // Incremente o ID
    class: "Aula 2: Consultas Avançadas",
    title: "Exercício 3 - Uso de JOINs",
    description: "Crie consultas SQL utilizando INNER JOIN para relacionar duas tabelas...",
    completed: false,
  },
];
```

### Criar a Tela de Detalhes do Exercício

Para cada exercício, é necessário criar ou atualizar o arquivo `src/pages/ExerciseDetail.tsx`:

1. Localize a lógica de validação da resposta na função `handleExecute`
2. Adicione a validação específica para o seu exercício:

```javascript
const handleExecute = () => {
  const trimmedCode = code.trim().toUpperCase();
  
  // Adicione sua validação aqui
  if (exerciseId === "3") {  // ID do novo exercício
    if (trimmedCode.includes("INNER JOIN") && trimmedCode.includes("ON")) {
      setShowSuccess(true);
    } else {
      setShowError(true);
    }
  }
  
  setAttempts(attempts + 1);
};
```

3. Atualize o conteúdo do exercício no JSX:
   - Modifique o título
   - Atualize a descrição do problema
   - Adicione tabelas de exemplo se necessário
   - Configure a dica (hint) apropriada

---

## 2. Como Adicionar e Atualizar Desafios

### Localização
- Lista de desafios: `src/pages/Challenges.tsx`
- Detalhe do desafio: `src/pages/ChallengeDetail.tsx`

### Estrutura de Dados
Cada desafio possui:

```javascript
{
  id: 1,
  class: "Aula 1",
  title: "Desafio 1 - Gestão de Biblioteca",
  description: "Descrição resumida do desafio...",
  completed: false,
  points: 150,      // Pontos ganhos ao completar
  coins: 75,        // Moedas ganhas ao completar
}
```

### Passo a Passo para Adicionar um Desafio

1. Abra `src/pages/Challenges.tsx`
2. Localize o array `challenges`
3. Adicione um novo desafio:

```javascript
const challenges = [
  // ... desafios existentes
  {
    id: 2,
    class: "Aula 2",
    title: "Desafio 2 - Sistema de E-commerce",
    description: "Identifique os produtos mais vendidos no último trimestre usando agregações e JOINs complexos.",
    completed: false,
    points: 200,
    coins: 100,
  },
];
```

### Criar o Conteúdo do Desafio

No arquivo `src/pages/ChallengeDetail.tsx`:

1. Adicione um novo cenário PBL (Problem-Based Learning) no JSX
2. Inclua as tabelas do banco de dados com estrutura e dados de exemplo
3. Configure a validação da solução na função `handleExecute`:

```javascript
const handleExecute = () => {
  const trimmedCode = code.trim().toUpperCase();
  
  if (challengeId === "2") {  // ID do novo desafio
    if (trimmedCode.includes("GROUP BY") && 
        trimmedCode.includes("ORDER BY") && 
        trimmedCode.includes("LIMIT")) {
      setShowSuccess(true);
    } else {
      setAttempts(attempts + 1);
      setShowError(true);
    }
  }
};
```

4. Atualize o contexto do problema:
   - Cenário realista e envolvente
   - Estrutura das tabelas (CREATE TABLE ou descrição)
   - Dados de exemplo (INSERT ou tabela visual)
   - Objetivo claro do que deve ser resolvido

---

## 3. Como Adicionar e Atualizar Aulas

### Localização
Arquivo: `src/pages/Classes.tsx` e `src/pages/ClassDetail.tsx`

### Estrutura de Dados

```javascript
{
  id: 1,
  title: "Aula 1: Introdução ao SQL",
  description: "Aprenda os fundamentos do SQL...",
  duration: "45 min",
  videoUrl: "https://www.youtube.com/embed/VIDEO_ID",  // ID do vídeo YouTube
  completed: false,
}
```

### Passo a Passo para Adicionar uma Aula

1. Abra `src/pages/Classes.tsx`
2. Localize o array de aulas
3. Adicione uma nova aula:

```javascript
const classes = [
  // ... aulas existentes
  {
    id: 3,
    title: "Aula 3: Funções de Agregação",
    description: "Aprenda a usar COUNT, SUM, AVG, MIN, MAX e GROUP BY para análise de dados.",
    duration: "50 min",
    videoUrl: "https://www.youtube.com/embed/SEU_VIDEO_ID_AQUI",
    completed: false,
  },
];
```

### Como Obter o ID do Vídeo do YouTube

1. Acesse o vídeo no YouTube
2. Copie a URL do vídeo, exemplo: `https://www.youtube.com/watch?v=ABC123XYZ`
3. O ID do vídeo é a parte após `v=`, neste caso: `ABC123XYZ`
4. Use no formato: `https://www.youtube.com/embed/ABC123XYZ`

### Vincular Exercícios e Desafios à Aula

No arquivo `src/pages/ClassDetail.tsx`, vincule exercícios e desafios à nova aula:

1. Localize as abas "Exercícios" e "Desafios"
2. Adicione cards para o novo conteúdo:

```javascript
// Na aba de Exercícios
<Card>
  <CardHeader>
    <CardTitle>Exercício 3 - Agregações Básicas</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-muted-foreground mb-4">
      Pratique o uso de funções de agregação...
    </p>
    <Button onClick={() => navigate("/exercicios/3")}>
      Acessar Exercício
    </Button>
  </CardContent>
</Card>

// Na aba de Desafios
<Card>
  <CardHeader>
    <CardTitle>Desafio 2 - Análise de Vendas</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="flex gap-2 mb-3">
      <Badge variant="secondary">200 pts</Badge>
      <Badge variant="outline">100 moedas</Badge>
    </div>
    <p className="text-sm text-muted-foreground mb-4">
      Use agregações para analisar dados de vendas...
    </p>
    <Button onClick={() => navigate("/desafios/2")}>
      Acessar Desafio
    </Button>
  </CardContent>
</Card>
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
