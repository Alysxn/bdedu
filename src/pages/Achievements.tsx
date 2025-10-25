import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Achievements = () => {
  return (
    <AppLayout>
      <h1 className="text-4xl font-bold mb-8 text-foreground">Conquistas</h1>
      <Card>
        <CardHeader>
          <CardTitle>Sistema de Conquistas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            O sistema de conquistas será implementado em breve. Continue aprendendo para desbloquear conquistas especiais!
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default Achievements;
