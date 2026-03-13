import React, { useState } from 'react';
import { 
  Database, HardDrive, Plus, Search, 
  ArrowLeft, MoreVertical, Trash2, 
  Settings, Activity, Shield, 
  CheckCircle2, Clock, Server, 
  Layers, ChevronRight, Info
} from 'lucide-react';

interface Volume {
  id: string;
  name: string;
  type: 'SSD' | 'HDD' | 'NVMe';
  size: string;
  used: string;
  status: 'active' | 'creating' | 'error';
  mountPath: string;
  createdAt: string;
}

const MOCK_VOLUMES: Volume[] = [
  {
    id: 'VOL-102',
    name: 'llama-weights-v3',
    type: 'NVMe',
    size: '500 GB',
    used: '342 GB',
    status: 'active',
    mountPath: '/mnt/models/llama',
    createdAt: '2026-03-01'
  },
  {
    id: 'VOL-105',
    name: 'training-dataset-alpha',
    type: 'SSD',
    size: '2 TB',
    used: '1.8 TB',
    status: 'active',
    mountPath: '/data/training/alpha',
    createdAt: '2026-03-05'
  },
  {
    id: 'VOL-108',
    name: 'sdxl-checkpoints',
    type: 'SSD',
    size: '1 TB',
    used: '120 GB',
    status: 'active',
    mountPath: '/mnt/checkpoints/sdxl',
    createdAt: '2026-03-10'
  }
];

