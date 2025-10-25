import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Store = () => {
  return (
    <AppLayout>
      <h1 className="text-4xl font-bold mb-8 text-foreground">Loja</h1>
      <Card>
        <CardHeader>
          <CardTitle>Loja de Recompensas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            A loja será aberta em breve. Você poderá trocar suas moedas por recompensas especiais!
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default Store;
