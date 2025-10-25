import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trophy } from "lucide-react";

interface RankingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const rankings = [
  { name: "Iniciante", points: 0, color: "text-gray-500" },
  { name: "Bronze", points: 100, color: "text-orange-700" },
  { name: "Prata", points: 300, color: "text-gray-400" },
  { name: "Ouro", points: 600, color: "text-yellow-500" },
  { name: "Platina", points: 1000, color: "text-cyan-400" },
  { name: "Diamante", points: 1500, color: "text-blue-400" },
  { name: "Mestre", points: 2000, color: "text-purple-500" },
  { name: "Grão-Mestre", points: 3000, color: "text-red-500" },
];

export const RankingsDialog = ({ open, onOpenChange }: RankingsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Rankings Disponíveis
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          {rankings.map((ranking, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <Trophy className={`h-5 w-5 ${ranking.color}`} />
                <span className={`font-semibold ${ranking.color}`}>
                  {ranking.name}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {ranking.points === 0 ? "Inicial" : `${ranking.points} pontos`}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
