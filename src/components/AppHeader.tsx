import { Star, Coins, User } from "lucide-react";
import { Logo } from "./Logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

interface AppHeaderProps {
  points?: number;
  coins?: number;
  userName?: string;
  userRank?: string;
}

export const AppHeader = ({ 
  points = 1200, 
  coins = 500, 
  userName = "Alyson Souza",
  userRank = "Diamante"
}: AppHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <Logo />
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-lg">
            <Star className="h-5 w-5 text-foreground" fill="currentColor" />
            <div className="text-sm">
              <div className="font-semibold text-foreground">Pontuação</div>
              <div className="text-foreground">{points}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-lg">
            <Coins className="h-5 w-5 text-foreground" />
            <div className="text-sm">
              <div className="font-semibold text-foreground">Moedas</div>
              <div className="text-foreground">{coins}</div>
            </div>
          </div>

          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/meuperfil")}
          >
            <div className="text-right">
              <div className="font-semibold text-foreground text-sm">{userName}</div>
              <div className="text-xs text-purple-600 flex items-center justify-end gap-1">
                <span>🏆</span>
                <span>{userRank}</span>
              </div>
            </div>
            <Avatar className="h-10 w-10 bg-muted">
              <AvatarFallback className="bg-muted text-muted-foreground">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
};
