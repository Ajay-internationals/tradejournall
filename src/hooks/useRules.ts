import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export interface Rule {
    id: string;
    user_id: string;
    text: string;
    completed: boolean;
    created_at: string;
}

export function useRules() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const query = useQuery<Rule[]>({
        queryKey: ['rules', user?.id],
        queryFn: () => api.rules.list(user!.id),
        enabled: !!user,
    });

    const addRule = useMutation({
        mutationFn: (text: string) => {
            if (!user) throw new Error("User not logged in");
            return api.rules.create(user.id, text);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rules', user?.id] });
        },
    });

    const toggleRule = useMutation({
        mutationFn: ({ id, completed }: { id: string, completed: boolean }) => {
            return api.rules.toggle(id, completed);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rules', user?.id] });
        },
    });

    const deleteRule = useMutation({
        mutationFn: api.rules.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rules', user?.id] });
        },
    });

    return {
        rules: query.data || [],
        isLoading: query.isLoading,
        addRule,
        toggleRule,
        deleteRule
    };
}
