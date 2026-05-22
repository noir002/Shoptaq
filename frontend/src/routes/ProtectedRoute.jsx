import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen tech-bg">
        <div className="flex flex-col items-center gap-4 neo-panel p-8">
          <div className="w-10 h-10 spinner" />
<<<<<<< HEAD
          <p className="text-white/40 text-sm">Loading Shoptaq...</p>
=======
          <p className="text-on-surface-variant text-sm font-label-md">Loading Shoptaq...</p>
>>>>>>> 9f55e72
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
