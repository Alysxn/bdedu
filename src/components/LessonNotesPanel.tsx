import { useState, useRef, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Bold, 
  Italic, 
  Underline, 
  Highlighter, 
  Type, 
  Plus, 
  Trash2,
  Save,
  Clock
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Note {
  id: string;
  content: string;
  timestamp_seconds: number;
  created_at: string;
  updated_at: string;
}

interface LessonNotesPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lessonId: number;
  currentVideoTime: number;
  onPause: () => void;
}

export const LessonNotesPanel = ({ 
  open, 
  onOpenChange, 
  lessonId, 
  currentVideoTime,
  onPause 
}: LessonNotesPanelProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editingTimestamp, setEditingTimestamp] = useState<string | null>(null);
  const [editTimestampValue, setEditTimestampValue] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);
  const editEditorRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState("14");

  // Fetch notes for this lesson
  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['lesson-notes', lessonId, user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('lesson_notes')
        .select('*')
        .eq('lesson_id', lessonId)
        .eq('user_id', user.id)
        .order('timestamp_seconds', { ascending: true });
      
      if (error) throw error;
      return data as Note[];
    },
    enabled: !!user?.id && open,
  });

  // Pause video when panel opens
  useEffect(() => {
    if (open) {
      onPause();
    }
  }, [open, onPause]);

  // Create note mutation
  const createNoteMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('lesson_notes')
        .insert({
          user_id: user.id,
          lesson_id: lessonId,
          content,
          timestamp_seconds: Math.floor(currentVideoTime),
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson-notes', lessonId, user?.id] });
      setNewNoteContent("");
      toast.success("Nota criada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao criar nota");
      console.error(error);
    },
  });

  // Update note mutation
  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, content, timestamp }: { id: string; content?: string; timestamp?: number }) => {
      const updateData: any = {};
      if (content !== undefined) updateData.content = content;
      if (timestamp !== undefined) updateData.timestamp_seconds = timestamp;
      
      const { error } = await supabase
        .from('lesson_notes')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson-notes', lessonId, user?.id] });
      setEditingNoteId(null);
      setEditContent("");
      setEditingTimestamp(null);
      setEditTimestampValue("");
      toast.success("Nota atualizada!");
    },
    onError: () => {
      toast.error("Erro ao atualizar nota");
    },
  });

  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('lesson_notes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson-notes', lessonId, user?.id] });
      toast.success("Nota excluída!");
    },
    onError: () => {
      toast.error("Erro ao excluir nota");
    },
  });

  const handleAddNote = () => {
    const content = editorRef.current?.innerHTML || "";
    if (!content.trim() || content === "<br>") {
      toast.error("Digite algo antes de salvar");
      return;
    }
    createNoteMutation.mutate(content);
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
  };

  const handleUpdateNote = (id: string) => {
    const content = editEditorRef.current?.innerHTML || "";
    if (!content.trim() || content === "<br>") {
      toast.error("A nota não pode estar vazia");
      return;
    }
    updateNoteMutation.mutate({ id, content });
  };

  const handleUpdateTimestamp = (id: string) => {
    const [mins, secs] = editTimestampValue.split(':').map(Number);
    if (isNaN(mins) || isNaN(secs)) {
      toast.error("Formato inválido. Use MM:SS");
      return;
    }
    const totalSeconds = mins * 60 + secs;
    updateNoteMutation.mutate({ id, timestamp: totalSeconds });
  };

  const applyFormatting = (command: string, editorElement?: HTMLDivElement | null) => {
    const editor = editorElement || editorRef.current;
    if (!editor) return;

    editor.focus();
    
    switch (command) {
      case 'bold':
        document.execCommand('bold', false);
        break;
      case 'italic':
        document.execCommand('italic', false);
        break;
      case 'underline':
        document.execCommand('underline', false);
        break;
      case 'highlight':
        document.execCommand('hiliteColor', false, '#ffff00');
        break;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle>Notas da Aula</SheetTitle>
          <SheetDescription>
            Crie anotações com marcações de tempo do vídeo
          </SheetDescription>
        </SheetHeader>

        <Separator />

        {/* New Note Editor */}
        <div className="px-6 py-4 space-y-3 border-b">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Timestamp: {formatTime(Math.floor(currentVideoTime))}</span>
          </div>

          {/* Formatting Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyFormatting('bold')}
              title="Negrito"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyFormatting('italic')}
              title="Itálico"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyFormatting('underline')}
              title="Sublinhado"
            >
              <Underline className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyFormatting('highlight')}
              title="Destacar"
            >
              <Highlighter className="h-4 w-4" />
            </Button>
            
            <Select value={fontSize} onValueChange={setFontSize}>
              <SelectTrigger className="w-20 h-8">
                <Type className="h-4 w-4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12px</SelectItem>
                <SelectItem value="14">14px</SelectItem>
                <SelectItem value="16">16px</SelectItem>
                <SelectItem value="18">18px</SelectItem>
                <SelectItem value="20">20px</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div
            ref={editorRef}
            contentEditable
            className="min-h-[100px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            style={{ fontSize: `${fontSize}px` }}
            data-placeholder="Digite sua nota aqui..."
            onInput={(e) => {
              const target = e.target as HTMLDivElement;
              if (target.textContent?.trim() === "") {
                target.innerHTML = "";
              }
            }}
          />

          <Button 
            onClick={handleAddNote} 
            disabled={createNoteMutation.isPending}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Nota
          </Button>
        </div>

        {/* Notes List */}
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4 py-4">
            {isLoading ? (
              <div className="text-center text-muted-foreground">
                Carregando notas...
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                Nenhuma nota criada ainda
              </div>
            ) : (
              notes.map((note) => (
                <div 
                  key={note.id} 
                  className="border rounded-lg p-4 space-y-3 bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {editingTimestamp === note.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editTimestampValue}
                            onChange={(e) => setEditTimestampValue(e.target.value)}
                            placeholder="MM:SS"
                            className="w-16 px-2 py-1 text-xs border rounded"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateTimestamp(note.id)}
                            disabled={updateNoteMutation.isPending}
                          >
                            <Save className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingTimestamp(null);
                              setEditTimestampValue("");
                            }}
                          >
                            ✕
                          </Button>
                        </div>
                      ) : (
                        <span
                          className="cursor-pointer hover:underline"
                          onClick={() => {
                            setEditingTimestamp(note.id);
                            setEditTimestampValue(formatTime(note.timestamp_seconds));
                          }}
                          title="Clique para editar"
                        >
                          {formatTime(note.timestamp_seconds)}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {editingNoteId === note.id ? (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateNote(note.id)}
                            disabled={updateNoteMutation.isPending}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingNoteId(null);
                              setEditContent("");
                            }}
                          >
                            Cancelar
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingNoteId(note.id);
                            setEditContent(note.content);
                            setTimeout(() => {
                              if (editEditorRef.current) {
                                editEditorRef.current.innerHTML = note.content;
                              }
                            }, 0);
                          }}
                        >
                          Editar
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNoteMutation.mutate(note.id)}
                        disabled={deleteNoteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  
                  {editingNoteId === note.id ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => applyFormatting('bold', editEditorRef.current)}
                          title="Negrito"
                        >
                          <Bold className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => applyFormatting('italic', editEditorRef.current)}
                          title="Itálico"
                        >
                          <Italic className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => applyFormatting('underline', editEditorRef.current)}
                          title="Sublinhado"
                        >
                          <Underline className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => applyFormatting('highlight', editEditorRef.current)}
                          title="Destacar"
                        >
                          <Highlighter className="h-4 w-4" />
                        </Button>
                      </div>
                      <div
                        ref={editEditorRef}
                        contentEditable
                        className="min-h-[80px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                        onInput={(e) => {
                          const target = e.target as HTMLDivElement;
                          if (target.textContent?.trim() === "") {
                            target.innerHTML = "";
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div 
                      className="text-sm break-words prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: note.content }}
                    />
                  )}
                  
                  <div className="text-xs text-muted-foreground">
                    {new Date(note.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
