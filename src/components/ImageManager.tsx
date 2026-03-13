import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Search, Plus, ArrowLeft, CheckCircle2, Clock, HardDrive, FileCode2, Terminal, Cpu, Layers, Copy } from 'lucide-react';

interface CustomImage {
  id: string;
  name: string;
  version: string;
  size: string;
  status: 'ready' | 'building' | 'failed';
  createdAt: string;
  description: string;
  architecture: string;
  framework: string;
}

const MOCK_IMAGES: CustomImage[] = [
  {
    id: 'img-1',
    name: 'custom-llama-3-finetuned',
    version: 'v1.0.2',
    size: '4.2 GB',
    status: 'ready',
    createdAt: '2026-03-10 14:30',
    description: 'Fine-tuned Llama 3 model for customer support.',
    architecture: 'linux/amd64',
    framework: 'vLLM'
  },
  {
    id: 'img-2',
    name: 'sdxl-anime-style',
    version: 'v2.1.0',
    size: '6.8 GB',
    status: 'ready',
    createdAt: '2026-03-11 09:15',
    description: 'Stable Diffusion XL with anime style LoRA baked in.',
    architecture: 'linux/amd64',
    framework: 'PyTorch'
  }
];

interface ImageManagerProps {
  setActiveTab: (tab: string, image?: CustomImage) => void;
}

