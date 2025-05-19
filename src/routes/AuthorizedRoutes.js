import { useSelector } from 'react-redux';

const AuthorizedRoutes = ({ allowedRoles, children }) => {
  const { user } = useSelector((state) => state);

  return allowedRoles.includes(user.role_id) ? children : null;
};

export default AuthorizedRoutes;
