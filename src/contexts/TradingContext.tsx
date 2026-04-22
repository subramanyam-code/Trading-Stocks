import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { INITIAL_STOCKS, Stock, PriceHistory } from '@/data/stocks';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Holding {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
}

export interface Transaction {
  id: string;
  symbol: string;
  name: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  total: number;
  timestamp: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  isPrimary: boolean;
}

export interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: 'OPEN' | 'RESOLVED' | 'IN_PROGRESS';
  createdAt: number;
}

export interface StockQuote {
  price?: number;
  change?: number;
  changePercent?: number;
  open?: number;
  high?: number;
  low?: number;
  previousClose?: number;
  exchange?: string;
  volume?: string;
}

interface TradingContextType {
  stocks: Stock[];
  holdings: Holding[];
  transactions: Transaction[];
  watchlist: string[];
  walletBalance: number;
  bankAccounts: BankAccount[];
  supportTickets: SupportTicket[];
  profile: UserProfile;
  searchQuery: string;
  isLiveData: boolean;
  lastSyncedAt: number | null;
  setSearchQuery: (q: string) => void;
  buyStock: (symbol: string, quantity: number) => boolean;
  sellStock: (symbol: string, quantity: number) => boolean;
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  addMoney: (amount: number) => void;
  withdrawMoney: (amount: number) => boolean;
  addBankAccount: (bank: Omit<BankAccount, 'id'>) => void;
  removeBankAccount: (id: string) => void;
  createTicket: (subject: string, message: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  login: (email: string, name: string) => void;
  logout: () => void;
  getStock: (symbol: string) => Stock | undefined;
  getPortfolioValue: () => { invested: number; current: number; pnl: number; pnlPercent: number };
  refreshQuote: (symbol: string) => Promise<Stock | null>;
  fetchHistory: (symbol: string, interval?: string, outputsize?: number) => Promise<PriceHistory[]>;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export const useTrading = () => {
  const ctx = useContext(TradingContext);
  if (!ctx) throw new Error('useTrading must be used within TradingProvider');
  return ctx;
};

const STORAGE_KEY = 'stocktrade_data_v2';

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // Ignore invalid localStorage data
  }
  return null;
};

const generateReferralCode = () => 'TRADE' + Math.random().toString(36).substring(2, 8).toUpperCase();

