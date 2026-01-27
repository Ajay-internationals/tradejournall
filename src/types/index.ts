export interface UserProfile {
    id: string;
    email: string;
    full_name?: string;
    phone_number?: string;
    plan: 'FREE' | 'PREMIUM';
    subscription_status?: string;
    current_period_end?: string;
    total_qp?: number;
    initial_capital?: number;
    avatar_url?: string;
    experience?: string;
    referral_source?: string;
    created_at: string;
}

export type AssetClass = 'INDEX' | 'STOCKS' | 'COMMODITIES' | 'FUTURES' | 'CRYPTO';

export interface Strategy {
    id: string;
    user_id: string;
    name: string;
    description: string;
    created_at: string;
}

export interface Trade {
    id: string;
    user_id: string;
    date: string;
    instrument: string;
    asset_class: string | null;
    direction: string;
    entry_price: number;
    exit_price: number;
    quantity: number;
    fees: number;
    stop_loss: number | null;
    emotion: string | null;
    strategy: string | null;
    gross_pnl: number;
    net_pnl: number;
    tags: string[] | null;
    notes: string | null;
    import_id: string | null;
    created_at: string;
}

export interface TradeImport {
    id: string;
    user_id: string;
    filename: string;
    total_count: number;
    success_count: number;
    fail_count: number;
    created_at: string;
}

export interface TradeStats {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    profitFactor: number;
    avgWin: number;
    avgLoss: number;
    bestTrade: number;
    worstTrade: number;
    totalProfit: number;
    totalLoss: number;
    netPnl: number;
    avgPnlPerTrade: number;
    avgRR: number;
    totalInvested: number;
    maxDrawdown: number;
    expectancy: number;
    recoveryFactor: number;
    avgRiskReward: number;
}
