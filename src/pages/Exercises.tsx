import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Play, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useExercises } from "@/hooks/useExercises";

const Exercises = () => {
  const navigate = useNavigate();
  const { exercises, isLoading } = useExercises();

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando exercícios...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Group exercises by lesson
  const groupedExercises = exercises.reduce((acc, exercise) => {
    const key = exercise.aula_id ? `Aula ${exercise.aula_id}` : 'Sem aula vinculada';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(exercise);
    return acc;
  }, {} as Record<string, typeof exercises>);

  return (
    <AppLayout>
      <h1 className="text-4xl font-bold mb-8 text-foreground">Exercícios</h1>

      {exercises.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Complete as aulas para desbloquear exercícios!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedExercises).map(([lessonLabel, lessonExercises]) => (
            <div key={lessonLabel}>
              <h2 className="text-xl font-semibold mb-4 text-foreground">{lessonLabel}</h2>
              <div className="space-y-4">
                {lessonExercises.map((exercise) => (
                  <Card key={exercise.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-2xl mb-2">{exercise.title}</CardTitle>
                          {exercise.attempts > 0 && (
                            <div className="text-sm text-muted-foreground mb-2">
                              Tentativas: {exercise.attempts}
                            </div>
                          )}
                        </div>
                        {exercise.completed && (
                          <div className="flex items-center gap-2 text-success">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="font-medium">Concluído</span>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{exercise.description}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-2">
                          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                            +{exercise.points} pts
                          </span>
                          <span className="bg-yellow-500/10 text-yellow-600 px-3 py-1 rounded-full text-sm font-medium">
                            +{exercise.coins} moedas
                          </span>
                        </div>
                        {exercise.completed ? (
                          <Button 
                            variant="outline" 
                            className="bg-success/10 text-success hover:bg-success/20 border-success"
                            onClick={() => navigate(`/exercicios/${exercise.id}`)}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Refazer
                          </Button>
                        ) : (
                          <Button onClick={() => navigate(`/exercicios/${exercise.id}`)}>
                            <Play className="h-4 w-4 mr-2" />
                            Acessar
                          </Button>
                        )}
                      </div>
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

export default Exercises;
