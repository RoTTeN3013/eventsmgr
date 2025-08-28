import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Loader from '../components/Loader';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, checked } = useUser();

  if (!checked) return <Loader />;

  if (!user) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;