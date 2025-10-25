import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Play, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

const challenges = [
  {
    id: 1,
    class: "Aula 1: Introdução a SQL",
    title: "Desafio 1 - Sistema de Gestão de Biblioteca",
    description: "Uma biblioteca municipal está modernizando seu sistema de controle. Você foi contratado como analista de dados e precisa extrair informações cruciais do banco de dados existente para auxiliar na tomada de decisões estratégicas.",
    completed: false,
    points: 150,
    coins: 75,
  },
];

const Challenges = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="flex items-center gap-3 mb-8">
        <Trophy className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-bold text-foreground">Desafios</h1>
      </div>

      <div className="space-y-8">
        {challenges.map((challenge) => (
          <div key={challenge.id}>
            <h2 className="text-xl font-semibold mb-4 text-foreground">{challenge.class}</h2>
            <Card className="border-primary/20 shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Trophy className="h-6 w-6 text-primary" />
                      {challenge.title}
                    </CardTitle>
                  </div>
                  <div className="flex gap-3 text-sm font-medium">
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
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="font-medium">Concluído</span>
                    </div>
                    <Button 
                      variant="outline" 
                      className="bg-success/10 text-success hover:bg-success/20 border-success"
                      onClick={() => navigate(`/desafios/${challenge.id}`)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Refazer
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => navigate(`/desafios/${challenge.id}`)}>
                    <Trophy className="h-4 w-4 mr-2" />
                    Acessar Desafio
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

export default Challenges;
