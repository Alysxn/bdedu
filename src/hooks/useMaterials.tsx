import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const useMaterials = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all materials
  const { data: materials = [], isLoading: materialsLoading } = useQuery({
    queryKey: ['materiais'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('materiais')
        .select('*')
        .order('id');
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch saved materials for current user
  const { data: savedMaterials = [], isLoading: savedLoading } = useQuery({
    queryKey: ['saved_materials', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('saved_materials')
        .select('material_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data.map(item => item.material_id);
    },
    enabled: !!user?.id,
  });

  // Save material
  const saveMaterial = useMutation({
    mutationFn: async (materialId: number) => {
      if (!user?.id) throw new Error('No user logged in');
      
      const { error } = await supabase
        .from('saved_materials')
        .insert({ user_id: user.id, material_id: materialId });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved_materials'] });
      toast.success('Material salvo', {
        description: 'Material adicionado à sua lista',
      });
    },
    onError: (error: any) => {
      toast.error('Erro ao salvar material: ' + error.message);
    },
  });

  // Unsave material
  const unsaveMaterial = useMutation({
    mutationFn: async (materialId: number) => {
      if (!user?.id) throw new Error('No user logged in');
      
      const { error } = await supabase
        .from('saved_materials')
        .delete()
        .eq('user_id', user.id)
        .eq('material_id', materialId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved_materials'] });
      toast.success('Material removido', {
        description: 'Material removido da sua lista',
      });
    },
    onError: (error: any) => {
      toast.error('Erro ao remover material: ' + error.message);
    },
  });

  // Toggle save/unsave
  const toggleSaveMaterial = (materialId: number) => {
    if (savedMaterials.includes(materialId)) {
      unsaveMaterial.mutate(materialId);
    } else {
      saveMaterial.mutate(materialId);
    }
  };

  // Check if material is saved
  const isMaterialSaved = (materialId: number) => {
    return savedMaterials.includes(materialId);
  };

  return {
    materials,
    savedMaterials,
    isLoading: materialsLoading || savedLoading,
    toggleSaveMaterial,
    isMaterialSaved,
  };
};
