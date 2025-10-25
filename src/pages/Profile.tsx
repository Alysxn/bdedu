import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RankingsDialog } from "@/components/RankingsDialog";
import { BookOpen, Target, GraduationCap, Trophy, User, Rocket, Star, Heart, Zap, Crown, Shield, Sparkles, Coins } from "lucide-react";
import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useProgress } from "@/hooks/useProgress";
import { useStore } from "@/hooks/useStore";
import { useToast } from "@/hooks/use-toast";

const iconMap: { [key: string]: any } = {
  "User": User,
  "Star": Star,
  "Rocket": Rocket,
  "Crown": Crown,
  "Shield": Shield,
  "Heart": Heart,
  "Zap": Zap,
  "Sparkles": Sparkles,
};

const Profile = () => {
  const [showRankings, setShowRankings] = useState(false);
  const { profile, isLoading, updateProfile } = useProfile();
  const { progress } = useProgress();
  const { purchases } = useStore();
  const { toast } = useToast();

  if (isLoading || !profile) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando perfil...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const handleSelectIcon = (iconId: string) => {
    updateProfile({ avatar_icon: iconId });
    toast({
      title: "Ícone atualizado!",
      description: "Seu novo ícone de perfil foi salvo com sucesso.",
    });
  };

  const SelectedIconComponent = iconMap[profile.avatar_icon || "User"] || User;
  
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

  const currentRank = getRankName(profile.points || 0);
  const nextRank = getNextRank(profile.points || 0);

  // Calculate stats from progress
  const completedClasses = progress.filter(p => p.content_type === 'aula' && p.completed).length;
  const completedExercises = progress.filter(p => p.content_type === 'exercicio' && p.completed).length;
  const completedChallenges = progress.filter(p => p.content_type === 'desafio' && p.completed).length;
  const materialsRead = progress.filter(p => p.content_type === 'material' && p.completed).length;

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
                      <span className="text-sm font-bold text-yellow-600">{profile.coins || 0}</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">{currentRank}</div>
                  {(profile.points || 0) < 3000 && (
                    <>
                      <div className="text-sm text-muted-foreground mb-1">Próximo Ranking: {nextRank.name}</div>
                      <div className="text-sm text-primary mb-3">{profile.points || 0}/{nextRank.target} Pontuação</div>
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
                  <Input value={profile.display_name || ''} className="bg-muted" readOnly />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input value={profile.email || ''} className="bg-muted" readOnly />
                </div>

                <div>
                  <Label>Ranking</Label>
                  <Input value={currentRank} className="bg-muted" readOnly />
                </div>
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
                {purchases.map((itemId) => {
                  const IconComponent = iconMap[itemId] || User;
                  const isSelected = (profile.avatar_icon || "User") === itemId;
                  
                  return (
                    <button
                      key={itemId}
                      onClick={() => handleSelectIcon(itemId)}
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
              {purchases.length <= 1 && (
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
                  <div className="text-3xl font-bold">{materialsRead}</div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Desafios Completos</div>
                  <div className="text-3xl font-bold">{completedChallenges}</div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Aulas Completas</div>
                  <div className="text-3xl font-bold">{completedClasses}</div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Exercícios Completos</div>
                  <div className="text-3xl font-bold">{completedExercises}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Últimos Materiais Lidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {progress
                .filter(p => p.content_type === 'material' && p.completed)
                .slice(-3)
                .reverse()
                .map((item, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>Material #{item.content_id}</span>
                  </div>
                ))}
              {progress.filter(p => p.content_type === 'material' && p.completed).length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhum material lido ainda</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Últimas Conquistas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { icon: GraduationCap, title: "Primeira aula concluída", show: completedClasses > 0 },
                { icon: Trophy, title: "Especialista em SQL", show: completedChallenges > 0 },
                { icon: Target, title: "10 Desafios resolvidos", show: completedChallenges >= 10 },
              ].filter(item => item.show).slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <span>{item.title}</span>
                </div>
              ))}
              {completedClasses === 0 && completedChallenges === 0 && (
                <p className="text-sm text-muted-foreground">Nenhuma conquista ainda</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <RankingsDialog open={showRankings} onOpenChange={setShowRankings} />
    </AppLayout>
  );
};

export default Profile;
