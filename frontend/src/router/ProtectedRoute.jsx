import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Loader from '../components/Loader';
import {useEffect} from 'react'

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, checked, refreshUser } = useUser();

  useEffect(() => {
    refreshUser();
  }, []);

  if (!checked) return <Loader />;

  //Nincs bejelentkezve -> Login panel
  if (!user) return <Navigate to="/" replace />;

  //Role szerinti routem a felhasználó csoportjának ellenőrzése
  if(roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to={location?.state?.from || '/'} replace />;
  }

  return children;
};

export default ProtectedRoute;