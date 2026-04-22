import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';
import { Stock } from '@/data/stocks';
import { useTrading } from '@/contexts/TradingContext';

interface Props { stock: Stock }

const StockCard: React.FC<Props> = ({ stock }) => {
  const navigate = useNavigate();
  const { watchlist, addToWatchlist, removeFromWatchlist } = useTrading();
  const inWatchlist = watchlist.includes(stock.symbol);
  const isPositive = stock.changePercent >= 0;

  const toggleWatch = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWatchlist) removeFromWatchlist(stock.symbol);
    else addToWatchlist(stock.symbol);
  };

  return (
    <div
      onClick={() => navigate(`/stock/${stock.symbol}`)}
      className="group bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Company Logo */}
          <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
            {stock.logo && stock.logo !== 'https://logo.clearbit.com/null' ? (
              <img 
                src={stock.logo} 
                alt={stock.symbol}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <span className="hidden text-sm font-bold">{stock.symbol.charAt(0)}</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-white font-semibold text-sm truncate">{stock.symbol}</div>
            <div className="text-slate-400 text-xs truncate">{stock.name}</div>
          </div>
        </div>
        <button onClick={toggleWatch} className="p-1 hover:bg-slate-700 rounded transition-colors">
          <Star className={`w-4 h-4 ${inWatchlist ? 'fill-yellow-400 text-yellow-400' : 'text-slate-500'}`} />
        </button>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="text-white font-bold text-lg">₹{stock.price.toFixed(2)}</div>
          <div className={`text-xs font-medium flex items-center gap-1 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500">Vol</div>
          <div className="text-xs text-slate-300">{stock.volume}</div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs">
        <span className="text-slate-500">{stock.sector}</span>
        <span className="text-slate-400">MCap {stock.marketCap}</span>
      </div>
    </div>
  );
};

export default StockCard;
