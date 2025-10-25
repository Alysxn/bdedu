import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Play, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useChallenges } from "@/hooks/useChallenges";

const Challenges = () => {
  const navigate = useNavigate();
  const { challenges, isLoading } = useChallenges();

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando desafios...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Group challenges by lesson
  const groupedChallenges = challenges.reduce((acc, challenge) => {
    const key = challenge.aula_id ? `Aula ${challenge.aula_id}` : 'Sem aula vinculada';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(challenge);
    return acc;
  }, {} as Record<string, typeof challenges>);

  return (
    <AppLayout>
      <div className="flex items-center gap-3 mb-8">
        <Trophy className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-bold text-foreground">Desafios</h1>
      </div>

      {challenges.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Complete as aulas para desbloquear desafios!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedChallenges).map(([lessonLabel, lessonChallenges]) => (
            <div key={lessonLabel}>
              <h2 className="text-xl font-semibold mb-4 text-foreground">{lessonLabel}</h2>
              <div className="space-y-4">
                {lessonChallenges.map((challenge) => (
                  <Card key={challenge.id} className="border-primary/20 shadow-lg">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-2xl flex items-center gap-2 mb-2">
                            <Trophy className="h-6 w-6 text-primary" />
                            {challenge.title}
                          </CardTitle>
                          {challenge.attempts > 0 && (
                            <div className="text-sm text-muted-foreground">
                              Tentativas: {challenge.attempts}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-3 text-sm font-medium">
                          {challenge.completed && (
                            <div className="flex items-center gap-2 text-success mr-4">
                              <CheckCircle2 className="h-5 w-5" />
                              <span className="font-medium">Concluído</span>
                            </div>
                          )}
                          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                            +{challenge.points} pts
                          </span>
                          <span className="bg-amber-500/10 text-amber-600 px-3 py-1 rounded-full">
                            +{challenge.coins} moedas
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-6">{challenge.description}</p>
                      {challenge.completed ? (
                        <Button 
                          variant="outline" 
                          className="bg-success/10 text-success hover:bg-success/20 border-success"
                          onClick={() => navigate(`/desafios/${challenge.id}`)}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Refazer
                        </Button>
                      ) : (
                        <Button onClick={() => navigate(`/desafios/${challenge.id}`)}>
                          <Trophy className="h-4 w-4 mr-2" />
                          Acessar Desafio
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default Challenges;
