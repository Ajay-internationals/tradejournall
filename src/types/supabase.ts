export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: "14.1"
    }
    public: {
        Tables: {
            broker_links: {
                Row: {
                    api_key: string | null
                    broker_name: string
                    id: string
                    last_sync: string | null
                    status: string | null
                    user_id: string | null
                }
                Insert: {
                    api_key?: string | null
                    broker_name: string
                    id?: string
                    last_sync?: string | null
                    status?: string | null
                    user_id?: string | null
                }
                Update: {
                    api_key?: string | null
                    broker_name?: string
                    id?: string
                    last_sync?: string | null
                    status?: string | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "broker_links_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            challenges: {
                Row: {
                    created_at: string | null
                    current_value: number | null
                    id: string
                    reward_qp: number | null
                    status: string | null
                    target_value: number
                    title: string
                    type: string
                    user_id: string | null
                }
                Insert: {
                    created_at?: string | null
                    current_value?: number | null
                    id?: string
                    reward_qp?: number | null
                    status?: string | null
                    target_value: number
                    title: string
                    type: string
                    user_id?: string | null
                }
                Update: {
                    created_at?: string | null
                    current_value?: number | null
                    id?: string
                    reward_qp?: number | null
                    status?: string | null
                    target_value?: number
                    title?: string
                    type?: string
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "challenges_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            mistakes: {
                Row: {
                    count: number | null
                    created_at: string | null
                    description: string | null
                    id: string
                    last_occurrence: string | null
                    severity: string | null
                    title: string
                    user_id: string | null
                }
                Insert: {
                    count?: number | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    last_occurrence?: string | null
                    severity?: string | null
                    title: string
                    user_id?: string | null
                }
                Update: {
                    count?: number | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    last_occurrence?: string | null
                    severity?: string | null
                    title?: string
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "mistakes_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            partner_inquiries: {
                Row: {
                    broker: string | null
                    created_at: string | null
                    email: string
                    id: string
                    message: string | null
                    name: string
                    status: string | null
                }
                Insert: {
                    broker?: string | null
                    created_at?: string | null
                    email: string
                    id?: string
                    message?: string | null
                    name: string
                    status?: string | null
                }
                Update: {
                    broker?: string | null
                    created_at?: string | null
                    email?: string
                    id?: string
                    message?: string | null
                    name?: string
                    status?: string | null
                }
                Relationships: []
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    created_at: string | null
                    email: string | null
                    full_name: string | null
                    id: string
                    plan: string | null
                    role: string | null
                    updated_at: string | null
                }
                Insert: {
                    avatar_url?: string | null
                    created_at?: string | null
                    email?: string | null
                    full_name?: string | null
                    id: string
                    plan?: string | null
                    role?: string | null
                    updated_at?: string | null
                }
                Update: {
                    avatar_url?: string | null
                    created_at?: string | null
                    email?: string | null
                    full_name?: string | null
                    id?: string
                    plan?: string | null
                    role?: string | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            roadmap_progress: {
                Row: {
                    completed_at: string | null
                    id: string
                    is_completed: boolean | null
                    step_id: string
                    user_id: string | null
                }
                Insert: {
                    completed_at?: string | null
                    id?: string
                    is_completed?: boolean | null
                    step_id: string
                    user_id?: string | null
                }
                Update: {
                    completed_at?: string | null
                    id?: string
                    is_completed?: boolean | null
                    step_id?: string
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "roadmap_progress_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            rules: {
                Row: {
                    completed: boolean | null
                    created_at: string | null
                    id: string
                    text: string
                    type: string | null
                    user_id: string | null
                }
                Insert: {
                    completed?: boolean | null
                    created_at?: string | null
                    id?: string
                    text: string
                    type?: string | null
                    user_id?: string | null
                }
                Update: {
                    completed?: boolean | null
                    created_at?: string | null
                    id?: string
                    text?: string
                    type?: string | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "rules_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            strategies: {
                Row: {
                    created_at: string | null
                    description: string | null
                    id: string
                    is_active: boolean | null
                    name: string
                    rules: string[] | null
                    user_id: string | null
                }
                Insert: {
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    is_active?: boolean | null
                    name: string
                    rules?: string[] | null
                    user_id?: string | null
                }
                Update: {
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    is_active?: boolean | null
                    name?: string
                    rules?: string[] | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "strategies_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            trade_imports: {
                Row: {
                    broker: string | null
                    created_at: string | null
                    id: string
                    status: string | null
                    trade_count: number | null
                    user_id: string | null
                }
                Insert: {
                    broker?: string | null
                    created_at?: string | null
                    id?: string
                    status?: string | null
                    trade_count?: number | null
                    user_id?: string | null
                }
                Update: {
                    broker?: string | null
                    created_at?: string | null
                    id?: string
                    status?: string | null
                    trade_count?: number | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "trade_imports_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            trades: {
                Row: {
                    attachment_url: string | null
                    created_at: string | null
                    date: string
                    direction: string
                    emotion: string | null
                    exit_price: number | null
                    fees: number | null
                    id: string
                    instrument: string
                    net_pnl: number
                    notes: string | null
                    order_id: string | null
                    price: number
                    quantity: number
                    stop_loss: number | null
                    strategy_id: string | null
                    tags: string[] | null
                    target: number | null
                    user_id: string | null
                }
                Insert: {
                    attachment_url?: string | null
                    created_at?: string | null
                    date: string
                    direction: string
                    emotion?: string | null
                    exit_price?: number | null
                    fees?: number | null
                    id?: string
                    instrument: string
                    net_pnl: number
                    notes?: string | null
                    order_id?: string | null
                    price: number
                    quantity: number
                    stop_loss?: number | null
                    strategy_id?: string | null
                    tags?: string[] | null
                    target?: number | null
                    user_id?: string | null
                }
                Update: {
                    attachment_url?: string | null
                    created_at?: string | null
                    date?: string
                    direction?: string
                    emotion?: string | null
                    exit_price?: number | null
                    fees?: number | null
                    id?: string
                    instrument?: string
                    net_pnl?: number
                    notes?: string | null
                    order_id?: string | null
                    price?: number
                    quantity?: number
                    stop_loss?: number | null
                    strategy_id?: string | null
                    tags?: string[] | null
                    target?: number | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "trades_strategy_id_fkey"
                        columns: ["strategy_id"]
                        isOneToOne: false
                        referencedRelation: "strategies"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "trades_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            user_challenges: {
                Row: {
                    challenge_id: string | null
                    completed_at: string | null
                    id: string
                    progress_value: number | null
                    status: string | null
                    user_id: string | null
                }
                Insert: {
                    challenge_id?: string | null
                    completed_at?: string | null
                    id?: string
                    progress_value?: number | null
                    status?: string | null
                    user_id?: string | null
                }
                Update: {
                    challenge_id?: string | null
                    completed_at?: string | null
                    id?: string
                    progress_value?: number | null
                    status?: string | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "user_challenges_challenge_id_fkey"
                        columns: ["challenge_id"]
                        isOneToOne: false
                        referencedRelation: "challenges"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "user_challenges_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            user_daily_tasks: {
                Row: {
                    completed_at: string | null
                    id: string
                    is_completed: boolean | null
                    task_id: string
                    user_id: string | null
                }
                Insert: {
                    completed_at?: string | null
                    id?: string
                    is_completed?: boolean | null
                    task_id: string
                    user_id?: string | null
                }
                Update: {
                    completed_at?: string | null
                    id?: string
                    is_completed?: boolean | null
                    task_id?: string
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "user_daily_tasks_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            users: {
                Row: {
                    created_at: string | null
                    email: string
                    full_name: string | null
                    id: string
                    initial_capital: number | null
                    last_login: string | null
                    plan: string | null
                    role: string | null
                    subscription_end: string | null
                    subscription_status: string | null
                }
                Insert: {
                    created_at?: string | null
                    email: string
                    full_name?: string | null
                    id: string
                    initial_capital?: number | null
                    last_login?: string | null
                    plan?: string | null
                    role?: string | null
                    subscription_end?: string | null
                    subscription_status?: string | null
                }
                Update: {
                    created_at?: string | null
                    email?: string
                    full_name?: string | null
                    id?: string
                    initial_capital?: number | null
                    last_login?: string | null
                    plan?: string | null
                    role?: string | null
                    subscription_end?: string | null
                    subscription_status?: string | null
                }
                Relationships: []
            }
            webinar_registrations: {
                Row: {
                    created_at: string | null
                    email: string | null
                    id: string
                    name: string
                    webinar_date: string
                    whatsapp: string
                }
                Insert: {
                    created_at?: string | null
                    email?: string | null
                    id?: string
                    name: string
                    webinar_date: string
                    whatsapp: string
                }
                Update: {
                    created_at?: string | null
                    email?: string | null
                    id?: string
                    name?: string
                    webinar_date?: string
                    whatsapp?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type PublicSchema = Database['public']

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
