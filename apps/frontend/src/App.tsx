import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import Dashboard from './components/dashboard/Dashboard';

export default function App() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Dashboard /> : <Login />;
}
