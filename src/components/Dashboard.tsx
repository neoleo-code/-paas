import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, Legend } from 'recharts';
import { Activity, Cpu, Server, Zap, Database, ArrowUpRight } from 'lucide-react';

const data = [
  { time: '00:00', qps: 400, compute: 240 },
  { time: '04:00', qps: 300, compute: 139 },
  { time: '08:00', qps: 200, compute: 980 },
  { time: '12:00', qps: 278, compute: 390 },
  { time: '16:00', qps: 189, compute: 480 },
  { time: '20:00', qps: 239, compute: 380 },
  { time: '24:00', qps: 349, compute: 430 },
];

const apiVolumeData = [
  { name: 'Llama-3-70B', calls: 45000 },
  { name: 'SDXL-Turbo', calls: 32000 },
  { name: 'Mistral-8x7B', calls: 28000 },
  { name: 'Qwen-1.5-72B', calls: 15000 },
  { name: 'Whisper-v3', calls: 8000 },
];

const resourceData = [
  { time: '00:00', gpu: 45, cpu: 30, ram: 50 },
  { time: '04:00', gpu: 35, cpu: 25, ram: 48 },
  { time: '08:00', gpu: 85, cpu: 60, ram: 75 },
  { time: '12:00', gpu: 70, cpu: 55, ram: 68 },
  { time: '16:00', gpu: 90, cpu: 75, ram: 82 },
  { time: '20:00', gpu: 65, cpu: 45, ram: 60 },
  { time: '24:00', gpu: 50, cpu: 35, ram: 55 },
];

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">控制台总览</h1>
        <p className="text-[var(--color-text-secondary)]">监控您的集群健康状态与资源利用率。</p>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: '运行中模型', value: '24', icon: Server, color: 'text-blue-400', hoverClass: 'hover:neon-breathe-blue' },
          { label: '总 QPS', value: '1,249', icon: Activity, color: 'text-green-400', hoverClass: 'hover:neon-breathe-green' },
          { label: 'GPU 利用率', value: '87%', icon: Cpu, color: 'text-orange-400', hoverClass: 'hover:neon-breathe-amber' },
          { label: '平均延迟', value: '42ms', icon: Zap, color: 'text-purple-400', hoverClass: 'hover:neon-breathe-purple' },
        ].map((stat, i) => (
          <div key={i} className={`glass-panel rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden group transition-all duration-300 ${stat.hoverClass}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--color-text-secondary)]">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-3xl font-semibold tracking-tight">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GPU Cluster Topology */}
        <div className="glass-panel rounded-3xl p-6 lg:col-span-1 flex flex-col">
          <h2 className="text-lg font-medium mb-6">集群拓扑</h2>
          <div className="flex-1 grid grid-cols-3 gap-3 place-content-center">
            {Array.from({ length: 9 }).map((_, i) => (
              <div 
                key={i} 
                className={`aspect-square rounded-xl border border-white/10 flex items-center justify-center relative
                  ${i === 4 ? 'bg-[var(--color-warn-start)]/20 neon-breathe-red border-[var(--color-warn-start)]/50' : 
                    i % 3 === 0 ? 'bg-[var(--color-success-start)]/10 neon-breathe-green border-[var(--color-success-start)]/30' : 
                    'bg-white/5'}
                `}
              >
                <div className="text-[10px] font-mono text-[var(--color-text-secondary)] absolute bottom-2">
                  {i === 4 ? 'H100 (98%)' : 'A100 (45%)'}
                </div>
                <Cpu className={`w-6 h-6 ${i === 4 ? 'text-[var(--color-warn-start)]' : i % 3 === 0 ? 'text-[var(--color-success-start)]' : 'text-[var(--color-text-secondary)]'}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="glass-panel rounded-3xl p-6 lg:col-span-2">
          <h2 className="text-lg font-medium mb-6">总请求量 (QPS)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorQps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-accent-start)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-accent-start)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-surface-border)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="qps" stroke="var(--color-accent-start)" strokeWidth={2} fillOpacity={1} fill="url(#colorQps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
        {/* API Call Volume */}
        <div className="glass-panel rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium">API 调用量 (按模型)</h2>
            <div className="flex items-center gap-1 text-xs font-medium text-[var(--color-success-start)] bg-[var(--color-success-start)]/10 px-2 py-1 rounded-md border border-[var(--color-success-start)]/20">
              <ArrowUpRight className="w-3 h-3" />
              12.5%
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={apiVolumeData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} width={100} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-surface-border)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="calls" fill="var(--color-accent-start)" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CPU Utilization */}
        <div className="glass-panel rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium">CPU 利用率趋势</h2>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)]"><div className="w-2 h-2 rounded-full bg-blue-400"></div> CPU</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={resourceData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-surface-border)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="cpu" stroke="#60a5fa" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RAM Utilization */}
        <div className="glass-panel rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium">RAM 利用率趋势</h2>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)]"><div className="w-2 h-2 rounded-full bg-purple-400"></div> RAM</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={resourceData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c084fc" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#c084fc" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-surface-border)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="ram" stroke="#c084fc" strokeWidth={2} fillOpacity={1} fill="url(#colorRam)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GPU Utilization */}
        <div className="glass-panel rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium">GPU 利用率趋势</h2>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)]"><div className="w-2 h-2 rounded-full bg-orange-400"></div> GPU</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={resourceData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorGpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#fb923c" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-surface-border)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="gpu" stroke="#fb923c" strokeWidth={2} fillOpacity={1} fill="url(#colorGpu)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
