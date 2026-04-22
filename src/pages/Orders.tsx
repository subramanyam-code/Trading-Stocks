import React, { useState } from 'react';
import { Receipt, Download, Filter } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { useTrading } from '@/contexts/TradingContext';

const Orders: React.FC = () => {
  const { transactions } = useTrading();
  const [filter, setFilter] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');

  const filtered = transactions.filter(t => filter === 'ALL' || t.type === filter);

  const downloadCSV = () => {
    const headers = ['Order ID', 'Date', 'Symbol', 'Type', 'Qty', 'Price', 'Total', 'Status'];
    const rows = filtered.map(t => [
      t.id,
      new Date(t.timestamp).toISOString(),
      t.symbol,
      t.type,
      t.quantity,
      t.price.toFixed(2),
      t.total.toFixed(2),
      t.status,
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${Date.now()}.csv`;
    a.click();
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Orders & Transactions</h1>
            <p className="text-slate-400 text-sm">{transactions.length} total transactions</p>
          </div>
          <button onClick={downloadCSV} disabled={filtered.length === 0}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-40">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <Filter className="w-4 h-4 text-slate-400" />
          {(['ALL', 'BUY', 'SELL'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                filter === f ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}>
              {f}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-12 text-center">
            <Receipt className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">No transactions yet</h3>
            <p className="text-slate-400 text-sm">Your orders will appear here once you start trading</p>
          </div>
        ) : (
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase">
                  <tr>
                    <th className="text-left p-3">Order ID</th>
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Stock</th>
                    <th className="text-center p-3">Type</th>
                    <th className="text-right p-3">Qty</th>
                    <th className="text-right p-3">Price</th>
                    <th className="text-right p-3">Total</th>
                    <th className="text-center p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(t => (
                    <tr key={t.id} className="border-t border-slate-700 hover:bg-slate-700/30">
                      <td className="p-3 text-slate-300 font-mono text-xs">{t.id}</td>
                      <td className="p-3 text-slate-300">{new Date(t.timestamp).toLocaleString('en-IN')}</td>
                      <td className="p-3">
                        <div className="text-white font-medium">{t.symbol}</div>
                        <div className="text-xs text-slate-400 truncate max-w-[160px]">{t.name}</div>
                      </td>
                      <td className="text-center p-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          t.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}>{t.type}</span>
                      </td>
                      <td className="text-right p-3 text-white">{t.quantity}</td>
                      <td className="text-right p-3 text-slate-300">₹{t.price.toFixed(2)}</td>
                      <td className="text-right p-3 text-white font-medium">₹{t.total.toFixed(2)}</td>
                      <td className="text-center p-3">
                        <span className="px-2 py-0.5 rounded-full text-xs bg-slate-700 text-slate-300">{t.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Orders;
