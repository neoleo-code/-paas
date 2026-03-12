import React, { useState } from 'react';
import { Play, Terminal, Settings, Activity, Cpu, Server, MessageSquare, Image as ImageIcon, Mic, Square, Download } from 'lucide-react';
import { models } from './ModelHub';

interface ServiceListProps {
  deployedModels: string[];
  onStopService: (modelId: string) => void;
}

export default function ServiceList({ deployedModels, onStopService }: ServiceListProps) {
  const [activeExperience, setActiveExperience] = useState<string | null>(null);
  const [activeDetail, setActiveDetail] = useState<{ type: 'settings' | 'terminal', modelId: string } | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);

  const deployedServices = models.filter(m => deployedModels.includes(m.id));

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
        <div className="space-y-6 animate-in fade-in duration-500">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight mb-1 flex items-center gap-3">
                <button 
                  onClick={() => setActiveDetail(null)}
                  className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg"
                >
                  返回列表
                </button>
                {model?.name} 服务设置
              </h1>
              <p className="text-[var(--color-text-secondary)] text-sm">配置模型推理参数与运行环境。</p>
            </div>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel rounded-3xl p-6 space-y-6">
              <h2 className="text-lg font-medium">推理参数</h2>
              
              <div className="space-y-3">
                <label className="text-sm text-[var(--color-text-secondary)] flex justify-between">
                  <span>Temperature</span>
                  <span className="text-white">0.7</span>
                </label>
                <input type="range" min="0" max="2" step="0.1" defaultValue="0.7" className="w-full accent-[var(--color-accent-start)] h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
              </div>

              <div className="space-y-3">
                <label className="text-sm text-[var(--color-text-secondary)] flex justify-between">
                  <span>Max Tokens</span>
                  <span className="text-white">4096</span>
                </label>
                <input type="range" min="256" max="8192" step="256" defaultValue="4096" className="w-full accent-[var(--color-accent-start)] h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
              </div>
              
              <div className="space-y-3">
                <label className="text-sm text-[var(--color-text-secondary)]">System Prompt</label>
                <textarea 
                  className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-gray-200 focus:outline-none focus:border-[var(--color-accent-start)]/50 transition-colors resize-none"
                  defaultValue="You are a helpful AI assistant."
                />
              </div>
            </div>

            <div className="glass-panel rounded-3xl p-6 space-y-6">
              <h2 className="text-lg font-medium">运行环境</h2>
              
              <div className="space-y-3">
                <label className="text-sm text-[var(--color-text-secondary)] flex justify-between">
                  <span>最小副本数 (Min Replicas)</span>
                  <span className="text-white">1</span>
                </label>
                <input type="range" min="0" max="5" step="1" defaultValue="1" className="w-full accent-[var(--color-success-start)] h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
              </div>

              <div className="space-y-3">
                <label className="text-sm text-[var(--color-text-secondary)] flex justify-between">
                  <span>最大副本数 (Max Replicas)</span>
                  <span className="text-white">5</span>
                </label>
                <input type="range" min="1" max="10" step="1" defaultValue="5" className="w-full accent-[var(--color-success-start)] h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
              </div>

              <div className="pt-4">
                <button 
                  onClick={() => setActiveDetail(null)}
                  className="w-full py-3 rounded-xl bg-[var(--color-accent-start)] text-white font-medium hover:bg-[var(--color-accent-end)] transition-colors hover:neon-breathe-blue"
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
        <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-8rem)] flex flex-col">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight mb-1 flex items-center gap-3">
                <button 
                  onClick={() => setActiveDetail(null)}
                  className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg"
                >
                  返回列表
                </button>
                {model?.name} 运行日志
              </h1>
              <p className="text-[var(--color-text-secondary)] text-sm">实时查看服务容器的控制台输出。</p>
            </div>
            <div className="flex gap-2">
               <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors">清空</button>
               <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors flex items-center gap-2"><Download className="w-4 h-4"/> 导出</button>
            </div>
          </header>

          <div className="flex-1 glass-panel rounded-3xl overflow-hidden flex flex-col relative border border-white/10 bg-[#0a0a0a]">
            <div className="flex-1 overflow-y-auto p-6 font-mono text-xs space-y-2">
              <div className="text-gray-500">[{new Date().toISOString()}] <span className="text-blue-400">INFO</span> Starting service {model?.name}...</div>
              <div className="text-gray-500">[{new Date().toISOString()}] <span className="text-blue-400">INFO</span> Loading weights into GPU memory (0/4)...</div>
              <div className="text-gray-500">[{new Date().toISOString()}] <span className="text-blue-400">INFO</span> Loading weights into GPU memory (4/4)...</div>
              <div className="text-gray-500">[{new Date().toISOString()}] <span className="text-green-400">SUCCESS</span> Model loaded successfully.</div>
              <div className="text-gray-500">[{new Date().toISOString()}] <span className="text-blue-400">INFO</span> Server listening on 0.0.0.0:8000</div>
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
      <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-8rem)] flex flex-col">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight mb-1 flex items-center gap-3">
              <button 
                onClick={() => setActiveExperience(null)}
                className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg"
              >
                返回列表
              </button>
              {model?.name} 体验终端
            </h1>
            <p className="text-[var(--color-text-secondary)] text-sm">实时交互测试您的部署模型。</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--color-success-start)]/10 text-[var(--color-success-start)] border border-[var(--color-success-start)]/20">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-success-start)] neon-breathe-green" />
              服务运行中
            </span>
          </div>
        </header>

        <div className="flex-1 glass-panel rounded-3xl overflow-hidden flex flex-col relative border border-white/10">
          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 ${
                  msg.role === 'user' 
                    ? 'bg-[var(--color-accent-start)] text-white rounded-tr-sm' 
                    : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-black/40 border-t border-white/5">
            <form onSubmit={handleSendMessage} className="relative flex items-center">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="输入消息以测试模型..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3.5 text-sm text-white focus:outline-none focus:border-[var(--color-accent-start)]/50 focus:neon-breathe-blue transition-all"
              />
              <button 
                type="submit"
                disabled={!chatInput.trim()}
                className="absolute right-2 p-2 rounded-lg bg-[var(--color-accent-start)] text-white hover:bg-[var(--color-accent-end)] hover:neon-breathe-blue disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:animate-none transition-all"
              >
                <Play className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">服务列表</h1>
        <p className="text-[var(--color-text-secondary)]">管理和体验您已部署的 AI 模型服务。</p>
      </header>

      {deployedServices.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 flex flex-col items-center justify-center text-center border border-white/5">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            <Server className="w-8 h-8 text-[var(--color-text-secondary)]" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">暂无运行中的服务</h3>
          <p className="text-[var(--color-text-secondary)] max-w-sm mb-6">
            您还没有部署任何模型。请前往模型大厅选择并部署您的第一个模型。
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {deployedServices.map((service) => (
            <div key={service.id} className="glass-panel rounded-2xl p-5 flex items-center justify-between group hover:bg-white/5 transition-colors border border-white/5 hover:border-white/10">
              <div className="flex items-center gap-5">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border border-white/10"
                  style={{ boxShadow: `0 0 15px ${service.color}15` }}
                >
                  {service.type === 'LLM' ? <MessageSquare className="w-5 h-5" color={service.color} /> : 
                   service.type === 'Image' ? <ImageIcon className="w-5 h-5" color={service.color} /> : 
                   <Mic className="w-5 h-5" color={service.color} />}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-medium text-white">{service.name}</h3>
                    <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--color-success-start)]/10 text-[var(--color-success-start)] border border-[var(--color-success-start)]/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-success-start)] neon-breathe-green" />
                      运行中
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[var(--color-text-secondary)]">
                    <span className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5" /> {service.recommended}</span>
                    <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5" /> 正常</span>
                    <span className="font-mono bg-white/5 px-1.5 py-0.5 rounded text-gray-400">API: /v1/models/{service.id}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setActiveDetail({ type: 'settings', modelId: service.id })}
                  title="服务设置"
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--color-text-secondary)] hover:text-white transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setActiveDetail({ type: 'terminal', modelId: service.id })}
                  title="运行日志"
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--color-text-secondary)] hover:text-white transition-colors"
                >
                  <Terminal className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => onStopService(service.id)}
                  title="停止服务"
                  className="p-2 rounded-lg bg-[var(--color-warn-start)]/10 text-[var(--color-warn-start)] hover:bg-[var(--color-warn-start)]/20 transition-colors hover:neon-breathe-red"
                >
                  <Square className="w-4 h-4 fill-current" />
                </button>
                <button 
                  onClick={() => handleExperience(service.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-accent-start)]/10 text-[var(--color-accent-start)] border border-[var(--color-accent-start)]/20 hover:bg-[var(--color-accent-start)]/20 transition-colors font-medium text-sm hover:neon-breathe-blue"
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
