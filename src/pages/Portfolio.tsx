import React from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Briefcase, ArrowRight } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { useTrading } from '@/contexts/TradingContext';

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6', '#ef4444', '#14b8a6'];

const Portfolio: React.FC = () => {
  const { holdings, getPortfolioValue, walletBalance } = useTrading();
  const { invested, current, pnl, pnlPercent } = getPortfolioValue();

  const pieData = holdings.map(h => ({ name: h.symbol, value: h.currentPrice * h.quantity }));

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-2">Portfolio</h1>
        <p className="text-slate-400 text-sm mb-8">Track your holdings and performance</p>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <SummaryCard label="Current Value" value={`₹${current.toFixed(2)}`} />
          <SummaryCard label="Invested" value={`₹${invested.toFixed(2)}`} />
          <SummaryCard label="Total P&L" value={`₹${pnl.toFixed(2)}`} accent={pnl >= 0 ? 'emerald' : 'red'} sub={`${pnlPercent.toFixed(2)}%`} />
          <SummaryCard label="Wallet" value={`₹${walletBalance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} />
        </div>

        {holdings.length === 0 ? (
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-12 text-center">
            <Briefcase className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-white font-semibold text-lg mb-2">No holdings yet</h3>
            <p className="text-slate-400 text-sm mb-6">Start building your portfolio by exploring stocks</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium">
              Explore Stocks <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden">
              <div className="p-5 border-b border-slate-700">
                <h3 className="text-white font-semibold">Your Holdings ({holdings.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase">
                    <tr>
                      <th className="text-left p-3">Stock</th>
                      <th className="text-right p-3">Qty</th>
                      <th className="text-right p-3">Avg</th>
                      <th className="text-right p-3">LTP</th>
                      <th className="text-right p-3">P&L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdings.map(h => {
                      const pl = (h.currentPrice - h.avgPrice) * h.quantity;
                      const plPercent = ((h.currentPrice - h.avgPrice) / h.avgPrice) * 100;
                      return (
                        <tr key={h.symbol} className="border-t border-slate-700 hover:bg-slate-700/30">
                          <td className="p-3">
                            <Link to={`/stock/${h.symbol}`} className="block">
                              <div className="text-white font-medium">{h.symbol}</div>
                              <div className="text-xs text-slate-400 truncate max-w-[180px]">{h.name}</div>
                            </Link>
                          </td>
                          <td className="text-right p-3 text-white">{h.quantity}</td>
                          <td className="text-right p-3 text-slate-300">₹{h.avgPrice.toFixed(2)}</td>
                          <td className="text-right p-3 text-white">₹{h.currentPrice.toFixed(2)}</td>
                          <td className={`text-right p-3 font-medium ${pl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            <div>{pl >= 0 ? '+' : ''}₹{pl.toFixed(2)}</div>
                            <div className="text-xs">{pl >= 0 ? '+' : ''}{plPercent.toFixed(2)}%</div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-4">Allocation</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={50}>
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

const SummaryCard: React.FC<{ label: string; value: string; accent?: 'emerald' | 'red'; sub?: string }> = ({ label, value, accent, sub }) => (
  <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
    <div className="text-slate-400 text-xs mb-1">{label}</div>
    <div className={`text-xl font-bold ${accent === 'emerald' ? 'text-emerald-400' : accent === 'red' ? 'text-red-400' : 'text-white'}`}>{value}</div>
    {sub && <div className={`text-xs mt-0.5 ${accent === 'emerald' ? 'text-emerald-400' : 'text-red-400'}`}>{sub}</div>}
  </div>
);

export default Portfolio;
