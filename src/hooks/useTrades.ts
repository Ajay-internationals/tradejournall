import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { Trade } from '@/types';

export function useTrades() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['trades', user?.id],
        queryFn: () => api.trades.list(user!.id),
        enabled: !!user,
    });

    useEffect(() => {
        if (query.data) {
            localStorage.setItem('ta_trades', JSON.stringify(query.data));
        }
    }, [query.data]);

    const addTrade = useMutation({
        mutationFn: (newTrade: Omit<Trade, 'id' | 'created_at' | 'user_id'>) => {
            if (!user) throw new Error("User not logged in");
            return api.trades.create({ ...newTrade, user_id: user.id });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trades', user?.id] });
        },
    });

    const updateTrade = useMutation({
        mutationFn: ({ id, updates }: { id: string, updates: Partial<Trade> }) => {
            return api.trades.update(id, updates);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trades', user?.id] });
        },
    });

    const deleteTrade = useMutation({
        mutationFn: api.trades.delete,
        onMutate: async (deletedId) => {
            // Optimistic update for instant feel
            await queryClient.cancelQueries({ queryKey: ['trades', user?.id] });
            const previousTrades = queryClient.getQueryData(['trades', user?.id]);
            queryClient.setQueryData(['trades', user?.id], (old: Trade[] | undefined) =>
                old?.filter(t => t.id !== deletedId)
            );
            return { previousTrades };
        },
        onError: (_err, _deletedId, context) => {
            queryClient.setQueryData(['trades', user?.id], context?.previousTrades);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['trades', user?.id] });
        },
    });

    return {
        trades: query.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        addTrade,
        updateTrade,
        deleteTrade
    };
}
