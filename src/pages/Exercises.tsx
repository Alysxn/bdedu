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
                      <div className="flex items-start justify-between gap-4">
                        <CardTitle className="text-2xl">{exercise.title}</CardTitle>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                            +{exercise.points} pts
                          </span>
                          <span className="bg-amber-500/10 text-amber-600 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                            +{exercise.coins} moedas
                          </span>
                          {exercise.completed && (
                            <div className="flex items-center gap-1 bg-success/10 text-success px-3 py-1 rounded-full">
                              <CheckCircle2 className="h-4 w-4" />
                              <span className="text-sm font-medium whitespace-nowrap">Concluído</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{exercise.description}</p>
                      <div className="flex items-center gap-3">
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
