
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Common redirect suggestions based on the attempted path
  const getRedirectSuggestion = (pathname: string) => {
    if (pathname.includes('/migration')) {
      return { path: '/app/setup', label: 'Go to Migration Setup' };
    }
    if (pathname.includes('/connect')) {
      return { path: '/app/crm-connections', label: 'Go to CRM Connections' };
    }
    if (pathname.includes('/dashboard')) {
      return { path: '/app/setup', label: 'Go to Dashboard' };
    }
    return { path: '/app/setup', label: 'Go to App' };
  };

  const suggestion = getRedirectSuggestion(location.pathname);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="text-center p-8 max-w-md">
        <h1 className="text-6xl font-bold text-blue-400 mb-6">404</h1>
        <p className="text-2xl font-medium mb-4 text-white">Page Not Found</p>
        <p className="text-slate-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <p className="text-sm text-slate-500 mb-8">
          Attempted path: <code className="bg-slate-800 px-2 py-1 rounded">{location.pathname}</code>
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link to="/" className="flex items-center gap-2">
              <Home size={18} /> Return to Home
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="border-slate-600 text-slate-200 hover:bg-slate-800">
            <Link to={suggestion.path} className="flex items-center gap-2">
              <ArrowLeft size={18} /> {suggestion.label}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
