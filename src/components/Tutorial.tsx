import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronRight, GraduationCap, FileText, Target, BookOpen, Trophy, ShoppingCart } from 'lucide-react';

interface TutorialProps {
  open: boolean;
  onClose: () => void;
}

const Tutorial = ({ open, onClose }: TutorialProps) => {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      title: "Bem-vindo ao BD.Edu",
      content: (
        <div className="space-y-4 text-foreground/90">
          <p>
            Você acaba de ingressar como estagiário(a) no <strong>Laboratório de Inovação Acadêmica (LIA)</strong>, uma equipe dedicada ao desenvolvimento de sistemas voltados à melhoria da gestão da Universidade Ágil.
          </p>
          <p>
            Seu papel será contribuir na criação do <strong>SAI – Sistema Acadêmico Integrado</strong>, uma plataforma que unificará os dados de alunos, professores, disciplinas e atividades em uma base única e integrada.
          </p>
          <p>
            O <strong>BD.Edu</strong> foi desenvolvido pelo LIA especialmente para preparar você para suas atividades como estagiário(a). Aqui, você encontrará aulas, exercícios, desafios, conquistas, rankings e muito mais — tudo pensado para fortalecer seu aprendizado em Banco de Dados (SQL) e capacitá-lo a colaborar de forma efetiva com o laboratório.
          </p>
          <p>
            Em cada unidade, você enfrentará situações inspiradas em problemas reais da universidade, representadas por exercícios e desafios práticos.
          </p>
        </div>
      ),
    },
    {
      title: "Aulas",
      icon: GraduationCap,
      content: (
        <div className="space-y-4 text-foreground/90">
          <p>
            As <strong>Aulas</strong> são o ponto de partida da sua jornada. Cada aula apresenta conceitos fundamentais de Banco de Dados através de videoaulas estruturadas e didáticas.
          </p>
          <p>
            Para avançar na plataforma, você precisa <strong>concluir as aulas em sequência</strong>. Ao terminar uma aula, a próxima é automaticamente desbloqueada.
          </p>
          <p>
            Assista com atenção, pois o conteúdo das aulas será essencial para resolver os exercícios e desafios que virão a seguir.
          </p>
        </div>
      ),
    },
    {
      title: "Exercícios",
      icon: FileText,
      content: (
        <div className="space-y-4 text-foreground/90">
          <p>
            Os <strong>Exercícios</strong> permitem que você pratique o que aprendeu nas aulas. Cada exercício está vinculado a uma aula específica e é desbloqueado assim que você completa a aula correspondente.
          </p>
          <p>
            Você escreverá consultas SQL reais em um editor interativo, e receberá feedback imediato sobre suas soluções.
          </p>
          <p>
            Ao completar exercícios, você ganha <strong>pontos</strong> e <strong>moedas</strong> que podem ser usadas na Loja.
          </p>
        </div>
      ),
    },
    {
      title: "Desafios",
      icon: Target,
      content: (
        <div className="space-y-4 text-foreground/90">
          <p>
            Os <strong>Desafios</strong> são cenários mais complexos que simulam problemas reais enfrentados pelo LIA na gestão da Universidade Ágil.
          </p>
          <p>
            Diferente dos exercícios, os desafios exigem raciocínio mais elaborado e a aplicação de múltiplos conceitos simultaneamente.
          </p>
          <p>
            Completar desafios rende mais pontos e moedas, além de contribuir para o desbloqueio de conquistas especiais.
          </p>
        </div>
      ),
    },
    {
      title: "Materiais",
      icon: BookOpen,
      content: (
        <div className="space-y-4 text-foreground/90">
          <p>
            A seção de <strong>Materiais</strong> oferece recursos complementares para aprofundar seus estudos: documentos PDF, guias de referência rápida, e materiais de apoio.
          </p>
          <p>
            Você pode salvar seus materiais favoritos para acesso rápido sempre que precisar revisar algum conceito.
          </p>
          <p>
            Os materiais são organizados por categoria e vinculados às aulas correspondentes.
          </p>
        </div>
      ),
    },
    {
      title: "Conquistas",
      icon: Trophy,
      content: (
        <div className="space-y-4 text-foreground/90">
          <p>
            As <strong>Conquistas</strong> reconhecem seu progresso e dedicação na plataforma. Cada conquista tem um objetivo específico, como completar um número de exercícios ou alcançar uma pontuação.
          </p>
          <p>
            Ao completar uma conquista, você pode <strong>resgatá-la</strong> para receber recompensas em pontos e moedas.
          </p>
          <p>
            Acompanhe seu progresso em direção às conquistas e veja como você se compara a outros estudantes no ranking.
          </p>
        </div>
      ),
    },
    {
      title: "Loja",
      icon: ShoppingCart,
      content: (
        <div className="space-y-4 text-foreground/90">
          <p>
            Na <strong>Loja</strong>, você pode gastar as moedas que ganhou completando exercícios e desafios. Adquira novos ícones para personalizar seu perfil e destaque-se na plataforma.
          </p>
          <p>
            Itens adquiridos ficam disponíveis permanentemente em seu perfil, onde você pode alternar entre eles a qualquer momento.
          </p>
          <p>
            Continue praticando e completando desafios para acumular mais moedas e expandir sua coleção.
          </p>
        </div>
      ),
    },
    {
      title: "Pronto para começar",
      content: (
        <div className="space-y-4 text-foreground/90">
          <p>
            Agora você está pronto para iniciar sua jornada no <strong>BD.Edu</strong>. Comece assistindo à primeira aula e, em seguida, pratique com os exercícios disponíveis.
          </p>
          <p>
            Lembre-se: você pode sempre revisitar este tutorial clicando em <strong>"Ver Tutorial"</strong> na aba Meu Perfil.
          </p>
          <p className="text-primary font-medium">
            Boa sorte, estagiário(a). O LIA conta com você.
          </p>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setCurrentPage(0);
    onClose();
  };

  const currentPageData = pages[currentPage];
  const Icon = currentPageData.icon;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="space-y-6 p-6 animate-fade-in">
          <div className="flex items-center gap-3 border-b pb-4">
            {Icon && <Icon className="w-8 h-8 text-primary" />}
            <h2 className="text-2xl font-bold text-foreground">
              {currentPageData.title}
            </h2>
          </div>

          <div className="text-base leading-relaxed">
            {currentPageData.content}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex gap-2">
              {pages.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentPage
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-muted'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              className="gap-2 min-w-[120px]"
            >
              {currentPage < pages.length - 1 ? (
                <>
                  Próximo
                  <ChevronRight className="w-4 h-4" />
                </>
              ) : (
                'Começar'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Tutorial;
