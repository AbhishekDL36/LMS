import { Navigate } from 'react-router-dom';
import { getToken } from '../utils/auth';

// This component checks if user is authenticated
// If NOT authenticated → redirect to login "/"
// If authenticated → render the page
const ProtectedRoute = ({ children }) => {
  // Get token from localStorage
  const token = getToken();

  // If token does not exist, user is not logged in
  if (!token) {
    // Redirect to login page
    return <Navigate to="/" />;
  }

  // Token exists, so render the requested page
  return children;
};

export default ProtectedRoute;
