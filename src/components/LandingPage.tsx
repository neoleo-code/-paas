import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Check, ChevronDown, Box, Sparkles, X, Server, Cpu, HardDrive, Database, Terminal, Monitor, CreditCard, Download, Copy } from 'lucide-react';

interface LandingPageProps {
  onEnter: (tab?: string, modelId?: string) => void;
}

const IMAGES = [
  { id: 'llama3', name: 'Llama 3 70B Instruct', type: 'LLM', icon: Box },
  { id: 'sdxl', name: 'Stable Diffusion XL', type: 'Vision', icon: Sparkles },
  { id: 'whisper', name: 'Whisper v3 Large', type: 'Audio', icon: Box },
];

const COMMUNITY_IMAGES = [
  { name: 'Ubuntu 22.04 + CUDA 12.1', desc: '官方基础镜像，预装最新 CUDA 驱动与常用系统工具。', downloads: '12k', tags: ['Linux', 'CUDA', 'Base'], size: '4.2GB', updated: '2天前', command: 'docker pull bitahub/ubuntu-cuda:12.1' },
  { name: 'PyTorch 2.1.0', desc: '深度学习框架，包含常用视觉和 NLP 库，开箱即用。', downloads: '8.5k', tags: ['PyTorch', 'Python 3.10', 'AI'], size: '6.8GB', updated: '1周前', command: 'docker pull bitahub/pytorch:2.1.0' },
  { name: 'Stable Diffusion WebUI', desc: '预装 AUTOMATIC1111 WebUI 的 AI 绘画环境。', downloads: '45k', tags: ['AIGC', 'Gradio', 'WebUI'], size: '12.5GB', updated: '3天前', command: 'docker pull bitahub/sd-webui:latest' },
  { name: 'vLLM Inference', desc: '高吞吐量大语言模型推理引擎，支持 PagedAttention。', downloads: '3.2k', tags: ['LLM', 'Inference', 'vLLM'], size: '3.1GB', updated: '5小时前', command: 'docker pull bitahub/vllm:latest' },
  { name: 'TensorFlow 2.15', desc: 'Google 开源机器学习框架，包含 TensorBoard。', downloads: '5.1k', tags: ['TensorFlow', 'Keras', 'Google'], size: '7.0GB', updated: '2周前', command: 'docker pull bitahub/tensorflow:2.15' },
  { name: 'JupyterLab Data Science', desc: '包含 Pandas, NumPy, Scikit-learn 等数据科学工具。', downloads: '9.8k', tags: ['Jupyter', 'Data Science', 'Python'], size: '5.5GB', updated: '1个月前', command: 'docker pull bitahub/jupyterlab:data-science' },
];

