import React from 'react';
import { TrendingUp, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">StockTrade</span>
            </div>
            <p className="text-slate-400 text-sm mb-4 max-w-md">
              Production-grade stock trading simulation platform built with AWS cloud-native architecture. 
              Practice trading with virtual money and master the markets.
            </p>
            <div className="flex gap-3">
              {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-slate-400 hover:text-white">Explore Stocks</Link></li>
              <li><Link to="/portfolio" className="text-slate-400 hover:text-white">Portfolio</Link></li>
              <li><Link to="/watchlist" className="text-slate-400 hover:text-white">Watchlist</Link></li>
              <li><Link to="/orders" className="text-slate-400 hover:text-white">Orders</Link></li>
              <li><Link to="/reports" className="text-slate-400 hover:text-white">Reports</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-400 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white">Careers</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white">Press</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white">Contact</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white">Blog</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-500 text-xs">
            © 2026 StockTrade. Built on AWS Cognito · API Gateway · Lambda · ECS Fargate · DynamoDB · S3
          </div>
          <div className="flex gap-4 text-xs text-slate-500">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Disclosures</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
