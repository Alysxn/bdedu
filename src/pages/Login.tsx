import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login - in real app, validate credentials
    if (email && password) {
      localStorage.setItem("isAuthenticated", "true");
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao BD.Edu",
      });
      navigate("/materiais");
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

          <Button type="submit" className="w-full" size="lg">
            Entrar
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
