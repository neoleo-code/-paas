import React, { useState } from 'react';
import { 
  History as HistoryIcon, Search, Filter, 
  Clock, CheckCircle2, AlertCircle, 
  ArrowLeft, Download, Terminal, 
  ExternalLink, Calendar, Activity
} from 'lucide-react';

interface HistoryItem {
  id: string;
  action: string;
  target: string;
  user: string;
  time: string;
  status: 'success' | 'failed' | 'warning';
  details: string;
}

const MOCK_HISTORY: HistoryItem[] = [
  {
    id: 'EVT-8821',
    action: '部署服务',
    target: 'Llama-3-70B-v1',
    user: 'alexkalebcoca@gmail.com',
    time: '2026-03-13 14:22:01',
    status: 'success',
    details: '成功在集群 [Cluster-A] 部署模型。分配了 4x A100 GPU。'
  },
  {
    id: 'EVT-8819',
    action: '删除镜像',
    target: 'old-stable-diffusion-v1',
    user: 'alexkalebcoca@gmail.com',
    time: '2026-03-13 12:05:44',
    status: 'success',
    details: '手动删除了过期的自定义镜像。释放了 12.4 GB 存储空间。'
  },
  {
    id: 'EVT-8815',
    action: '自动扩容',
    target: 'SDXL-Turbo-API',
    user: 'System (Auto-scaler)',
    time: '2026-03-13 10:15:22',
    status: 'warning',
    details: '由于 QPS 超过阈值 (500)，副本数从 2 增加到 4。'
  },
  {
    id: 'EVT-8812',
    action: '部署失败',
    target: 'Mistral-Large-v2',
    user: 'alexkalebcoca@gmail.com',
    time: '2026-03-13 09:30:11',
    status: 'failed',
    details: '资源不足：请求的 H100 GPU 当前不可用。请尝试其他区域或降低规格。'
  },
  {
    id: 'EVT-8808',
    action: '更新配置',
    target: 'Whisper-v3-Worker',
    user: 'alexkalebcoca@gmail.com',
    time: '2026-03-12 22:45:00',
    status: 'success',
    details: '更新了推理参数：temperature 从 0.5 调整为 0.7。'
  }
];

