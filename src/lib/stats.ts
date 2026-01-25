import type { Trade, TradeStats } from '@/types';

/**
 * Calculates trading statistics with support for Lot Sizes and dynamic Capital tracking.
 */
export function calculateStats(trades: Trade[], masterCapital: number = 0): TradeStats {
    const baseStats = {
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        winRate: 0,
        profitFactor: 0,
        avgWin: 0,
        avgLoss: 0,
        bestTrade: 0,
        worstTrade: 0,
        totalProfit: 0,
        totalLoss: 0,
        netPnl: 0,
        avgPnlPerTrade: 0,
        avgRR: 0,
        totalInvested: masterCapital, // This acts as our "Baseline"
    };

    if (!trades.length) return baseStats;

    const totalTrades = trades.length;
    const wins = trades.filter((t) => t.net_pnl > 0);
    const losses = trades.filter((t) => t.net_pnl <= 0);

    const winningTrades = wins.length;
    const losingTrades = losses.length;
    const winRate = (winningTrades / totalTrades) * 100;

    const totalProfit = wins.reduce((acc, t) => acc + t.net_pnl, 0);
    const totalLoss = Math.abs(losses.reduce((acc, t) => acc + t.net_pnl, 0));
    const netPnl = totalProfit - totalLoss;

    const profitFactor = totalLoss === 0 ? totalProfit : totalProfit / totalLoss;
    const avgWin = winningTrades ? totalProfit / winningTrades : 0;
    const avgLoss = losingTrades ? totalLoss / losingTrades : 0;

    const avgPnlPerTrade = netPnl / totalTrades;
    const bestTrade = Math.max(...trades.map((t) => t.net_pnl));
    const worstTrade = Math.min(...trades.map((t) => t.net_pnl));

    const rMultiples = trades.map(t => {
        if (!t.stop_loss || t.stop_loss === t.entry_price) return 0;
        const risk = t.direction === 'LONG' ? Math.abs(t.entry_price - t.stop_loss) : Math.abs(t.stop_loss - t.entry_price);
        const reward = t.direction === 'LONG' ? (t.exit_price - t.entry_price) : (t.entry_price - t.exit_price);
        return reward / risk;
    }).filter(r => !isNaN(r) && isFinite(r));

    const avgRR = rMultiples.length > 0 ? rMultiples.reduce((a, b) => a + b, 0) / rMultiples.length : 0;

    return {
        totalTrades,
        winningTrades,
        losingTrades,
        winRate,
        profitFactor,
        avgWin,
        avgLoss,
        bestTrade,
        worstTrade,
        totalProfit,
        totalLoss,
        netPnl,
        avgPnlPerTrade,
        avgRR,
        // The user wants "calculated properly" - we show Capital + PnL as the Active Balance
        totalInvested: masterCapital + netPnl,
    };
}

/**
 * Utility to calculate real quantity based on Lot Sizes for Indian Indices
 */
export function getRealQuantity(symbol: string, quantity: number): number {
    const sym = symbol.toUpperCase();

    // If the quantity is already a lot-size (e.g. 50, 75, 25), we don't multiply
    // This handles users who PASTE real quantities vs users who ENTER lot counts
    if (quantity >= 10) return quantity;

    if (sym.includes('NIFTY')) return quantity * 65;
    if (sym.includes('SENSEX')) return quantity * 20;
    if (sym.includes('BANKNIFTY')) return quantity * 15;
    if (sym.includes('FINNIFTY')) return quantity * 25;

    return quantity;
}

export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
}
