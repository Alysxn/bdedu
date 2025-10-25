import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, BookOpen, Target, Coins, GraduationCap, Star, Award, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  target: number;
  currentProgress: number;
  reward: {
    points: number;
    coins: number;
  };
  claimed: boolean;
}

const Achievements = () => {
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // Load achievements from localStorage
  useEffect(() => {
    const savedAchievements = localStorage.getItem("achievements");
    const userStats = JSON.parse(localStorage.getItem("userStats") || "{}");

    const achievementsList: Achievement[] = [
      {
        id: "first-class",
        title: "Primeira Aula",
        description: "Complete sua primeira aula",
        icon: GraduationCap,
        target: 1,
        currentProgress: userStats.completedClasses || 0,
        reward: { points: 50, coins: 25 },
        claimed: false,
      },
      {
        id: "three-classes",
        title: "Estudante Dedicado",
        description: "Complete 3 aulas",
        icon: BookOpen,
        target: 3,
        currentProgress: userStats.completedClasses || 0,
        reward: { points: 150, coins: 75 },
        claimed: false,
      },
      {
        id: "five-exercises",
        title: "Praticante SQL",
        description: "Complete 5 exercícios",
        icon: Target,
        target: 5,
        currentProgress: userStats.completedExercises || 0,
        reward: { points: 200, coins: 100 },
        claimed: false,
      },
      {
        id: "first-challenge",
        title: "Desafiador",
        description: "Complete seu primeiro desafio",
        icon: Trophy,
        target: 1,
        currentProgress: userStats.completedChallenges || 0,
        reward: { points: 250, coins: 125 },
        claimed: false,
      },
      {
        id: "coin-collector",
        title: "Colecionador de Moedas",
        description: "Acumule 500 moedas",
        icon: Coins,
        target: 500,
        currentProgress: userStats.coins || 0,
        reward: { points: 300, coins: 150 },
        claimed: false,
      },
      {
        id: "point-master",
        title: "Mestre em Pontos",
        description: "Alcance 1000 pontos",
        icon: Star,
        target: 1000,
        currentProgress: userStats.points || 0,
        reward: { points: 500, coins: 250 },
        claimed: false,
      },
      {
        id: "material-reader",
        title: "Leitor Assíduo",
        description: "Leia 10 materiais",
        icon: BookOpen,
        target: 10,
        currentProgress: userStats.materialsRead || 0,
        reward: { points: 200, coins: 100 },
        claimed: false,
      },
      {
        id: "all-classes",
        title: "Aluno Exemplar",
        description: "Complete todas as aulas disponíveis",
        icon: Award,
        target: 5,
        currentProgress: userStats.completedClasses || 0,
        reward: { points: 1000, coins: 500 },
        claimed: false,
      },
      {
        id: "speed-runner",
        title: "Velocista",
        description: "Complete 3 exercícios em um dia",
        icon: Zap,
        target: 3,
        currentProgress: userStats.exercisesToday || 0,
        reward: { points: 150, coins: 75 },
        claimed: false,
      },
    ];

    if (savedAchievements) {
      const claimed = JSON.parse(savedAchievements);
      achievementsList.forEach(achievement => {
        if (claimed.includes(achievement.id)) {
          achievement.claimed = true;
        }
      });
    }

    setAchievements(achievementsList);
  }, []);

  const claimReward = (achievement: Achievement) => {
    // Update claimed achievements
    const savedAchievements = JSON.parse(localStorage.getItem("achievements") || "[]");
    if (!savedAchievements.includes(achievement.id)) {
      savedAchievements.push(achievement.id);
      localStorage.setItem("achievements", JSON.stringify(savedAchievements));
    }

    // Update user stats
    const userStats = JSON.parse(localStorage.getItem("userStats") || "{}");
    userStats.points = (userStats.points || 0) + achievement.reward.points;
    userStats.coins = (userStats.coins || 0) + achievement.reward.coins;
    localStorage.setItem("userStats", JSON.stringify(userStats));

    // Update achievements state
    setAchievements(prev =>
      prev.map(a =>
        a.id === achievement.id ? { ...a, claimed: true } : a
      )
    );

    toast({
      title: "Recompensa Resgatada!",
      description: `Você ganhou ${achievement.reward.points} pontos e ${achievement.reward.coins} moedas!`,
    });
  };

  const getProgressPercentage = (achievement: Achievement) => {
    return Math.min((achievement.currentProgress / achievement.target) * 100, 100);
  };

  const isCompleted = (achievement: Achievement) => {
    return achievement.currentProgress >= achievement.target;
  };

  const completedAchievements = achievements.filter(a => a.claimed);
  const availableAchievements = achievements.filter(a => !a.claimed && isCompleted(a));
  const inProgressAchievements = achievements.filter(a => !a.claimed && !isCompleted(a));

  return (
    <AppLayout>
      <h1 className="text-4xl font-bold mb-8 text-foreground">Conquistas</h1>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{completedAchievements.length}</div>
                <div className="text-sm text-muted-foreground">Conquistas Resgatadas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-lg">
                <Star className="h-6 w-6 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold">{availableAchievements.length}</div>
                <div className="text-sm text-muted-foreground">Prontas para Resgatar</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <Target className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold">{inProgressAchievements.length}</div>
                <div className="text-sm text-muted-foreground">Em Progresso</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available to Claim */}
      {availableAchievements.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Pronta para Resgatar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableAchievements.map((achievement) => (
              <Card key={achievement.id} className="border-success/50 bg-success/5">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-success/10 rounded-lg">
                        <achievement.icon className="h-6 w-6 text-success" />
                      </div>
                      <div>
                        <CardTitle className="text-lg mb-1">{achievement.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progresso</span>
                        <span className="font-semibold text-success">
                          {achievement.currentProgress}/{achievement.target}
                        </span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex gap-2">
                        <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                          +{achievement.reward.points} pts
                        </span>
                        <span className="text-sm bg-yellow-500/10 text-yellow-600 px-3 py-1 rounded-full font-medium">
                          +{achievement.reward.coins} moedas
                        </span>
                      </div>
                      <Button onClick={() => claimReward(achievement)} size="sm">
                        Resgatar Recompensa
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* In Progress */}
      {inProgressAchievements.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Em Progresso</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inProgressAchievements.map((achievement) => (
              <Card key={achievement.id}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <achievement.icon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg mb-1">{achievement.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progresso</span>
                        <span className="font-semibold">
                          {achievement.currentProgress}/{achievement.target}
                        </span>
                      </div>
                      <Progress value={getProgressPercentage(achievement)} className="h-2" />
                    </div>

                    <div className="flex gap-2">
                      <span className="text-sm bg-muted text-muted-foreground px-3 py-1 rounded-full">
                        +{achievement.reward.points} pts
                      </span>
                      <span className="text-sm bg-muted text-muted-foreground px-3 py-1 rounded-full">
                        +{achievement.reward.coins} moedas
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Completed */}
      {completedAchievements.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Conquistas Resgatadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completedAchievements.map((achievement) => (
              <Card key={achievement.id} className="opacity-75">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <achievement.icon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg mb-1">{achievement.title}</CardTitle>
                        <Trophy className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <span className="text-sm bg-muted text-muted-foreground px-3 py-1 rounded-full">
                        +{achievement.reward.points} pts
                      </span>
                      <span className="text-sm bg-muted text-muted-foreground px-3 py-1 rounded-full">
                        +{achievement.reward.coins} moedas
                      </span>
                    </div>
                    <span className="text-sm text-success font-medium">Resgatada ✓</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {achievements.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Continue aprendendo para desbloquear conquistas especiais!
            </p>
          </CardContent>
        </Card>
      )}
    </AppLayout>
  );
};

export default Achievements;
