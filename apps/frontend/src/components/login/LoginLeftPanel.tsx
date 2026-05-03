export default function LoginLeftPanel() {
  return (
    <div
      className="left-panel relative flex flex-col shrink-0 overflow-hidden p-9"
      style={{
        width: '50%',
        backgroundImage: 'url(/assets/images/fractial-glass-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[rgba(5,13,26,0.3)] via-[rgba(5,13,26,0.1)] to-[rgba(5,13,26,0.6)]" />

      <div className="relative z-10 flex flex-row gap-3 items-center">
        <img src="/assets/images/bc-logo.png" alt="BotCalm logo" className="w-10 h-10 object-contain" />
          <div className="text-md font-bold text-white leading-5">BotCalm <br/>Deposit System</div>
      </div>

      <div className="flex-1 flex items-center relative z-10">
        <div className="w-full rounded-xl p-5 backdrop-blur-[12px] bg-[rgba(5,13,26,0.5)] border border-[rgba(20,184,166,0.2)]">
          <div className="text-[11px] text-white/50 tracking-[0.08em] uppercase mb-3">
            Live Statistics
          </div>
          <div className="flex flex-col gap-[10px]">
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-white/70">Total Processed</span>
              <span className="text-[13px] font-semibold text-status-green">12,847</span>
            </div>
            <div className="h-px bg-white/[0.08]" />
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-white/70">Pending</span>
              <span className="text-[13px] font-semibold text-status-yellow">3</span>
            </div>
            <div className="h-px bg-white/[0.08]" />
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-white/70">Failed</span>
              <span className="text-[13px] font-semibold text-status-green">0</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <div className="text-[11px] text-white/50 tracking-[0.12em] uppercase font-mono mb-3">
          Deposit Infrastructure
        </div>
        <div className="text-[28px] font-bold text-white leading-[1.3]">
          Process deposits with confidence.
        </div>
        <div className="text-sm text-white/70 mt-2">
          Real-time tracking, idempotent processing, zero duplicates.
        </div>
      </div>
    </div>
  );
}
