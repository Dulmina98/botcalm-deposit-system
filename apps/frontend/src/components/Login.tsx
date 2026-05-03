import type { AxiosError } from 'axios';
import { useState } from 'react';
import { login as apiLogin } from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoginLeftPanel from './login/LoginLeftPanel';
import LoginForm from './login/LoginForm';

export default function Login() {
  const auth = useAuth();
  const { addToast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await apiLogin(username, password);
      auth.login(data.token, data.username);
      addToast('success', 'Signed in successfully');
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      const message =
        axiosErr.response?.data?.message ?? 'Invalid credentials. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <LoginLeftPanel />
      <div
        style={{
          flex: 1,
          backgroundColor: '#050d1a',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
          overflow: 'auto',
        }}
      >
        <LoginForm
          username={username}
          password={password}
          loading={loading}
          error={error}
          onUsernameChange={setUsername}
          onPasswordChange={setPassword}
          onSubmit={handleSubmit}
        />
      </div>
      <style>{`@media (max-width: 640px) { .left-panel { display: none !important; } }`}</style>
    </div>
  );
}
