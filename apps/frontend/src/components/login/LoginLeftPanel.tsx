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
        <img src="/assets/images/bc-logo.png" alt="BotCalm logo" className="w-8 h-8 object-contain" />
          <div className="flex flex-col gap-px">
              <span className="text-white font-bold text-[16px] leading-none">BotCalm</span>
              <span className="text-white text-[9px] tracking-[0.12em] uppercase font-mono leading-none">
              DEPOSIT SYSTEM
            </span>
          </div>
      </div>

      <div className="flex-1 flex items-center relative z-10">
        <div className="w-full rounded-xl p-5 backdrop-blur-[12px] bg-[rgba(5,13,26,0.5)] border border-[rgba(20,184,166,0.2)]">
          <div className="text-[11px] text-white/50 tracking-[0.08em] uppercase mb-3 font-mono">
            Why BotCalm
          </div>
          {[
            { icon: '⚡', title: 'Real-Time Updates', desc: 'WebSocket-powered live transaction status' },
            { icon: '◈', title: 'Idempotent Processing', desc: 'Duplicate deposits safely rejected at DB level' },
            { icon: '⟳', title: 'Async Queue', desc: 'Bull + Redis worker with exponential backoff retry' },
            { icon: '⚿', title: 'JWT Protected', desc: 'Stateless auth securing every API route' },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-3" style={{ marginBottom: '10px' }}>
              <div
                className="flex items-center justify-center shrink-0 rounded-md text-[#14b8a6] text-[11px]"
                style={{
                  width: 20,
                  height: 20,
                  background: 'rgba(20,184,166,0.12)',
                  border: '1px solid rgba(20,184,166,0.2)',
                }}
              >
                {f.icon}
              </div>
              <div>
                <div className="text-[13px] text-white/80 font-medium">{f.title}</div>
                <div className="text-[11px] text-white/50 leading-snug">{f.desc}</div>
              </div>
            </div>
          ))}
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
