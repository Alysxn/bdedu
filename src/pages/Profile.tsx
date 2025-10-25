import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RankingsDialog } from "@/components/RankingsDialog";
import { BookOpen, Target, GraduationCap, Trophy, User, Rocket, Star, Heart, Zap, Crown, Shield, Sparkles, Coins } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const iconMap: { [key: string]: any } = {
  "icon-user": User,
  "icon-star": Star,
  "icon-rocket": Rocket,
  "icon-crown": Crown,
  "icon-shield": Shield,
  "icon-heart": Heart,
  "icon-zap": Zap,
  "icon-sparkles": Sparkles,
};

const Profile = () => {
  const [showRankings, setShowRankings] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState("icon-user");
  const [purchasedIcons, setPurchasedIcons] = useState<string[]>(["icon-user"]);
  const [userStats, setUserStats] = useState({
    points: 1200,
    coins: 0,
    completedClasses: 0,
    completedExercises: 0,
    completedChallenges: 0,
    materialsRead: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load user data from localStorage
    const savedIcon = localStorage.getItem("selectedIcon") || "icon-user";
    setSelectedIcon(savedIcon);

    const purchased = JSON.parse(localStorage.getItem("purchasedIcons") || '["icon-user"]');
    setPurchasedIcons(purchased);

    const stats = JSON.parse(localStorage.getItem("userStats") || "{}");
    setUserStats({
      points: stats.points || 1200,
      coins: stats.coins || 0,
      completedClasses: stats.completedClasses || 0,
      completedExercises: stats.completedExercises || 0,
      completedChallenges: stats.completedChallenges || 0,
      materialsRead: stats.materialsRead || 15,
    });
  }, []);

  const handleSelectIcon = (iconId: string) => {
    setSelectedIcon(iconId);
    localStorage.setItem("selectedIcon", iconId);
    toast({
      title: "Ícone atualizado!",
      description: "Seu novo ícone de perfil foi salvo com sucesso.",
    });
  };

  const SelectedIconComponent = iconMap[selectedIcon] || User;
  
  const getRankName = (points: number) => {
    if (points >= 3000) return "Grão-Mestre";
    if (points >= 2000) return "Mestre";
    if (points >= 1500) return "Diamante";
    if (points >= 1000) return "Platina";
    if (points >= 600) return "Ouro";
    if (points >= 300) return "Prata";
    if (points >= 100) return "Bronze";
    return "Iniciante";
  };

  const getNextRank = (points: number) => {
    if (points >= 3000) return { name: "Grão-Mestre", target: 3000 };
    if (points >= 2000) return { name: "Grão-Mestre", target: 3000 };
    if (points >= 1500) return { name: "Mestre", target: 2000 };
    if (points >= 1000) return { name: "Diamante", target: 1500 };
    if (points >= 600) return { name: "Platina", target: 1000 };
    if (points >= 300) return { name: "Ouro", target: 600 };
    if (points >= 100) return { name: "Prata", target: 300 };
    return { name: "Bronze", target: 100 };
  };

  const currentRank = getRankName(userStats.points);
  const nextRank = getNextRank(userStats.points);

  return (
    <AppLayout>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-4xl font-bold text-foreground">Meu Perfil</h1>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-6 mb-8">
                <Avatar className="h-32 w-32 bg-primary/10 border-4 border-primary/20">
                  <AvatarFallback className="bg-primary/10">
                    <SelectedIconComponent className="h-16 w-16 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-sm text-muted-foreground">Ranking Atual</div>
                    <div className="flex items-center gap-2 bg-yellow-500/10 px-3 py-1 rounded-full">
                      <Coins className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-bold text-yellow-600">{userStats.coins}</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">{currentRank}</div>
                  {userStats.points < 3000 && (
                    <>
                      <div className="text-sm text-muted-foreground mb-1">Próximo Ranking: {nextRank.name}</div>
                      <div className="text-sm text-primary mb-3">{userStats.points}/{nextRank.target} Pontuação</div>
                    </>
                  )}
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
                  <Input value={currentRank} className="bg-muted" readOnly />
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

          {/* Icon Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Meus Ícones de Perfil</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Selecione um ícone para usar como sua foto de perfil
              </p>
              <div className="grid grid-cols-4 gap-4">
                {purchasedIcons.map((iconId) => {
                  const IconComponent = iconMap[iconId] || User;
                  const isSelected = selectedIcon === iconId;
                  
                  return (
                    <button
                      key={iconId}
                      onClick={() => handleSelectIcon(iconId)}
                      className={`p-6 rounded-lg border-2 transition-all hover:scale-105 ${
                        isSelected
                          ? "border-primary bg-primary/10"
                          : "border-muted hover:border-primary/50"
                      }`}
                    >
                      <IconComponent className={`h-8 w-8 mx-auto ${
                        isSelected ? "text-primary" : "text-muted-foreground"
                      }`} />
                    </button>
                  );
                })}
              </div>
              {purchasedIcons.length === 1 && (
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Visite a Loja para comprar mais ícones!
                </p>
              )}
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
                  <div className="text-3xl font-bold">{userStats.materialsRead}</div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Desafios Completos</div>
                  <div className="text-3xl font-bold">{userStats.completedChallenges}</div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Aulas Completas</div>
                  <div className="text-3xl font-bold">{userStats.completedClasses}</div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Exercícios Completos</div>
                  <div className="text-3xl font-bold">{userStats.completedExercises}</div>
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
