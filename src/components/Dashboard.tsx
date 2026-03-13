import React from 'react';
import { 
  Activity, Cpu, Layers, Zap, 
  ArrowUpRight, Monitor, Database, 
  Microchip as Chip 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';

const qpsData = [
  { time: '00:00', value: 400 },
  { time: '04:00', value: 300 },
  { time: '08:00', value: 200 },
  { time: '12:00', value: 280 },
  { time: '16:00', value: 200 },
  { time: '20:00', value: 250 },
  { time: '24:00', value: 350 },
];

const modelData = [
  { name: 'Llama-3-70B', value: 45000 },
  { name: 'SDXL-Turbo', value: 32000 },
  { name: 'Mistral-8x7B', value: 28000 },
  { name: 'Qwen-1.5-72B', value: 15000 },
  { name: 'Whisper-v3', value: 8000 },
];

const trendData = [
  { time: '00:00', cpu: 30, ram: 55, gpu: 45 },
  { time: '04:00', cpu: 25, ram: 52, gpu: 38 },
  { time: '08:00', cpu: 60, ram: 68, gpu: 72 },
  { time: '12:00', cpu: 55, ram: 65, gpu: 68 },
  { time: '16:00', cpu: 78, ram: 72, gpu: 75 },
  { time: '20:00', cpu: 45, ram: 60, gpu: 55 },
  { time: '24:00', cpu: 38, ram: 58, gpu: 48 },
];

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700 pb-10">
      <header className="px-2">
        <h1 className="text-3xl font-semibold tracking-tight mb-1">控制台总览</h1>
        <p className="text-[var(--color-text-secondary)] text-sm">监控您的集群健康状态与资源利用率。</p>
      </header>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: '运行中模型', value: '24', icon: Layers, color: 'text-amber-500' },
          { label: '总 QPS', value: '1,249', icon: Activity, color: 'text-emerald-500' },
          { label: 'GPU 利用率', value: '87%', icon: Chip, color: 'text-orange-500' },
          { label: '平均延迟', value: '42ms', icon: Zap, color: 'text-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden group">
            <div className="flex justify-between items-start relative z-10">
              <span className="text-[11px] uppercase tracking-[0.1em] text-[var(--color-text-tertiary)] font-medium">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.color} opacity-80`} />
            </div>
            <div className="text-4xl font-normal font-mono relative z-10">{stat.value}</div>
            <div className={`absolute -bottom-2 -right-2 w-16 h-16 ${stat.color} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity`}>
              <stat.icon className="w-full h-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Middle Section: Topology & QPS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cluster Topology */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-medium text-white">集群拓扑</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[...Array(9)].map((_, i) => {
              const isWarning = i === 4; // H100 98%
              return (
                <div 
                  key={i} 
                  className={`aspect-square rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                    isWarning 
                      ? 'bg-red-500/10 border-red-500/30 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-emerald-500/30 hover:text-emerald-400'
                  }`}
                >
                  <Chip className={`w-5 h-5 ${i % 3 === 0 || i === 1 ? 'text-emerald-500/80' : ''}`} />
                  <div className="text-[9px] font-mono uppercase">
                    {isWarning ? 'H100 (98%)' : 'A100 (45%)'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* QPS Chart */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 flex flex-col gap-6">
          <h2 className="text-sm font-medium text-white">总请求量 (QPS)</h2>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={qpsData}>
                <defs>
                  <linearGradient id="colorQps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#f59e0b' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorQps)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section: 4 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Calls by Model */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-medium text-white">API 调用量 (按模型)</h2>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> 12.5%
            </span>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelData} layout="vertical" margin={{ left: 40 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                  {modelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#f59e0b" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CPU Trend */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-medium text-white">CPU 利用率趋势</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-[10px] text-gray-400 uppercase">CPU</span>
            </div>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RAM Trend */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-medium text-white">RAM 利用率趋势</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-[10px] text-gray-400 uppercase">RAM</span>
            </div>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="ram" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorRam)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GPU Trend */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-medium text-white">GPU 利用率趋势</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-[10px] text-gray-400 uppercase">GPU</span>
            </div>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorGpuTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="gpu" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorGpuTrend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