export default function LandingPage({ onEnter }: LandingPageProps) {
  const [selectedImage, setSelectedImage] = useState(IMAGES[0]);
  const [selectedImageDetail, setSelectedImageDetail] = useState<any | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('home');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Form State
  const [gpuType, setGpuType] = useState('NVIDIA A100');
  const [gpuCount, setGpuCount] = useState(1);
  const [diskSize, setDiskSize] = useState(100);
  const [accessSSH, setAccessSSH] = useState(true);
  const [accessVNC, setAccessVNC] = useState(false);
  const [billing, setBilling] = useState('按量付费');

  // Deployment State
  const [isDeploying, setIsDeploying] = useState(false);
  const [isDeployed, setIsDeployed] = useState(false);

  // Calculate Price
  const basePrice = gpuType === 'NVIDIA A100' ? 3.5 : 4.8;
  const price = basePrice * gpuCount * (billing === '包月' ? 730 * 0.8 : 1);

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setIsDeployed(true);
      setTimeout(() => {
        onEnter('services', selectedImage.id);
      }, 1500);
    }, 1500);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#0F0C09] text-white overflow-x-hidden relative font-sans selection:bg-amber-500/30">
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-amber-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-amber-900/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Top Navigation */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 flex items-center gap-6 px-6 py-2.5 rounded-full border border-white/5 bg-[#1A1512]/80 backdrop-blur-md z-50 shadow-2xl">
        <button onClick={() => setActiveView('home')} className="flex items-center gap-2 text-amber-500 font-semibold text-sm tracking-wide hover:opacity-80 transition-opacity">
          <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" /> 
          BitaHub
        </button>
        <div className="w-px h-4 bg-white/10" />
        <button onClick={() => setActiveView('images')} className={`text-sm transition-colors ${activeView === 'images' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>镜像社区</button>
        <button onClick={() => setActiveView('deploy')} className={`text-sm transition-colors ${activeView === 'deploy' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>部署GPU实例</button>
        <button onClick={() => setActiveView('help')} className={`text-sm transition-colors ${activeView === 'help' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>帮助中心</button>
      </nav>

      {/* Main Content */}
      {activeView === 'home' && (
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-8 min-h-screen flex items-center relative">
            {/* Left Column */}
          <div className="w-full lg:w-5/12 space-y-8 relative z-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 text-amber-500 text-[10px] font-mono tracking-widest uppercase bg-amber-500/5">
            系统运行中_
          </div>
          
          <h1 className="text-6xl lg:text-7xl font-light tracking-tight text-gray-100 leading-[1.1]">
            智能推理 <br /> 引擎
          </h1>
          
          <p className="text-lg text-gray-400 max-w-md leading-relaxed font-light">
            BitaHub 将原始算力转化为结构化的智能网络，让复杂的模型部署变成无缝的洞察编排。
          </p>

          {/* Image Selection */}
          <div className="pt-2 pb-2 relative" ref={dropdownRef}>
            <p className="text-[11px] text-gray-500 font-mono mb-3 uppercase tracking-wider">选择基础镜像_</p>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full max-w-sm flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 bg-[#1A1512]/80 backdrop-blur-md hover:border-amber-500/50 hover:bg-[#221C18] transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors">
                  <selectedImage.icon className="w-4 h-4 text-amber-500" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-200">{selectedImage.name}</span>
                  <span className="text-[10px] font-mono text-gray-500">{selectedImage.type}</span>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-full max-w-sm rounded-xl border border-white/10 bg-[#1A1512]/95 backdrop-blur-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {IMAGES.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => {
                      setSelectedImage(img);
                      setIsDropdownOpen(false);
                      setIsSidebarOpen(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${selectedImage.id === img.id ? 'bg-amber-500/20 border-amber-500/30' : 'bg-white/5 border-white/10'}`}>
                      <img.icon className={`w-4 h-4 ${selectedImage.id === img.id ? 'text-amber-500' : 'text-gray-400'}`} />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className={`text-sm font-medium ${selectedImage.id === img.id ? 'text-amber-500' : 'text-gray-300'}`}>{img.name}</span>
                      <span className="text-[10px] font-mono text-gray-500">{img.type}</span>
                    </div>
                    {selectedImage.id === img.id && (
                      <Check className="w-4 h-4 text-amber-500 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-6 pt-4 cursor-pointer group w-fit" onClick={() => setIsSidebarOpen(true)}>
            <div className="w-14 h-14 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 flex items-center justify-center neon-breathe-amber transition-all duration-500 group-hover:scale-105">
              <ArrowUp className="text-black w-6 h-6 rotate-45 group-hover:rotate-90 transition-transform duration-500" />
            </div>
            <span className="font-medium text-gray-200 group-hover:text-white transition-colors tracking-wide">配置部署</span>
          </div>
        </div>

        {/* Right Column - Isometric Graphic */}
        <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[900px] h-[900px] pointer-events-none hidden lg:block animate-in fade-in duration-1000 delay-300">
          {/* Floating Top Check Icon */}
          <div className="absolute top-[10%] left-[40%] z-30 flex items-center justify-center animate-[bounce_4s_ease-in-out_infinite]">
            <div className="absolute w-24 h-24 rounded-full border border-amber-500/20 bg-[#1A1512]/50 backdrop-blur-md" />
            <div className="w-12 h-12 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.4)] relative z-10">
              <Check className="text-black w-5 h-5" />
            </div>
          </div>

          {/* Skewed Container */}
          <div 
            className="w-full h-full relative" 
            style={{ 
              transform: 'perspective(2000px) rotateY(-25deg) rotateX(20deg) rotateZ(-5deg) scale(0.9)',
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Main Board Background */}
            <div className="absolute inset-20 rounded-[40px] border border-white/5 bg-[#1A1512]/40 backdrop-blur-md shadow-2xl" />
            
            {/* SVG Connections */}
            <svg className="absolute inset-0 w-full h-full z-10" style={{ filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.4))' }}>
              <path d="M 300 300 C 450 300, 450 450, 450 450 C 450 450, 450 650, 250 650" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="8 8" className="opacity-60 animate-[dash_20s_linear_infinite]" />
              <path d="M 650 320 C 450 320, 450 450, 450 450 C 450 450, 450 700, 700 700" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="8 8" className="opacity-60 animate-[dash_20s_linear_infinite]" />
              <path d="M 250 650 C 350 650, 450 550, 700 700" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="8 8" className="opacity-30 animate-[dash_25s_linear_infinite_reverse]" />
            </svg>

            {/* Nodes */}
            <NodeCard x={150} y={220} label="SRC_TTOK" delay="0s" />
            <NodeCard x={500} y={240} label="SRC_YT" delay="1s" />
            <NodeCard x={100} y={570} label="SRC_REEL" delay="2s" />
            <NodeCard x={550} y={620} label="SRC_TTOK" delay="3s" />
          </div>
        </div>
      </div>

      {/* Image Selection Section */}
      <div className="max-w-7xl mx-auto px-8 py-24 border-t border-white/5">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-4xl font-light mb-2 text-gray-100">推荐镜像</h2>
            <p className="text-gray-400">探索并使用预配置的深度学习环境和基础模型镜像。</p>
          </div>
          <button onClick={() => setActiveView('images')} className="text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1">
            查看全部 <ArrowUp className="w-4 h-4 rotate-45" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COMMUNITY_IMAGES.slice(0, 3).map((img, i) => (
            <div key={i} onClick={() => setSelectedImageDetail(img)} className="p-6 rounded-2xl border border-white/10 bg-[#1A1512]/50 hover:bg-[#221C18] hover:border-amber-500/30 transition-all cursor-pointer group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 mb-5 group-hover:bg-amber-500/20 transition-colors">
                <Box className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-200 mb-2">{img.name}</h3>
              <p className="text-sm text-gray-400 mb-6 line-clamp-2">{img.desc}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono">
                  <Download className="w-3.5 h-3.5" /> {img.downloads} 次下载
                </div>
                <button onClick={(e) => { e.stopPropagation(); setIsSidebarOpen(true); }} className="text-xs font-medium text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-full transition-colors">
                  部署此镜像
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    )}

      {/* Images View */}
      {activeView === 'images' && (
        <div className="max-w-7xl mx-auto px-8 pt-32 pb-16 relative z-10 min-h-screen animate-in fade-in duration-700">
          <h2 className="text-4xl font-light mb-2 text-gray-100">镜像社区</h2>
          <p className="text-gray-400 mb-10">探索并使用预配置的深度学习环境和基础模型镜像。</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMMUNITY_IMAGES.map((img, i) => (
              <div key={i} onClick={() => setSelectedImageDetail(img)} className="p-6 rounded-2xl border border-white/10 bg-[#1A1512]/50 hover:bg-[#221C18] hover:border-amber-500/30 transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 mb-5 group-hover:bg-amber-500/20 transition-colors">
                  <Box className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-200 mb-2">{img.name}</h3>
                <p className="text-sm text-gray-400 mb-6 line-clamp-2">{img.desc}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono">
                    <Download className="w-3.5 h-3.5" /> {img.downloads} 次下载
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setIsSidebarOpen(true); }} className="text-xs font-medium text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-full transition-colors">
                    使用此镜像
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deploy View */}
      {activeView === 'deploy' && (
        <div className="max-w-7xl mx-auto px-8 pt-32 pb-16 relative z-10 min-h-screen animate-in fade-in duration-700">
          <h2 className="text-4xl font-light mb-2 text-gray-100">部署 GPU 实例</h2>
          <p className="text-gray-400 mb-10">按需选择高性能算力，秒级启动您的 AI 工作站。</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                {[
                  { name: 'NVIDIA A100 80GB', price: '$3.50', mem: '80GB VRAM', perf: '极致性能，适合大模型训练与推理' },
                  { name: 'NVIDIA H100 80GB', price: '$4.80', mem: '80GB HBM3', perf: '新一代架构，Transformer 性能翻倍' },
                  { name: 'NVIDIA RTX 4090', price: '$0.80', mem: '24GB VRAM', perf: '高性价比，适合中小型模型微调' },
                  { name: 'NVIDIA L40S', price: '$1.20', mem: '48GB VRAM', perf: '通用图形与 AI 加速' },
                ].map((gpu, i) => (
                  <div key={i} className="flex items-center justify-between p-5 rounded-2xl border border-white/10 bg-[#1A1512]/50 hover:border-amber-500/30 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors">
                        <Cpu className="w-6 h-6 text-amber-500" />
                      </div>
                      <div>
                        <h4 className="text-gray-200 font-medium text-lg">{gpu.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">{gpu.perf} · <span className="text-amber-500/80 font-mono">{gpu.mem}</span></p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-light text-amber-500">{gpu.price}<span className="text-sm text-gray-500">/小时</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-[#1A1512]/80 border border-white/10 rounded-3xl p-8 sticky top-32">
                <h3 className="text-xl font-medium text-gray-200 mb-4">快速启动</h3>
                <p className="text-sm text-gray-400 mb-8 leading-relaxed">选择您需要的配置，立即在云端启动您的专属 AI 工作站。支持 SSH 和 VNC 远程访问。</p>
                <button onClick={() => setIsSidebarOpen(true)} className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-medium text-lg hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all duration-300">
                  打开部署面板
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help View */}
      {activeView === 'help' && (
        <div className="max-w-7xl mx-auto px-8 pt-32 pb-16 relative z-10 min-h-screen animate-in fade-in duration-700">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-light mb-2 text-gray-100 text-center">帮助中心</h2>
            <p className="text-gray-400 mb-10 text-center">查找常见问题解答或联系我们的技术支持团队。</p>
            
            <div className="relative mb-12">
              <input type="text" placeholder="搜索帮助文档..." className="w-full bg-[#1A1512]/80 border border-white/10 rounded-2xl px-6 py-4 text-gray-200 focus:outline-none focus:border-amber-500/50 transition-colors shadow-xl" />
            </div>

            <div className="space-y-4">
              {[
                { q: '如何连接到我的 GPU 实例？', a: '实例启动后，您可以通过控制台提供的 SSH 命令直接连接，或者点击 VNC 按钮在浏览器中打开图形界面。SSH 密钥可以在控制台的"设置"中进行管理。' },
                { q: '计费方式是怎样的？', a: '我们采用按秒计费的模式。当实例处于"运行中"状态时将收取 GPU 和磁盘费用；当实例处于"已停止"状态时，仅收取磁盘存储费用。包月套餐可享受约 20% 的折扣。' },
                { q: '如何上传我的数据和模型？', a: '您可以使用 SCP/SFTP 通过 SSH 隧道上传数据，或者挂载 BitaHub NFS / S3 兼容存储，在多个实例间共享数据。大文件推荐使用 S3 兼容存储。' },
                { q: '支持哪些深度学习框架？', a: '我们的镜像社区提供了预装 PyTorch, TensorFlow, JAX 等主流框架的镜像。您也可以使用基础 Ubuntu 镜像自行安装所需环境。所有官方镜像均已配置好对应的 CUDA 和 cuDNN。' },
                { q: '实例关机后数据会丢失吗？', a: '不会。只要您不主动"销毁"实例，系统盘和挂载的数据盘数据都会永久保留。但请注意，关机状态下仍会收取少量的磁盘存储费用。' },
              ].map((faq, i) => (
                <div key={i} className="p-6 rounded-2xl border border-white/10 bg-[#1A1512]/50 hover:bg-[#221C18] transition-colors">
                  <h3 className="text-lg font-medium text-gray-200 mb-3">{faq.q}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-500 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsSidebarOpen(false)} 
      />

      {/* Right Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-[480px] bg-[#120E0B]/95 backdrop-blur-2xl border-l border-white/10 z-[70] transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-[#1A1512]/50">
          <h2 className="text-lg font-medium text-gray-100">配置实例</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Selected Image Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
              <selectedImage.icon className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <div className="text-xs font-mono text-amber-500/80 mb-1 uppercase tracking-wider">已选镜像</div>
              <div className="text-base font-medium text-amber-500">{selectedImage.name}</div>
            </div>
          </div>

          {/* Cluster */}
          <div className="space-y-3">
            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider flex items-center gap-2"><Server className="w-3 h-3"/> 集群区域</label>
            <div className="relative">
              <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-gray-200 focus:outline-none focus:border-amber-500/50 appearance-none transition-colors">
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
                  className={`p-3 rounded-xl border text-left transition-all ${gpuType === gpu ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' : 'bg-black/20 border-white/5 text-gray-400 hover:border-white/10'}`}
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
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${gpuCount === num ? 'bg-amber-500/20 text-amber-500 shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
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
                <span className="text-xs text-amber-500 font-mono bg-amber-500/10 px-2 py-0.5 rounded">{diskSize} GB</span>
              </div>
              <input type="range" min="50" max="2000" step="50" value={diskSize} onChange={(e) => setDiskSize(Number(e.target.value))} className="w-full accent-amber-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider flex items-center gap-2"><Database className="w-3 h-3"/> 云存储</label>
              <div className="relative">
                <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-gray-200 focus:outline-none focus:border-amber-500/50 appearance-none transition-colors">
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
              <button onClick={() => setAccessSSH(!accessSSH)} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${accessSSH ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-black/20 border-white/5 text-gray-400'}`}>
                <Terminal className="w-4 h-4" /> 
                <span className="text-sm font-medium">SSH</span>
              </button>
              <button onClick={() => setAccessVNC(!accessVNC)} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${accessVNC ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-black/20 border-white/5 text-gray-400'}`}>
                <Monitor className="w-4 h-4" /> 
                <span className="text-sm font-medium">VNC</span>
              </button>
            </div>
          </div>

          {/* Billing */}
          <div className="space-y-3">
            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider flex items-center gap-2"><CreditCard className="w-3 h-3"/> 计费周期</label>
            <div className="flex bg-black/40 rounded-xl p-1 border border-white/5">
              {['按量付费', '包月'].map(cycle => (
                <button
                  key={cycle}
                  onClick={() => setBilling(cycle)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${billing === cycle ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  {cycle}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-[#1A1512]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">预估费用</span>
            <span className="text-2xl font-light text-amber-500">${price.toFixed(2)}<span className="text-sm text-gray-500">/{billing === '按量付费' ? '小时' : '月'}</span></span>
          </div>
          {isDeployed ? (
            <button 
              className="w-full py-4 rounded-xl bg-green-500/10 text-green-500 border border-green-500/30 font-medium text-lg flex items-center justify-center gap-2 transition-all duration-300"
            >
              <Check className="w-5 h-5" />
              部署成功，正在跳转...
            </button>
          ) : (
            <button 
              onClick={handleDeploy} 
              disabled={isDeploying}
              className={`w-full py-4 rounded-xl font-medium text-lg transition-all duration-300 ${
                isDeploying 
                  ? 'bg-white/10 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] neon-breathe-amber'
              }`}
            >
              {isDeploying ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  部署中...
                </div>
              ) : (
                '部署到控制台'
              )}
            </button>
          )}
        </div>
      </div>

      {/* Image Detail Modal */}
      {selectedImageDetail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedImageDetail(null)} />
          <div className="relative w-full max-w-2xl bg-[#1A1512] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  <Box className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-100">{selectedImageDetail.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 font-mono flex items-center gap-1"><Download className="w-3 h-3" /> {selectedImageDetail.downloads}</span>
                    <span className="text-xs text-gray-500 font-mono">• {selectedImageDetail.size}</span>
                    <span className="text-xs text-gray-500 font-mono">• 更新于 {selectedImageDetail.updated}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedImageDetail(null)}
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">镜像介绍</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{selectedImageDetail.desc}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">环境标签</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedImageDetail.tags.map((tag: string, idx: number) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-gray-300 font-mono">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">部署方式</h4>
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <Terminal className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-300 font-medium">Docker CLI 拉取</div>
                        <div className="text-xs text-gray-500 font-mono mt-1">{selectedImageDetail.command}</div>
                      </div>
                    </div>
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/5 bg-black/20 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedImageDetail(null)}
                className="px-6 py-2.5 rounded-xl border border-white/10 text-sm font-medium hover:bg-white/5 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  setSelectedImageDetail(null);
                  setIsSidebarOpen(true);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black text-sm font-medium hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all flex items-center gap-2"
              >
                <ArrowUp className="w-4 h-4 rotate-45" />
                快捷部署
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NodeCard({ x, y, label, delay }: { x: number, y: number, label: string, delay: string }) {
  return (
    <div 
      className="absolute w-56 h-32 rounded-2xl border border-white/10 bg-[#221C18]/90 backdrop-blur-xl p-5 flex flex-col justify-between shadow-2xl z-20 transition-transform duration-700 hover:-translate-y-2 animate-[float_6s_ease-in-out_infinite]"
      style={{ left: x, top: y, transform: 'translateZ(50px)', animationDelay: delay }}
    >
      <div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-amber-600 shadow-[0_0_10px_rgba(217,119,6,0.8)]" />
          <div className="w-20 h-1.5 rounded-full bg-white/10" />
        </div>
        <div className="w-32 h-1.5 rounded-full bg-white/5 mt-3" />
      </div>
      
      <div className="flex justify-between items-end mt-auto">
        <span className="text-[11px] font-mono text-gray-500 tracking-wider">{label}</span>
        <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
          <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-amber-500 border-b-[4px] border-b-transparent ml-0.5" />
        </div>
      </div>
    </div>
  );
}
