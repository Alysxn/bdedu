import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { GraduationCap, Target, Trophy } from "lucide-react";
import heroImage from "@/assets/hero.jpg";
import curriculoImage from "@/assets/curriculo.png";
import projetosImage from "@/assets/projetos.png";
import aulasImage from "@/assets/aulas.png";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo />
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button onClick={() => navigate("/register")}>
              Registre-se
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-6 text-foreground leading-tight">
              Aprenda Bancos de Dados de Forma Prática
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Domine SQL e design de banco de dados por meio de aprendizagem baseada em problemas e prática. Adquira
              habilidades do mundo real com nossa plataforma interativa.
            </p>
            <Button size="lg" onClick={() => navigate("/register")}>
              Começar agora
            </Button>
          </div>
          <div className="rounded-2xl overflow-hidden">
            <img 
              src={heroImage} 
              alt="Database Learning Platform" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="bg-card py-20">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-foreground">
            Nossa metodologia
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-xl border border-border">
              <GraduationCap className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3 text-foreground">Aulas guiadas</h3>
              <p className="text-muted-foreground">
                Aulas estruturadas com explicações claras e exemplos para construir uma base sólida.
              </p>
            </div>
            <div className="bg-background p-8 rounded-xl border border-border">
              <Target className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3 text-foreground">Desafios Interativos</h3>
              <p className="text-muted-foreground">
                Desafios que aplicam seu conhecimento em cenários e projetos reais.
              </p>
            </div>
            <div className="bg-background p-8 rounded-xl border border-border">
              <Trophy className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3 text-foreground">Progresso Gamificado</h3>
              <p className="text-muted-foreground">
                Acompanhe seu progresso, ganhe recompensas e aumente seu ranking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-8 text-foreground">
          Tudo o que você precisa para impulsionar suas habilidades em SQL e banco de dados
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-3xl mx-auto">
          Nossa plataforma oferece uma experiência de aprendizado abrangente para estudantes, profissionais e entusiastas de bancos de dados.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-background rounded-2xl p-6 mb-6 border border-border overflow-hidden">
              <img 
                src={curriculoImage} 
                alt="Currículo Abrangente" 
                className="w-full h-auto object-contain"
              />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Currículo Abrangente</h3>
            <p className="text-muted-foreground">
              Do SQL básico ao design avançado, nosso currículo te leva para todos os níveis.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-background rounded-2xl p-6 mb-6 border border-border overflow-hidden">
              <img 
                src={projetosImage} 
                alt="Projetos Práticos" 
                className="w-full h-auto object-contain"
              />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Projetos Práticos</h3>
            <p className="text-muted-foreground">
              Aplique seu conhecimento em projetos reais que resumem desafios mais de bancos de dados.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-background rounded-2xl p-6 mb-6 border border-border overflow-hidden">
              <img 
                src={aulasImage} 
                alt="Aulas Gratuitas" 
                className="w-full h-auto object-contain"
              />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Aulas Gratuitas</h3>
            <p className="text-muted-foreground">
              Tenha acesso a conteúdos selecionados com curadoria para iniciar seus estudos em SQL e bancos de dados.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-card py-20">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-bold mb-6 text-foreground">
            Comece a aprender bancos de dados hoje mesmo!
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Cadastre-se agora e leve suas habilidades em bancos de dados para o próximo nível.
          </p>
          <Button size="lg" onClick={() => navigate("/register")}>
            Crie sua conta grátis
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
