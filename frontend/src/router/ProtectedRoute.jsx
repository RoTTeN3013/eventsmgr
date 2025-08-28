import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, checked } = useUser();

  if (!checked) return <div>Loading...</div>;

  if (!user) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;