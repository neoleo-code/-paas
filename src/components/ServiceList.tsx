import React, { useState } from 'react';
import { Play, Terminal, Settings, Activity, Cpu, Server, MessageSquare, Image as ImageIcon, Mic, Square, Download, Rocket } from 'lucide-react';
import { models } from './ModelHub';

interface ServiceListProps {
  deployedModels: string[];
  onStopService: (modelId: string) => void;
  onQuickDeploy: () => void;
}

export default function ServiceList({ deployedModels, onStopService, onQuickDeploy }: ServiceListProps) {
  const [activeExperience, setActiveExperience] = useState<string | null>(null);
  const [activeDetail, setActiveDetail] = useState<{ type: 'settings' | 'terminal', modelId: string } | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);

  const deployedServices = [
    ...models.filter(m => deployedModels.includes(m.id)),
    // Add some default mock services for display
    { id: 'llama3-prod', name: 'Llama 3 70B (Production)', type: 'LLM', size: '140GB', recommended: 'A100 x4', color: '#00C6FF' },
    { id: 'sdxl-api', name: 'SDXL Turbo API', type: 'Image', size: '12GB', recommended: 'A100 x1', color: '#FF2D55' },
    { id: 'whisper-realtime', name: 'Whisper v3 Realtime', type: 'Audio', size: '8GB', recommended: 'T4 x2', color: '#32D74B' },
  ];

  const handleExperience = (modelId: string) => {
    setActiveExperience(modelId);
    setMessages([{ role: 'assistant', content: `Hello! I am ready to assist you. How can I help you today?` }]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const newMessages = [...messages, { role: 'user' as const, content: chatInput }];
    setMessages(newMessages);
    setChatInput('');
    
    // Mock response
    setTimeout(() => {
      setMessages([...newMessages, { role: 'assistant', content: `This is a simulated response from the deployed model.` }]);
    }, 1000);
  };

  if (activeDetail) {
    const model = models.find(m => m.id === activeDetail.modelId);
    
    if (activeDetail.type === 'settings') {
      return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">
          <header className="flex justify-between items-end px-2">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] font-semibold mb-1">
                服务配置 (Service Configuration)
              </div>
              <h1 className="text-3xl font-light tracking-tight flex items-center gap-4">
                <button 
                  onClick={() => setActiveDetail(null)}
                  className="text-xs uppercase tracking-widest font-medium text-[var(--color-text-secondary)] hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg"
                >
                  返回列表
                </button>
                {model?.name}
              </h1>
            </div>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel rounded-3xl p-8 space-y-8">
              <h2 className="text-lg font-medium">推理参数</h2>
              
              <div className="space-y-4">
                <label className="text-[11px] uppercase tracking-widest text-[var(--color-text-tertiary)] flex justify-between font-semibold">
                  <span>Temperature</span>
                  <span className="text-white font-mono">0.7</span>
                </label>
                <input type="range" min="0" max="2" step="0.1" defaultValue="0.7" className="w-full accent-[var(--color-accent-start)] h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
              </div>

              <div className="space-y-4">
                <label className="text-[11px] uppercase tracking-widest text-[var(--color-text-tertiary)] flex justify-between font-semibold">
                  <span>Max Tokens</span>
                  <span className="text-white font-mono">4096</span>
                </label>
                <input type="range" min="256" max="8192" step="256" defaultValue="4096" className="w-full accent-[var(--color-accent-start)] h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
              </div>
              
              <div className="space-y-4">
                <label className="text-[11px] uppercase tracking-widest text-[var(--color-text-tertiary)] font-semibold">System Prompt</label>
                <textarea 
                  className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-gray-200 focus:outline-none focus:border-[var(--color-accent-start)]/50 transition-colors resize-none leading-relaxed"
                  defaultValue="You are a helpful AI assistant."
                />
              </div>
            </div>

            <div className="glass-panel rounded-3xl p-8 space-y-8">
              <h2 className="text-lg font-medium">运行环境</h2>
              
              <div className="space-y-4">
                <label className="text-[11px] uppercase tracking-widest text-[var(--color-text-tertiary)] flex justify-between font-semibold">
                  <span>最小副本数 (Min Replicas)</span>
                  <span className="text-white font-mono">1</span>
                </label>
                <input type="range" min="0" max="5" step="1" defaultValue="1" className="w-full accent-[var(--color-status-complete)] h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
              </div>

              <div className="space-y-4">
                <label className="text-[11px] uppercase tracking-widest text-[var(--color-text-tertiary)] flex justify-between font-semibold">
                  <span>最大副本数 (Max Replicas)</span>
                  <span className="text-white font-mono">5</span>
                </label>
                <input type="range" min="1" max="10" step="1" defaultValue="5" className="w-full accent-[var(--color-status-complete)] h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
              </div>

              <div className="pt-8">
                <button 
                  onClick={() => setActiveDetail(null)}
                  className="w-full py-4 rounded-2xl bg-[var(--color-accent-start)] text-white font-semibold uppercase tracking-[0.2em] text-xs hover:bg-[var(--color-accent-end)] transition-all hover:neon-breathe-amber shadow-lg shadow-[var(--color-accent-start)]/20"
                >
                  保存配置
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeDetail.type === 'terminal') {
      return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500 h-[calc(100vh-8rem)]">
          <header className="flex justify-between items-end px-2">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] font-semibold mb-1">
                系统控制台 (System Console)
              </div>
              <h1 className="text-3xl font-light tracking-tight flex items-center gap-4">
                <button 
                  onClick={() => setActiveDetail(null)}
                  className="text-xs uppercase tracking-widest font-medium text-[var(--color-text-secondary)] hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg"
                >
                  返回列表
                </button>
                {model?.name} 运行日志
              </h1>
            </div>
            <div className="flex gap-3">
               <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs uppercase tracking-widest font-semibold transition-colors">清空</button>
               <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs uppercase tracking-widest font-semibold transition-colors flex items-center gap-2"><Download className="w-4 h-4"/> 导出</button>
            </div>
          </header>

          <div className="flex-1 glass-panel rounded-3xl overflow-hidden flex flex-col relative border border-white/10 bg-[#0a0a0a]/80">
            <div className="flex-1 overflow-y-auto p-8 font-mono text-[11px] space-y-3 leading-relaxed">
              <div className="text-gray-500">[{new Date().toISOString()}] <span className="text-amber-400">INFO</span> Starting service {model?.name}...</div>
              <div className="text-gray-500">[{new Date().toISOString()}] <span className="text-amber-400">INFO</span> Loading weights into GPU memory (0/4)...</div>
              <div className="text-gray-500">[{new Date().toISOString()}] <span className="text-amber-400">INFO</span> Loading weights into GPU memory (4/4)...</div>
              <div className="text-gray-500">[{new Date().toISOString()}] <span className="text-[var(--color-status-complete)]">SUCCESS</span> Model loaded successfully.</div>
              <div className="text-gray-500">[{new Date().toISOString()}] <span className="text-amber-400">INFO</span> Server listening on 0.0.0.0:8000</div>
              <div className="text-gray-500">[{new Date().toISOString()}] <span className="text-purple-400">HTTP</span> GET /health 200 OK - 2ms</div>
              <div className="text-gray-500">[{new Date().toISOString()}] <span className="text-purple-400">HTTP</span> POST /v1/completions 200 OK - 842ms</div>
              <div className="text-gray-500">[{new Date().toISOString()}] <span className="text-purple-400">HTTP</span> POST /v1/completions 200 OK - 1024ms</div>
              <div className="w-2 h-4 bg-gray-400 animate-pulse mt-2"></div>
            </div>
          </div>
        </div>
      );
    }
  }

  if (activeExperience) {
    const model = models.find(m => m.id === activeExperience);
    return (
      <div className="flex flex-col gap-8 animate-in fade-in duration-500 h-[calc(100vh-8rem)]">
        <header className="flex justify-between items-end px-2">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] font-semibold mb-1">
              交互体验 (Interactive Experience)
            </div>
            <h1 className="text-3xl font-light tracking-tight flex items-center gap-4">
              <button 
                onClick={() => setActiveExperience(null)}
                className="text-xs uppercase tracking-widest font-medium text-[var(--color-text-secondary)] hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg"
              >
                返回列表
              </button>
              {model?.name} 体验终端
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-2 text-[11px] uppercase tracking-wider px-4 py-1.5 rounded-full bg-white/5 text-[var(--color-status-complete)]">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-status-complete)] shadow-[0_0_8px_var(--color-status-complete)]" />
              服务运行中
            </span>
          </div>
        </header>

        <div className="flex-1 glass-panel rounded-3xl overflow-hidden flex flex-col relative border border-white/10">
          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                  msg.role === 'user' 
                    ? 'bg-[var(--color-accent-start)] text-white rounded-tr-sm shadow-lg shadow-[var(--color-accent-start)]/20' 
                    : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-black/40 border-t border-white/5">
            <form onSubmit={handleSendMessage} className="relative flex items-center max-w-4xl mx-auto">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="输入消息以测试模型..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-6 pr-16 py-4 text-sm text-white focus:outline-none focus:border-[var(--color-accent-start)]/50 transition-all"
              />
              <button 
                type="submit"
                disabled={!chatInput.trim()}
                className="absolute right-2 p-2.5 rounded-xl bg-[var(--color-accent-start)] text-white hover:bg-[var(--color-accent-end)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      <header className="flex justify-between items-end px-2">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] font-semibold mb-1">
            服务管理 (Service Management)
          </div>
          <h1 className="text-3xl font-light tracking-tight">服务列表</h1>
        </div>
        <button 
          onClick={onQuickDeploy}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[var(--color-accent-start)] text-white font-semibold uppercase tracking-[0.2em] text-xs hover:bg-[var(--color-accent-end)] transition-all hover:neon-breathe-amber shadow-lg shadow-[var(--color-accent-start)]/20"
        >
          <Rocket className="w-4 h-4" />
          快速部署
        </button>
      </header>

      {deployedServices.length === 0 ? (
        <div className="glass-panel rounded-[2rem] p-16 flex flex-col items-center justify-center text-center border border-white/5">
          <div className="w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center mb-6">
            <Server className="w-10 h-10 text-[var(--color-text-tertiary)]" />
          </div>
          <h3 className="text-2xl font-light text-white mb-3">暂无运行中的服务</h3>
          <p className="text-[var(--color-text-tertiary)] max-w-sm mb-8 leading-relaxed">
            您还没有部署任何模型。请前往模型大厅选择并部署您的第一个模型。
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {deployedServices.map((service) => (
            <div key={service.id} className="glass-panel rounded-3xl p-6 flex items-center justify-between group hover:bg-white/5 transition-all border border-white/5 hover:border-white/10">
              <div className="flex items-center gap-6">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10"
                  style={{ boxShadow: `0 0 20px ${service.color}10` }}
                >
                  {service.type === 'LLM' ? <MessageSquare className="w-6 h-6" color={service.color} /> : 
                   service.type === 'Image' ? <ImageIcon className="w-6 h-6" color={service.color} /> : 
                   <Mic className="w-6 h-6" color={service.color} />}
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-xl font-medium text-white">{service.name}</h3>
                    <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold px-3 py-1 rounded-full bg-white/5 text-[var(--color-status-complete)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-status-complete)] shadow-[0_0_8px_var(--color-status-complete)]" />
                      运行中
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-[11px] text-[var(--color-text-tertiary)] font-medium uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Cpu className="w-3.5 h-3.5" /> {service.recommended}</span>
                    <span className="flex items-center gap-2"><Activity className="w-3.5 h-3.5" /> 正常</span>
                    <span className="font-mono bg-white/5 px-2 py-0.5 rounded text-gray-400 normal-case tracking-normal">API: /v1/models/{service.id}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setActiveDetail({ type: 'settings', modelId: service.id })}
                  title="服务设置"
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--color-text-secondary)] hover:text-white transition-all"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setActiveDetail({ type: 'terminal', modelId: service.id })}
                  title="运行日志"
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--color-text-secondary)] hover:text-white transition-all"
                >
                  <Terminal className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => onStopService(service.id)}
                  title="停止服务"
                  className="p-3 rounded-xl bg-[var(--color-status-failed)]/10 text-[var(--color-status-failed)] hover:bg-[var(--color-status-failed)]/20 transition-all"
                >
                  <Square className="w-5 h-5 fill-current" />
                </button>
                <button 
                  onClick={() => handleExperience(service.id)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-accent-start)]/10 text-[var(--color-accent-start)] border border-[var(--color-accent-start)]/20 hover:bg-[var(--color-accent-start)]/20 transition-all font-semibold text-xs uppercase tracking-widest hover:neon-breathe-amber"
                >
                  <Play className="w-4 h-4" />
                  体验
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