export default function ImageManager({ setActiveTab }: ImageManagerProps) {
  const [images, setImages] = useState<CustomImage[]>(MOCK_IMAGES);
  const [view, setView] = useState<'list' | 'upload' | 'detail'>('list');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'harbor'>('file');
  const [selectedImage, setSelectedImage] = useState<CustomImage | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(index);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const handleUploadStart = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            const newImage: CustomImage = {
              id: `img-${Date.now()}`,
              name: 'new-custom-model',
              version: 'v1.0.0',
              size: '2.4 GB',
              status: 'ready',
              createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
              description: 'Newly uploaded custom model image.',
              architecture: 'linux/amd64',
              framework: 'Custom'
            };
            setImages([newImage, ...images]);
            setView('list');
          }, 500);
          return 100;
        }
        return p + 5;
      });
    }, 100);
  };

  if (view === 'upload') {
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button 
          onClick={() => setView('list')} 
          className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-white transition-colors group w-fit"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">返回镜像列表</span>
        </button>

        <header className="mb-10 text-center">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">上传自定义镜像</h1>
          <p className="text-[var(--color-text-secondary)]">上传您的 Docker 镜像或模型权重文件以在集群中部署。</p>
        </header>

        <div className="flex gap-6 mb-8 border-b border-white/10">
          <button
            onClick={() => setUploadMethod('file')}
            className={`pb-4 -mb-[1px] text-sm font-medium transition-colors border-b-2 ${uploadMethod === 'file' ? 'border-[var(--color-accent-start)] text-white' : 'border-transparent text-[var(--color-text-secondary)] hover:text-white'}`}
          >
            本地文件上传
          </button>
          <button
            onClick={() => setUploadMethod('harbor')}
            className={`pb-4 -mb-[1px] text-sm font-medium transition-colors border-b-2 ${uploadMethod === 'harbor' ? 'border-[var(--color-accent-start)] text-white' : 'border-transparent text-[var(--color-text-secondary)] hover:text-white'}`}
          >
            Harbor 仓库推送
          </button>
        </div>

        {uploadMethod === 'file' ? (
          <form onSubmit={handleUploadStart} className="glass-panel rounded-3xl p-8 space-y-8 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4 relative z-10">
              <label className="text-sm font-medium text-[var(--color-text-secondary)]">镜像名称</label>
              <input 
                type="text" 
                required
                placeholder="例如: my-custom-model"
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent-start)] focus:neon-breathe-amber transition-all"
              />
            </div>

            <div className="space-y-4 relative z-10">
              <label className="text-sm font-medium text-[var(--color-text-secondary)]">版本标签 (Tag)</label>
              <input 
                type="text" 
                defaultValue="latest"
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent-start)] focus:neon-breathe-amber transition-all"
              />
            </div>

            <div className="space-y-4 relative z-10">
              <label className="text-sm font-medium text-[var(--color-text-secondary)]">镜像文件 (.tar, .tar.gz)</label>
              <div className="border-2 border-dashed border-white/10 hover:border-[var(--color-accent-start)]/50 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer bg-black/20 group hover:neon-breathe-amber">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-[var(--color-accent-start)]/10">
                  <Upload className="w-8 h-8 text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent-start)] transition-colors" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-white mb-1">点击或拖拽文件到此处上传</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">支持 Docker 导出的 tar 包，最大支持 50GB</p>
                </div>
              </div>
            </div>

            <div className="pt-6 relative z-10">
              <button 
                type="submit"
                disabled={isUploading}
                className={`w-full relative overflow-hidden rounded-2xl font-medium text-lg transition-all duration-500 ${
                  isUploading 
                    ? 'h-14 bg-white/5 border border-white/10 cursor-not-allowed' 
                    : 'h-14 bg-gradient-to-r from-[var(--color-accent-start)] to-[var(--color-accent-end)] hover:neon-breathe-amber text-white'
                }`}
              >
                {isUploading ? (
                  <div className="absolute inset-0 flex items-center">
                    <div 
                      className="h-full bg-gradient-to-r from-[var(--color-accent-start)] to-[var(--color-accent-end)] transition-all duration-75 ease-linear neon-breathe-amber"
                      style={{ width: `${uploadProgress}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center font-mono text-xs z-10 text-white drop-shadow-md">
                      正在上传... {uploadProgress}%
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Upload className="w-5 h-5" />
                    开始上传
                  </div>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="glass-panel rounded-3xl p-8 space-y-8 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4 relative z-10">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[var(--color-accent-start)]" />
                通过 Docker CLI 推送镜像
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                您可以使用标准的 Docker 客户端将镜像推送到 BitaHub 的私有 Harbor 仓库。
              </p>
              
              <div className="space-y-6 mt-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">1. 登录到镜像仓库</label>
                  <div className="bg-black/40 rounded-xl p-4 border border-white/5 font-mono text-sm text-gray-300 flex justify-between items-center group">
                    <span>docker login registry.bitahub.paas -u &lt;your-username&gt;</span>
                    <button onClick={() => handleCopy('docker login registry.bitahub.paas -u <your-username>', 1)} className="text-gray-500 hover:text-white transition-colors">
                      {copiedCommand === 1 ? <CheckCircle2 className="w-4 h-4 text-[var(--color-success-start)]" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">2. 标记您的本地镜像</label>
                  <div className="bg-black/40 rounded-xl p-4 border border-white/5 font-mono text-sm text-gray-300 flex justify-between items-center group">
                    <span>docker tag my-local-image:latest registry.bitahub.paas/user-images/my-custom-model:v1.0.0</span>
                    <button onClick={() => handleCopy('docker tag my-local-image:latest registry.bitahub.paas/user-images/my-custom-model:v1.0.0', 2)} className="text-gray-500 hover:text-white transition-colors">
                      {copiedCommand === 2 ? <CheckCircle2 className="w-4 h-4 text-[var(--color-success-start)]" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">3. 推送镜像到仓库</label>
                  <div className="bg-black/40 rounded-xl p-4 border border-white/5 font-mono text-sm text-gray-300 flex justify-between items-center group">
                    <span>docker push registry.bitahub.paas/user-images/my-custom-model:v1.0.0</span>
                    <button onClick={() => handleCopy('docker push registry.bitahub.paas/user-images/my-custom-model:v1.0.0', 3)} className="text-gray-500 hover:text-white transition-colors">
                      {copiedCommand === 3 ? <CheckCircle2 className="w-4 h-4 text-[var(--color-success-start)]" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-6 relative z-10">
              <button 
                onClick={() => setView('list')}
                className="w-full h-14 rounded-2xl font-medium text-lg transition-all duration-500 bg-white/5 border border-white/10 hover:bg-white/10 text-white"
              >
                完成推送，返回列表
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (view === 'detail' && selectedImage) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 pb-20">
        <button 
          onClick={() => setView('list')} 
          className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-white transition-colors group w-fit"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">返回镜像列表</span>
        </button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center bg-white/5 border border-white/10 relative shadow-[0_0_30px_rgba(245,158,11,0.15)]">
              <ImageIcon className="w-10 h-10 text-purple-400" />
            </div>
            <div>
              <h1 className="text-4xl font-semibold tracking-tight mb-2">{selectedImage.name}</h1>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-white/10 text-[var(--color-text-secondary)] border border-white/5 font-mono">
                  {selectedImage.version}
                </span>
                <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-white/10 text-[var(--color-text-secondary)] border border-white/5 flex items-center gap-1">
                  <HardDrive className="w-3 h-3" /> {selectedImage.size}
                </span>
                <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-[var(--color-success-start)]/10 text-[var(--color-success-start)] border border-[var(--color-success-start)]/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> 就绪
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('deployment', selectedImage)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--color-accent-start)] to-[var(--color-accent-end)] text-white font-medium hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all neon-breathe-amber"
          >
            部署此镜像
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="space-y-4">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-[var(--color-text-secondary)]" />
                镜像详情
              </h2>
              <div className="glass-panel rounded-2xl p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">描述</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">{selectedImage.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">创建时间</h3>
                    <p className="text-sm text-gray-300 flex items-center gap-2"><Clock className="w-4 h-4" /> {selectedImage.createdAt}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">镜像大小</h3>
                    <p className="text-sm text-gray-300 flex items-center gap-2"><HardDrive className="w-4 h-4" /> {selectedImage.size}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">系统架构</h3>
                    <p className="text-sm text-gray-300 flex items-center gap-2"><Cpu className="w-4 h-4" /> {selectedImage.architecture}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">推理框架</h3>
                    <p className="text-sm text-gray-300 flex items-center gap-2"><Layers className="w-4 h-4" /> {selectedImage.framework}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[var(--color-text-secondary)]" />
                使用方法
              </h2>
              <div className="glass-panel rounded-2xl p-0 overflow-hidden border-white/10">
                <div className="bg-black/40 px-4 py-3 border-b border-white/5 flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[var(--color-text-secondary)]">Dockerfile 示例</span>
                </div>
                <div className="p-4 overflow-x-auto">
                  <pre className="text-sm font-mono leading-relaxed text-gray-300">
{`FROM bitahub.paas/user-images/${selectedImage.name}:${selectedImage.version}

# 设置环境变量
ENV MODEL_PATH=/models/weights
ENV PORT=8080

# 暴露端口
EXPOSE 8080

# 启动命令
CMD ["python", "-m", "vllm.entrypoints.api_server"]`}
                  </pre>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight mb-2">镜像管理</h1>
          <p className="text-[var(--color-text-secondary)]">上传和管理您的自定义模型镜像。</p>
        </div>
        <button 
          onClick={() => setView('upload')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--color-accent-start)] to-[var(--color-accent-end)] text-white font-medium hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all neon-breathe-amber"
        >
          <Plus className="w-5 h-5" />
          上传镜像
        </button>
      </header>

      <div className="glass-panel rounded-3xl p-2 flex items-center gap-2 mb-6 border border-white/10">
        <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-black/20 rounded-2xl">
          <Search className="w-5 h-5 text-[var(--color-text-secondary)]" />
          <input 
            type="text" 
            placeholder="搜索镜像名称..." 
            className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-gray-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {images.map((image) => (
          <div 
            key={image.id} 
            onClick={() => {
              setSelectedImage(image);
              setView('detail');
            }}
            className="glass-panel rounded-2xl p-5 flex items-center justify-between group hover:bg-white/5 transition-colors border border-white/5 hover:border-white/10 cursor-pointer"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 group-hover:border-purple-500/30 transition-colors">
                <ImageIcon className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-medium text-white group-hover:text-purple-400 transition-colors">{image.name}</h3>
                  <span className="font-mono text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300 border border-white/5">
                    {image.version}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-[var(--color-text-secondary)]">
                  <span className="flex items-center gap-1"><HardDrive className="w-3.5 h-3.5" /> {image.size}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {image.createdAt}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[10px] font-medium px-2.5 py-1 rounded-full bg-[var(--color-success-start)]/10 text-[var(--color-success-start)] border border-[var(--color-success-start)]/20">
                <CheckCircle2 className="w-3 h-3" />
                就绪
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
