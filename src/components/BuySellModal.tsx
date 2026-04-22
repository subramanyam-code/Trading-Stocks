import React, { useState } from 'react';
import { X, Plus, Minus, AlertCircle } from 'lucide-react';
import { Stock } from '@/data/stocks';
import { useTrading } from '@/contexts/TradingContext';

interface Props {
  stock: Stock;
  mode: 'BUY' | 'SELL';
  open: boolean;
  onClose: () => void;
}

const BuySellModal: React.FC<Props> = ({ stock, mode, open, onClose }) => {
  const { walletBalance, buyStock, sellStock, holdings, profile } = useTrading();
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');

  if (!open) return null;

  const total = stock.price * quantity;
  const holding = holdings.find(h => h.symbol === stock.symbol);
  const maxSell = holding?.quantity || 0;
  const insufficient = mode === 'BUY' ? total > walletBalance : quantity > maxSell;

  const handleSubmit = () => {
    if (!profile.isAuthenticated) {
      return;
    }
    const ok = mode === 'BUY' ? buyStock(stock.symbol, quantity) : sellStock(stock.symbol, quantity);
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className={`p-5 border-b border-slate-800 flex items-center justify-between ${mode === 'BUY' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
          <div>
            <h2 className="text-xl font-bold text-white">{mode} {stock.symbol}</h2>
            <p className="text-slate-400 text-xs mt-0.5">{stock.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex justify-between items-center bg-slate-800 rounded-lg p-3">
            <span className="text-slate-400 text-sm">LTP</span>
            <span className="text-white font-bold text-lg">₹{stock.price.toFixed(2)}</span>
          </div>

          <div className="flex gap-2">
            {(['MARKET', 'LIMIT'] as const).map(t => (
              <button key={t} onClick={() => setOrderType(t)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${orderType === t ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {t}
              </button>
            ))}
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Quantity</label>
            <div className="flex items-center gap-2">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg text-white">
                <Minus className="w-4 h-4" />
              </button>
              <input type="number" min={1} value={quantity} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 bg-slate-800 border border-slate-700 text-white text-center rounded-lg py-2 focus:outline-none focus:border-emerald-500" />
              <button onClick={() => setQuantity(quantity + 1)} className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg text-white">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {mode === 'SELL' && (
              <div className="text-xs text-slate-500 mt-1">You own {maxSell} shares</div>
            )}
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Price × Qty</span>
              <span className="text-white">₹{stock.price.toFixed(2)} × {quantity}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Brokerage</span>
              <span className="text-white">₹0.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Taxes & charges</span>
              <span className="text-white">₹{(total * 0.001).toFixed(2)}</span>
            </div>
            <div className="border-t border-slate-700 pt-2 flex justify-between">
              <span className="text-white font-semibold">Total</span>
              <span className="text-white font-bold">₹{(total + total * 0.001).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between text-xs text-slate-400">
            <span>Wallet Balance</span>
            <span>₹{walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>

          {insufficient && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {mode === 'BUY' ? 'Insufficient wallet balance' : 'Insufficient shares to sell'}
            </div>
          )}

          {!profile.isAuthenticated && (
            <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-yellow-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              Please sign in to place orders
            </div>
          )}

          <button onClick={handleSubmit} disabled={insufficient || !profile.isAuthenticated}
            className={`w-full py-3 rounded-lg font-semibold text-white transition ${
              mode === 'BUY' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}>
            {mode} {quantity} {quantity === 1 ? 'Share' : 'Shares'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuySellModal;
