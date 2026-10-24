import { Navigate } from 'react-router-dom';

/**
 * AuthWrapper — Route guard for protected admin pages.
 * Checks for a valid token in localStorage before rendering children.
 * If no token is found, redirects to /login.
 */
const AuthWrapper = ({ children }) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AuthWrapper;
