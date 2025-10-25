import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const materials = [
  {
    id: 1,
    category: "Basic SQL",
    title: "Introduction to SQL",
    description: "Learn the fundamentals of SQL, including data retrieval, filtering, and sorting.",
    pdfUrl: "/sample-material.pdf",
  },
  {
    id: 2,
    category: "Advanced SQL",
    title: "Mastering SQL Queries",
    description: "Dive deeper into SQL with advanced querying techniques, joins, and subqueries.",
    pdfUrl: "/sample-material.pdf",
  },
  {
    id: 3,
    category: "SQL Optimization",
    title: "Optimizing SQL Performance",
    description: "Enhance your SQL skills by learning how to optimize queries for better performance.",
    pdfUrl: "/sample-material.pdf",
  },
  {
    id: 4,
    category: "SQL Best Practices",
    title: "SQL Coding Standards",
    description: "Follow industry best practices for writing clean, maintainable, and efficient SQL code.",
    pdfUrl: "/sample-material.pdf",
  },
];

const MaterialDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const material = materials.find((m) => m.id === Number(id));

  if (!material) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Material não encontrado</h1>
          <Button onClick={() => navigate("/materiais")}>Voltar para Materiais</Button>
        </div>
      </AppLayout>
    );
  }

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/materiais")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Materiais
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-primary mb-2">{material.category}</div>
                <CardTitle className="text-3xl mb-2">{material.title}</CardTitle>
                <p className="text-muted-foreground">{material.description}</p>
              </div>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Baixar PDF
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conteúdo do Material</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="border rounded-lg overflow-hidden bg-muted/20">
                <Document
                  file={material.pdfUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={
                    <div className="w-full h-96 flex items-center justify-center text-muted-foreground">
                      Carregando PDF...
                    </div>
                  }
                  error={
                    <div className="w-full h-96 flex items-center justify-center text-destructive">
                      Erro ao carregar PDF
                    </div>
                  }
                >
                  <Page
                    pageNumber={pageNumber}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    width={Math.min(800, window.innerWidth - 100)}
                  />
                </Document>
              </div>

              {numPages > 0 && (
                <div className="flex items-center gap-4 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
                    disabled={pageNumber <= 1}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Página {pageNumber} de {numPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPageNumber((prev) => Math.min(numPages, prev + 1))}
                    disabled={pageNumber >= numPages}
                  >
                    Próxima
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default MaterialDetail;
