import React, { useState } from 'react';
import { Download, Star, Zap, X, Server, Cpu, HardDrive, Database, Terminal, Monitor, CreditCard, ChevronDown, CheckCircle2 } from 'lucide-react';
import { Model } from './ModelDetail';

export const models: Model[] = [
  { id: 'llama3', name: 'Llama 3 70B', type: 'LLM', size: '140GB', recommended: 'A100 x2', color: '#00C6FF' },
  { id: 'sdxl', name: 'Stable Diffusion XL', type: 'Image', size: '12GB', recommended: 'A100 x1', color: '#FF2D55' },
  { id: 'whisper', name: 'Whisper v3', type: 'Audio', size: '8GB', recommended: 'T4 x1', color: '#32D74B' },
  { id: 'mixtral', name: 'Mixtral 8x7B', type: 'LLM', size: '90GB', recommended: 'A100 x2', color: '#A855F7' },
  { id: 'qwen', name: 'Qwen 1.5 72B', type: 'LLM', size: '144GB', recommended: 'A100 x2', color: '#F59E0B' },
  { id: 'llama3-8b', name: 'Llama 3 8B', type: 'LLM', size: '16GB', recommended: 'A10G x1', color: '#00C6FF' },
];

interface ModelHubProps {
  deployedModels: string[];
  setDeployedModels: React.Dispatch<React.SetStateAction<string[]>>;
  setActiveTab: (tab: string) => void;
}

