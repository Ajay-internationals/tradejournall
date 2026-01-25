export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    avatar_url: string | null
                    plan: 'FREE' | 'PREMIUM'
                    created_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    avatar_url?: string | null
                    plan?: 'FREE' | 'PREMIUM'
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    avatar_url?: string | null
                    plan?: 'FREE' | 'PREMIUM'
                    created_at?: string
                }
            }
            trades: {
                Row: {
                    id: string
                    user_id: string
                    date: string
                    instrument: string
                    direction: 'LONG' | 'SHORT'
                    entry_price: number
                    exit_price: number
                    quantity: number
                    fees: number
                    gross_pnl: number
                    net_pnl: number
                    tags: string[] | null
                    notes: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    date: string
                    instrument: string
                    direction: 'LONG' | 'SHORT'
                    entry_price: number
                    exit_price: number
                    quantity: number
                    fees: number
                    gross_pnl: number
                    net_pnl: number
                    tags?: string[] | null
                    notes?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    date?: string
                    instrument?: string
                    direction?: 'LONG' | 'SHORT'
                    entry_price?: number
                    exit_price?: number
                    quantity?: number
                    fees?: number
                    gross_pnl?: number
                    net_pnl?: number
                    tags?: string[] | null
                    notes?: string | null
                    created_at?: string
                }
            }
        }
    }
}
