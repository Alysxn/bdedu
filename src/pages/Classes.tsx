import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

const classes = [
  {
    id: 1,
    category: "Banco de Dados",
    title: "Introdução a SQL",
    description: "Aprenda os fundamentos do SQL com exemplos práticos e exercícios.",
    professor: "Fulano da Silva",
    duration: "1h30",
    progress: 100,
  },
  {
    id: 2,
    category: "Banco de Dados",
    title: "Consultas Avançadas com JOINs",
    description: "Domine a arte de combinar tabelas para extrair informações complexas.",
    professor: "Fulano da Silva",
    duration: "2h15",
    progress: 1,
  },
];

const Classes = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <h1 className="text-4xl font-bold mb-8 text-foreground">Aulas</h1>

      <div className="space-y-6">
        {classes.map((classItem) => (
          <Card key={classItem.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground mb-2">{classItem.category}</div>
                  <CardTitle className="text-2xl mb-2">{classItem.title}</CardTitle>
                  <CardDescription className="text-base mb-4">
                    {classItem.description}
                  </CardDescription>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>Professor: {classItem.professor}</div>
                    <div>Duração: {classItem.duration}</div>
                  </div>
                </div>
                <div className="w-80 h-40 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-4xl">
                  303 × 161
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-foreground">Progresso</span>
                    <span className="font-semibold text-foreground">{classItem.progress}%</span>
                  </div>
                  <Progress value={classItem.progress} />
                </div>
                <Button 
                  variant={classItem.progress === 100 ? "outline" : "default"}
                  onClick={() => navigate(`/aulas/${classItem.id}`)}
                >
                  {classItem.progress === 100 ? "Revisar Aula" : "Acessar Aula"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
};

export default Classes;
