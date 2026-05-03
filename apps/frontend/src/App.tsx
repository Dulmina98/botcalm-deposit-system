import { useAuth } from './context/AuthContext';
import Login from './components/Login';

export default function App() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <div>Dashboard coming soon</div> : <Login />;
}