export default function History() {
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = MOCK_HISTORY.filter(item => 
    item.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedItem) {
    return (
      <div className="space-y-8 animate-in slide-in-from-right-8 duration-500 pb-20">
        <button 
          onClick={() => setSelectedItem(null)} 
          className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-white transition-colors group w-fit"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">返回历史记录</span>
        </button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 ${
              selectedItem.status === 'success' ? 'text-emerald-500' : 
              selectedItem.status === 'failed' ? 'text-red-500' : 'text-amber-500'
            }`}>
              <HistoryIcon className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-semibold tracking-tight">{selectedItem.action}</h1>
                <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-white/5 ${
                  selectedItem.status === 'success' ? 'text-emerald-500' : 
                  selectedItem.status === 'failed' ? 'text-red-500' : 'text-amber-500'
                }`}>
                  {selectedItem.status === 'success' ? '成功' : selectedItem.status === 'failed' ? '失败' : '警告'}
                </span>
              </div>
              <p className="text-[var(--color-text-secondary)] font-mono text-sm">{selectedItem.id} • {selectedItem.time}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold uppercase tracking-widest transition-all flex items-center gap-2">
              <Download className="w-4 h-4" /> 导出日志
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="glass-panel rounded-3xl p-8 space-y-6">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[var(--color-text-secondary)]" />
                事件详情
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2">操作目标</h3>
                    <p className="text-white font-medium">{selectedItem.target}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2">执行用户</h3>
                    <p className="text-white font-medium">{selectedItem.user}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <h3 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-3">详细描述</h3>
                  <div className="bg-black/40 rounded-2xl p-6 font-mono text-sm text-gray-300 leading-relaxed border border-white/5">
                    {selectedItem.details}
                  </div>
                </div>
              </div>
            </section>

            <section className="glass-panel rounded-3xl p-8 space-y-6">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <Activity className="w-5 h-5 text-[var(--color-text-secondary)]" />
                系统日志 (Audit Logs)
              </h2>
              <div className="bg-[#0a0a0a] rounded-2xl p-6 font-mono text-[11px] space-y-2 text-gray-500 border border-white/10">
                <div>[14:22:01] <span className="text-blue-400">DEBUG</span> Initiating deployment sequence for {selectedItem.target}...</div>
                <div>[14:22:02] <span className="text-blue-400">DEBUG</span> Validating cluster resources...</div>
                <div>[14:22:03] <span className="text-emerald-400">INFO</span> Resource check passed. 4x A100 allocated.</div>
                <div>[14:22:04] <span className="text-blue-400">DEBUG</span> Pulling image registry.bitahub.paas/llama-3:latest...</div>
                <div>[14:22:08] <span className="text-blue-400">DEBUG</span> Image pulled successfully.</div>
                <div>[14:22:10] <span className="text-amber-400">WARN</span> Network latency detected in Region-East-5.</div>
                <div>[14:22:15] <span className="text-emerald-400">INFO</span> Container started. Health check pending...</div>
                <div>[14:22:20] <span className="text-emerald-500 font-bold">SUCCESS</span> Deployment completed.</div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="glass-panel rounded-3xl p-6 space-y-6">
              <h2 className="text-sm font-medium text-white">相关资源</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <ExternalLink className="w-4 h-4 text-blue-500" />
                    </div>
                    <span className="text-xs font-medium text-gray-300 group-hover:text-white">查看服务状态</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-purple-500" />
                    </div>
                    <span className="text-xs font-medium text-gray-300 group-hover:text-white">查看监控图表</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="px-2">
        <h1 className="text-3xl font-semibold tracking-tight mb-1">历史记录</h1>
        <p className="text-[var(--color-text-secondary)] text-sm">追踪集群内的所有操作与系统事件。</p>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 glass-panel rounded-2xl p-2 flex items-center gap-2 border border-white/10">
          <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-black/20 rounded-xl">
            <Search className="w-5 h-5 text-[var(--color-text-secondary)]" />
            <input 
              type="text" 
              placeholder="搜索操作、目标或 ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-gray-600"
            />
          </div>
        </div>
        <button className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-medium flex items-center gap-2 hover:bg-white/10 transition-all">
          <Filter className="w-4 h-4" /> 筛选
        </button>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden border border-white/5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-[var(--color-text-tertiary)]">事件 ID</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-[var(--color-text-tertiary)]">操作</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-[var(--color-text-tertiary)]">目标</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-[var(--color-text-tertiary)]">状态</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-[var(--color-text-tertiary)] text-right">时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredHistory.map((item) => (
              <tr 
                key={item.id} 
                onClick={() => setSelectedItem(item)}
                className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
              >
                <td className="px-6 py-5">
                  <span className="font-mono text-[11px] text-[var(--color-text-tertiary)] group-hover:text-white transition-colors">{item.id}</span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm font-medium text-white">{item.action}</span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm text-gray-400">{item.target}</span>
                </td>
                <td className="px-6 py-5">
                  <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider ${
                    item.status === 'success' ? 'text-emerald-500' : 
                    item.status === 'failed' ? 'text-red-500' : 'text-amber-500'
                  }`}>
                    {item.status === 'success' ? <CheckCircle2 className="w-3 h-3" /> : 
                     item.status === 'failed' ? <AlertCircle className="w-3 h-3" /> : 
                     <Clock className="w-3 h-3" />}
                    {item.status === 'success' ? '成功' : item.status === 'failed' ? '失败' : '警告'}
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <span className="text-[11px] font-mono text-[var(--color-text-tertiary)]">{item.time}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
