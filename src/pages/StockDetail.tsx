import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PriceHistory } from '@/data/stocks';
import { ArrowLeft, Star, TrendingUp, TrendingDown, Loader2, Wifi } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import PageLayout from '@/components/PageLayout';
import BuySellModal from '@/components/BuySellModal';
import { useTrading } from '@/contexts/TradingContext';

type RangeKey = '1D' | '1W' | '1M' | '3M' | '1Y';

const RANGE_CONFIG: Record<RangeKey, { interval: string; outputsize: number }> = {
  '1D': { interval: '5min', outputsize: 78 },   // ~1 trading day (6.5h × 12)
  '1W': { interval: '30min', outputsize: 91 },  // ~5 trading days
  '1M': { interval: '1day', outputsize: 22 },
  '3M': { interval: '1day', outputsize: 65 },
  '1Y': { interval: '1week', outputsize: 52 },
};

const StockDetail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const { getStock, watchlist, addToWatchlist, removeFromWatchlist, holdings, fetchHistory, refreshQuote } = useTrading();
  const [modal, setModal] = useState<'BUY' | 'SELL' | null>(null);
  const [range, setRange] = useState<RangeKey>('1M');
  const [history, setHistory] = useState<PriceHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingQuote, setLoadingQuote] = useState(false);

  const stock = getStock(symbol || '');

  // Refresh live quote on mount
  useEffect(() => {
    if (!symbol) return;
    setLoadingQuote(true);
    refreshQuote(symbol).finally(() => setLoadingQuote(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol]);

  // Fetch historical data when symbol or range changes
  useEffect(() => {
    if (!symbol) return;
    setLoadingHistory(true);
    const cfg = RANGE_CONFIG[range];
    fetchHistory(symbol, cfg.interval, cfg.outputsize).then(data => {
      setHistory(data);
    }).finally(() => setLoadingHistory(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol, range]);

  if (!stock) {
    return (
      <PageLayout>
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl text-white mb-4">Stock not found</h2>
          <button onClick={() => navigate('/')} className="text-emerald-400 hover:underline">Back to home</button>
        </div>
      </PageLayout>
    );
  }

  const inWatchlist = watchlist.includes(stock.symbol);
  const holding = holdings.find(h => h.symbol === stock.symbol);
  const isPositive = stock.changePercent >= 0;

  // Format X axis ticks based on range
  const formatXAxis = (v: string) => {
    if (!v) return '';
    if (range === '1D' || range === '1W') {
      const d = new Date(v);
      return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
    }
    const parts = v.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}`;
    return v;
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                    {stock.symbol.charAt(0)}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">{stock.name}</h1>
                    <div className="text-sm text-slate-400 flex items-center gap-2 flex-wrap">
                      <span>{stock.exchange || 'NASDAQ'}: {stock.symbol}</span>
                      <span>•</span>
                      <span>{stock.sector}</span>
                      {loadingQuote && <Loader2 className="w-3 h-3 animate-spin text-emerald-400" />}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => inWatchlist ? removeFromWatchlist(stock.symbol) : addToWatchlist(stock.symbol)}
                  className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg text-sm"
                >
                  <Star className={`w-4 h-4 ${inWatchlist ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                  {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                </button>
              </div>
              <div className="flex items-end gap-3">
                <div className="text-4xl font-bold text-white">₹{stock.price.toFixed(2)}</div>
                <div className={`pb-1 text-sm font-medium flex items-center gap-1 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                </div>
              </div>
              <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-400">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                Live quote via Twelve Data
              </div>
            </div>

            {/* Chart */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div>
                  <h3 className="text-white font-semibold">Price Chart</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Wifi className="w-3 h-3" /> Real OHLC data from Finance Gateway
                  </p>
                </div>
                <div className="flex gap-1 bg-slate-900 p-1 rounded-lg">
                  {(Object.keys(RANGE_CONFIG) as RangeKey[]).map(r => (
                    <button key={r} onClick={() => setRange(r)}
                      className={`px-3 py-1 text-xs rounded ${range === r ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'}`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-72">
                {loadingHistory ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                  </div>
                ) : history.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                    No historical data available for this range
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={history}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0.4} />
                          <stop offset="95%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickFormatter={formatXAxis} />
                      <YAxis stroke="#64748b" fontSize={11} domain={['auto', 'auto']} tickFormatter={(v) => `₹${v.toFixed(0)}`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
                        labelStyle={{ color: '#94a3b8' }}
                        formatter={(value: number, name: string) => [`₹${Number(value).toFixed(2)}`, name === 'price' ? 'Close' : name]}
                      />
                      <Area type="monotone" dataKey="close" stroke={isPositive ? '#10b981' : '#ef4444'} fillOpacity={1} fill="url(#colorPrice)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
              {history.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-2 text-xs">
                  {(() => {
                    const latest = history[history.length - 1];
                    return [
                      ['Open', `₹${latest.open?.toFixed(2)}`],
                      ['High', `₹${latest.high?.toFixed(2)}`],
                      ['Low', `₹${latest.low?.toFixed(2)}`],
                      ['Close', `₹${latest.close?.toFixed(2)}`],
                    ].map(([k, v]) => (
                      <div key={k} className="bg-slate-900/50 rounded p-2">
                        <div className="text-slate-500">{k}</div>
                        <div className="text-white font-medium">{v}</div>
                      </div>
                    ));
                  })()}
                </div>
              )}
            </div>

            {/* Fundamentals */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Fundamentals</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  ['Market Cap', stock.marketCap],
                  ['P/E Ratio', stock.pe.toFixed(2)],
                  ['Volume', stock.volume],
                  ['52W High', `₹${stock.high52.toFixed(2)}`],
                  ['52W Low', `₹${stock.low52.toFixed(2)}`],
                  ['Sector', stock.sector],
                ].map(([label, value]) => (
                  <div key={label} className="bg-slate-900/50 rounded-lg p-3">
                    <div className="text-xs text-slate-400">{label}</div>
                    <div className="text-white font-semibold text-sm mt-1">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-3">About {stock.name}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {stock.name} is one of the leading companies in the {stock.sector} sector, listed on {stock.exchange || 'NASDAQ'}. 
                With a market capitalization of {stock.marketCap}, it trades under the symbol {stock.symbol}. 
                The company has shown consistent performance with a P/E ratio of {stock.pe.toFixed(2)}.
                Live price data is fetched from Twelve Data via the Finance API Gateway.
              </p>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 sticky top-20">
              <h3 className="text-white font-semibold mb-4">Trade</h3>
              {holding && (
                <div className="bg-slate-900/50 rounded-lg p-3 mb-4 text-sm">
                  <div className="text-slate-400 text-xs mb-1">Your holding</div>
                  <div className="flex justify-between">
                    <span className="text-white">{holding.quantity} shares</span>
                    <span className="text-slate-300">Avg ₹{holding.avgPrice.toFixed(2)}</span>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setModal('BUY')} className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg transition">BUY</button>
                <button onClick={() => setModal('SELL')} disabled={!holding} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed">SELL</button>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Open</span><span className="text-white">₹{(stock.open ?? stock.price * 0.995).toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">High</span><span className="text-white">₹{(stock.high ?? stock.price * 1.015).toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Low</span><span className="text-white">₹{(stock.low ?? stock.price * 0.985).toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Prev Close</span><span className="text-white">₹{(stock.previousClose ?? (stock.price - stock.change)).toFixed(2)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modal && <BuySellModal stock={stock} mode={modal} open={!!modal} onClose={() => setModal(null)} />}
    </PageLayout>
  );
};

export default StockDetail;
