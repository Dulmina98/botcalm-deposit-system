import Button from '../ui/Button';

interface NavbarProps {
  username: string;
  isConnected: boolean;
  onLogout: () => void;
}

export default function Navbar({ username, isConnected, onLogout }: NavbarProps) {
  const avatarLetter = username.charAt(0).toUpperCase();

  return (
    <>
      <style>{`
        @keyframes navDotPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        .nav-dot-pulse { animation: navDotPulse 1.5s ease-in-out infinite; }
      `}</style>

      <nav className="fixed top-0 left-0 right-0 h-14 z-50 flex items-center justify-between px-6 bg-[rgba(5,13,26,0.8)] backdrop-blur-[12px] border-b border-[rgba(20,184,166,0.1)]">

          <div className="relative z-10 flex flex-row gap-3 items-center">
              <img src="/assets/images/bc-logo.png" alt="BotCalm logo" className="w-8 h-8 object-contain" />
              <div className="flex flex-col gap-px">
                  <span className="text-white font-bold text-[16px] leading-none">BotCalm</span>
                  <span className="text-white text-[9px] tracking-[0.12em] uppercase font-mono leading-none">
              DEPOSIT SYSTEM
            </span>
              </div>
          </div>

        <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-[7px] bg-[rgba(20,184,166,0.08)] border border-[rgba(20,184,166,0.15)] rounded-[20px] px-3 py-[5px]">
          <span
              className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  isConnected ? 'bg-[#22c55e] nav-dot-pulse' : 'bg-[#64748b]'
              }`}
          />
                <span
                    className={`text-[12px] font-mono tracking-[0.05em] ${
                        isConnected ? 'text-[#2dd4bf]' : 'text-[#64748b]'
                    }`}
                >
            {isConnected ? 'LIVE' : 'CONNECTING'}
          </span>
            </div>
          <div className="w-8 h-8 rounded-full bg-[rgba(20,184,166,0.15)] border border-[rgba(20,184,166,0.25)] flex items-center justify-center flex-shrink-0">
            <span className="text-[#2dd4bf] font-semibold text-[13px] leading-none">
              {avatarLetter}
            </span>
          </div>

          <span className="text-[#94a3b8] text-[13px]">{username}</span>

          <Button variant="ghost" onClick={onLogout} className="!px-3 !py-1.5 !text-[12px]">
            <span className="text-[13px] leading-none">→</span>
            Logout
          </Button>
        </div>
      </nav>
    </>
  );
}
