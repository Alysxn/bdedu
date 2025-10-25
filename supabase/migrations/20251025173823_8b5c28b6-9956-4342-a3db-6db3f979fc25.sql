-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_icon TEXT DEFAULT 'User',
  points INTEGER DEFAULT 0,
  coins INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create aulas (lessons) table
CREATE TABLE public.aulas (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration TEXT NOT NULL,
  video_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exercicios (exercises) table
CREATE TABLE public.exercicios (
  id SERIAL PRIMARY KEY,
  aula_id INTEGER REFERENCES public.aulas(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  validation_rules JSONB NOT NULL,
  hint TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create desafios (challenges) table
CREATE TABLE public.desafios (
  id SERIAL PRIMARY KEY,
  aula_id INTEGER REFERENCES public.aulas(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  scenario TEXT NOT NULL,
  validation_rules JSONB NOT NULL,
  points INTEGER DEFAULT 150,
  coins INTEGER DEFAULT 75,
  hint TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create materiais (materials) table
CREATE TABLE public.materiais (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  pdf_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_progress table
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('aula', 'exercicio', 'desafio', 'material')),
  content_id INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  attempts INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, content_type, content_id)
);

-- Create achievements table
CREATE TABLE public.achievements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  target INTEGER NOT NULL,
  reward_points INTEGER DEFAULT 0,
  reward_coins INTEGER DEFAULT 0,
  achievement_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_achievements table
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id TEXT REFERENCES public.achievements(id) ON DELETE CASCADE,
  current_progress INTEGER DEFAULT 0,
  claimed BOOLEAN DEFAULT FALSE,
  claimed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Create store_items table
CREATE TABLE public.store_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  price INTEGER NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_purchases table
CREATE TABLE public.user_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_id TEXT REFERENCES public.store_items(id) ON DELETE CASCADE,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, item_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.desafios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materiais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Aulas policies (public read)
CREATE POLICY "Anyone can view aulas"
  ON public.aulas FOR SELECT
  TO authenticated
  USING (true);

-- Exercicios policies (public read)
CREATE POLICY "Anyone can view exercicios"
  ON public.exercicios FOR SELECT
  TO authenticated
  USING (true);

-- Desafios policies (public read)
CREATE POLICY "Anyone can view desafios"
  ON public.desafios FOR SELECT
  TO authenticated
  USING (true);

-- Materiais policies (public read)
CREATE POLICY "Anyone can view materiais"
  ON public.materiais FOR SELECT
  TO authenticated
  USING (true);

-- User progress policies
CREATE POLICY "Users can view their own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Achievements policies (public read)
CREATE POLICY "Anyone can view achievements"
  ON public.achievements FOR SELECT
  TO authenticated
  USING (true);

-- User achievements policies
CREATE POLICY "Users can view their own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievements"
  ON public.user_achievements FOR UPDATE
  USING (auth.uid() = user_id);

-- Store items policies (public read)
CREATE POLICY "Anyone can view store items"
  ON public.store_items FOR SELECT
  TO authenticated
  USING (true);

-- User purchases policies
CREATE POLICY "Users can view their own purchases"
  ON public.user_purchases FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own purchases"
  ON public.user_purchases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to update profile updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profile updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_profile_updated_at();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', 'Estudante'));
  RETURN NEW;
END;
$$;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert initial aulas
INSERT INTO public.aulas (id, title, description, duration, video_url) VALUES
(1, 'Aula 1: Introdução ao SQL', 'Aprenda os fundamentos do SQL e como criar seu primeiro banco de dados. Nesta aula, você vai entender a estrutura básica de um banco de dados relacional e executar seus primeiros comandos.', '45 min', 'https://www.youtube.com/embed/Ofktsne-utM');

-- Insert initial exercicios
INSERT INTO public.exercicios (id, aula_id, title, description, validation_rules, hint) VALUES
(1, 1, 'Exercício 1 - Crie um banco de dados', 'Crie um banco de dados chamado "escola" usando o comando CREATE DATABASE.', '{"keywords": ["CREATE", "DATABASE", "ESCOLA"]}', 'Use o comando CREATE DATABASE seguido do nome do banco de dados.'),
(2, 1, 'Exercício 2 - Crie uma tabela', 'Crie uma tabela chamada "alunos" com as colunas: id (INT), nome (VARCHAR), email (VARCHAR).', '{"keywords": ["CREATE", "TABLE", "ALUNOS"]}', 'Use CREATE TABLE alunos (...) com as definições de colunas.');

-- Insert initial desafios
INSERT INTO public.desafios (id, aula_id, title, description, scenario, validation_rules, points, coins, hint) VALUES
(1, 1, 'Desafio 1 - Gestão de Biblioteca', 'Identifique os livros emprestados há mais de 30 dias e liste os nomes dos usuários responsáveis.', 'Você é o administrador de uma biblioteca digital e precisa gerar um relatório dos livros que estão emprestados há mais de 30 dias.', '{"keywords": ["SELECT", "FROM", "WHERE", "JOIN"]}', 150, 75, 'Use JOIN para conectar as tabelas e WHERE com data de empréstimo.');

-- Insert initial materiais
INSERT INTO public.materiais (id, category, title, description, pdf_url) VALUES
(1, 'Basic SQL', 'Introduction to SQL', 'Learn the fundamentals of SQL databases and queries.', '/sample-material.pdf');

-- Insert initial achievements
INSERT INTO public.achievements (id, title, description, icon, target, reward_points, reward_coins, achievement_type) VALUES
('first-lesson', 'Primeira Aula', 'Complete sua primeira aula', 'GraduationCap', 1, 50, 25, 'aulas'),
('three-lessons', 'Estudante Dedicado', 'Complete 3 aulas', 'BookOpen', 3, 100, 50, 'aulas'),
('first-exercise', 'Primeiro Exercício', 'Complete seu primeiro exercício', 'Code', 1, 50, 25, 'exercicios'),
('five-exercises', 'Praticante SQL', 'Complete 5 exercícios', 'Trophy', 5, 150, 75, 'exercicios'),
('first-challenge', 'Desafiador', 'Complete seu primeiro desafio', 'Target', 1, 100, 50, 'desafios'),
('first-material', 'Leitor Ávido', 'Leia seu primeiro material', 'FileText', 1, 50, 25, 'materiais'),
('500-coins', 'Colecionador', 'Acumule 500 moedas', 'Coins', 500, 200, 0, 'coins'),
('1000-points', 'Mestre SQL', 'Alcance 1000 pontos', 'Award', 1000, 0, 100, 'points'),
('daily-streak', 'Consistente', 'Mantenha uma sequência de 7 dias', 'Calendar', 7, 300, 150, 'streak');

-- Insert initial store items
INSERT INTO public.store_items (id, name, icon, price, description) VALUES
('icon-trophy', 'Troféu', 'Trophy', 100, 'Ícone de troféu para perfis conquistadores'),
('icon-star', 'Estrela', 'Star', 150, 'Ícone de estrela para perfis brilhantes'),
('icon-crown', 'Coroa', 'Crown', 200, 'Ícone de coroa para perfis reais'),
('icon-medal', 'Medalha', 'Medal', 120, 'Ícone de medalha para perfis campeões'),
('icon-rocket', 'Foguete', 'Rocket', 180, 'Ícone de foguete para perfis em ascensão'),
('icon-brain', 'Cérebro', 'Brain', 200, 'Ícone de cérebro para perfis inteligentes'),
('icon-zap', 'Raio', 'Zap', 150, 'Ícone de raio para perfis elétricos'),
('icon-flame', 'Chama', 'Flame', 160, 'Ícone de chama para perfis ardentes');