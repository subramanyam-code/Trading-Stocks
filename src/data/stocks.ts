export interface PriceHistory {
  date: string;
  price: number;
}

// US stocks — Twelve Data has excellent coverage for these tickers
export const INITIAL_STOCKS: Stock[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 273.05, change: 2.82, changePercent: 1.04, marketCap: '4.1T', volume: '34.6M', sector: 'Technology', high52: 280.00, low52: 164.08, pe: 33.5, logo: 'https://cdn.simpleicons.org/apple' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 418.07, change: -4.72, changePercent: -1.12, marketCap: '3.1T', volume: '27.2M', sector: 'Technology', high52: 468.35, low52: 309.45, pe: 36.2, logo: 'https://cdn.simpleicons.org/microsoft' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 337.42, change: -4.26, changePercent: -1.25, marketCap: '2.1T', volume: '18.6M', sector: 'Technology', high52: 345.00, low52: 115.83, pe: 28.7, logo: 'https://cdn.simpleicons.org/google' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 234.50, change: 3.15, changePercent: 1.36, marketCap: '2.4T', volume: '42.1M', sector: 'Consumer', high52: 242.52, low52: 118.35, pe: 52.4, logo: 'https://cdn.simpleicons.org/amazon' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 142.30, change: 1.85, changePercent: 1.32, marketCap: '3.5T', volume: '189.4M', sector: 'Technology', high52: 152.89, low52: 45.66, pe: 65.8, logo: 'https://cdn.simpleicons.org/nvidia' },
  { symbol: 'META', name: 'Meta Platforms', price: 578.40, change: -2.65, changePercent: -0.46, marketCap: '1.5T', volume: '11.8M', sector: 'Technology', high52: 595.94, low52: 274.38, pe: 27.3, logo: 'https://cdn.simpleicons.org/meta' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 342.80, change: 8.95, changePercent: 2.68, marketCap: '1.1T', volume: '92.3M', sector: 'Auto', high52: 488.54, low52: 138.80, pe: 96.2, logo: 'https://cdn.simpleicons.org/tesla' },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway', price: 478.20, change: 2.40, changePercent: 0.50, marketCap: '1.0T', volume: '3.8M', sector: 'Finance', high52: 491.68, low52: 360.59, pe: 10.8, logo: 'https://cdn.worldvectorlogo.com/logos/berkshire-hathaway.svg' },
  { symbol: 'JPM', name: 'JPMorgan Chase', price: 234.75, change: 1.85, changePercent: 0.79, marketCap: '660B', volume: '8.5M', sector: 'Banking', high52: 254.31, low52: 155.83, pe: 12.5, logo: 'https://cdn.worldvectorlogo.com/logos/jpmorgan-chase.svg' },
  { symbol: 'V', name: 'Visa Inc.', price: 312.45, change: -0.85, changePercent: -0.27, marketCap: '610B', volume: '5.6M', sector: 'Finance', high52: 325.12, low52: 252.70, pe: 32.1, logo: 'https://cdn.simpleicons.org/visa' },
  { symbol: 'WMT', name: 'Walmart Inc.', price: 95.30, change: 0.65, changePercent: 0.69, marketCap: '765B', volume: '15.2M', sector: 'Retail', high52: 103.07, low52: 59.57, pe: 40.8, logo: 'https://cdn.simpleicons.org/walmart' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', price: 158.90, change: 0.45, changePercent: 0.28, marketCap: '385B', volume: '7.3M', sector: 'Healthcare', high52: 169.99, low52: 143.13, pe: 24.6, logo: 'https://cdn.simpleicons.org/johnsonandjohnson' },
  { symbol: 'MA', name: 'Mastercard Inc.', price: 528.70, change: -1.20, changePercent: -0.23, marketCap: '490B', volume: '2.9M', sector: 'Finance', high52: 545.07, low52: 399.19, pe: 38.9, logo: 'https://cdn.simpleicons.org/mastercard' },
  { symbol: 'PG', name: 'Procter & Gamble', price: 168.25, change: 0.95, changePercent: 0.57, marketCap: '395B', volume: '6.8M', sector: 'Consumer', high52: 180.43, low52: 142.50, pe: 27.8, logo: 'https://cdn.simpleicons.org/proctergamble' },
  { symbol: 'HD', name: 'Home Depot Inc.', price: 412.60, change: 3.80, changePercent: 0.93, marketCap: '410B', volume: '3.5M', sector: 'Retail', high52: 439.37, low52: 323.77, pe: 26.3, logo: 'https://cdn.simpleicons.org/homedepot' },
  { symbol: 'DIS', name: 'Walt Disney Co.', price: 112.80, change: 1.45, changePercent: 1.30, marketCap: '205B', volume: '9.1M', sector: 'Entertainment', high52: 123.74, low52: 83.91, pe: 35.2, logo: 'https://cdn.simpleicons.org/disney' },
  { symbol: 'BAC', name: 'Bank of America', price: 47.85, change: 0.35, changePercent: 0.74, marketCap: '365B', volume: '38.6M', sector: 'Banking', high52: 48.08, low52: 33.07, pe: 15.8, logo: 'https://cdn.simpleicons.org/bankofamerica' },
  { symbol: 'NFLX', name: 'Netflix Inc.', price: 892.40, change: 12.60, changePercent: 1.43, marketCap: '385B', volume: '3.2M', sector: 'Entertainment', high52: 941.75, low52: 544.27, pe: 48.7, logo: 'https://cdn.simpleicons.org/netflix' },
  { symbol: 'ADBE', name: 'Adobe Inc.', price: 510.25, change: -3.45, changePercent: -0.67, marketCap: '225B', volume: '2.8M', sector: 'Technology', high52: 638.25, low52: 433.97, pe: 42.3, logo: 'https://cdn.simpleicons.org/adobe' },
  { symbol: 'CRM', name: 'Salesforce Inc.', price: 328.70, change: 2.15, changePercent: 0.66, marketCap: '315B', volume: '4.7M', sector: 'Technology', high52: 369.00, low52: 212.00, pe: 54.8, logo: 'https://cdn.simpleicons.org/salesforce' },
  { symbol: 'INTC', name: 'Intel Corp.', price: 24.35, change: 0.42, changePercent: 1.76, marketCap: '104B', volume: '65.3M', sector: 'Technology', high52: 37.16, low52: 18.51, pe: 0, logo: 'https://cdn.simpleicons.org/intel' },
  { symbol: 'AMD', name: 'Advanced Micro Devices', price: 168.45, change: 3.85, changePercent: 2.34, marketCap: '272B', volume: '42.8M', sector: 'Technology', high52: 227.30, low52: 121.80, pe: 198.5, logo: 'https://cdn.simpleicons.org/amd' },
  { symbol: 'PYPL', name: 'PayPal Holdings', price: 85.60, change: -0.95, changePercent: -1.10, marketCap: '85B', volume: '12.5M', sector: 'Fintech', high52: 93.66, low52: 55.85, pe: 18.7, logo: 'https://cdn.simpleicons.org/paypal' },
  { symbol: 'CSCO', name: 'Cisco Systems', price: 58.90, change: 0.25, changePercent: 0.43, marketCap: '238B', volume: '18.9M', sector: 'Technology', high52: 62.45, low52: 45.17, pe: 22.8, logo: 'https://cdn.simpleicons.org/cisco' },
  { symbol: 'KO', name: 'Coca-Cola Co.', price: 68.20, change: 0.30, changePercent: 0.44, marketCap: '294B', volume: '11.4M', sector: 'Consumer', high52: 73.53, low52: 57.93, pe: 26.4, logo: 'https://cdn.simpleicons.org/cocacola' },
  { symbol: 'PEP', name: 'PepsiCo Inc.', price: 158.75, change: -0.65, changePercent: -0.41, marketCap: '217B', volume: '5.8M', sector: 'Consumer', high52: 183.41, low52: 141.51, pe: 22.1, logo: 'https://cdn.simpleicons.org/pepsi' },
  { symbol: 'NKE', name: 'Nike Inc.', price: 76.30, change: 1.25, changePercent: 1.67, marketCap: '113B', volume: '8.7M', sector: 'Consumer', high52: 106.01, low52: 68.62, pe: 25.8, logo: 'https://cdn.simpleicons.org/nike' },
  { symbol: 'MCD', name: "McDonald's Corp.", price: 298.45, change: 1.80, changePercent: 0.61, marketCap: '215B', volume: '3.1M', sector: 'Consumer', high52: 317.90, low52: 243.53, pe: 24.7, logo: 'https://cdn.simpleicons.org/mcdonalds' },
  { symbol: 'SBUX', name: 'Starbucks Corp.', price: 98.60, change: -1.45, changePercent: -1.45, marketCap: '112B', volume: '9.2M', sector: 'Consumer', high52: 117.46, low52: 71.55, pe: 28.3, logo: 'https://cdn.simpleicons.org/starbucks' },
  { symbol: 'T', name: 'AT&T Inc.', price: 23.85, change: 0.15, changePercent: 0.63, marketCap: '170B', volume: '34.2M', sector: 'Telecom', high52: 25.15, low52: 16.60, pe: 13.2, logo: 'https://cdn.simpleicons.org/att' },
  { symbol: 'VZ', name: 'Verizon Communications', price: 42.30, change: 0.20, changePercent: 0.47, marketCap: '178B', volume: '15.8M', sector: 'Telecom', high52: 45.36, low52: 37.53, pe: 9.4, logo: 'https://cdn.simpleicons.org/verizon' },
  { symbol: 'XOM', name: 'Exxon Mobil Corp.', price: 118.60, change: 1.95, changePercent: 1.67, marketCap: '525B', volume: '15.6M', sector: 'Energy', high52: 125.37, low52: 97.80, pe: 14.6, logo: 'https://cdn.simpleicons.org/exxonmobil' },
  { symbol: 'CVX', name: 'Chevron Corp.', price: 162.40, change: 2.30, changePercent: 1.44, marketCap: '298B', volume: '7.9M', sector: 'Energy', high52: 167.11, low52: 135.37, pe: 15.8, logo: 'https://cdn.simpleicons.org/chevron' },
  { symbol: 'PFE', name: 'Pfizer Inc.', price: 28.40, change: -0.20, changePercent: -0.70, marketCap: '161B', volume: '32.5M', sector: 'Pharma', high52: 31.54, low52: 24.48, pe: 18.3, logo: 'https://cdn.simpleicons.org/pfizer' },
  { symbol: 'MRK', name: 'Merck & Co.', price: 102.85, change: 0.45, changePercent: 0.44, marketCap: '260B', volume: '9.8M', sector: 'Pharma', high52: 134.63, low52: 99.92, pe: 21.7, logo: 'https://cdn.simpleicons.org/merck' },
  { symbol: 'ABBV', name: 'AbbVie Inc.', price: 182.60, change: 1.85, changePercent: 1.02, marketCap: '322B', volume: '6.4M', sector: 'Pharma', high52: 207.32, low52: 153.58, pe: 56.3, logo: 'https://cdn.simpleicons.org/abbvie' },
  { symbol: 'UBER', name: 'Uber Technologies', price: 82.45, change: 1.65, changePercent: 2.04, marketCap: '172B', volume: '15.3M', sector: 'Internet', high52: 87.00, low52: 54.84, pe: 38.7, logo: 'https://cdn.simpleicons.org/uber' },
  { symbol: 'SHOP', name: 'Shopify Inc.', price: 118.30, change: 2.45, changePercent: 2.11, marketCap: '155B', volume: '8.9M', sector: 'Internet', high52: 129.31, low52: 48.56, pe: 78.4, logo: 'https://cdn.simpleicons.org/shopify' },
  { symbol: 'SQ', name: 'Block Inc.', price: 78.20, change: -1.25, changePercent: -1.57, marketCap: '48B', volume: '12.1M', sector: 'Fintech', high52: 99.26, low52: 50.61, pe: 0, logo: 'https://cdn.simpleicons.org/block' },
  { symbol: 'COIN', name: 'Coinbase Global', price: 285.60, change: 8.45, changePercent: 3.05, marketCap: '72B', volume: '9.8M', sector: 'Fintech', high52: 343.62, low52: 142.58, pe: 47.2, logo: 'https://cdn.simpleicons.org/coinbase' },
  { symbol: 'ABNB', name: 'Airbnb Inc.', price: 138.90, change: 1.20, changePercent: 0.87, marketCap: '87B', volume: '4.6M', sector: 'Internet', high52: 163.93, low52: 110.38, pe: 48.9, logo: 'https://cdn.simpleicons.org/airbnb' },
  { symbol: 'SPOT', name: 'Spotify Technology', price: 458.30, change: 5.80, changePercent: 1.28, marketCap: '93B', volume: '1.4M', sector: 'Entertainment', high52: 499.33, low52: 222.84, pe: 105.6, logo: 'https://cdn.simpleicons.org/spotify' },
  { symbol: 'BA', name: 'Boeing Co.', price: 178.45, change: -2.15, changePercent: -1.19, marketCap: '135B', volume: '8.2M', sector: 'Aerospace', high52: 267.54, low52: 137.03, pe: 0, logo: 'https://cdn.simpleicons.org/boeing' },
  { symbol: 'GE', name: 'General Electric', price: 198.40, change: 1.85, changePercent: 0.94, marketCap: '215B', volume: '5.9M', sector: 'Industrial', high52: 212.13, low52: 150.20, pe: 34.5, logo: 'https://cdn.simpleicons.org/generalelectric' },
  { symbol: 'F', name: 'Ford Motor Co.', price: 10.85, change: 0.15, changePercent: 1.40, marketCap: '43B', volume: '62.4M', sector: 'Auto', high52: 14.86, low52: 9.06, pe: 12.8, logo: 'https://cdn.simpleicons.org/ford' },
  { symbol: 'GM', name: 'General Motors', price: 52.60, change: 0.85, changePercent: 1.64, marketCap: '56B', volume: '14.8M', sector: 'Auto', high52: 61.24, low52: 38.96, pe: 5.8, logo: 'https://cdn.simpleicons.org/gm' },
  { symbol: 'ORCL', name: 'Oracle Corp.', price: 168.70, change: 1.25, changePercent: 0.75, marketCap: '475B', volume: '8.6M', sector: 'Technology', high52: 198.31, low52: 99.26, pe: 40.2, logo: 'https://cdn.simpleicons.org/oracle' },
  { symbol: 'IBM', name: 'IBM Corp.', price: 228.40, change: 2.85, changePercent: 1.26, marketCap: '210B', volume: '4.3M', sector: 'Technology', high52: 239.35, low52: 161.45, pe: 32.5, logo: 'https://cdn.simpleicons.org/ibm' },
  { symbol: 'QCOM', name: 'Qualcomm Inc.', price: 162.30, change: 1.95, changePercent: 1.22, marketCap: '180B', volume: '9.2M', sector: 'Technology', high52: 230.63, low52: 121.41, pe: 17.8, logo: 'https://cdn.simpleicons.org/qualcomm' },
  { symbol: 'GS', name: 'Goldman Sachs', price: 578.90, change: 4.25, changePercent: 0.74, marketCap: '185B', volume: '2.1M', sector: 'Banking', high52: 617.84, low52: 383.30, pe: 14.5, logo: 'https://cdn.simpleicons.org/goldmansachs' },
];

export const generatePriceHistory = (basePrice: number, days: number = 30) => {
  const history = [];
  let price = basePrice * 0.9;
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    price = price + (Math.random() - 0.45) * basePrice * 0.03;
    history.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
    });
  }
  history[history.length - 1].price = basePrice;
  return history;
};
