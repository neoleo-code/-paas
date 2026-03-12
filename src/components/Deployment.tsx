import React, { useState } from 'react';
import { Rocket, Cpu, CheckCircle2, CircleDashed, Loader2 } from 'lucide-react';

export default function Deployment() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedHardware, setSelectedHardware] = useState('a100');

  const steps = [
    { id: 0, label: '验证配置', detail: '检查模型兼容性与资源配额...', estimatedTime: '约 2 秒' },
    { id: 1, label: '分配计算资源', detail: '正在调度 GPU 节点...', estimatedTime: '约 5 秒' },
    { id: 2, label: '拉取模型镜像', detail: '从私有仓库下载权重文件...', estimatedTime: '约 15 秒' },
    { id: 3, label: '挂载存储卷', detail: '连接高性能持久化存储...', estimatedTime: '约 5 秒' },
    { id: 4, label: '启动推理引擎', detail: '初始化模型并加载到显存...', estimatedTime: '约 10 秒' },
    { id: 5, label: '执行健康检查', detail: '等待端点响应 /health...', estimatedTime: '约 5 秒' },
    { id: 6, label: '部署完成', detail: '端点已就绪，可接收请求。', estimatedTime: '就绪' }
  ];

  const handleDeploy = () => {
    setIsDeploying(true);
    setProgress(0);
    setCurrentStep(0);
    
    const interval = setInterval(() => {
      setProgress(p => {
        const nextProgress = p + 1;
        
        if (nextProgress >= 100) {
          clearInterval(interval);
          setCurrentStep(6);
          setTimeout(() => {
            setIsDeploying(false);
            setProgress(0);
            setCurrentStep(0);
          }, 3000);
          return 100;
        }
        
        if (nextProgress < 10) setCurrentStep(0);
        else if (nextProgress < 25) setCurrentStep(1);
        else if (nextProgress < 55) setCurrentStep(2);
        else if (nextProgress < 70) setCurrentStep(3);
        else if (nextProgress < 85) setCurrentStep(4);
        else if (nextProgress < 100) setCurrentStep(5);
        
        return nextProgress;
      });
    }, 50);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-700">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">部署模型</h1>
        <p className="text-[var(--color-text-secondary)]">配置带有自动扩缩容的推理端点。</p>
      </header>

      <div className="glass-panel rounded-3xl p-8 space-y-8 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[200px] bg-[var(--color-accent-start)]/10 blur-[80px] pointer-events-none" />

        {/* Form Group 1 */}
        <div className="space-y-3 relative z-10">
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">选择模型</label>
          <div className="relative">
            <select className="w-full appearance-none bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent-start)] focus:neon-breathe-blue transition-all">
              <option>Llama 3 70B (Instruct)</option>
              <option>Stable Diffusion XL</option>
              <option>Whisper v3</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>

        {/* Form Group 2 */}
        <div className="space-y-3 relative z-10">
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">硬件配置</label>
          <div className="grid grid-cols-2 gap-4">
            <div 
              onClick={() => setSelectedHardware('a100')}
              className={`bg-black/30 border rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-all ${
                selectedHardware === 'a100' 
                  ? 'border-[var(--color-accent-start)]/50 neon-breathe-blue' 
                  : 'border-white/10 hover:border-white/30 hover:neon-breathe-blue'
              }`}
            >
              <Cpu className={`w-5 h-5 ${selectedHardware === 'a100' ? 'text-[var(--color-accent-start)]' : 'text-[var(--color-text-secondary)]'}`} />
              <div>
                <div className="font-medium">A100 80GB</div>
                <div className="text-xs text-[var(--color-text-secondary)]">$3.50 / hr</div>
              </div>
            </div>
            <div 
              onClick={() => setSelectedHardware('h100')}
              className={`bg-black/30 border rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-all ${
                selectedHardware === 'h100' 
                  ? 'border-[var(--color-accent-start)]/50 neon-breathe-blue' 
                  : 'border-white/10 hover:border-white/30 hover:neon-breathe-blue'
              }`}
            >
              <Cpu className={`w-5 h-5 ${selectedHardware === 'h100' ? 'text-[var(--color-accent-start)]' : 'text-[var(--color-text-secondary)]'}`} />
              <div>
                <div className="font-medium">H100 80GB</div>
                <div className="text-xs text-[var(--color-text-secondary)]">$4.80 / hr</div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Group 3 - Slider */}
        <div className="space-y-4 relative z-10">
          <div className="flex justify-between items-end">
            <label className="text-sm font-medium text-[var(--color-text-secondary)]">自动扩缩容副本数</label>
            <span className="text-xs font-mono text-[var(--color-accent-start)]">1 - 5</span>
          </div>
          <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-[var(--color-accent-start)] to-[var(--color-accent-end)] shadow-[0_0_10px_rgba(0,198,255,0.8)]" />
          </div>
          <div className="flex justify-between text-xs text-[var(--color-text-secondary)]">
            <span>最小: 1 (关闭缩容至零)</span>
            <span>最大: 5</span>
          </div>
        </div>

        {/* Deploy Button & Progress */}
        <div className="pt-6 relative z-10">
          {!isDeploying ? (
            <button 
              onClick={handleDeploy}
              className="w-full h-14 rounded-2xl font-medium text-lg transition-all duration-500 bg-gradient-to-r from-[var(--color-accent-start)] to-[var(--color-accent-end)] neon-breathe-blue text-white flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(0,122,255,0.4)]"
            >
              <Rocket className="w-5 h-5" />
              部署端点
            </button>
          ) : (
            <div className="space-y-6 bg-black/40 border border-white/10 rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-white">部署进度</h3>
                <span className="text-[var(--color-accent-start)] font-mono font-medium">{progress}%</span>
              </div>
              
              {/* Progress Bar */}
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[var(--color-accent-start)] to-[var(--color-accent-end)] transition-all duration-75 ease-linear neon-breathe-blue"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Steps */}
              <div className="space-y-4 pt-4">
                {steps.map((step, index) => {
                  const isCompleted = currentStep > index;
                  const isCurrent = currentStep === index;
                  const isPending = currentStep < index;

                  return (
                    <div key={step.id} className={`flex items-start gap-4 transition-opacity duration-300 ${isPending ? 'opacity-40' : 'opacity-100'}`}>
                      <div className="mt-0.5">
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-[var(--color-success-start)]" />
                        ) : isCurrent ? (
                          <Loader2 className="w-5 h-5 text-[var(--color-accent-start)] animate-spin" />
                        ) : (
                          <CircleDashed className="w-5 h-5 text-[var(--color-text-secondary)]" />
                        )}
                      </div>
                      <div className="flex-1 w-full">
                        <div className="flex items-center justify-between">
                          <div className={`text-sm font-medium ${isCurrent ? 'text-white' : isCompleted ? 'text-gray-300' : 'text-[var(--color-text-secondary)]'}`}>
                            {step.label}
                          </div>
                          <div className={`text-xs font-mono ${isCurrent ? 'text-[var(--color-accent-start)]' : 'text-[var(--color-text-secondary)]'}`}>
                            {step.estimatedTime}
                          </div>
                        </div>
                        <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                          {step.detail}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
