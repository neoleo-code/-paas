import React, { useState } from 'react';
import { ArrowLeft, Settings, Rocket, Code, Cpu, Zap, CheckCircle2, Box } from 'lucide-react';

export interface Model {
  id: string;
  name: string;
  type: string;
  size: string;
  recommended: string;
  color: string;
}

interface ModelDetailProps {
  model: Model;
  onBack: () => void;
}

export default function ModelDetail({ model, onBack }: ModelDetailProps) {
  const [activeCodeTab, setActiveCodeTab] = useState<'curl' | 'python'>('python');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setDeployed(true);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-500 pb-20">
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-white transition-colors group w-fit"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">返回模型列表</span>
      </button>

      {/* Hero Section */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-6">
          <div 
            className="w-20 h-20 rounded-3xl flex items-center justify-center bg-white/5 border border-white/10 relative"
            style={{ boxShadow: `0 0 30px ${model.color}30` }}
          >
            <div className="absolute inset-0 rounded-3xl opacity-20" style={{ background: `radial-gradient(circle at top left, ${model.color}, transparent)` }} />
            <Box className="relative z-10" style={{ color: model.color }} size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-semibold tracking-tight mb-2">{model.name}</h1>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-white/10 text-[var(--color-text-secondary)] border border-white/5">
                {model.type}
              </span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-white/10 text-[var(--color-text-secondary)] border border-white/5">
                {model.size}
              </span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-white/10 text-[var(--color-text-secondary)] border border-white/5 flex items-center gap-1">
                <Zap className="w-3 h-3" /> 已优化
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details & Usage */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Parameters */}
          <section className="space-y-4">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <Settings className="w-5 h-5 text-[var(--color-text-secondary)]" />
              模型参数
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: '上下文窗口', value: model.type === 'LLM' ? '128k' : 'N/A' },
                { label: '最大输出', value: model.type === 'LLM' ? '4096' : '高清' },
                { label: '开源协议', value: 'Apache 2.0' },
                { label: '推理框架', value: 'vLLM / TensorRT' },
              ].map((param, i) => (
                <div key={i} className="glass-panel rounded-2xl p-4 flex flex-col gap-1">
                  <span className="text-xs text-[var(--color-text-secondary)]">{param.label}</span>
                  <span className="text-sm font-medium text-white">{param.value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Usage Examples */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <Code className="w-5 h-5 text-[var(--color-text-secondary)]" />
                调用示例
              </h2>
              <div className="flex bg-black/40 rounded-lg p-1 border border-white/10">
                <button 
                  onClick={() => setActiveCodeTab('python')}
                  className={`text-xs font-medium px-3 py-1.5 rounded-md transition-all ${activeCodeTab === 'python' ? 'bg-white/10 text-white shadow-sm' : 'text-[var(--color-text-secondary)] hover:text-white'}`}
                >
                  Python
                </button>
                <button 
                  onClick={() => setActiveCodeTab('curl')}
                  className={`text-xs font-medium px-3 py-1.5 rounded-md transition-all ${activeCodeTab === 'curl' ? 'bg-white/10 text-white shadow-sm' : 'text-[var(--color-text-secondary)] hover:text-white'}`}
                >
                  cURL
                </button>
              </div>
            </div>
            
            <div className="glass-panel rounded-2xl p-0 overflow-hidden border-white/10">
              <div className="bg-black/40 px-4 py-3 border-b border-white/5 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <span className="text-[10px] font-mono text-[var(--color-text-secondary)] ml-2">
                  {activeCodeTab === 'python' ? 'inference.py' : 'request.sh'}
                </span>
              </div>
              <div className="p-4 overflow-x-auto">
                <pre className="text-sm font-mono leading-relaxed text-gray-300">
                  {activeCodeTab === 'python' ? (
`import openai

client = openai.Client(
    base_url="https://api.bitahub.paas/v1",
    api_key="YOUR_API_KEY"
)

response = client.chat.completions.create(
    model="${model.id}",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain quantum computing."}
    ],
    temperature=0.7,
    max_tokens=1024
)

print(response.choices[0].message.content)`
                  ) : (
`curl https://api.bitahub.paas/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "model": "${model.id}",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Explain quantum computing."}
    ],
    "temperature": 0.7
  }'`
                  )}
                </pre>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Deployment Options */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent-start)]/10 blur-[50px] pointer-events-none" />
            
            <h2 className="text-lg font-medium flex items-center gap-2">
              <Rocket className="w-5 h-5 text-[var(--color-text-secondary)]" />
              快速部署
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-[var(--color-text-secondary)]">目标硬件</label>
                <div className="bg-black/30 border border-[var(--color-accent-start)]/50 rounded-xl p-3 flex items-center justify-between shadow-[0_0_15px_rgba(0,122,255,0.1)] cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Cpu className="text-[var(--color-accent-start)] w-4 h-4" />
                    <span className="text-sm font-medium">{model.recommended}</span>
                  </div>
                  <div className="w-4 h-4 rounded-full border-4 border-[var(--color-accent-start)]" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <label className="text-xs font-medium text-[var(--color-text-secondary)]">初始副本数</label>
                  <span className="text-xs font-mono text-white">1</span>
                </div>
                <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-1/4 bg-[var(--color-accent-start)]" />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={handleDeploy}
                disabled={isDeploying || deployed}
                className={`w-full relative overflow-hidden rounded-xl font-medium text-sm transition-all duration-500 ${
                  deployed 
                    ? 'h-12 bg-[var(--color-success-start)]/20 text-[var(--color-success-start)] border border-[var(--color-success-start)]/50'
                    : isDeploying 
                      ? 'h-12 bg-white/5 border border-white/10 cursor-not-allowed text-white' 
                      : 'h-12 bg-white text-black hover:bg-gray-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                }`}
              >
                {deployed ? (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    部署成功
                  </div>
                ) : isDeploying ? (
                  <div className="absolute inset-0 flex items-center">
                  <div className="h-full bg-white/20 transition-all duration-75 ease-linear neon-breathe-amber w-full animate-pulse" />
                    <span className="absolute inset-0 flex items-center justify-center font-mono text-xs">
                      资源分配中...
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Rocket className="w-4 h-4" />
                    部署到集群
                  </div>
                )}
              </button>
            </div>
            
            <p className="text-[10px] text-center text-[var(--color-text-secondary)] mt-4">
              预估费用: 约 $3.50/小时。按分钟计费。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
