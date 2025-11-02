import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Star, Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ExerciseSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attempts: number;
  points: number;
  coins: number;
  resultTable?: {
    columns: string[];
    rows: string[][];
  };
  contentType?: 'exercicio' | 'desafio';
}

export const ExerciseSuccessDialog = ({
  open,
  onOpenChange,
  attempts,
  points,
  coins,
  resultTable,
  contentType = 'exercicio',
}: ExerciseSuccessDialogProps) => {
  const navigate = useNavigate();
  
  const isChallenge = contentType === 'desafio';
  const title = isChallenge ? 'Desafio Concluído!' : 'Exercício Concluído!';
  const buttonText = isChallenge ? 'Voltar aos Desafios' : 'Voltar aos Exercícios';
  const navigatePath = isChallenge ? '/desafios' : '/exercicios';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <div className="text-center space-y-4 py-6">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
          </div>

          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">
            Parabéns! Você criou a tabela corretamente!
          </p>
          <p className="text-sm text-muted-foreground">
            Você concluiu após {attempts} tentativas.
          </p>

          <div className="flex items-center justify-center gap-6 py-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold">+{points} pontos</span>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold">+{coins} moedas</span>
            </div>
          </div>

          {resultTable && (
            <div className="mt-6 overflow-hidden rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    {resultTable.columns.map((col, idx) => (
                      <th key={idx} className="px-4 py-2 text-left font-medium">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {resultTable.rows.map((row, rowIdx) => (
                    <tr key={rowIdx} className="border-t">
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className="px-4 py-2">
                          {cell || "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <Button
            className="w-full mt-6"
            onClick={() => {
              onOpenChange(false);
              navigate(navigatePath);
            }}
          >
            {buttonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
