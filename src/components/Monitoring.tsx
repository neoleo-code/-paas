import React, { useEffect, useState } from 'react';
import { Activity, Server } from 'lucide-react';

export default function Monitoring() {
  const [pods, setPods] = useState([
    { id: 1, status: 'active', load: 85 },
    { id: 2, status: 'active', load: 42 },
    { id: 3, status: 'idle', load: 0 },
  ]);

  // Simulate scale to zero
  useEffect(() => {
    const timer = setTimeout(() => {
      setPods(p => p.map(pod => pod.id === 3 ? { ...pod, status: 'terminating' } : pod));
      setTimeout(() => {
        setPods(p => p.filter(pod => pod.id !== 3));
      }, 2000);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      <header className="flex justify-between items-end px-2">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] font-semibold mb-1">
            实时遥测 (Real-time Telemetry)
          </div>
          <h1 className="text-3xl font-light tracking-tight">服务监控</h1>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pod Visualization */}
        <div className="glass-panel rounded-3xl p-8 min-h-[400px] flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-center mb-8 relative z-10">
            <h2 className="text-lg font-medium">Llama-3-70B-Instruct</h2>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider px-3 py-1 rounded-full bg-white/5 text-[var(--color-status-complete)]">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-status-complete)] shadow-[0_0_8px_var(--color-status-complete)]" />
              服务中
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center gap-8 relative z-10">
            {/* Gateway */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                <Activity className="w-8 h-8 text-[var(--color-text-secondary)]" />
              </div>
              <span className="text-[11px] text-[var(--color-text-tertiary)] font-mono uppercase tracking-widest">网关</span>
            </div>

            {/* Flow Lines */}
            <div className="flex-1 h-[2px] bg-white/5 relative">
              <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-[var(--color-accent-start)] to-transparent animate-[flow_2s_linear_infinite]" />
            </div>

            {/* Pods */}
            <div className="flex flex-col gap-6">
              {pods.map(pod => (
                <div 
                  key={pod.id} 
                  className={`flex items-center gap-4 transition-all duration-1000 ${
                    pod.status === 'terminating' ? 'opacity-0 scale-50 blur-md' : 'opacity-100 scale-100'
                  }`}
                >
                  <div className="flex-1 h-[2px] w-8 bg-white/5 relative overflow-hidden">
                    {pod.status === 'active' && (
                      <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-[var(--color-accent-start)] to-transparent animate-[flow_1s_linear_infinite]" />
                    )}
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-500
                        ${pod.status === 'active' && pod.load > 80 ? 'bg-[var(--color-status-failed)]/20 border-[var(--color-status-failed)]/50 neon-breathe-red' : 
                          pod.status === 'active' ? 'bg-[var(--color-accent-start)]/20 border-[var(--color-accent-start)]/50 neon-breathe-amber' : 
                          'bg-white/5 border-white/10'}
                      `}
                    >
                      <Server className={`w-5 h-5 ${pod.status === 'active' ? 'text-white' : 'text-[var(--color-text-secondary)]'}`} />
                    </div>
                    <span className="text-[10px] text-[var(--color-text-secondary)] font-mono">
                      Pod-{pod.id} {pod.status === 'active' ? `(${pod.load}%)` : '(空闲)'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Logs / Events */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col">
          <h2 className="text-lg font-medium mb-6">系统事件</h2>
          <div className="flex-1 bg-black/40 rounded-xl p-4 font-mono text-[11px] space-y-3 overflow-y-auto leading-relaxed">
            <div className="text-[var(--color-text-secondary)]">[10:05:22] <span className="text-[var(--color-status-complete)]">INFO</span> 自动扩缩容: 检测到流量激增。</div>
            <div className="text-[var(--color-text-secondary)]">[10:05:23] <span className="text-[var(--color-accent-start)]">SCALE</span> 正在分配新副本 (Pod-2)。</div>
            <div className="text-[var(--color-text-secondary)]">[10:05:45] <span className="text-[var(--color-status-complete)]">INFO</span> Pod-2 就绪。正在路由流量。</div>
            <div className="text-[var(--color-text-secondary)]">[10:12:00] <span className="text-[var(--color-text-secondary)]">INFO</span> 流量恢复正常。</div>
            <div className="text-[var(--color-text-secondary)]">[10:17:00] <span className="text-[var(--color-status-failed)]">SCALE</span> Pod-3 空闲超过 5 分钟。缩容至零。</div>
            <div className="text-[var(--color-text-secondary)]">[10:17:02] <span className="text-[var(--color-text-secondary)]">INFO</span> Pod-3 已终止。</div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes flow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}
