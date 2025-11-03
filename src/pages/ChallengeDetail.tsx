import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Play, Code, Info, Trophy } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { ExerciseSuccessDialog } from "@/components/ExerciseSuccessDialog";
import { ExerciseErrorDialog } from "@/components/ExerciseErrorDialog";
import { useProgress } from "@/hooks/useProgress";
import { useProfile } from "@/hooks/useProfile";
import { useAchievements } from "@/hooks/useAchievements";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const sqlKeywords = [
  "USE", "CREATE", "TABLE", "SELECT", "FROM", "WHERE", 
  "INSERT", "INTO", "VALUES", "UPDATE", "SET", "DELETE",
  "JOIN", "INNER", "LEFT", "RIGHT", "ON", "GROUP BY", 
  "ORDER BY", "AND", "OR", "NOT", "DATABASE", "INT", "VARCHAR",
  "DATEDIFF", "COUNT", "SUM", "AVG", "AS", "DISTINCT"
];

const ChallengeDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [code, setCode] = useState("-- Escreva sua consulta SQL aqui\n");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showContext, setShowContext] = useState(true);
  const [showSyntax, setShowSyntax] = useState(true);

  const { markComplete, incrementAttempts, getAttempts, isCompleted } = useProgress();
  const { updatePoints, updateCoins } = useProfile();
  const { updateProgress } = useAchievements();
  
  const challengeId = parseInt(id || "1");
  const attempts = getAttempts('desafio', challengeId);
  const alreadyCompleted = isCompleted('desafio', challengeId);

  // Fetch challenge details from backend
  const { data: challenge, isLoading } = useQuery({
    queryKey: ['desafio', challengeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('desafios')
        .select('*')
        .eq('id', challengeId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });

  // Show loading state
  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Carregando desafio...</p>
        </div>
      </AppLayout>
    );
  }

  // Show not found state
  if (!challenge) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-muted-foreground">Desafio não encontrado</p>
          <Button onClick={() => navigate("/desafios")}>
            Voltar para Desafios
          </Button>
        </div>
      </AppLayout>
    );
  }

  const pointsReward = challenge?.points || 150;
  const coinsReward = challenge?.coins || 75;

  const insertKeyword = (keyword: string) => {
    setCode(code + " " + keyword);
  };

  const handleExecute = () => {
    if (!challenge) return;

    // Increment attempts
    incrementAttempts({ contentType: 'desafio', contentId: challengeId });

    // Validate using keywords from backend
    const codeUpper = code.toUpperCase();
    const validationRules = challenge.validation_rules as { keywords: string[] };
    const allKeywordsPresent = validationRules.keywords.every(keyword =>
      codeUpper.includes(keyword.toUpperCase())
    );

    if (allKeywordsPresent) {
      // Mark as complete
      markComplete({ contentType: 'desafio', contentId: challengeId });
      
      // Award points and coins ONLY if not already completed
      if (!alreadyCompleted) {
        updatePoints(pointsReward);
        updateCoins(coinsReward);
        
        // Update achievement progress
        updateProgress({ achievementId: 'first-challenge' });
      }
      
      setShowSuccess(true);
    } else {
      setShowError(true);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/desafios")}
          className="rounded-full h-12 w-12 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>

        <div className="flex items-center gap-3 mb-4">
          <Trophy className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">
            {challenge.title}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Context Panel */}
          <div className={`lg:col-span-1 space-y-4 ${showContext ? "" : "hidden lg:block"}`}>
            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Objetivo</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4 whitespace-pre-line">
                  {challenge.description}
                </p>

                <div className="bg-primary/5 p-3 rounded-md">
                  <p className="text-xs font-medium text-primary mb-2">Recompensas:</p>
                  <div className="flex gap-2 text-sm">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded">+{pointsReward} pts</span>
                    <span className="bg-amber-500/10 text-amber-600 px-2 py-1 rounded">+{coinsReward} moedas</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Contexto</h3>
                </div>
                <div className="text-sm text-muted-foreground whitespace-pre-line font-mono">
                  {challenge.scenario}
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Code Editor Panel */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Editor SQL</h3>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowContext(!showContext)}
                    className="lg:hidden"
                  >
                    {showContext ? "Ocultar" : "Mostrar"} Contexto
                  </Button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <CodeMirror
                    value={code}
                    height="400px"
                    extensions={[sql()]}
                    onChange={(value) => setCode(value)}
                    theme="light"
                    className="text-sm"
                  />
                </div>

                {showSyntax && (
                  <div className="border-t pt-4 mt-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Button variant="outline" size="sm" onClick={() => insertKeyword("(")}>(</Button>
                      <Button variant="outline" size="sm" onClick={() => insertKeyword(")")}>)</Button>
                      <Button variant="outline" size="sm" onClick={() => insertKeyword(";")}>;</Button>
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

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                      Tentativas: <span className="font-semibold text-foreground">{attempts}</span>
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowSyntax(!showSyntax)}
                    >
                      {showSyntax ? "Ocultar Sintaxe" : "Mostrar Sintaxe"}
                    </Button>
                  </div>
                  <Button onClick={handleExecute} size="lg">
                    <Play className="h-4 w-4 mr-2" />
                    Executar código
                  </Button>
                </div>
              </CardContent>
            </Card>

            {challenge.hint && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-sm mb-3 text-foreground">💡 Dica:</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {challenge.hint}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <ExerciseSuccessDialog
          open={showSuccess}
          onOpenChange={setShowSuccess}
          attempts={attempts + 1}
          points={pointsReward}
          coins={coinsReward}
          resultTable={(challenge as any).example_result as { columns: string[]; rows: string[][] } | undefined}
          contentType="desafio"
        />

        <ExerciseErrorDialog
          open={showError}
          onOpenChange={setShowError}
          errorMessage="A consulta SQL não retornou o resultado esperado. Verifique sua sintaxe."
          attempts={attempts + 1}
          hint={challenge.hint || undefined}
        />
      </div>
    </AppLayout>
  );
};

export default ChallengeDetail;
