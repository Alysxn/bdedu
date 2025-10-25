import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMaterials } from "@/hooks/useMaterials";

const Materials = () => {
  const navigate = useNavigate();
  const { materials, savedMaterials, isLoading, toggleSaveMaterial, isMaterialSaved } = useMaterials();

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando materiais...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const savedMaterialsList = materials.filter(m => isMaterialSaved(m.id));

  return (
    <AppLayout>
      <div className="flex gap-8">
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-8 text-foreground">Materiais</h1>

          <div className="space-y-6">
            {materials.map((material) => {
              const isSaved = isMaterialSaved(material.id);
              return (
                <Card key={material.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="text-sm text-primary mb-2">{material.category}</div>
                        <CardTitle className="text-2xl mb-2">{material.title}</CardTitle>
                        <CardDescription className="text-base">{material.description}</CardDescription>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <button
                          onClick={() => toggleSaveMaterial(material.id)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          aria-label={isSaved ? "Remover dos salvos" : "Salvar material"}
                        >
                          <Bookmark
                            className={`h-5 w-5 transition-colors ${
                              isSaved ? "text-primary fill-primary" : "text-muted-foreground"
                            }`}
                          />
                        </button>
                        <div className="w-48 h-32 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                          200 × 160
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => navigate(`/materiais/${material.id}`)}>Abrir</Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <aside className="w-80">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Minha lista
              </CardTitle>
            </CardHeader>
            <CardContent>
              {savedMaterialsList.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum material salvo ainda</p>
              ) : (
                <div className="space-y-3">
                  {savedMaterialsList.map((material) => (
                    <div
                      key={material.id}
                      className="flex items-center justify-between gap-2 text-sm group"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <Bookmark className="h-4 w-4 text-primary fill-primary flex-shrink-0" />
                        <span className="line-clamp-1">{material.title}</span>
                      </div>
                      <button
                        onClick={() => toggleSaveMaterial(material.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded"
                        aria-label="Remover"
                      >
                        <span className="text-xs text-muted-foreground">✕</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </AppLayout>
  );
};

export default Materials;