// Symbols to refresh in each batch (top popular to conserve API quota)
const HOT_SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'NFLX'];

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const saved = loadState();

  const [stocks, setStocks] = useState<Stock[]>(INITIAL_STOCKS);
  const [holdings, setHoldings] = useState<Holding[]>(saved?.holdings || []);
  const [transactions, setTransactions] = useState<Transaction[]>(saved?.transactions || []);
  const [watchlist, setWatchlist] = useState<string[]>(saved?.watchlist || ['AAPL', 'MSFT', 'GOOGL', 'NVDA']);
  const [walletBalance, setWalletBalance] = useState<number>(saved?.walletBalance ?? 10000);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(saved?.bankAccounts || []);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(saved?.supportTickets || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLiveData, setIsLiveData] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
  const [profile, setProfile] = useState<UserProfile>(saved?.profile || {
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    phone: '+91 98765 43210',
    pan: 'ABCDE1234F',
    joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 180,
    referralCode: generateReferralCode(),
    isAuthenticated: false,
  });

  // Persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      holdings, transactions, watchlist, walletBalance, bankAccounts, supportTickets, profile,
    }));
  }, [holdings, transactions, watchlist, walletBalance, bankAccounts, supportTickets, profile]);

  // Apply a fresh quote to the stocks list
  const applyQuote = useCallback((symbol: string, q: StockQuote) => {
    setStocks(prev => prev.map(s => s.symbol === symbol ? {
      ...s,
      price: q.price || s.price,
      change: q.change ?? s.change,
      changePercent: q.changePercent ?? s.changePercent,
      open: q.open,
      high: q.high,
      low: q.low,
      previousClose: q.previousClose,
      exchange: q.exchange,
      volume: q.volume ? formatVolume(q.volume) : s.volume,
    } : s));
  }, []);

  const refreshQuote = useCallback(async (symbol: string): Promise<Stock | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('get-stock-quote', {
        body: { symbol },
      });
      if (error || !data || data.error) {
        console.warn('Quote fetch failed for', symbol, error || data?.error);
        return null;
      }
      applyQuote(symbol, data);
      setIsLiveData(true);
      setLastSyncedAt(Date.now());
      return stocks.find(s => s.symbol === symbol) || null;
    } catch (e) {
      console.error('refreshQuote error:', e);
      return null;
    }
  }, [applyQuote, stocks]);

  // Batch refresh hot symbols + held symbols + watchlist
  const batchRefresh = useCallback(async () => {
    try {
      const targets = Array.from(new Set([
        ...HOT_SYMBOLS,
        ...holdings.map(h => h.symbol),
        ...watchlist,
      ])).slice(0, 15);
      if (targets.length === 0) return;

      const { data, error } = await supabase.functions.invoke('get-stock-quote', {
        body: { symbols: targets.join(',') },
      });
      if (error || !data) {
        console.warn('Batch refresh failed', error);
        // Simulate price changes when API fails
        setStocks(prev => prev.map(s => {
          if (targets.includes(s.symbol)) {
            const change = (Math.random() - 0.5) * 0.02 * s.price; // ±1% change
            const newPrice = Math.max(0.01, s.price + change);
            const newChange = newPrice - s.price;
            const newChangePercent = (newChange / s.price) * 100;
            return {
              ...s,
              price: parseFloat(newPrice.toFixed(2)),
              change: parseFloat(newChange.toFixed(2)),
              changePercent: parseFloat(newChangePercent.toFixed(2)),
            };
          }
          return s;
        }));
        setIsLiveData(false);
        setLastSyncedAt(Date.now());
        return;
      }

      // Response is { quotes: { SYM: {...}, ... } } or a single quote object if only 1 symbol
      if (data.quotes) {
        setStocks(prev => prev.map(s => {
          const q = data.quotes[s.symbol];
          if (!q) return s;
          return {
            ...s,
            price: q.price || s.price,
            change: q.change ?? s.change,
            changePercent: q.changePercent ?? s.changePercent,
            open: q.open, high: q.high, low: q.low,
            previousClose: q.previousClose,
            exchange: q.exchange,
            volume: q.volume ? formatVolume(q.volume) : s.volume,
          };
        }));
      } else if (data.symbol) {
        applyQuote(data.symbol, data);
      }
      setIsLiveData(true);
      setLastSyncedAt(Date.now());
    } catch (e) {
      console.error('batchRefresh error:', e);
      // Simulate price changes on error
      setStocks(prev => prev.map(s => {
        const change = (Math.random() - 0.5) * 0.02 * s.price; // ±1% change
        const newPrice = Math.max(0.01, s.price + change);
        const newChange = newPrice - s.price;
        const newChangePercent = (newChange / s.price) * 100;
        return {
          ...s,
          price: parseFloat(newPrice.toFixed(2)),
          change: parseFloat(newChange.toFixed(2)),
          changePercent: parseFloat(newChangePercent.toFixed(2)),
        };
      }));
      setIsLiveData(false);
      setLastSyncedAt(Date.now());
    }
  }, [holdings, watchlist, applyQuote]);

  // Initial load + interval refresh (every 5s for real-time feel)
  const firstLoad = useRef(true);
  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      batchRefresh();
    }
    const interval = setInterval(batchRefresh, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchHistory = useCallback(async (symbol: string, interval = '1day', outputsize = 30): Promise<PriceHistory[]> => {
    try {
      const { data, error } = await supabase.functions.invoke('get-stock-history', {
        body: { symbol, interval, outputsize },
      });
      if (error || !data || data.error) {
        console.warn('History fetch failed:', error || data?.error);
        return [];
      }
      return data.history || [];
    } catch (e) {
      console.error('fetchHistory error:', e);
      return [];
    }
  }, []);

  // Sync holdings current prices
  useEffect(() => {
    setHoldings(prev => prev.map(h => {
      const stock = stocks.find(s => s.symbol === h.symbol);
      return stock ? { ...h, currentPrice: stock.price } : h;
    }));
  }, [stocks]);

  const getStock = useCallback((symbol: string) => stocks.find(s => s.symbol === symbol), [stocks]);

  const buyStock = (symbol: string, quantity: number) => {
    const stock = getStock(symbol);
    if (!stock) return false;
    const total = stock.price * quantity;
    if (total > walletBalance) {
      toast.error('Insufficient wallet balance');
      return false;
    }
    setWalletBalance(b => b - total);
    setHoldings(prev => {
      const existing = prev.find(h => h.symbol === symbol);
      if (existing) {
        const newQty = existing.quantity + quantity;
        const newAvg = (existing.avgPrice * existing.quantity + stock.price * quantity) / newQty;
        return prev.map(h => h.symbol === symbol ? { ...h, quantity: newQty, avgPrice: newAvg, currentPrice: stock.price } : h);
      }
      return [...prev, { symbol, name: stock.name, quantity, avgPrice: stock.price, currentPrice: stock.price }];
    });
    const tx: Transaction = {
      id: 'TXN' + Date.now(), symbol, name: stock.name, type: 'BUY', quantity,
      price: stock.price, total, timestamp: Date.now(), status: 'COMPLETED',
    };
    setTransactions(prev => [tx, ...prev]);
    toast.success(`Bought ${quantity} shares of ${symbol} @ ₹${stock.price.toFixed(2)}`);
    return true;
  };

  const sellStock = (symbol: string, quantity: number) => {
    const stock = getStock(symbol);
    if (!stock) return false;
    const holding = holdings.find(h => h.symbol === symbol);
    if (!holding || holding.quantity < quantity) {
      toast.error('Insufficient shares to sell');
      return false;
    }
    const total = stock.price * quantity;
    setWalletBalance(b => b + total);
    setHoldings(prev => {
      const updated = prev.map(h => h.symbol === symbol ? { ...h, quantity: h.quantity - quantity } : h);
      return updated.filter(h => h.quantity > 0);
    });
    const tx: Transaction = {
      id: 'TXN' + Date.now(), symbol, name: stock.name, type: 'SELL', quantity,
      price: stock.price, total, timestamp: Date.now(), status: 'COMPLETED',
    };
    setTransactions(prev => [tx, ...prev]);
    toast.success(`Sold ${quantity} shares of ${symbol} @ ₹${stock.price.toFixed(2)}`);
    return true;
  };

  const addToWatchlist = (symbol: string) => {
    setWatchlist(prev => prev.includes(symbol) ? prev : [...prev, symbol]);
    toast.success(`${symbol} added to watchlist`);
  };
  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(prev => prev.filter(s => s !== symbol));
    toast.success(`${symbol} removed from watchlist`);
  };
  const addMoney = (amount: number) => {
    setWalletBalance(b => b + amount);
    toast.success(`₹${amount.toLocaleString('en-IN')} added to wallet`);
  };
  const withdrawMoney = (amount: number) => {
    if (amount > walletBalance) { toast.error('Insufficient balance'); return false; }
    setWalletBalance(b => b - amount);
    toast.success(`₹${amount.toLocaleString('en-IN')} withdrawal initiated`);
    return true;
  };
  const addBankAccount = (bank: Omit<BankAccount, 'id'>) => {
    setBankAccounts(prev => [...prev, { ...bank, id: 'BANK' + Date.now() }]);
    toast.success('Bank account added');
  };
  const removeBankAccount = (id: string) => setBankAccounts(prev => prev.filter(b => b.id !== id));
  const createTicket = (subject: string, message: string) => {
    const ticket: SupportTicket = { id: 'TKT' + Date.now(), subject, message, status: 'OPEN', createdAt: Date.now() };
    setSupportTickets(prev => [ticket, ...prev]);
    toast.success('Support ticket created');
  };
  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
    toast.success('Profile updated');
  };
  const login = (email: string, name: string) => {
    setProfile(prev => ({ ...prev, email, name, isAuthenticated: true }));
    toast.success(`Welcome back, ${name}!`);
  };
  const logout = () => {
    setProfile(prev => ({ ...prev, isAuthenticated: false }));
    toast.success('Logged out');
  };
  const getPortfolioValue = () => {
    const invested = holdings.reduce((sum, h) => sum + h.avgPrice * h.quantity, 0);
    const current = holdings.reduce((sum, h) => sum + h.currentPrice * h.quantity, 0);
    const pnl = current - invested;
    const pnlPercent = invested > 0 ? (pnl / invested) * 100 : 0;
    return { invested, current, pnl, pnlPercent };
  };

  return (
    <TradingContext.Provider value={{
      stocks, holdings, transactions, watchlist, walletBalance, bankAccounts, supportTickets, profile,
      searchQuery, isLiveData, lastSyncedAt, setSearchQuery,
      buyStock, sellStock, addToWatchlist, removeFromWatchlist,
      addMoney, withdrawMoney, addBankAccount, removeBankAccount,
      createTicket, updateProfile, login, logout, getStock, getPortfolioValue,
      refreshQuote, fetchHistory,
    }}>
      {children}
    </TradingContext.Provider>
  );
};

function formatVolume(vol: number): string {
  if (vol >= 1e9) return (vol / 1e9).toFixed(1) + 'B';
  if (vol >= 1e6) return (vol / 1e6).toFixed(1) + 'M';
  if (vol >= 1e3) return (vol / 1e3).toFixed(1) + 'K';
  return vol.toString();
}
