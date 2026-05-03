import Button from '../ui/Button';
import FormInput from '../ui/FormInput';

interface LoginFormProps {
  username: string;
  password: string;
  loading: boolean;
  error: string | null;
  onUsernameChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function LoginForm({
  username,
  password,
  loading,
  error,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) {
  return (
    <div className="w-full max-w-[380px]">
      <div className="mb-8">
        <div className="text-[26px] font-bold text-white mb-[6px]">Welcome back</div>
        <div className="text-sm text-text-muted">Sign in to your dashboard</div>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <FormInput
          label="Username"
          id="username"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
        />

        <FormInput
          label="Password"
          id="password"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
        />

        <Button type="submit" loading={loading} fullWidth className="mt-2">
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>

        {error && (
          <div className="bg-[rgba(239,68,68,0.1)] text-status-red border border-[rgba(239,68,68,0.3)] rounded-lg px-3 py-[10px] text-[13px]">
            {error}
          </div>
        )}
      </form>

      <div className="flex items-center justify-center gap-2 mt-6 text-[12px] text-text-muted">
        Default credentials
        <span className="font-mono text-accent-light bg-accent-dim px-[10px] py-[3px] rounded-md">
          admin / admin123
        </span>
      </div>
    </div>
  );
}
