import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, User, Rocket, Star, Heart, Zap, Crown, Shield, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface StoreItem {
  id: string;
  name: string;
  icon: any;
  price: number;
  description: string;
  purchased: boolean;
}

const Store = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<StoreItem[]>([]);
  const [userCoins, setUserCoins] = useState(0);

  useEffect(() => {
    // Load user stats
    const userStats = JSON.parse(localStorage.getItem("userStats") || "{}");
    setUserCoins(userStats.coins || 0);

    // Load purchased items
    const purchasedItems = JSON.parse(localStorage.getItem("purchasedIcons") || "[]");

    const storeItems: StoreItem[] = [
      {
        id: "icon-user",
        name: "Ícone Clássico",
        icon: User,
        price: 0,
        description: "Ícone padrão disponível gratuitamente",
        purchased: true,
      },
      {
        id: "icon-star",
        name: "Estrela Brilhante",
        icon: Star,
        price: 150,
        description: "Para os estudantes que brilham",
        purchased: purchasedItems.includes("icon-star"),
      },
      {
        id: "icon-rocket",
        name: "Foguete Espacial",
        icon: Rocket,
        price: 200,
        description: "Decole rumo ao conhecimento",
        purchased: purchasedItems.includes("icon-rocket"),
      },
      {
        id: "icon-crown",
        name: "Coroa Real",
        icon: Crown,
        price: 300,
        description: "Para os reis e rainhas do SQL",
        purchased: purchasedItems.includes("icon-crown"),
      },
      {
        id: "icon-shield",
        name: "Escudo Protetor",
        icon: Shield,
        price: 250,
        description: "Defensor dos dados",
        purchased: purchasedItems.includes("icon-shield"),
      },
      {
        id: "icon-heart",
        name: "Coração Apaixonado",
        icon: Heart,
        price: 180,
        description: "Para quem ama programar",
        purchased: purchasedItems.includes("icon-heart"),
      },
      {
        id: "icon-zap",
        name: "Raio Elétrico",
        icon: Zap,
        price: 220,
        description: "Poder e velocidade",
        purchased: purchasedItems.includes("icon-zap"),
      },
      {
        id: "icon-sparkles",
        name: "Brilho Mágico",
        icon: Sparkles,
        price: 350,
        description: "Ícone mágico premium",
        purchased: purchasedItems.includes("icon-sparkles"),
      },
    ];

    setItems(storeItems);
  }, []);

  const purchaseItem = (item: StoreItem) => {
    if (item.purchased) {
      toast({
        title: "Já possui este item",
        description: "Você já comprou este ícone!",
        variant: "destructive",
      });
      return;
    }

    if (userCoins < item.price) {
      toast({
        title: "Moedas insuficientes",
        description: `Você precisa de ${item.price - userCoins} moedas a mais para comprar este item.`,
        variant: "destructive",
      });
      return;
    }

    // Deduct coins
    const userStats = JSON.parse(localStorage.getItem("userStats") || "{}");
    userStats.coins = (userStats.coins || 0) - item.price;
    localStorage.setItem("userStats", JSON.stringify(userStats));
    setUserCoins(userStats.coins);

    // Add to purchased items
    const purchasedItems = JSON.parse(localStorage.getItem("purchasedIcons") || "[]");
    purchasedItems.push(item.id);
    localStorage.setItem("purchasedIcons", JSON.stringify(purchasedItems));

    // Update items state
    setItems(prev =>
      prev.map(i =>
        i.id === item.id ? { ...i, purchased: true } : i
      )
    );

    toast({
      title: "Compra realizada!",
      description: `Você comprou ${item.name}. Acesse seu perfil para equipá-lo.`,
    });
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-foreground">Loja de Recompensas</h1>
          <div className="flex items-center gap-2 bg-yellow-500/10 px-6 py-3 rounded-lg">
            <Coins className="h-6 w-6 text-yellow-600" />
            <span className="text-2xl font-bold text-yellow-600">{userCoins}</span>
            <span className="text-sm text-muted-foreground">moedas</span>
          </div>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              Use suas moedas conquistadas para comprar ícones exclusivos de perfil. 
              Complete exercícios, desafios e conquistas para ganhar mais moedas!
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className={item.purchased ? "border-primary/50" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <item.icon className="h-10 w-10 text-primary" />
                  </div>
                  {item.purchased && (
                    <Badge variant="secondary" className="bg-success/10 text-success border-success">
                      Comprado
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl">{item.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {item.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="h-5 w-5 text-yellow-600" />
                    <span className="text-lg font-bold text-yellow-600">
                      {item.price === 0 ? "Grátis" : item.price}
                    </span>
                  </div>

                  {item.purchased ? (
                    <Button variant="outline" disabled size="sm">
                      Comprado ✓
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => purchaseItem(item)}
                      disabled={userCoins < item.price}
                      size="sm"
                    >
                      Comprar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Store;
