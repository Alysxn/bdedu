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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  
  const { markComplete, incrementAttempts, getAttempts, isCompleted } = useProgress();
  const { updatePoints, updateCoins } = useProfile();
  const { updateProgress } = useAchievements();
  
  const exerciseId = parseInt(id || "1");
  const attempts = getAttempts('exercicio', exerciseId);
  const alreadyCompleted = isCompleted('exercicio', exerciseId);

  // Fetch exercise details from backend
  const { data: exercise, isLoading } = useQuery({
    queryKey: ['exercicio', exerciseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exercicios')
        .select('*')
        .eq('id', exerciseId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const pointsReward = exercise?.points || 50;
  const coinsReward = exercise?.coins || 25;

  const handleExecute = () => {
    if (!exercise) return;

    // Increment attempts
    incrementAttempts({ contentType: 'exercicio', contentId: exerciseId });

    // Validate using keywords from backend
    const codeUpper = code.toUpperCase();
    const validationRules = exercise.validation_rules as { keywords: string[] };
    const allKeywordsPresent = validationRules.keywords.every(keyword =>
      codeUpper.includes(keyword.toUpperCase())
    );

    if (allKeywordsPresent) {
      // Mark as complete
      markComplete({ contentType: 'exercicio', contentId: exerciseId });
      
      // Award points and coins ONLY if not already completed
      if (!alreadyCompleted) {
        updatePoints(pointsReward);
        updateCoins(coinsReward);
        
        // Update achievement progress
        updateProgress({ achievementId: 'five-exercises' });
        updateProgress({ achievementId: 'speed-runner' });
      }
      
      setShowSuccess(true);
    } else {
      setShowError(true);
    }
  };

  const insertKeyword = (keyword: string) => {
    setCode(code + " " + keyword);
  };

  if (isLoading || !exercise) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando exercício...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

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
          <h1 className="text-4xl font-bold mb-8 text-foreground">Exercício {exerciseId} - {exercise.title}</h1>
          
          {alreadyCompleted && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ℹ️ Você já completou este exercício. Refazer não concederá pontos ou moedas adicionais.
              </p>
            </div>
          )}

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Enunciado do Problema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground whitespace-pre-line">{exercise.description}</p>
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
        errorMessage="Erro SQL detectado: Verifique a sintaxe do seu código."
        attempts={attempts + 1}
        hint={exercise.hint || undefined}
      />
    </AppLayout>
  );
};

export default ExerciseDetail;
