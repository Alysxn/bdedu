import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Medal, Crown, Star, Award } from "lucide-react";
import { useRanking } from "@/hooks/useRanking";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

const iconMap: { [key: string]: any } = LucideIcons;

const Ranking = () => {
  const { rankings, isLoading } = useRanking();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando rankings...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const topThree = rankings.slice(0, 3);
  const remaining = rankings.slice(3);
  const currentUserRank = rankings.find(r => r.id === user?.id);

  const getPodiumHeight = (rank: number) => {
    switch (rank) {
      case 1: return "h-48";
      case 2: return "h-40";
      case 3: return "h-32";
      default: return "h-32";
    }
  };

  const getPodiumColor = (rank: number) => {
    switch (rank) {
      case 1: return "from-yellow-400 to-yellow-600";
      case 2: return "from-gray-300 to-gray-400";
      case 3: return "from-orange-400 to-orange-600";
      default: return "from-gray-300 to-gray-400";
    }
  };

  const getPodiumIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-8 w-8 text-yellow-500" />;
      case 2: return <Medal className="h-7 w-7 text-gray-400" />;
      case 3: return <Award className="h-7 w-7 text-orange-500" />;
      default: return <Trophy className="h-6 w-6" />;
    }
  };

  const getUserIcon = (iconName: string) => {
    const Icon = iconMap[iconName];
    return Icon ? <Icon className="h-full w-full" /> : <LucideIcons.User className="h-full w-full" />;
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3 text-foreground flex items-center justify-center gap-3">
            <Trophy className="h-10 w-10 text-primary" />
            Ranking Global
          </h1>
          <p className="text-muted-foreground">Os melhores estudantes da plataforma</p>
        </div>

        {/* Podium - Top 3 */}
        {topThree.length > 0 && (
          <div className="mb-16">
            <div className="flex items-end justify-center gap-4 md:gap-8">
              {/* 2nd Place */}
              {topThree[1] && (
                <div className="flex flex-col items-center animate-fade-in" style={{ animationDelay: "0.1s" }}>
                  <div className="mb-4 relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                    <div className="relative w-20 h-20 bg-card rounded-full flex items-center justify-center border-4 border-gray-400 shadow-lg">
                      <div className="w-12 h-12 text-gray-600">
                        {getUserIcon(topThree[1].avatar_icon)}
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center shadow-lg border-2 border-card">
                      <span className="text-sm font-bold text-white">2</span>
                    </div>
                  </div>
                  <Card className={cn("w-32 md:w-40", getPodiumHeight(2), "transition-transform hover:scale-105")}>
                    <div className={cn("h-full w-full rounded-t-lg bg-gradient-to-b", getPodiumColor(2), "flex flex-col items-center justify-center p-4 relative overflow-hidden")}>
                      <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                      <div className="relative z-10 text-center">
                        <Medal className="h-6 w-6 mx-auto mb-2 text-white" />
                        <p className="font-bold text-white text-sm truncate w-full px-2">{topThree[1].display_name}</p>
                        <div className="flex items-center justify-center gap-1 mt-2">
                          <Star className="h-3 w-3 text-white" />
                          <span className="text-xs text-white font-semibold">{topThree[1].points}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* 1st Place */}
              {topThree[0] && (
                <div className="flex flex-col items-center animate-fade-in" style={{ animationDelay: "0s" }}>
                  <div className="mb-4 relative group">
                    <div className="absolute -inset-2 bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
                    <div className="relative w-24 h-24 bg-card rounded-full flex items-center justify-center border-4 border-yellow-500 shadow-2xl">
                      <div className="w-14 h-14 text-yellow-600">
                        {getUserIcon(topThree[0].avatar_icon)}
                      </div>
                    </div>
                    <div className="absolute -top-3 -right-1 animate-bounce">
                      <Crown className="h-10 w-10 text-yellow-500 drop-shadow-lg" />
                    </div>
                  </div>
                  <Card className={cn("w-36 md:w-44", getPodiumHeight(1), "transition-transform hover:scale-105")}>
                    <div className={cn("h-full w-full rounded-t-lg bg-gradient-to-b", getPodiumColor(1), "flex flex-col items-center justify-center p-4 relative overflow-hidden")}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                      <div className="absolute top-0 left-0 w-full h-full">
                        <div className="absolute top-2 left-2 w-2 h-2 bg-white/50 rounded-full animate-ping"></div>
                        <div className="absolute bottom-4 right-3 w-2 h-2 bg-white/50 rounded-full animate-ping" style={{ animationDelay: "0.5s" }}></div>
                      </div>
                      <div className="relative z-10 text-center">
                        <Trophy className="h-7 w-7 mx-auto mb-2 text-white drop-shadow-lg" />
                        <p className="font-bold text-white truncate w-full px-2">{topThree[0].display_name}</p>
                        <div className="flex items-center justify-center gap-1 mt-2">
                          <Star className="h-4 w-4 text-white fill-white" />
                          <span className="text-sm text-white font-bold">{topThree[0].points}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* 3rd Place */}
              {topThree[2] && (
                <div className="flex flex-col items-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  <div className="mb-4 relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                    <div className="relative w-20 h-20 bg-card rounded-full flex items-center justify-center border-4 border-orange-500 shadow-lg">
                      <div className="w-12 h-12 text-orange-600">
                        {getUserIcon(topThree[2].avatar_icon)}
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg border-2 border-card">
                      <span className="text-sm font-bold text-white">3</span>
                    </div>
                  </div>
                  <Card className={cn("w-32 md:w-40", getPodiumHeight(3), "transition-transform hover:scale-105")}>
                    <div className={cn("h-full w-full rounded-t-lg bg-gradient-to-b", getPodiumColor(3), "flex flex-col items-center justify-center p-4 relative overflow-hidden")}>
                      <div className="absolute inset-0 bg-white/10 animate-pulse" style={{ animationDelay: "0.3s" }}></div>
                      <div className="relative z-10 text-center">
                        <Award className="h-6 w-6 mx-auto mb-2 text-white" />
                        <p className="font-bold text-white text-sm truncate w-full px-2">{topThree[2].display_name}</p>
                        <div className="flex items-center justify-center gap-1 mt-2">
                          <Star className="h-3 w-3 text-white" />
                          <span className="text-xs text-white font-semibold">{topThree[2].points}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Current User Position (if not in top 3) */}
        {currentUserRank && currentUserRank.rank > 3 && (
          <Card className="mb-8 border-primary/50 bg-primary/5 animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary">
                    <span className="text-xl font-bold text-primary">#{currentUserRank.rank}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 text-primary">
                      {getUserIcon(currentUserRank.avatar_icon)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Sua Posição</p>
                      <p className="text-sm text-muted-foreground">{currentUserRank.display_name}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <Star className="h-4 w-4 text-primary" />
                      <span className="font-bold text-foreground">{currentUserRank.points}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">pontos</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Remaining Rankings */}
        {remaining.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Demais Posições</h2>
            <div className="space-y-3">
              {remaining.map((ranking, index) => (
                <Card 
                  key={ranking.id}
                  className={cn(
                    "transition-all hover:shadow-md hover:border-primary/30",
                    ranking.id === user?.id && "border-primary/50 bg-primary/5",
                    "animate-fade-in"
                  )}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
                          ranking.id === user?.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        )}>
                          #{ranking.rank}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10",
                            ranking.id === user?.id ? "text-primary" : "text-muted-foreground"
                          )}>
                            {getUserIcon(ranking.avatar_icon)}
                          </div>
                          <div>
                            <p className={cn(
                              "font-medium",
                              ranking.id === user?.id ? "text-primary font-semibold" : "text-foreground"
                            )}>
                              {ranking.display_name}
                              {ranking.id === user?.id && <span className="ml-2 text-xs text-primary">(Você)</span>}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className={cn(
                          "h-4 w-4",
                          ranking.id === user?.id ? "text-primary" : "text-muted-foreground"
                        )} />
                        <span className={cn(
                          "font-semibold",
                          ranking.id === user?.id ? "text-primary" : "text-foreground"
                        )}>
                          {ranking.points}
                        </span>
                        <span className="text-xs text-muted-foreground">pts</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {rankings.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Nenhum ranking disponível no momento.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Ranking;
