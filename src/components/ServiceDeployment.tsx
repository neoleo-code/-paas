import React, { useState } from 'react';
import { ArrowLeft, Cpu, HardDrive, Settings, Server, Zap, ShieldCheck, ChevronDown } from 'lucide-react';

interface ServiceDeploymentProps {
  onDeploy: () => void;
  onBack: () => void;
  selectedImage?: any;
}

export default function ServiceDeployment({ onDeploy, onBack, selectedImage }: ServiceDeploymentProps) {
  const [gpuType, setGpuType] = useState('NVIDIA A100');
  const [gpuCount, setGpuCount] = useState(1);
  const [diskSize, setDiskSize] = useState(100);
  const [advanced, setAdvanced] = useState({ port: 8000, autoscaling: true, serverless: false, apiAuth: true });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--color-text-secondary)] hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {selectedImage ? `部署镜像: ${selectedImage.name}` : '快速部署服务'}
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            {selectedImage ? `正在基于 ${selectedImage.name}:${selectedImage.version} 配置部署参数。` : '配置您的服务参数以启动实例。'}
          </p>
        </div>
      </header>

      {selectedImage && (
        <div className="glass-panel rounded-2xl p-6 border border-white/10 bg-white/[0.02] flex items-center gap-6">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
            <Server className="w-6 h-6 text-purple-400" />
          </div>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">镜像名称</div>
              <div className="text-sm font-medium text-white">{selectedImage.name}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">版本标签</div>
              <div className="text-sm font-mono text-gray-300">{selectedImage.version}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">镜像大小</div>
              <div className="text-sm text-gray-300">{selectedImage.size}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">推理框架</div>
              <div className="text-sm text-gray-300">{selectedImage.framework}</div>
            </div>
          </div>
        </div>
      )}

      <div className="glass-panel rounded-3xl p-8 space-y-8 border border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-lg font-medium flex items-center gap-2"><Cpu className="w-5 h-5 text-[var(--color-accent-start)]"/> 算力配置</h2>
            <div className="space-y-3">
              <label className="text-sm text-[var(--color-text-secondary)]">GPU 型号</label>
              <select value={gpuType} onChange={(e) => setGpuType(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-[var(--color-accent-start)]/50">
                <option>NVIDIA A100</option>
                <option>NVIDIA H100</option>
                <option>NVIDIA RTX 4090</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-sm text-[var(--color-text-secondary)]">GPU 数量</label>
              <input type="number" min="1" max="8" value={gpuCount} onChange={(e) => setGpuCount(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-[var(--color-accent-start)]/50" />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-medium flex items-center gap-2"><HardDrive className="w-5 h-5 text-[var(--color-accent-start)]"/> 存储配置</h2>
            <div className="space-y-3">
              <label className="text-sm text-[var(--color-text-secondary)]">磁盘大小 (GB)</label>
              <input type="number" min="50" step="50" value={diskSize} onChange={(e) => setDiskSize(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-[var(--color-accent-start)]/50" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-medium flex items-center gap-2"><Settings className="w-5 h-5 text-[var(--color-accent-start)]"/> 高级设置</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm text-[var(--color-text-secondary)]">端口</label>
              <input type="number" value={advanced.port} onChange={(e) => setAdvanced({...advanced, port: Number(e.target.value)})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-[var(--color-accent-start)]/50" />
            </div>
            <div className="flex items-center gap-6 pt-6">
              <label className="flex items-center gap-2 text-sm text-gray-200 cursor-pointer">
                <input type="checkbox" checked={advanced.autoscaling} onChange={(e) => setAdvanced({...advanced, autoscaling: e.target.checked})} className="accent-[var(--color-accent-start)]" />
                <Zap className="w-4 h-4 text-[var(--color-accent-start)]"/> 弹性伸缩
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-200 cursor-pointer">
                <input type="checkbox" checked={advanced.serverless} onChange={(e) => setAdvanced({...advanced, serverless: e.target.checked})} className="accent-[var(--color-accent-start)]" />
                <Server className="w-4 h-4 text-[var(--color-accent-start)]"/> Serverless
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-200 cursor-pointer">
                <input type="checkbox" checked={advanced.apiAuth} onChange={(e) => setAdvanced({...advanced, apiAuth: e.target.checked})} className="accent-[var(--color-accent-start)]" />
                <ShieldCheck className="w-4 h-4 text-[var(--color-accent-start)]"/> API 认证
              </label>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex justify-end">
          <button onClick={onDeploy} className="px-8 py-3 rounded-xl bg-[var(--color-accent-start)] text-white font-medium hover:bg-[var(--color-accent-end)] transition-all hover:neon-breathe-amber">
            部署服务
          </button>
        </div>
      </div>
    </div>
  );
}
