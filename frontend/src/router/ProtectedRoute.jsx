import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Loader from '../components/Loader';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, checked } = useUser();

  if (!checked) return <Loader />;

  //Nincs bejelentkezve -> Login panel
  if (!user) return <Navigate to="/" replace />;

  //Role szerinti routem a felhasználó csoportjának ellenőrzése
  if(roles.lenght > 0 && !roles.includes(user.role)) {
    return <Navigate to={location?.state?.from || '/'} replace />;
  }

  return children;
};

export default ProtectedRoute;