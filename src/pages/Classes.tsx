import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLessons } from "@/hooks/useLessons";
import { getYouTubeThumbnail } from "@/lib/youtube";
import { useState } from "react";

const Classes = () => {
  const navigate = useNavigate();
  const { lessons, isLoading } = useLessons();
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando aulas...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <h1 className="text-4xl font-bold mb-8 text-foreground">Aulas</h1>

      <div className="space-y-6">
        {lessons.map((lesson) => (
          <Card 
            key={lesson.id} 
            className={!lesson.isUnlocked ? "opacity-60" : ""}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-sm text-muted-foreground">Aula {lesson.id}</div>
                    {!lesson.isUnlocked && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        <Lock className="h-3 w-3" />
                        Bloqueada
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-2xl mb-2">{lesson.title}</CardTitle>
                  <CardDescription className="text-base mb-4">
                    {lesson.description}
                  </CardDescription>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>Duração: {lesson.duration}</div>
                  </div>
                </div>
                <div className="w-80 h-40 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  {!imageErrors[lesson.id] && getYouTubeThumbnail(lesson.video_url) ? (
                    <img
                      src={getYouTubeThumbnail(lesson.video_url)!}
                      alt={`Thumbnail da aula ${lesson.title}`}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={() => setImageErrors(prev => ({ ...prev, [lesson.id]: true }))}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                      <div className="text-center">
                        <div className="text-sm font-medium">Aula {lesson.id}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-foreground">Progresso</span>
                    <span className="font-semibold text-foreground">{lesson.progress}%</span>
                  </div>
                  <Progress value={lesson.progress} />
                </div>
                {lesson.isUnlocked ? (
                  <Button 
                    variant={lesson.isCompleted ? "outline" : "default"}
                    onClick={() => navigate(`/aulas/${lesson.id}`)}
                  >
                    {lesson.isCompleted ? "Revisar Aula" : "Acessar Aula"}
                  </Button>
                ) : (
                  <Button disabled variant="outline">
                    <Lock className="h-4 w-4 mr-2" />
                    Complete a aula anterior para desbloquear
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
};

export default Classes;
