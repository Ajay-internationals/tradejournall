import { supabase } from './supabase';
import type { Trade, Strategy, TradeImport } from '@/types';

export const api = {
    trades: {
        list: async (userId: string) => {
            const { data, error } = await supabase
                .from('trades')
                .select('*')
                .eq('user_id', userId)
                .order('date', { ascending: false });

            if (error) throw error;
            return data as Trade[];
        },

        create: async (trade: Omit<Trade, 'id' | 'created_at'>) => {
            const { data, error } = await supabase
                .from('trades')
                // @ts-ignore
                .insert(trade as any)
                .select()
                .single();

            if (error) throw error;
            return data as Trade;
        },

        update: async (tradeId: string, updates: Partial<Trade>) => {
            const { data, error } = await supabase
                .from('trades')
                // @ts-ignore
                .update(updates as any)
                .eq('id', tradeId)
                .select();

            if (error) throw error;
            if (!data || data.length === 0) throw new Error("Update failed: Trade not found or permission denied.");
            return data[0] as Trade;
        },

        delete: async (tradeId: string) => {
            const { error } = await supabase
                .from('trades')
                .delete()
                .eq('id', tradeId);

            if (error) throw error;
        }
    },
    strategies: {
        list: async (userId: string) => {
            const { data, error } = await supabase
                // @ts-ignore
                .from('strategies')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as Strategy[];
        },
        create: async (strategy: Omit<Strategy, 'id' | 'created_at'>) => {
            const { data, error } = await supabase
                // @ts-ignore
                .from('strategies')
                // @ts-ignore
                .insert(strategy as any)
                .select()
                .single();

            if (error) throw error;
            return data as Strategy;
        }
    },
    imports: {
        list: async (userId: string) => {
            const { data, error } = await supabase
                // @ts-ignore
                .from('trade_imports')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data as TradeImport[];
        },
        create: async (payload: Omit<TradeImport, 'id' | 'created_at' | 'user_id'>) => {
            const { data, error } = await supabase
                // @ts-ignore
                .from('trade_imports')
                // @ts-ignore
                .insert(payload as any)
                .select()
                .single();
            if (error) throw error;
            return data as TradeImport;
        },
        update: async (importId: string, updates: Partial<TradeImport>) => {
            const { data, error } = await supabase
                // @ts-ignore
                .from('trade_imports')
                // @ts-ignore
                .update(updates as any)
                .eq('id', importId)
                .select()
                .single();
            if (error) throw error;
            return data as TradeImport;
        },
        delete: async (importId: string) => {
            const { error } = await supabase
                // @ts-ignore
                .from('trade_imports')
                .delete()
                .eq('id', importId);
            if (error) throw error;
        }
    },
    roadmap: {
        list: async (userId: string) => {
            const { data, error } = await supabase
                // @ts-ignore
                .from('roadmap_progress')
                .select('*')
                .eq('user_id', userId);
            if (error) throw error;
            return data;
        },
        toggleStep: async (userId: string, stepId: string, isCompleted: boolean) => {
            const { data, error } = await supabase
                // @ts-ignore
                .from('roadmap_progress')
                // @ts-ignore
                .upsert({
                    user_id: userId,
                    step_id: stepId,
                    is_completed: isCompleted,
                    completed_at: isCompleted ? new Date().toISOString() : null
                } as any)
                .select();
            if (error) throw error;
            return data;
        }
    },
    challenges: {
        list: async (userId: string) => {
            const { data, error } = await supabase
                // @ts-ignore
                .from('challenges')
                .select('*')
                .eq('user_id', userId);
            if (error) throw error;
            return data;
        },
        updateProgress: async (challengeId: string, value: number) => {
            const { data, error } = await supabase
                // @ts-ignore
                .from('challenges')
                // @ts-ignore
                .update({ current_value: value } as any)
                .eq('id', challengeId)
                .select();
            if (error) throw error;
            return data;
        }
    },
    brokers: {
        list: async (userId: string) => {
            const { data, error } = await supabase
                // @ts-ignore
                .from('broker_links')
                .select('*')
                .eq('user_id', userId);
            if (error) throw error;
            return data;
        },
        connect: async (userId: string, brokerName: string, apiKey: string) => {
            const { data, error } = await supabase
                // @ts-ignore
                .from('broker_links')
                // @ts-ignore
                .upsert({
                    user_id: userId,
                    broker_name: brokerName,
                    api_key: apiKey,
                    status: 'CONNECTED',
                    last_sync: new Date().toISOString()
                } as any)
                .select();
            if (error) throw error;
            return data;
        }
    },
    rules: {
        list: async (userId: string) => {
            const { data, error } = await supabase
                .from('rules')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: true });
            if (error) throw error;
            return data;
        },
        create: async (userId: string, text: string) => {
            const { data, error } = await supabase
                .from('rules')
                .insert({ user_id: userId, text } as any)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        toggle: async (id: string, completed: boolean) => {
            const { data, error } = await supabase
                .from('rules')
                .update({ completed } as never)
                .eq('id', id)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        delete: async (id: string) => {
            const { error } = await supabase
                .from('rules')
                .delete()
                .eq('id', id);
            if (error) throw error;
        }
    },
    users: {
        updateProfile: async (userId: string, updates: { full_name?: string, avatar_url?: string, phone_number?: string }) => {
            const { data, error } = await supabase
                .from('users')
                // @ts-ignore
                .update(updates as any)
                .eq('id', userId)
                .select()
                .single();

            if (error) throw error;
            return data;
        }
    }
};
