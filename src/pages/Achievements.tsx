import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, BookOpen, Target, Coins, GraduationCap, Star, Award, Zap } from "lucide-react";
import { useAchievements } from "@/hooks/useAchievements";

const iconMap: { [key: string]: any } = {
  "GraduationCap": GraduationCap,
  "BookOpen": BookOpen,
  "Target": Target,
  "Trophy": Trophy,
  "Coins": Coins,
  "Star": Star,
  "Award": Award,
  "Zap": Zap,
};

const Achievements = () => {
  const { achievements, isLoading, claimReward, isClaiming } = useAchievements();

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando conquistas...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const getProgressPercentage = (achievement: any) => {
    return Math.min((achievement.currentProgress / achievement.target) * 100, 100);
  };

  const isCompleted = (achievement: any) => {
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
            {availableAchievements.map((achievement) => {
              const IconComponent = iconMap[achievement.icon] || Trophy;
              
              return (
                <Card key={achievement.id} className="border-success/50 bg-success/5">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-success/10 rounded-lg">
                          <IconComponent className="h-6 w-6 text-success" />
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
                            +{achievement.reward_points} pts
                          </span>
                          <span className="text-sm bg-yellow-500/10 text-yellow-600 px-3 py-1 rounded-full font-medium">
                            +{achievement.reward_coins} moedas
                          </span>
                        </div>
                        <Button 
                          onClick={() => claimReward(achievement.id)} 
                          size="sm"
                          disabled={isClaiming}
                        >
                          {isClaiming ? "Resgatando..." : "Resgatar Recompensa"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* In Progress */}
      {inProgressAchievements.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Em Progresso</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inProgressAchievements.map((achievement) => {
              const IconComponent = iconMap[achievement.icon] || Trophy;
              
              return (
                <Card key={achievement.id}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-muted rounded-lg">
                        <IconComponent className="h-6 w-6 text-muted-foreground" />
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
                          +{achievement.reward_points} pts
                        </span>
                        <span className="text-sm bg-muted text-muted-foreground px-3 py-1 rounded-full">
                          +{achievement.reward_coins} moedas
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed */}
      {completedAchievements.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Conquistas Resgatadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completedAchievements.map((achievement) => {
              const IconComponent = iconMap[achievement.icon] || Trophy;
              
              return (
                <Card key={achievement.id} className="opacity-75">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-muted rounded-lg">
                        <IconComponent className="h-6 w-6 text-muted-foreground" />
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
                          +{achievement.reward_points} pts
                        </span>
                        <span className="text-sm bg-muted text-muted-foreground px-3 py-1 rounded-full">
                          +{achievement.reward_coins} moedas
                        </span>
                      </div>
                      <span className="text-sm text-success font-medium">Resgatada ✓</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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
