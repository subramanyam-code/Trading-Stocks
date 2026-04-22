import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { TrendingUp } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: attempted to access:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="text-center p-8">
        <div className="inline-flex w-16 h-16 bg-emerald-500/10 rounded-2xl items-center justify-center mb-6">
          <TrendingUp className="w-8 h-8 text-emerald-400" />
        </div>
        <h1 className="text-6xl font-bold text-white mb-2">404</h1>
        <p className="text-xl text-slate-400 mb-6">This page doesn't exist</p>
        <Link to="/" className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
