import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const materials = [
  {
    id: 1,
    category: "Basic SQL",
    title: "Introduction to SQL",
    description: "Learn the fundamentals of SQL, including data retrieval, filtering, and sorting.",
  },
  {
    id: 2,
    category: "Advanced SQL",
    title: "Mastering SQL Queries",
    description: "Dive deeper into SQL with advanced querying techniques, joins, and subqueries.",
  },
  {
    id: 3,
    category: "SQL Optimization",
    title: "Optimizing SQL Performance",
    description: "Enhance your SQL skills by learning how to optimize queries for better performance.",
  },
  {
    id: 4,
    category: "SQL Best Practices",
    title: "SQL Coding Standards",
    description: "Follow industry best practices for writing clean, maintainable, and efficient SQL code.",
  },
];

const savedList = [
  "SQL Basics",
  "Advanced Queries",
  "Performance Tuning",
  "Coding Standards",
  "Database Design",
];

const Materials = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [savedMaterials, setSavedMaterials] = useState<number[]>([1, 2, 3, 4, 5]);

  const toggleSaveMaterial = (materialId: number) => {
    setSavedMaterials((prev) => {
      const isCurrentlySaved = prev.includes(materialId);
      if (isCurrentlySaved) {
        toast({
          title: "Material removido",
          description: "Material removido da sua lista",
        });
        return prev.filter((id) => id !== materialId);
      } else {
        toast({
          title: "Material salvo",
          description: "Material adicionado à sua lista",
        });
        return [...prev, materialId];
      }
    });
  };

  const savedMaterialsList = materials.filter((m) => savedMaterials.includes(m.id));

  return (
    <AppLayout>
      <div className="flex gap-8">
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-8 text-foreground">Materiais</h1>

          <div className="space-y-6">
            {materials.map((material) => {
              const isSaved = savedMaterials.includes(material.id);
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
