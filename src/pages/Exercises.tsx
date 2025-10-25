import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

const exercises = [
  {
    id: 1,
    class: "Aula 1: Introdução a SQL",
    title: "Exercício 1 - Crie um banco de dados",
    description: "Você foi contratado para desenvolver o sistema de gerenciamento de uma biblioteca fictícia. O primeiro passo é a criação das tabelas principais do banco de dados.",
    completed: true,
  },
  {
    id: 2,
    class: "Aula 2: Consultas Avançadas com JOINs",
    title: "Exercício 2 - Crie um banco de dados",
    description: "Você foi contratado para desenvolver o sistema de gerenciamento de uma biblioteca fictícia. O primeiro passo é a criação das tabelas principais do banco de dados.",
    completed: false,
  },
];

const Exercises = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <h1 className="text-4xl font-bold mb-8 text-foreground">Exercícios</h1>

      <div className="space-y-8">
        {exercises.map((exercise) => (
          <div key={exercise.id}>
            <h2 className="text-xl font-semibold mb-4 text-foreground">{exercise.class}</h2>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{exercise.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">{exercise.description}</p>
                {exercise.completed ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="font-medium">Concluído</span>
                    </div>
                    <Button variant="outline" className="bg-success/10 text-success hover:bg-success/20 border-success">
                      <Play className="h-4 w-4 mr-2" />
                      Refazer
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => navigate(`/exercicios/${exercise.id}`)}>
                    <Play className="h-4 w-4 mr-2" />
                    Acessar
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </AppLayout>
  );
};

export default Exercises;