export default function ModelHub({ deployedModels, setDeployedModels, setActiveTab }: ModelHubProps) {
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  
  // Form State
  const [gpuType, setGpuType] = useState('NVIDIA A100');
  const [gpuCount, setGpuCount] = useState(1);
  const [diskSize, setDiskSize] = useState(100);
  const [accessSSH, setAccessSSH] = useState(true);
  const [accessVNC, setAccessVNC] = useState(false);
  const [billing, setBilling] = useState('On-Demand');

  // Deployment State
  const [deployStatus, setDeployStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');
  const [deployProgress, setDeployProgress] = useState(0);
  const [deployInterval, setDeployInterval] = useState<ReturnType<typeof setInterval> | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string, type: 'success' | 'error' | 'info' } | null>(null);

  const handleDeploy = () => {
    if (!selectedModel) return;
    setDeployStatus('deploying');
    setDeployProgress(0);
    
    const interval = setInterval(() => {
      setDeployProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          const isSuccess = Math.random() > 0.1; // 90% success rate
          if (isSuccess) {
            setDeployStatus('success');
            setDeployedModels(prev => [...prev, selectedModel.id]);
            setToastMessage({ text: `${selectedModel.name} 部署成功！`, type: 'success' });
          } else {
            setDeployStatus('error');
            setToastMessage({ text: `${selectedModel.name} 部署失败，请重试。`, type: 'error' });
          }
          setTimeout(() => {
            setDeployStatus('idle');
            setToastMessage(null);
          }, 3000);
          return 100;
        }
        return Math.min(100, p + Math.floor(Math.random() * 15) + 5);
      });
    }, 300);
    setDeployInterval(interval);
  };

  const handleCancelDeploy = () => {
    if (deployInterval) clearInterval(deployInterval);
    setDeployStatus('idle');
    setDeployProgress(0);
    setToastMessage({ text: '部署已取消', type: 'info' });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Calculate Price
  const basePrice = gpuType === 'NVIDIA A100' ? 3.5 : 4.8;
  const price = basePrice * gpuCount * (billing === 'Reserved' ? 730 * 0.8 : 1);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">模型大厅</h1>
        <p className="text-[var(--color-text-secondary)]">发现并部署经过预优化的基础模型。</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <div 
            key={model.id} 
            onClick={() => { if (!deployedModels.includes(model.id)) setSelectedModel(model); }}
            className="glass-panel rounded-3xl p-6 group hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden"
            data-particle-color={model.color}
          >
            {/* Ambient Glow on Hover */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: `radial-gradient(circle at 50% 100%, ${model.color}20 0%, transparent 70%)` }}
            />
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 transition-shadow duration-300"
                style={{ boxShadow: `0 0 20px ${model.color}20` }}
              >
                <BoxIcon color={model.color} />
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); /* handle star */ }}
                className="text-[var(--color-text-secondary)] hover:text-white transition-colors"
              >
                <Star className="w-5 h-5" />
              </button>
            </div>

            <div className="relative z-10">
              <h3 className="text-xl font-semibold tracking-tight mb-1 flex items-center gap-2">
                {model.name}
                {deployedModels.includes(model.id) && (
                  <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--color-success-start)]/10 text-[var(--color-success-start)] border border-[var(--color-success-start)]/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-success-start)] neon-breathe-green" />
                    运行中
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-xs font-medium px-2 py-1 rounded-md bg-white/10 text-[var(--color-text-secondary)]">
                  {model.type}
                </span>
                <span className="text-xs font-medium px-2 py-1 rounded-md bg-white/10 text-[var(--color-text-secondary)]">
                  {model.size}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
                  <Zap className="w-3.5 h-3.5" />
                  <span>推荐: {model.recommended}</span>
                </div>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if (!deployedModels.includes(model.id)) setSelectedModel(model); 
                  }}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                    deployedModels.includes(model.id)
                      ? 'text-[var(--color-success-start)] bg-[var(--color-success-start)]/10 border border-[var(--color-success-start)]/20 cursor-default'
                      : 'text-white bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {deployedModels.includes(model.id) ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                  {deployedModels.includes(model.id) ? '已部署' : '部署'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-500 ${selectedModel ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setSelectedModel(null)} 
      />

      {/* Right Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-[480px] bg-[#120E0B]/95 backdrop-blur-2xl border-l border-white/10 z-[70] transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${selectedModel ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-[#1A1512]/50">
          <h2 className="text-lg font-medium text-gray-100">配置实例</h2>
          <button onClick={() => setSelectedModel(null)} className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Selected Model Card */}
          {selectedModel && (
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/10" style={{ backgroundColor: `${selectedModel.color}20`, borderColor: `${selectedModel.color}30` }}>
                <BoxIcon color={selectedModel.color} />
              </div>
              <div>
                <div className="text-xs font-mono text-[var(--color-text-secondary)] mb-1 uppercase tracking-wider">已选模型</div>
                <div className="text-base font-medium text-white">{selectedModel.name}</div>
              </div>
            </div>
          )}

          {/* Cluster */}
          <div className="space-y-3">
            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider flex items-center gap-2"><Server className="w-3 h-3"/> 集群区域</label>
            <div className="relative">
              <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-gray-200 focus:outline-none focus:border-[var(--color-accent-start)]/50 appearance-none transition-colors">
                <option>美东 (弗吉尼亚北部)</option>
                <option>美西 (俄勒冈)</option>
                <option>欧洲中部 (法兰克福)</option>
                <option>亚太东北 (东京)</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* GPU Model */}
          <div className="space-y-3">
            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider flex items-center gap-2"><Cpu className="w-3 h-3"/> GPU 加速器</label>
            <div className="grid grid-cols-2 gap-3">
              {['NVIDIA A100', 'NVIDIA H100'].map(gpu => (
                <button
                  key={gpu}
                  onClick={() => setGpuType(gpu)}
                  className={`p-3 rounded-xl border text-left transition-all ${gpuType === gpu ? 'bg-[var(--color-accent-start)]/10 border-[var(--color-accent-start)]/50 text-[var(--color-accent-start)]' : 'bg-black/20 border-white/5 text-gray-400 hover:border-white/10'}`}
                >
                  <div className="text-sm font-medium">{gpu}</div>
                  <div className="text-[10px] font-mono mt-1 opacity-70">{gpu === 'NVIDIA A100' ? '80GB VRAM' : '80GB HBM3'}</div>
                </button>
              ))}
            </div>
          </div>

          {/* GPU Count */}
          <div className="space-y-3">
            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">GPU 数量</label>
            <div className="flex bg-black/40 rounded-xl p-1 border border-white/5">
              {[1, 2, 4, 8].map(num => (
                <button
                  key={num}
                  onClick={() => setGpuCount(num)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${gpuCount === num ? 'bg-[var(--color-accent-start)]/20 text-[var(--color-accent-start)] shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Disk & Storage */}
          <div className="space-y-5">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider flex items-center gap-2"><HardDrive className="w-3 h-3"/> 系统盘</label>
                <span className="text-xs text-[var(--color-accent-start)] font-mono bg-[var(--color-accent-start)]/10 px-2 py-0.5 rounded">{diskSize} GB</span>
              </div>
              <input type="range" min="50" max="2000" step="50" value={diskSize} onChange={(e) => setDiskSize(Number(e.target.value))} className="w-full accent-[var(--color-accent-start)] h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider flex items-center gap-2"><Database className="w-3 h-3"/> 云存储</label>
              <div className="relative">
                <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-gray-200 focus:outline-none focus:border-[var(--color-accent-start)]/50 appearance-none transition-colors">
                  <option>无</option>
                  <option>BitaHub NFS (1TB) - $10/月</option>
                  <option>S3 兼容 (自动扩容)</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Access Method */}
          <div className="space-y-3">
            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">访问方式</label>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setAccessSSH(!accessSSH)} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${accessSSH ? 'bg-[var(--color-accent-start)]/10 border-[var(--color-accent-start)]/30 text-[var(--color-accent-start)]' : 'bg-black/20 border-white/5 text-gray-400'}`}>
                <Terminal className="w-4 h-4" /> 
                <span className="text-sm font-medium">SSH</span>
              </button>
              <button onClick={() => setAccessVNC(!accessVNC)} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${accessVNC ? 'bg-[var(--color-accent-start)]/10 border-[var(--color-accent-start)]/30 text-[var(--color-accent-start)]' : 'bg-black/20 border-white/5 text-gray-400'}`}>
                <Monitor className="w-4 h-4" /> 
                <span className="text-sm font-medium">VNC</span>
              </button>
            </div>
          </div>

          {/* Billing */}
          <div className="space-y-3">
            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider flex items-center gap-2"><CreditCard className="w-3 h-3"/> Billing Cycle</label>
            <div className="flex bg-black/40 rounded-xl p-1 border border-white/5 relative">
              {['On-Demand', 'Reserved'].map(cycle => (
                <button
                  key={cycle}
                  onClick={() => setBilling(cycle)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all z-10 ${billing === cycle ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  {cycle}
                </button>
              ))}
              <div 
                className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white/10 rounded-lg transition-all duration-300 ease-out"
                style={{ left: billing === 'On-Demand' ? '4px' : 'calc(50% + 2px)' }}
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-[#1A1512]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">预估费用</span>
            <span className="text-2xl font-light text-[var(--color-accent-start)]">${price.toFixed(2)}<span className="text-sm text-gray-500">/{billing === 'On-Demand' ? 'hr' : 'mo'}</span></span>
          </div>
          {selectedModel && deployedModels.includes(selectedModel.id) && deployStatus !== 'success' ? (
            <div className="flex gap-3">
              <button 
                onClick={() => setSelectedModel(null)}
                className="flex-1 py-4 rounded-xl bg-white/5 text-gray-300 border border-white/10 font-medium text-lg flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
              >
                返回大厅
              </button>
              <button 
                onClick={() => setActiveTab('services')}
                className="flex-1 py-4 rounded-xl bg-[var(--color-success-start)]/10 text-[var(--color-success-start)] border border-[var(--color-success-start)]/30 font-medium text-lg flex items-center justify-center gap-2 hover:bg-[var(--color-success-start)]/20 transition-colors neon-breathe-green"
              >
                <CheckCircle2 className="w-5 h-5" />
                去体验
              </button>
            </div>
          ) : deployStatus === 'deploying' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white font-medium flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[var(--color-accent-start)] border-t-transparent rounded-full animate-spin" />
                  正在分配计算资源...
                </span>
                <span className="text-[var(--color-accent-start)] font-mono">{deployProgress}%</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[var(--color-accent-start)] to-[var(--color-accent-end)] transition-all duration-300 ease-out"
                  style={{ width: `${deployProgress}%` }}
                />
              </div>
              <button 
                onClick={handleCancelDeploy}
                className="w-full py-3 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium"
              >
                取消部署
              </button>
            </div>
          ) : deployStatus === 'success' ? (
            <div className="w-full py-4 rounded-xl bg-[var(--color-success-start)]/10 border border-[var(--color-success-start)]/30 text-[var(--color-success-start)] font-medium text-lg flex items-center justify-center gap-2 neon-breathe-green">
              <CheckCircle2 className="w-5 h-5" />
              部署成功
            </div>
          ) : deployStatus === 'error' ? (
            <div className="space-y-3">
              <div className="w-full py-4 rounded-xl bg-[var(--color-warn-start)]/10 border border-[var(--color-warn-start)]/30 text-[var(--color-warn-start)] font-medium text-lg flex items-center justify-center gap-2">
                <X className="w-5 h-5" />
                部署失败
              </div>
              <button 
                onClick={handleDeploy}
                className="w-full py-3 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors text-sm font-medium"
              >
                重新尝试
              </button>
            </div>
          ) : (
            <button 
              onClick={handleDeploy} 
              className="w-full py-4 rounded-xl font-medium text-lg transition-all duration-300 bg-gradient-to-r from-[var(--color-accent-start)] to-[var(--color-accent-end)] text-white hover:shadow-[0_0_30px_rgba(0,122,255,0.4)] neon-breathe-blue"
            >
              部署到控制台
            </button>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ${toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
        <div className={`backdrop-blur-md text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 border ${
          toastMessage?.type === 'error' ? 'bg-[var(--color-warn-start)]/20 border-[var(--color-warn-start)]/50 shadow-[0_0_20px_rgba(255,59,48,0.3)]' :
          toastMessage?.type === 'info' ? 'bg-white/10 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]' :
          'bg-[var(--color-success-start)]/20 border-[var(--color-success-start)]/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
        }`}>
          {toastMessage?.type === 'error' ? <X className="w-5 h-5 text-[var(--color-warn-start)]" /> : 
           toastMessage?.type === 'info' ? <Terminal className="w-5 h-5 text-gray-300" /> :
           <CheckCircle2 className="w-5 h-5 text-[var(--color-success-start)]" />}
          <span className="font-medium">{toastMessage?.text}</span>
        </div>
      </div>
    </div>
  );
}

function BoxIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  );
}
