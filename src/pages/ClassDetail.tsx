import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const ClassDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("descricao");

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
          <h1 className="text-4xl font-bold mb-6 text-foreground text-center">Introdução a SQL</h1>
          
          <div className="w-full max-w-4xl mx-auto h-96 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-6xl mb-6">
            303 × 161
          </div>

          <div className="flex justify-end mb-6">
            <Button size="lg">Próxima aula</Button>
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
                    Aprenda os fundamentos do SQL com exemplos práticos e exercícios.
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
