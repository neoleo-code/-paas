import React, { useState } from 'react';
import { 
  X, Server, Cpu, HardDrive, Database, 
  Terminal, Monitor, CreditCard, ChevronDown, 
  CheckCircle2, Box, Image as ImageIcon, Plus 
} from 'lucide-react';

interface DeploymentSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel?: any;
  preSelectedImage?: any;
  onDeploySuccess: (modelId: string) => void;
}

export default function DeploymentSidebar({ isOpen, onClose, selectedModel, preSelectedImage, onDeploySuccess }: DeploymentSidebarProps) {
  const [gpuType, setGpuType] = useState('NVIDIA A100');
  const [gpuCount, setGpuCount] = useState(1);
  const [diskSize, setDiskSize] = useState(100);
  const [accessSSH, setAccessSSH] = useState(true);
  const [accessVNC, setAccessVNC] = useState(false);
  const [billing, setBilling] = useState('On-Demand');
  const [selectedImageId, setSelectedImageId] = useState('official');

  // Sync pre-selected image
  React.useEffect(() => {
    if (preSelectedImage) {
      setSelectedImageId(preSelectedImage.id || 'custom-1');
    } else {
      setSelectedImageId('official');
    }
  }, [preSelectedImage, isOpen]);

  // Deployment State
  const [deployStatus, setDeployStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');
  const [deployProgress, setDeployProgress] = useState(0);

  const handleDeploy = () => {
    setDeployStatus('deploying');
    setDeployProgress(0);
    
    const interval = setInterval(() => {
      setDeployProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setDeployStatus('success');
          if (selectedModel) onDeploySuccess(selectedModel.id);
          setTimeout(() => {
            setDeployStatus('idle');
            onClose();
          }, 2000);
          return 100;
        }
        return Math.min(100, p + Math.floor(Math.random() * 15) + 5);
      });
    }, 300);
  };

  const basePrice = gpuType === 'NVIDIA A100' ? 3.5 : 4.8;
  const price = basePrice * gpuCount * (billing === 'Reserved' ? 730 * 0.8 : 1);

  return (
    <>
      {/* Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-md z-[60] transition-opacity duration-700 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />

      {/* Right Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-[520px] glass-panel border-l border-white/10 z-[70] transform transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] font-semibold mb-1">
              全局配置部署 (Global Deployment)
            </div>
            <h2 className="text-xl font-light text-white">配置实例</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
          
          {/* Selected Model Card */}
          {selectedModel && (
            <div className="flex items-center gap-5 p-6 rounded-3xl bg-white/[0.03] border border-white/10 shadow-inner">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10" style={{ backgroundColor: `${selectedModel.color}15`, borderColor: `${selectedModel.color}20` }}>
                <Box className="w-7 h-7" style={{ color: selectedModel.color }} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-[var(--color-text-tertiary)] mb-1 uppercase tracking-[0.2em]">已选模型</div>
                <div className="text-lg font-medium text-white">{selectedModel.name}</div>
              </div>
            </div>
          )}

          {/* Image Selection Interaction */}
          <div className="space-y-4">
            <label className="text-[11px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-[0.2em] flex items-center gap-2">
              <ImageIcon className="w-3.5 h-3.5"/> 镜像选择
            </label>
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'official', name: '官方预置镜像', desc: '包含优化后的推理引擎与驱动', icon: CheckCircle2 },
                { id: 'custom-1', name: 'custom-llama-3-finetuned', desc: 'v1.0.2 • 4.2 GB • 用户上传', icon: Database },
              ].map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImageId(img.id)}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-4 ${selectedImageId === img.id ? 'bg-[var(--color-accent-start)]/10 border-[var(--color-accent-start)]/50 text-[var(--color-accent-start)]' : 'bg-black/20 border-white/5 text-gray-400 hover:border-white/10'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedImageId === img.id ? 'bg-[var(--color-accent-start)]/20' : 'bg-white/5'}`}>
                    <img.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{img.name}</div>
                    <div className="text-[10px] opacity-60 mt-0.5 truncate">{img.desc}</div>
                  </div>
                  {selectedImageId === img.id && <div className="w-2 h-2 rounded-full bg-[var(--color-accent-start)] shadow-[0_0_8px_var(--color-accent-start)]" />}
                </button>
              ))}
              <button className="p-4 rounded-2xl border border-dashed border-white/10 text-gray-500 hover:text-gray-300 hover:border-white/20 transition-all flex items-center justify-center gap-2 text-xs font-medium">
                <Plus className="w-4 h-4" /> 选择其他自定义镜像
              </button>
            </div>
          </div>

          {/* Cluster */}
          <div className="space-y-4">
            <label className="text-[11px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-[0.2em] flex items-center gap-2"><Server className="w-3.5 h-3.5"/> 集群区域</label>
            <div className="relative">
              <select className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm text-gray-200 focus:outline-none focus:border-[var(--color-accent-start)]/50 appearance-none transition-all">
                <option>美东 (弗吉尼亚北部)</option>
                <option>美西 (俄勒冈)</option>
                <option>欧洲中部 (法兰克福)</option>
                <option>亚太东北 (东京)</option>
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* GPU Model */}
          <div className="space-y-4">
            <label className="text-[11px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-[0.2em] flex items-center gap-2"><Cpu className="w-3.5 h-3.5"/> GPU 加速器</label>
            <div className="grid grid-cols-2 gap-4">
              {['NVIDIA A100', 'NVIDIA H100'].map(gpu => (
                <button
                  key={gpu}
                  onClick={() => setGpuType(gpu)}
                  className={`p-5 rounded-2xl border text-left transition-all duration-300 ${gpuType === gpu ? 'bg-[var(--color-accent-start)]/10 border-[var(--color-accent-start)]/50 text-[var(--color-accent-start)] shadow-lg shadow-[var(--color-accent-start)]/10' : 'bg-black/20 border-white/5 text-gray-400 hover:border-white/10'}`}
                >
                  <div className="text-sm font-semibold">{gpu}</div>
                  <div className="text-[10px] font-mono mt-2 opacity-60 uppercase tracking-widest">{gpu === 'NVIDIA A100' ? '80GB VRAM' : '80GB HBM3'}</div>
                </button>
              ))}
            </div>
          </div>

          {/* GPU Count */}
          <div className="space-y-4">
            <label className="text-[11px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-[0.2em]">GPU 数量</label>
            <div className="flex bg-black/40 rounded-2xl p-1.5 border border-white/5">
              {[1, 2, 4, 8].map(num => (
                <button
                  key={num}
                  onClick={() => setGpuCount(num)}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${gpuCount === num ? 'bg-[var(--color-accent-start)]/20 text-[var(--color-accent-start)] shadow-inner' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Disk & Storage */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-[0.2em] flex items-center gap-2"><HardDrive className="w-3.5 h-3.5"/> 系统盘</label>
                <span className="text-[11px] text-[var(--color-accent-start)] font-mono bg-[var(--color-accent-start)]/10 px-3 py-1 rounded-full border border-[var(--color-accent-start)]/20">{diskSize} GB</span>
              </div>
              <input type="range" min="50" max="2000" step="50" value={diskSize} onChange={(e) => setDiskSize(Number(e.target.value))} className="w-full accent-[var(--color-accent-start)] h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
            </div>
          </div>

          {/* Access Method */}
          <div className="space-y-4">
            <label className="text-[11px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-[0.2em]">访问方式</label>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setAccessSSH(!accessSSH)} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${accessSSH ? 'bg-[var(--color-accent-start)]/10 border-[var(--color-accent-start)]/30 text-[var(--color-accent-start)]' : 'bg-black/20 border-white/5 text-gray-400'}`}>
                <Terminal className="w-5 h-5" /> 
                <span className="text-sm font-semibold uppercase tracking-widest">SSH</span>
              </button>
              <button onClick={() => setAccessVNC(!accessVNC)} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${accessVNC ? 'bg-[var(--color-accent-start)]/10 border-[var(--color-accent-start)]/30 text-[var(--color-accent-start)]' : 'bg-black/20 border-white/5 text-gray-400'}`}>
                <Monitor className="w-5 h-5" /> 
                <span className="text-sm font-semibold uppercase tracking-widest">VNC</span>
              </button>
            </div>
          </div>

          {/* Billing */}
          <div className="space-y-4">
            <label className="text-[11px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-[0.2em] flex items-center gap-2"><CreditCard className="w-3.5 h-3.5"/> 计费周期 (Billing Cycle)</label>
            <div className="flex bg-black/40 rounded-2xl p-1.5 border border-white/5 relative">
              {['On-Demand', 'Reserved'].map(cycle => (
                <button
                  key={cycle}
                  onClick={() => setBilling(cycle)}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all z-10 ${billing === cycle ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  {cycle}
                </button>
              ))}
              <div 
                className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white/10 rounded-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ left: billing === 'On-Demand' ? '6px' : 'calc(50% + 3px)' }}
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-8 border-t border-white/5 bg-white/5">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs uppercase tracking-widest font-bold text-[var(--color-text-tertiary)]">预估费用</span>
            <span className="text-3xl font-light text-[var(--color-accent-start)]">${price.toFixed(2)}<span className="text-sm text-gray-500 font-medium tracking-normal ml-1">/{billing === 'On-Demand' ? 'hr' : 'mo'}</span></span>
          </div>
          
          {deployStatus === 'deploying' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs uppercase tracking-widest font-bold">
                <span className="text-white flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-[var(--color-accent-start)] border-t-transparent rounded-full animate-spin" />
                  正在分配计算资源...
                </span>
                <span className="text-[var(--color-accent-start)] font-mono">{deployProgress}%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[var(--color-accent-start)] to-[var(--color-accent-end)] transition-all duration-500 ease-out"
                  style={{ width: `${deployProgress}%` }}
                />
              </div>
            </div>
          ) : deployStatus === 'success' ? (
            <div className="w-full py-5 rounded-2xl bg-[var(--color-status-complete)]/10 border border-[var(--color-status-complete)]/30 text-[var(--color-status-complete)] font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 shadow-lg shadow-[var(--color-status-complete)]/10">
              <CheckCircle2 className="w-5 h-5" />
              部署成功
            </div>
          ) : (
            <button 
              onClick={handleDeploy} 
              className="w-full py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs transition-all duration-500 bg-gradient-to-r from-[var(--color-accent-start)] to-[var(--color-accent-end)] text-white hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] shadow-lg shadow-[var(--color-accent-start)]/20"
            >
              部署到控制台
            </button>
          )}
        </div>
      </div>
    </>
  );
}
