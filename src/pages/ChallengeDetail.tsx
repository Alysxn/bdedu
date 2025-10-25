import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Play, Code, Info, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { ExerciseSuccessDialog } from "@/components/ExerciseSuccessDialog";
import { ExerciseErrorDialog } from "@/components/ExerciseErrorDialog";

const ChallengeDetail = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("-- Escreva sua consulta SQL aqui\n");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showContext, setShowContext] = useState(true);

  const handleExecute = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    // Simulated validation - checks for key SQL elements
    const codeUpper = code.toUpperCase();
    const hasSelect = codeUpper.includes("SELECT");
    const hasFrom = codeUpper.includes("FROM");
    const hasWhere = codeUpper.includes("WHERE");
    const hasJoin = codeUpper.includes("JOIN");

    if (hasSelect && hasFrom && hasJoin && hasWhere) {
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
            Desafio 1 - Sistema de Gestão de Biblioteca
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Context Panel */}
          <div className={`lg:col-span-1 space-y-4 ${showContext ? "" : "hidden lg:block"}`}>
            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Contexto do Desafio</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Uma biblioteca municipal está modernizando seu sistema de controle. A diretora precisa de um relatório
                  detalhado sobre todos os livros emprestados no último mês que ainda não foram devolvidos.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-foreground">Objetivo:</h4>
                    <p className="text-sm text-muted-foreground">
                      Crie uma consulta SQL que retorne o título do livro, nome do usuário que pegou emprestado,
                      data do empréstimo e quantos dias de atraso (se houver).
                    </p>
                  </div>

                  <div className="bg-primary/5 p-3 rounded-md">
                    <p className="text-xs font-medium text-primary mb-2">Recompensas:</p>
                    <div className="flex gap-2 text-sm">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">+150 pts</span>
                      <span className="bg-amber-500/10 text-amber-600 px-2 py-1 rounded">+75 moedas</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <h4 className="font-semibold text-sm mb-3 text-foreground">Estrutura do Banco de Dados:</h4>
                
                <div className="space-y-4 text-xs">
                  <div className="bg-muted p-3 rounded">
                    <p className="font-mono font-semibold mb-2 text-primary">Tabela: livros</p>
                    <div className="space-y-1 text-muted-foreground">
                      <p>• id_livro (INT)</p>
                      <p>• titulo (VARCHAR)</p>
                      <p>• autor (VARCHAR)</p>
                      <p>• isbn (VARCHAR)</p>
                    </div>
                  </div>

                  <div className="bg-muted p-3 rounded">
                    <p className="font-mono font-semibold mb-2 text-primary">Tabela: usuarios</p>
                    <div className="space-y-1 text-muted-foreground">
                      <p>• id_usuario (INT)</p>
                      <p>• nome (VARCHAR)</p>
                      <p>• email (VARCHAR)</p>
                      <p>• telefone (VARCHAR)</p>
                    </div>
                  </div>

                  <div className="bg-muted p-3 rounded">
                    <p className="font-mono font-semibold mb-2 text-primary">Tabela: emprestimos</p>
                    <div className="space-y-1 text-muted-foreground">
                      <p>• id_emprestimo (INT)</p>
                      <p>• id_livro (INT) FK</p>
                      <p>• id_usuario (INT) FK</p>
                      <p>• data_emprestimo (DATE)</p>
                      <p>• data_devolucao (DATE)</p>
                      <p>• devolvido (BOOLEAN)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <h4 className="font-semibold text-sm mb-3 text-foreground">Dica:</h4>
                <p className="text-xs text-muted-foreground">
                  Você precisará usar JOIN para relacionar as tabelas e WHERE para filtrar apenas
                  os empréstimos não devolvidos. Considere usar DATEDIFF ou funções similares para calcular
                  o atraso.
                </p>
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

                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    Tentativas: <span className="font-semibold text-foreground">{attempts}</span>
                  </p>
                  <Button onClick={handleExecute} size="lg">
                    <Play className="h-4 w-4 mr-2" />
                    Executar código
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <h4 className="font-semibold text-sm mb-3 text-foreground">Dados de Exemplo:</h4>
                <div className="space-y-3 text-xs">
                  <div className="bg-background p-3 rounded border">
                    <p className="font-semibold mb-2 text-primary">Livros:</p>
                    <p className="text-muted-foreground font-mono">
                      (1, 'O Senhor dos Anéis', 'J.R.R. Tolkien', '978-0544003415')<br/>
                      (2, '1984', 'George Orwell', '978-0451524935')<br/>
                      (3, 'Dom Casmurro', 'Machado de Assis', '978-8535911664')
                    </p>
                  </div>

                  <div className="bg-background p-3 rounded border">
                    <p className="font-semibold mb-2 text-primary">Usuários:</p>
                    <p className="text-muted-foreground font-mono">
                      (1, 'Ana Silva', 'ana@email.com', '11-9999-1111')<br/>
                      (2, 'Carlos Santos', 'carlos@email.com', '11-9999-2222')<br/>
                      (3, 'Maria Oliveira', 'maria@email.com', '11-9999-3333')
                    </p>
                  </div>

                  <div className="bg-background p-3 rounded border">
                    <p className="font-semibold mb-2 text-primary">Empréstimos Ativos:</p>
                    <p className="text-muted-foreground font-mono">
                      (1, 1, 1, '2025-09-15', '2025-09-30', false)<br/>
                      (2, 2, 2, '2025-09-20', '2025-10-05', false)<br/>
                      (3, 3, 3, '2025-10-01', '2025-10-15', false)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <ExerciseSuccessDialog
          open={showSuccess}
          onOpenChange={setShowSuccess}
          attempts={attempts}
          points={150}
          coins={75}
          resultTable={{
            columns: ["Título", "Usuário", "Data Empréstimo", "Dias de Atraso"],
            rows: [
              ["O Senhor dos Anéis", "Ana Silva", "15/09/2025", "25"],
              ["1984", "Carlos Santos", "20/09/2025", "20"],
            ],
          }}
        />

        <ExerciseErrorDialog
          open={showError}
          onOpenChange={setShowError}
          errorMessage="A consulta SQL não retornou o resultado esperado. Verifique se você está usando JOIN para relacionar as tabelas corretamente e WHERE para filtrar empréstimos não devolvidos."
          attempts={attempts}
          hint="Lembre-se: você precisa relacionar as três tabelas (livros, usuarios e emprestimos) e filtrar apenas os registros onde devolvido = false."
        />
      </div>
    </AppLayout>
  );
};

export default ChallengeDetail;