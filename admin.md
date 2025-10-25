# Credenciais do Usuário Admin

## Usuário Administrador Padrão

Para acessar a plataforma com privilégios de administrador, você primeiro precisa criar a conta através do sistema de registro.

**Email:** admin@sqlmaster.com  
**Senha:** admin123  
**Nome:** Administrador

---

## Instruções para Criar a Conta Admin

Como a plataforma agora usa autenticação real com banco de dados, você precisa criar o usuário admin pela primeira vez:

1. Acesse a página de registro em `/register`
2. Preencha os campos:
   - **Nome completo:** Administrador
   - **E-mail:** admin@sqlmaster.com
   - **Senha:** admin123
   - **Confirmar senha:** admin123
3. Clique em "Criar conta"
4. Você será automaticamente redirecionado para a plataforma

---

## Login Subsequente

Após criar a conta pela primeira vez, use as credenciais acima para fazer login em `/login`.

---

## Segurança

⚠️ **IMPORTANTE**: Esta é uma conta de teste para fins de desenvolvimento e demonstração.  
Em produção, você deve:
- Alterar a senha padrão imediatamente
- Criar contas individuais para cada administrador
- Implementar autenticação de dois fatores (2FA)
- Revisar regularmente os logs de acesso

---

## Criando Usuários Adicionais

Todos os novos usuários devem se registrar através da página `/register`. Os dados são armazenados de forma segura no banco de dados com:
- Autenticação gerenciada pelo backend
- Senhas criptografadas automaticamente
- Perfis individuais com progresso isolado
- Todos os usuários começam com 0 pontos e 0 moedas

---

## Dados do Usuário

Cada usuário tem seu próprio registro no banco de dados contendo:
- **ID único (UUID)**
- **Email** (usado para login)
- **Nome de exibição**
- **Pontos acumulados**
- **Moedas acumuladas**
- **Ícone do perfil**
- **Progresso individual** (aulas, exercícios, desafios, materiais completados)
- **Conquistas desbloqueadas**
- **Itens comprados na loja**

Todo o progresso é rastreado individualmente por usuário e persiste entre sessões.
