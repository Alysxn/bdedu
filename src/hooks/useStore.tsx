import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { toast } from 'sonner';

export const useStore = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const queryClient = useQueryClient();

  // Fetch all store items
  const { data: items = [], isLoading: itemsLoading } = useQuery({
    queryKey: ['store_items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_items')
        .select('*')
        .order('price');
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch user's purchases
  const { data: purchases = [], isLoading: purchasesLoading } = useQuery({
    queryKey: ['user_purchases', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_purchases')
        .select('item_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data.map(p => p.item_id);
    },
    enabled: !!user?.id,
  });

  // Purchase item mutation
  const purchaseItem = useMutation({
    mutationFn: async ({ itemId, price }: { itemId: string; price: number }) => {
      if (!user?.id) throw new Error('No user logged in');
      if (!profile) throw new Error('Profile not found');

      // Check if user has enough coins
      if (profile.coins < price) {
        throw new Error('Insufficient coins');
      }

      // Check if already purchased
      if (purchases.includes(itemId)) {
        throw new Error('Already purchased');
      }

      // Deduct coins and record purchase in a transaction
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ coins: profile.coins - price })
        .eq('id', user.id);

      if (updateError) throw updateError;

      const { error: purchaseError } = await supabase
        .from('user_purchases')
        .insert({ user_id: user.id, item_id: itemId });

      if (purchaseError) throw purchaseError;

      return itemId;
    },
    onSuccess: (itemId) => {
      queryClient.invalidateQueries({ queryKey: ['user_purchases'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Compra realizada!', {
        description: 'Acesse seu perfil para equipar o novo ícone.',
      });
    },
    onError: (error: any) => {
      if (error.message === 'Insufficient coins') {
        toast.error('Moedas insuficientes', {
          description: 'Você não tem moedas suficientes para esta compra.',
        });
      } else if (error.message === 'Already purchased') {
        toast.error('Já possui este item', {
          description: 'Você já comprou este ícone!',
        });
      } else {
        toast.error('Erro ao comprar item: ' + error.message);
      }
    },
  });

  // Check if item is purchased
  const isPurchased = (itemId: string) => {
    return purchases.includes(itemId);
  };

  return {
    items,
    purchases,
    isLoading: itemsLoading || purchasesLoading,
    purchaseItem: purchaseItem.mutate,
    isPurchasing: purchaseItem.isPending,
    isPurchased,
  };
};
