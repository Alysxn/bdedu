import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Database } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/aulas");
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Email ou senha incorretos");
      } else {
        toast.error("Erro ao fazer login: " + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="relative">
              <Database className="h-12 w-12 text-primary" strokeWidth={2.5} />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-sm transform rotate-12" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">Bem-vindo ao BD.Edu</h1>
          <p className="text-muted-foreground">
            Aprimore suas habilidades em banco de dados com práticas interativas de SQL e aprendizado baseado em problemas.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="text-right">
            <a href="#" className="text-sm text-primary hover:underline">
              Esqueceu a senha?
            </a>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Ou
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => navigate("/register")}
          >
            Criar conta
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
