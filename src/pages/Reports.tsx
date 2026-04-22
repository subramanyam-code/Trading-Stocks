import React from 'react';
import { FileText, Download, Calendar, TrendingUp } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { useTrading } from '@/contexts/TradingContext';
import { toast } from 'sonner';

const Reports: React.FC = () => {
  const { transactions, holdings, getPortfolioValue, walletBalance, profile } = useTrading();
  const { invested, current, pnl, pnlPercent } = getPortfolioValue();

  const downloadPortfolioReport = () => {
    const lines = [
      'STOCKTRADE — PORTFOLIO REPORT',
      `Generated: ${new Date().toLocaleString('en-IN')}`,
      `User: ${profile.name} (${profile.email})`,
      '',
      '═══ SUMMARY ═══',
      `Wallet Balance:     ₹${walletBalance.toFixed(2)}`,
      `Total Invested:     ₹${invested.toFixed(2)}`,
      `Current Value:      ₹${current.toFixed(2)}`,
      `P&L:                ₹${pnl.toFixed(2)} (${pnlPercent.toFixed(2)}%)`,
      '',
      '═══ HOLDINGS ═══',
      ...holdings.map(h => {
        const pl = (h.currentPrice - h.avgPrice) * h.quantity;
        return `${h.symbol.padEnd(12)} Qty:${String(h.quantity).padEnd(6)} Avg:₹${h.avgPrice.toFixed(2).padEnd(10)} LTP:₹${h.currentPrice.toFixed(2).padEnd(10)} P&L:₹${pl.toFixed(2)}`;
      }),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio_report_${Date.now()}.txt`;
    a.click();
    toast.success('Portfolio report downloaded (simulated pre-signed S3 URL)');
  };

  const downloadTransactionReport = () => {
    const headers = 'Order ID,Date,Symbol,Name,Type,Quantity,Price,Total,Status';
    const rows = transactions.map(t =>
      `${t.id},${new Date(t.timestamp).toISOString()},${t.symbol},"${t.name}",${t.type},${t.quantity},${t.price.toFixed(2)},${t.total.toFixed(2)},${t.status}`
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${Date.now()}.csv`;
    a.click();
    toast.success('Transaction report downloaded');
  };

  const downloadTaxReport = () => {
    const sellTxns = transactions.filter(t => t.type === 'SELL');
    const lines = [
      'STOCKTRADE — TAX / P&L STATEMENT',
      `FY ${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      `User: ${profile.name}  PAN: ${profile.pan}`,
      '',
      'Realized gains from SELL transactions:',
      ...sellTxns.map(t => `${new Date(t.timestamp).toLocaleDateString('en-IN')} | ${t.symbol} | ${t.quantity} shares @ ₹${t.price.toFixed(2)} = ₹${t.total.toFixed(2)}`),
      '',
      `Total realized proceeds: ₹${sellTxns.reduce((s, t) => s + t.total, 0).toFixed(2)}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tax_statement_${Date.now()}.txt`;
    a.click();
    toast.success('Tax statement downloaded');
  };

  const reports = [
    { title: 'Portfolio Statement', desc: 'Complete snapshot of your current holdings with P&L', icon: TrendingUp, action: downloadPortfolioReport, format: 'TXT' },
    { title: 'Transaction Report', desc: 'Detailed CSV of all buy/sell orders and transactions', icon: FileText, action: downloadTransactionReport, format: 'CSV' },
    { title: 'Tax P&L Statement', desc: 'Capital gains statement for income tax filing', icon: Calendar, action: downloadTaxReport, format: 'TXT' },
  ];

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-2">Reports</h1>
        <p className="text-slate-400 text-sm mb-2">Generated on-demand via AWS Lambda and served from S3 pre-signed URLs</p>
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-medium mb-8">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          Powered by Lambda + S3
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {reports.map((r, i) => (
            <div key={i} className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 hover:border-emerald-500/50 transition-colors">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                <r.icon className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-white font-semibold">{r.title}</h3>
                <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">{r.format}</span>
              </div>
              <p className="text-slate-400 text-sm mb-4">{r.desc}</p>
              <button onClick={r.action} className="w-full bg-slate-700 hover:bg-emerald-500 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                <Download className="w-4 h-4" /> Download
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-slate-800/60 border border-slate-700 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-3">Report Generation Flow</h3>
          <div className="text-sm text-slate-400 space-y-2">
            <div className="flex items-start gap-2"><span className="text-emerald-400">1.</span> Frontend requests report via API Gateway endpoint <code className="bg-slate-900 px-2 py-0.5 rounded text-xs">/reports/download</code></div>
            <div className="flex items-start gap-2"><span className="text-emerald-400">2.</span> Lambda function generates PDF/CSV from DynamoDB user data</div>
            <div className="flex items-start gap-2"><span className="text-emerald-400">3.</span> Report uploaded to private S3 bucket <code className="bg-slate-900 px-2 py-0.5 rounded text-xs">stocktrade-reports</code></div>
            <div className="flex items-start gap-2"><span className="text-emerald-400">4.</span> Pre-signed URL (15 min TTL) returned to authenticated user</div>
            <div className="flex items-start gap-2"><span className="text-emerald-400">5.</span> CloudWatch logs all report generation events for audit</div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Reports;
