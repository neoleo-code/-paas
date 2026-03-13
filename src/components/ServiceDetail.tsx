import React from 'react';
import { ArrowLeft, Activity, Cpu, Server, Check } from 'lucide-react';

interface ServiceDetailProps {
  onBack: () => void;
}

export default function ServiceDetail({ onBack }: ServiceDetailProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--color-text-secondary)] hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">服务详情</h1>
          <p className="text-[var(--color-text-secondary)]">查看您的服务运行状态。</p>
        </div>
      </header>

      <div className="glass-panel rounded-3xl p-8 space-y-8 border border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-success-start)]/10 flex items-center justify-center border border-[var(--color-success-start)]/20">
            <Check className="w-8 h-8 text-[var(--color-success-start)]" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">服务部署成功</h2>
            <p className="text-[var(--color-text-secondary)]">您的服务正在启动中，预计 30 秒内就绪。</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2 text-[var(--color-text-secondary)] mb-2">
              <Cpu className="w-4 h-4" /> 算力状态
            </div>
            <div className="text-xl font-medium">运行中</div>
          </div>
          <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2 text-[var(--color-text-secondary)] mb-2">
              <Activity className="w-4 h-4" /> 负载
            </div>
            <div className="text-xl font-medium">0%</div>
          </div>
          <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2 text-[var(--color-text-secondary)] mb-2">
              <Server className="w-4 h-4" /> 终端节点
            </div>
            <div className="text-sm font-mono text-gray-400">api.bitahub.com/v1/service-123</div>
          </div>
        </div>
      </div>
    </div>
  );
}
