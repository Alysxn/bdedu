import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RankingsDialog } from "@/components/RankingsDialog";
import { BookOpen, Target, GraduationCap, Trophy } from "lucide-react";
import { useState } from "react";

const Profile = () => {
  const [showRankings, setShowRankings] = useState(false);

  return (
    <AppLayout>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-4xl font-bold text-foreground">Meu Perfil</h1>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-6 mb-8">
                <Avatar className="h-32 w-32 bg-muted">
                  <AvatarFallback className="bg-muted text-muted-foreground text-4xl">
                    199 × 160
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground mb-1">Próximo Ranking</div>
                  <div className="text-2xl font-bold text-purple-600 mb-1">Mestre</div>
                  <div className="text-sm text-primary mb-3">1200/2000 Pontuação</div>
                  <Button variant="outline" size="sm" onClick={() => setShowRankings(true)}>
                    Ver Rankings
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Informações Pessoais</h2>
                
                <div>
                  <Label>Nome Completo</Label>
                  <Input value="Alyson Souza" className="bg-muted" readOnly />
                </div>

                <div>
                  <Label>Ranking</Label>
                  <Input value="Diamante" className="bg-muted" readOnly />
                </div>

                <div>
                  <Label>Universidade</Label>
                  <Input value="Universidade Federal do Amazonas" className="bg-muted" readOnly />
                </div>

                <div>
                  <Label>Número</Label>
                  <Input value="(92) 99999-9999" className="bg-muted" readOnly />
                </div>

                <div>
                  <Label>Nova Senha</Label>
                  <Input 
                    type="password" 
                    placeholder="Deixe em branco para não alterar" 
                    className="bg-background"
                  />
                </div>

                <Button className="w-full">Salvar Alterações</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visão Geral da Atividade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Materiais Lidos</div>
                  <div className="text-3xl font-bold">15</div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Desafios Completos</div>
                  <div className="text-3xl font-bold">8</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Últimos Materiais Lidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { icon: BookOpen, title: "Introdução ao SQL" },
                { icon: BookOpen, title: "Primary Keys" },
                { icon: BookOpen, title: "INNER JOINS" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <span>{item.title}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Últimas Conquistas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { icon: GraduationCap, title: "Primeira aula concluída" },
                { icon: Trophy, title: "Especialista em SQL" },
                { icon: Target, title: "10 Desafios resolvidos" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <span>{item.title}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <RankingsDialog open={showRankings} onOpenChange={setShowRankings} />
    </AppLayout>
  );
};

export default Profile;
