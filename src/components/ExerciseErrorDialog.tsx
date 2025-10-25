import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XCircle, Lightbulb } from "lucide-react";
import { useState } from "react";

interface ExerciseErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  errorMessage: string;
  attempts: number;
  hint?: string;
}

export const ExerciseErrorDialog = ({
  open,
  onOpenChange,
  errorMessage,
  attempts,
  hint,
}: ExerciseErrorDialogProps) => {
  const [showHint, setShowHint] = useState(false);

  const handleClose = () => {
    setShowHint(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <div className="text-center space-y-4 py-6">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-red-500/20 flex items-center justify-center">
              <XCircle className="h-12 w-12 text-red-500" />
            </div>
          </div>

          <h2 className="text-2xl font-bold">Algo deu errado!</h2>
          <p className="text-muted-foreground">{errorMessage}</p>
          <p className="text-sm text-muted-foreground">
            Tentativas até agora: {attempts}
          </p>

          {hint && attempts > 1 && (
            <div className="mt-4">
              {!showHint ? (
                <Button
                  variant="outline"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-600"
                  onClick={() => setShowHint(true)}
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Ver Dica
                </Button>
              ) : (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-left">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                        Dica:
                      </p>
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        {hint}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <Button className="w-full mt-6" onClick={handleClose}>
            Tentar Novamente
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
