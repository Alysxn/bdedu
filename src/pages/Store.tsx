import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, User, Rocket, Star, Heart, Zap, Crown, Shield, Sparkles } from "lucide-react";
import { useStore } from "@/hooks/useStore";
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

const Store = () => {
  const { items, isPurchased, purchaseItem, isPurchasing, isLoading } = useStore();
  const { profile } = useProfile();

  if (isLoading || !profile) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando loja...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const handlePurchase = (itemId: string, price: number) => {
    purchaseItem({ itemId, price });
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-foreground">Loja de Recompensas</h1>
          <div className="flex items-center gap-2 bg-yellow-500/10 px-6 py-3 rounded-lg">
            <Coins className="h-6 w-6 text-yellow-600" />
            <span className="text-2xl font-bold text-yellow-600">{profile.coins || 0}</span>
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
          {items.map((item) => {
            const IconComponent = iconMap[item.icon] || User;
            const purchased = isPurchased(item.id);
            
            return (
              <Card key={item.id} className={purchased ? "border-primary/50" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <IconComponent className="h-10 w-10 text-primary" />
                    </div>
                    {purchased && (
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

                    {purchased ? (
                      <Button variant="outline" disabled size="sm">
                        Comprado ✓
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handlePurchase(item.id, item.price)}
                        disabled={isPurchasing || (profile.coins || 0) < item.price}
                        size="sm"
                      >
                        {isPurchasing ? "Comprando..." : "Comprar"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default Store;
