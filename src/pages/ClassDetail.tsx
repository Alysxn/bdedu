import { useState, useRef } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProgress } from "@/hooks/useProgress";
import { useLessons } from "@/hooks/useLessons";
import { useProfile } from "@/hooks/useProfile";
import { useAchievements } from "@/hooks/useAchievements";
import { YouTubePlayer } from "@/components/YouTubePlayer";

const ClassDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const lessonId = parseInt(id || "1");
  const [activeTab, setActiveTab] = useState("descricao");
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const lastProgressRef = useRef(0);

  const { updateProgress, getProgress } = useProgress();
  const { isLessonUnlocked, lessons } = useLessons();
  const { updatePoints, updateCoins } = useProfile();
  const { updateProgress: updateAchievementProgress } = useAchievements();

  // Fetch lesson details
  const { data: lesson, isLoading } = useQuery({
    queryKey: ['aula', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('aulas')
        .select('*')
        .eq('id', lessonId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch materials linked to this lesson
  const { data: materials = [] } = useQuery({
    queryKey: ['materiais', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('materiais')
        .select('*')
        .eq('aula_id', lessonId)
        .order('id');
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch exercises linked to this lesson
  const { data: exercises = [] } = useQuery({
    queryKey: ['exercicios-aula', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exercicios')
        .select('*')
        .eq('aula_id', lessonId)
        .order('id');
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch challenges linked to this lesson
  const { data: challenges = [] } = useQuery({
    queryKey: ['desafios-aula', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('desafios')
        .select('*')
        .eq('aula_id', lessonId)
        .order('id');
      
      if (error) throw error;
      return data;
    },
  });

  const currentProgress = getProgress('aula', lessonId);
  const unlocked = isLessonUnlocked(lessonId);
  const nextLesson = lessons.find(l => l.id === lessonId + 1);

  // Handle video progress updates
  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    const progress = Math.round(state.played * 100);
    setPlayed(state.played);

    // Update backend every 5% progress or on completion
    if (progress >= lastProgressRef.current + 5 || progress === 100) {
      lastProgressRef.current = progress;
      
      if (progress > currentProgress && progress <= 100) {
        updateProgress({ 
          contentType: 'aula', 
          contentId: lessonId, 
          progressPercentage: progress 
        });

        // Award rewards on completion
        if (progress === 100 && currentProgress < 100) {
          updatePoints(50);
          updateCoins(25);
          updateAchievementProgress({ achievementId: 'first-class' });
          updateAchievementProgress({ achievementId: 'three-classes' });
          updateAchievementProgress({ achievementId: 'all-classes' });
        }
      }
    }
  };

  if (isLoading || !lesson) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando aula...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!unlocked) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Aula Bloqueada</h1>
          <p className="text-muted-foreground mb-6">
            Complete a aula anterior para desbloquear esta aula.
          </p>
          <Button onClick={() => navigate("/aulas")}>Voltar para Aulas</Button>
        </div>
      </AppLayout>
    );
  }

  const progressPercent = played * 100;
  const videoUrl = lesson.video_url || "https://www.youtube.com/watch?v=Qef5aOKI81o";

  return (
    <AppLayout>
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/aulas")}
          className="rounded-full h-12 w-12 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>

        <div>
          <h1 className="text-4xl font-bold mb-6 text-foreground text-center">{lesson.title}</h1>
          
          <div className="w-full max-w-4xl mx-auto mb-6">
            <div className="relative bg-muted rounded-lg overflow-hidden">
              <YouTubePlayer
                url={videoUrl}
                playing={playing}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onProgress={handleProgress}
              />
            </div>
            <div className="mt-4">
              <div className="bg-muted rounded-full h-2 mb-2">
                <div 
                  className="bg-primary h-full rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progresso da Aula</span>
                <span className="font-semibold">{Math.round(progressPercent)}% completo</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end mb-6">
            {nextLesson && nextLesson.isUnlocked && (
              <Button size="lg" onClick={() => navigate(`/aulas/${nextLesson.id}`)}>
                Próxima aula
              </Button>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start mb-6">
              <TabsTrigger value="descricao" className="text-base">Descrição</TabsTrigger>
              <TabsTrigger value="materiais" className="text-base">Materiais de Apoio</TabsTrigger>
              <TabsTrigger value="exercicios" className="text-base">Exercícios</TabsTrigger>
              <TabsTrigger value="desafios" className="text-base">Desafios</TabsTrigger>
            </TabsList>

            <TabsContent value="descricao" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4">Descrição</h2>
                  <p className="text-muted-foreground mb-6">
                    {lesson.description}
                  </p>

                  <h3 className="text-xl font-semibold mb-3">Objetivos</h3>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Entender a estrutura básica de um banco de dados SQL.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Aprender a escrever consultas para recuperar dados.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Conhecer os principais comandos DML e DDL.</span>
                    </li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">Próximos Passos</h3>
                  <p className="text-muted-foreground">
                    Após esta aula, recomendamos que você explore os materiais de apoio e realize as atividades propostas para consolidar o seu
                    aprendizado. Não se esqueça de participar dos desafios para testar os seus conhecimentos!
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="materiais">
              {materials.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground">Nenhum material de apoio disponível para esta aula.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {materials.map((material) => (
                    <Card key={material.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2">{material.title}</h3>
                            <p className="text-muted-foreground mb-4">{material.description}</p>
                            <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                              {material.category}
                            </span>
                          </div>
                        </div>
                        <Button onClick={() => navigate(`/materiais/${material.id}`)}>
                          Ver Material
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="exercicios">
              {exercises.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground">Nenhum exercício disponível para esta aula.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {exercises.map((exercise) => (
                    <Card key={exercise.id}>
                      <CardContent className="pt-6">
                        <h3 className="text-xl font-semibold mb-4">{exercise.title}</h3>
                        <p className="text-muted-foreground mb-4">{exercise.description}</p>
                        <div className="flex gap-3 mb-4">
                          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                            +{exercise.points} pts
                          </span>
                          <span className="bg-amber-500/10 text-amber-600 px-3 py-1 rounded-full text-sm font-medium">
                            +{exercise.coins} moedas
                          </span>
                        </div>
                        <Button onClick={() => navigate(`/exercicios/${exercise.id}`)}>Acessar Exercício</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="desafios">
              {challenges.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground">Nenhum desafio disponível para esta aula.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {challenges.map((challenge) => (
                    <Card key={challenge.id}>
                      <CardContent className="pt-6">
                        <h3 className="text-xl font-semibold mb-4">{challenge.title}</h3>
                        <p className="text-muted-foreground mb-4">{challenge.description}</p>
                        <div className="flex gap-3 mb-4">
                          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                            +{challenge.points} pts
                          </span>
                          <span className="bg-amber-500/10 text-amber-600 px-3 py-1 rounded-full text-sm font-medium">
                            +{challenge.coins} moedas
                          </span>
                        </div>
                        <Button onClick={() => navigate(`/desafios/${challenge.id}`)}>Acessar Desafio</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default ClassDetail;
