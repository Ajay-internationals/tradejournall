import { supabase } from './supabase';
import type { Database } from '@/types/supabase';
import { encryptToken } from './encryption';
import { BROKER_PROVIDERS } from './brokers/broker-service';
import { getRealQuantity } from './stats';

type Tables = Database['public']['Tables'];
export type Trade = Tables['trades']['Row'];
export type Strategy = Tables['strategies']['Row'];
export type TradeImport = Tables['trade_imports']['Row'];
export type BrokerLink = Tables['broker_links']['Row'];
export type Rule = Tables['rules']['Row'];

export const api = {
    trades: {
        list: async (userId: string) => {
            const { data, error } = await supabase
                .from('trades')
                .select('*')
                .eq('user_id', userId)
                .order('date', { ascending: false });

            if (error) throw error;
            return data;
        },

        create: async (trade: Tables['trades']['Insert']) => {
            const { data, error } = await supabase
                .from('trades')
                .insert(trade)
                .select()
                .single();

            if (error) throw error;
            return data;
        },

        update: async (tradeId: string, updates: Tables['trades']['Update']) => {
            const { data, error } = await supabase
                .from('trades')
                .update(updates)
                .eq('id', tradeId)
                .select()
                .single();

            if (error) throw error;
            return data;
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
                .from('strategies')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        },
        create: async (strategy: Tables['strategies']['Insert']) => {
            const { data, error } = await supabase
                .from('strategies')
                .insert(strategy)
                .select()
                .single();

            if (error) throw error;
            return data;
        }
    },
    imports: {
        list: async (userId: string) => {
            const { data, error } = await supabase
                .from('trade_imports')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data;
        },
        create: async (payload: Tables['trade_imports']['Insert']) => {
            const { data, error } = await supabase
                .from('trade_imports')
                .insert(payload)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        update: async (importId: string, updates: Tables['trade_imports']['Update']) => {
            const { data, error } = await supabase
                .from('trade_imports')
                .update(updates)
                .eq('id', importId)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        delete: async (importId: string) => {
            const { error } = await supabase
                .from('trade_imports')
                .delete()
                .eq('id', importId);
            if (error) throw error;
        }
    },
    roadmap: {
        list: async (userId: string) => {
            const { data, error } = await supabase
                .from('roadmap_progress')
                .select('*')
                .eq('user_id', userId);
            if (error) throw error;
            return data;
        },
        toggleStep: async (userId: string, stepId: string, isCompleted: boolean) => {
            const { data, error } = await supabase
                .from('roadmap_progress')
                .upsert({
                    user_id: userId,
                    step_id: stepId,
                    is_completed: isCompleted,
                    completed_at: isCompleted ? new Date().toISOString() : null
                })
                .select();
            if (error) throw error;
            return data;
        }
    },
    challenges: {
        list: async (userId: string) => {
            const { data, error } = await supabase
                .from('challenges')
                .select('*')
                .eq('user_id', userId);
            if (error) throw error;
            return data;
        },
        updateProgress: async (challengeId: string, value: number) => {
            const { data, error } = await supabase
                .from('challenges')
                .update({ current_value: value })
                .eq('id', challengeId)
                .select();
            if (error) throw error;
            return data;
        }
    },
    /* brokers: {
        list: async (userId: string) => {
            const { data, error } = await supabase
                .from('broker_links')
                .select('*')
                .eq('user_id', userId);
            if (error) throw error;
            return data;
        },
        connect: async (userId: string, brokerName: string, apiKey: string) => {
            const encryptedKey = encryptToken(apiKey);
            const { data, error } = await supabase
                .from('broker_links')
                .upsert({
                    user_id: userId,
                    broker_name: brokerName,
                    api_key: encryptedKey,
                    status: 'CONNECTED',
                    last_sync: new Date().toISOString()
                })
                .select();
            if (error) throw error;
            return data;
        },
        sync: async (userId: string, brokerName: string) => {
            const { data: connection, error: connError } = await supabase
                .from('broker_links')
                .select('*')
                .eq('user_id', userId)
                .eq('broker_name', brokerName)
                .single();

            if (connError || !connection) throw new Error("Broker not connected");

            const { data: existingTrades, error: tradesError } = await supabase
                .from('trades')
                .select('*')
                .eq('user_id', userId);

            if (tradesError) throw tradesError;

            const provider = BROKER_PROVIDERS[brokerName];
            if (!provider) throw new Error(`Provider for ${brokerName} not found`);

            const newTrades = await provider.syncTrades(connection.api_key, existingTrades || []);

            if (newTrades.length === 0) return { count: 0 };

            const tradesToInsert = newTrades.map(t => ({
                ...t,
                user_id: userId,
                emotion: 'UNDEFINED',
                tags: [],
                fees: 0
            }));
            const { error: insertError } = await supabase
                .from('trades')
                .insert(tradesToInsert as any);

            if (insertError) throw insertError;

            await supabase
                .from('broker_links')
                .update({ last_sync: new Date().toISOString() })
                .eq('id', connection.id);

            return { count: newTrades.length };
        },
        getSyncLogs: async (userId: string) => {
            // Placeholder for fetching sync activity logs
            // Ideally we'd have a separate table broker_sync_logs
            return [];
        }
    }, */
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
                .insert({ user_id: userId, text })
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        toggle: async (id: string, completed: boolean) => {
            const { data, error } = await supabase
                .from('rules')
                .update({ completed })
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
        updateProfile: async (userId: string, updates: Tables['users']['Update']) => {
            const { data, error } = await supabase
                .from('users')
                .update(updates)
                .eq('id', userId)
                .select()
                .single();

            if (error) throw error;
            return data;
        }
    }
};
