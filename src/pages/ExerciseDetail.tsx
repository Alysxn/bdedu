import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { ExerciseSuccessDialog } from "@/components/ExerciseSuccessDialog";
import { ExerciseErrorDialog } from "@/components/ExerciseErrorDialog";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { useProgress } from "@/hooks/useProgress";
import { useProfile } from "@/hooks/useProfile";
import { useAchievements } from "@/hooks/useAchievements";

const sqlKeywords = [
  "USE", "CREATE", "TABLE", "SELECT", "FROM", "WHERE", 
  "INSERT", "INTO", "VALUES", "UPDATE", "SET", "DELETE",
  "JOIN", "INNER", "LEFT", "RIGHT", "ON", "GROUP BY", 
  "ORDER BY", "AND", "OR", "NOT", "DATABASE", "INT", "VARCHAR"
];

const ExerciseDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [code, setCode] = useState("-- Escreva seu código SQL aqui\n");
  const [showSyntax, setShowSyntax] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  
  const { markComplete, incrementAttempts, getAttempts } = useProgress();
  const { updatePoints, updateCoins } = useProfile();
  const { updateProgress } = useAchievements();
  
  const exerciseId = parseInt(id || "1");
  const attempts = getAttempts('exercicio', exerciseId);
  const pointsReward = 50;
  const coinsReward = 50;

  const handleExecute = () => {
    // Increment attempts
    incrementAttempts({ contentType: 'exercicio', contentId: exerciseId });

    // Simple validation for demo - check if code contains CREATE TABLE
    const codeUpper = code.toUpperCase();
    if (codeUpper.includes("CREATE TABLE") && codeUpper.includes("LIVROS")) {
      // Mark as complete
      markComplete({ contentType: 'exercicio', contentId: exerciseId });
      
      // Award points and coins
      updatePoints(pointsReward);
      updateCoins(coinsReward);
      
      // Update achievement progress
      updateProgress({ achievementId: 'five-exercises' });
      updateProgress({ achievementId: 'speed-runner' });
      
      setShowSuccess(true);
    } else {
      setShowError(true);
    }
  };

  const insertKeyword = (keyword: string) => {
    setCode(code + " " + keyword);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/exercicios")}
          className="rounded-full h-12 w-12 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>

        <div>
          <h1 className="text-4xl font-bold mb-8 text-foreground">Exercício {exerciseId} - Crie um banco de dados</h1>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Enunciado do Problema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Você foi contratado para desenvolver o sistema de gerenciamento de uma biblioteca fictícia. O primeiro passo é a criação das tabelas
                principais do banco de dados.
              </p>

              <div>
                <p className="mb-2">Crie um banco de dados chamado BibliotecaDB e, dentro dele, crie as seguintes tabelas:</p>
                <div className="ml-6 space-y-2 text-sm">
                  <div>
                    <p className="font-medium">1. Livros</p>
                    <p className="text-muted-foreground ml-4">- id_livro (inteiro, chave primária)</p>
                    <p className="text-muted-foreground ml-4">- titulo (texto, até 150 caracteres)</p>
                    <p className="text-muted-foreground ml-4">- ano_publicacao (inteiro)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>SQL Editor</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowSyntax(!showSyntax)}
              >
                {showSyntax ? "Ocultar Sintaxe" : "Mostrar Sintaxe"}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <CodeMirror
                value={code}
                height="200px"
                extensions={[sql()]}
                onChange={(value) => setCode(value)}
                theme="light"
                className="border rounded-lg overflow-hidden"
              />

              {showSyntax && (
                <div className="border-t pt-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Button variant="outline" size="sm">(</Button>
                    <Button variant="outline" size="sm">)</Button>
                    <Button variant="outline" size="sm">;</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sqlKeywords.map((keyword) => (
                      <Button
                        key={keyword}
                        variant="outline"
                        size="sm"
                        onClick={() => insertKeyword(keyword)}
                      >
                        {keyword}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <Button size="lg" className="w-full" onClick={handleExecute}>
                Executar código
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <ExerciseSuccessDialog
        open={showSuccess}
        onOpenChange={setShowSuccess}
        attempts={attempts + 1}
        points={pointsReward}
        coins={coinsReward}
        resultTable={{
          columns: ["id_livro", "titulo", "ano_publicacao"],
          rows: [
            ["-", "-", "-"],
          ],
        }}
      />

      <ExerciseErrorDialog
        open={showError}
        onOpenChange={setShowError}
        errorMessage="Erro SQL detectado: Verifique a sintaxe do comando CREATE TABLE."
        attempts={attempts + 1}
        hint="Lembre-se de usar o comando CREATE DATABASE antes de criar a tabela com CREATE TABLE."
      />
    </AppLayout>
  );
};

export default ExerciseDetail;
