import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Challenges = () => {
  return (
    <AppLayout>
      <h1 className="text-4xl font-bold mb-8 text-foreground">Desafios</h1>
      <Card>
        <CardHeader>
          <CardTitle>Em breve!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Os desafios serão liberados em breve. Continue completando as aulas e exercícios para desbloquear novos desafios!
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default Challenges;
