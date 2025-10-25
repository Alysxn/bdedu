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
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">Materiais de apoio serão adicionados pelo instrutor.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="exercicios">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Exercício 1 - Crie um banco de dados</h3>
                  <p className="text-muted-foreground mb-4">
                    Você foi contratado para desenvolver o sistema de gerenciamento de uma biblioteca fictícia. O primeiro passo é a criação das tabelas
                    principais do banco de dados.
                  </p>
                  <Button onClick={() => navigate("/exercicios/1")}>Acessar Exercício</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="desafios">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Desafio 1 - Sistema de Gestão de Biblioteca</h3>
                  <p className="text-muted-foreground mb-4">
                    Uma biblioteca municipal está modernizando seu sistema de controle. Você foi contratado como analista de dados e precisa extrair informações cruciais do banco de dados existente.
                  </p>
                  <div className="flex gap-3 mb-4">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      +150 pts
                    </span>
                    <span className="bg-amber-500/10 text-amber-600 px-3 py-1 rounded-full text-sm font-medium">
                      +75 moedas
                    </span>
                  </div>
                  <Button onClick={() => navigate("/desafios/1")}>Acessar Desafio</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default ClassDetail;