export default function StorageManager() {
  const [view, setView] = useState<'list' | 'detail' | 'create'>('list');
  const [selectedVolume, setSelectedVolume] = useState<Volume | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setTimeout(() => {
      setIsCreating(false);
      setView('list');
    }, 2000);
  };

  if (view === 'create') {
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button 
          onClick={() => setView('list')} 
          className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-white transition-colors group w-fit"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">返回存储列表</span>
        </button>

        <header className="mb-10 text-center">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">创建存储卷</h1>
          <p className="text-[var(--color-text-secondary)]">为您的模型和数据集分配持久化存储空间。</p>
        </header>

        <form onSubmit={handleCreate} className="glass-panel rounded-3xl p-8 space-y-8 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-sm font-medium text-[var(--color-text-secondary)]">卷名称</label>
              <input 
                type="text" 
                required
                placeholder="例如: model-storage-01"
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent-start)] transition-all"
              />
            </div>
            <div className="space-y-4">
              <label className="text-sm font-medium text-[var(--color-text-secondary)]">存储类型</label>
              <select className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent-start)] transition-all appearance-none">
                <option value="NVMe">高性能 NVMe (推荐用于模型推理)</option>
                <option value="SSD">标准 SSD (适用于通用数据)</option>
                <option value="HDD">大容量 HDD (适用于冷数据备份)</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-sm font-medium text-[var(--color-text-secondary)]">容量大小 (GB)</label>
              <span className="text-xl font-mono text-white">500 GB</span>
            </div>
            <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-1/2 bg-[var(--color-accent-start)]" />
            </div>
            <div className="flex justify-between text-[10px] text-[var(--color-text-tertiary)] uppercase tracking-widest font-bold">
              <span>10 GB</span>
              <span>1000 GB</span>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-[var(--color-text-secondary)]">挂载路径 (可选)</label>
            <input 
              type="text" 
              placeholder="例如: /mnt/data"
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent-start)] transition-all"
            />
          </div>

          <div className="pt-6">
            <button 
              type="submit"
              disabled={isCreating}
              className={`w-full relative overflow-hidden rounded-2xl font-medium text-lg transition-all duration-500 ${
                isCreating 
                  ? 'h-14 bg-white/5 border border-white/10 cursor-not-allowed' 
                  : 'h-14 bg-white text-black hover:bg-gray-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]'
              }`}
            >
              {isCreating ? (
                <div className="absolute inset-0 flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span className="font-mono text-sm">正在分配资源...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" />
                  确认创建
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (view === 'detail' && selectedVolume) {
    const usagePercent = (parseInt(selectedVolume.used) / parseInt(selectedVolume.size)) * 100;
    
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 pb-20">
        <button 
          onClick={() => setView('list')} 
          className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-white transition-colors group w-fit"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">返回存储列表</span>
        </button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center bg-white/5 border border-white/10 relative shadow-[0_0_30px_rgba(0,122,255,0.15)]">
              <Database className="w-10 h-10 text-blue-500" />
            </div>
            <div>
              <h1 className="text-4xl font-semibold tracking-tight mb-2">{selectedVolume.name}</h1>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-white/10 text-[var(--color-text-secondary)] border border-white/5 font-mono">
                  {selectedVolume.type}
                </span>
                <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-white/10 text-[var(--color-text-secondary)] border border-white/5 flex items-center gap-1">
                  <HardDrive className="w-3 h-3" /> {selectedVolume.size}
                </span>
                <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-[var(--color-success-start)]/10 text-[var(--color-success-start)] border border-[var(--color-success-start)]/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> 运行中
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--color-text-secondary)] hover:text-white transition-all">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Usage Stats */}
            <section className="glass-panel rounded-3xl p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[var(--color-text-secondary)]" />
                  使用情况
                </h2>
                <span className="text-sm font-mono text-white">{selectedVolume.used} / {selectedVolume.size}</span>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${usagePercent > 80 ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-[var(--color-text-tertiary)]">
                  <span>已使用 {Math.round(usagePercent)}%</span>
                  <span>剩余 {parseInt(selectedVolume.size) - parseInt(selectedVolume.used)} GB</span>
                </div>
              </div>
            </section>

            {/* Mount Info */}
            <section className="glass-panel rounded-3xl p-8 space-y-6">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <Server className="w-5 h-5 text-[var(--color-text-secondary)]" />
                挂载详情
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-tertiary)] font-bold">挂载路径</span>
                    <span className="font-mono text-sm text-white">{selectedVolume.mountPath}</span>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-white/5 text-[var(--color-text-secondary)] transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-tertiary)] font-bold">访问模式</span>
                    <span className="text-sm text-white">ReadWriteMany (RWX)</span>
                  </div>
                  <Shield className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="glass-panel rounded-3xl p-6 space-y-6">
              <h2 className="text-sm font-medium text-white">快照与备份</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>上次快照: 2 小时前</span>
                </div>
                <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold uppercase tracking-widest transition-all">
                  创建快照
                </button>
              </div>
            </div>

            <div className="glass-panel rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-amber-500">
                <Info className="w-4 h-4" />
                <span className="text-xs font-medium">存储优化建议</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                当前卷已使用超过 60%，建议开启自动扩容功能以防止存储空间耗尽导致服务中断。
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight mb-2">存储卷管理</h1>
          <p className="text-[var(--color-text-secondary)]">管理集群内的持久化存储资源。</p>
        </div>
        <button 
          onClick={() => setView('create')}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-black font-semibold uppercase tracking-[0.2em] text-xs hover:bg-gray-200 transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
        >
          <Plus className="w-4 h-4" />
          新建存储卷
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel rounded-2xl p-6 flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-tertiary)] font-bold">总容量</span>
          <span className="text-2xl font-mono text-white">3.5 TB</span>
        </div>
        <div className="glass-panel rounded-2xl p-6 flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-tertiary)] font-bold">已使用</span>
          <span className="text-2xl font-mono text-white">2.2 TB</span>
        </div>
        <div className="glass-panel rounded-2xl p-6 flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-tertiary)] font-bold">活跃卷</span>
          <span className="text-2xl font-mono text-white">03</span>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-2 flex items-center gap-2 border border-white/10">
        <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-black/20 rounded-xl">
          <Search className="w-5 h-5 text-[var(--color-text-secondary)]" />
          <input 
            type="text" 
            placeholder="搜索存储卷名称..." 
            className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-gray-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {MOCK_VOLUMES.map((volume) => (
          <div 
            key={volume.id} 
            onClick={() => {
              setSelectedVolume(volume);
              setView('detail');
            }}
            className="glass-panel rounded-3xl p-6 flex items-center justify-between group hover:bg-white/5 transition-all border border-white/5 hover:border-white/10 cursor-pointer"
          >
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 group-hover:border-blue-500/30 transition-colors">
                <Database className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-xl font-medium text-white group-hover:text-blue-400 transition-colors">{volume.name}</h3>
                  <span className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-white/5 text-[var(--color-text-tertiary)]">
                    {volume.type}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-[11px] text-[var(--color-text-tertiary)] font-medium uppercase tracking-widest">
                  <span className="flex items-center gap-2"><HardDrive className="w-3.5 h-3.5" /> {volume.size}</span>
                  <span className="flex items-center gap-2"><Layers className="w-3.5 h-3.5" /> {volume.mountPath}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right mr-4">
                <div className="text-xs font-mono text-white mb-1">{volume.used} / {volume.size}</div>
                <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500" 
                    style={{ width: `${(parseInt(volume.used) / parseInt(volume.size)) * 100}%` }} 
                  />
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--color-text-tertiary)] group-hover:text-white transition-all transform group-hover:translate-x-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
