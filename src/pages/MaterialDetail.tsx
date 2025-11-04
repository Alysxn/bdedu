import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";
import { useMaterials } from "@/hooks/useMaterials";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure PDF.js worker with explicit HTTPS
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const MaterialDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const { materials, isLoading } = useMaterials();

  const material = materials.find((m) => m.id === Number(id));

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando material...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

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

  const handleDownload = () => {
    // Construct full URL with base path
    const fullUrl = `${import.meta.env.BASE_URL}${material.pdf_url.replace(/^\//, '')}`;
    const link = document.createElement('a');
    link.href = fullUrl;
    link.download = `${material.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    console.log('PDF loaded successfully:', numPages, 'pages');
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF load error:', error);
    console.error('PDF URL:', material?.pdf_url);
  };

  // Construct full PDF URL with base path
  const pdfUrl = material ? `${import.meta.env.BASE_URL}${material.pdf_url.replace(/^\//, '')}` : '';

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
              <Button variant="outline" onClick={handleDownload}>
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
                  file={pdfUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={
                    <div className="w-full h-96 flex items-center justify-center text-muted-foreground">
                      Carregando PDF...
                    </div>
                  }
                  error={
                    <div className="w-full h-96 flex flex-col items-center justify-center text-destructive gap-2">
                      <p>Erro ao carregar PDF</p>
                      <p className="text-sm text-muted-foreground">URL: {pdfUrl}</p>
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
