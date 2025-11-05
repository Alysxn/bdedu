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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [fontSize, setFontSize] = useState("14");
  const [textColor, setTextColor] = useState("#000000");
  const [highlightColor, setHighlightColor] = useState("#ffff00");

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
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const { error } = await supabase
        .from('lesson_notes')
        .update({ content })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson-notes', lessonId, user?.id] });
      setEditingNoteId(null);
      setEditContent("");
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
    if (!newNoteContent.trim()) {
      toast.error("Digite algo antes de salvar");
      return;
    }
    createNoteMutation.mutate(newNoteContent);
  };

  const handleUpdateNote = (id: string) => {
    if (!editContent.trim()) {
      toast.error("A nota não pode estar vazia");
      return;
    }
    updateNoteMutation.mutate({ id, content: editContent });
  };

  const applyFormatting = (command: string, value?: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = newNoteContent.substring(start, end);
    
    if (!selectedText) {
      toast.error("Selecione um texto primeiro");
      return;
    }

    let formattedText = selectedText;
    
    switch (command) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `__${selectedText}__`;
        break;
      case 'highlight':
        formattedText = `==${selectedText}==`;
        break;
      case 'color':
        formattedText = `[${selectedText}](color:${value})`;
        break;
    }

    const newContent = 
      newNoteContent.substring(0, start) + 
      formattedText + 
      newNoteContent.substring(end);
    
    setNewNoteContent(newContent);
    
    // Refocus and set cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + formattedText.length);
    }, 0);
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

          <Textarea
            ref={textareaRef}
            placeholder="Digite sua nota aqui..."
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            className="min-h-[100px] resize-none"
            style={{ fontSize: `${fontSize}px` }}
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
                      <span>{formatTime(note.timestamp_seconds)}</span>
                    </div>
                    <div className="flex gap-1">
                      {editingNoteId === note.id ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateNote(note.id)}
                          disabled={updateNoteMutation.isPending}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingNoteId(note.id);
                            setEditContent(note.content);
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
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[80px]"
                    />
                  ) : (
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {note.content}
                    </p>
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
