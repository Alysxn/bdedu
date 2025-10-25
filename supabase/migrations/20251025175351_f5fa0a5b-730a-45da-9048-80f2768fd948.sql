-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for secure role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policy: Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Trigger to automatically assign 'user' role on signup
CREATE OR REPLACE FUNCTION public.handle_user_role()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_role();

-- Add initial_coins and initial_points columns to profiles for starting values
ALTER TABLE public.profiles 
  ALTER COLUMN points SET DEFAULT 0,
  ALTER COLUMN coins SET DEFAULT 0;

-- Update store_items to sync with database
INSERT INTO public.store_items (id, name, icon, price, description) VALUES
  ('icon-user', 'Ícone Clássico', 'User', 0, 'Ícone padrão disponível gratuitamente'),
  ('icon-star', 'Estrela Brilhante', 'Star', 150, 'Para os estudantes que brilham'),
  ('icon-rocket', 'Foguete Espacial', 'Rocket', 200, 'Decole rumo ao conhecimento'),
  ('icon-crown', 'Coroa Real', 'Crown', 300, 'Para os reis e rainhas do SQL'),
  ('icon-shield', 'Escudo Protetor', 'Shield', 250, 'Defensor dos dados'),
  ('icon-heart', 'Coração Apaixonado', 'Heart', 180, 'Para quem ama programar'),
  ('icon-zap', 'Raio Elétrico', 'Zap', 220, 'Poder e velocidade'),
  ('icon-sparkles', 'Brilho Mágico', 'Sparkles', 350, 'Ícone mágico premium')
ON CONFLICT (id) DO NOTHING;

-- Insert predefined achievements
INSERT INTO public.achievements (id, title, description, achievement_type, icon, target, reward_points, reward_coins) VALUES
  ('first-class', 'Primeira Aula', 'Complete sua primeira aula', 'aula', 'GraduationCap', 1, 50, 25),
  ('three-classes', 'Estudante Dedicado', 'Complete 3 aulas', 'aula', 'BookOpen', 3, 150, 75),
  ('five-exercises', 'Praticante SQL', 'Complete 5 exercícios', 'exercicio', 'Target', 5, 200, 100),
  ('first-challenge', 'Desafiador', 'Complete seu primeiro desafio', 'desafio', 'Trophy', 1, 250, 125),
  ('coin-collector', 'Colecionador de Moedas', 'Acumule 500 moedas', 'coins', 'Coins', 500, 300, 150),
  ('point-master', 'Mestre em Pontos', 'Alcance 1000 pontos', 'points', 'Star', 1000, 500, 250),
  ('material-reader', 'Leitor Assíduo', 'Leia 10 materiais', 'material', 'BookOpen', 10, 200, 100),
  ('all-classes', 'Aluno Exemplar', 'Complete todas as aulas disponíveis', 'aula', 'Award', 5, 1000, 500),
  ('speed-runner', 'Velocista', 'Complete 3 exercícios em um dia', 'exercicio', 'Zap', 3, 150, 75)
ON CONFLICT (id) DO NOTHING;