import { Coins, User, Rocket, Star, Heart, Zap, Crown, Shield, Sparkles } from "lucide-react";
import { Logo } from "./Logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";

const iconMap: { [key: string]: any } = {
  "User": User,
  "Star": Star,
  "Rocket": Rocket,
  "Crown": Crown,
  "Shield": Shield,
  "Heart": Heart,
  "Zap": Zap,
  "Sparkles": Sparkles,
};

// Ranking SVG Icons
const RankingIcon = ({ rank }: { rank: string }) => {
  const rankColors: { [key: string]: string } = {
    "Iniciante": "text-gray-500",
    "Bronze": "text-orange-700",
    "Prata": "text-gray-400",
    "Ouro": "text-yellow-500",
    "Platina": "text-cyan-400",
    "Diamante": "text-blue-400",
    "Mestre": "text-purple-500",
    "Grão-Mestre": "text-red-500",
  };

  const color = rankColors[rank] || "text-gray-500";

  return (
    <svg 
      className={`h-5 w-5 ${color}`} 
      viewBox="0 0 24 24" 
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  );
};

export const AppHeader = () => {
  const navigate = useNavigate();
  const { profile, isLoading } = useProfile();

  const getRankName = (points: number) => {
    if (points >= 3000) return "Grão-Mestre";
    if (points >= 2000) return "Mestre";
    if (points >= 1500) return "Diamante";
    if (points >= 1000) return "Platina";
    if (points >= 600) return "Ouro";
    if (points >= 300) return "Prata";
    if (points >= 100) return "Bronze";
    return "Iniciante";
  };

  if (isLoading || !profile) {
    return (
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div onClick={() => navigate("/")} className="cursor-pointer">
            <Logo />
          </div>
          <div className="text-sm text-muted-foreground">Carregando...</div>
        </div>
      </header>
    );
  }

  const currentRank = getRankName(profile.points || 0);
  const SelectedIconComponent = iconMap[profile.avatar_icon || "User"] || User;

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
              <div className="text-foreground">{profile.points || 0}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-lg">
            <Coins className="h-5 w-5 text-foreground" />
            <div className="text-sm">
              <div className="font-semibold text-foreground">Moedas</div>
              <div className="text-foreground">{profile.coins || 0}</div>
            </div>
          </div>

          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/meuperfil")}
          >
            <div className="text-right">
              <div className="font-semibold text-foreground text-sm">{profile.display_name}</div>
              <div className="text-xs flex items-center justify-end gap-1">
                <RankingIcon rank={currentRank} />
                <span className={
                  currentRank === "Grão-Mestre" ? "text-red-500" :
                  currentRank === "Mestre" ? "text-purple-500" :
                  currentRank === "Diamante" ? "text-blue-400" :
                  currentRank === "Platina" ? "text-cyan-400" :
                  currentRank === "Ouro" ? "text-yellow-500" :
                  currentRank === "Prata" ? "text-gray-400" :
                  currentRank === "Bronze" ? "text-orange-700" :
                  "text-gray-500"
                }>{currentRank}</span>
              </div>
            </div>
            <Avatar className="h-10 w-10 bg-primary/10">
              <AvatarFallback className="bg-primary/10">
                <SelectedIconComponent className="h-5 w-5 text-primary" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
};
