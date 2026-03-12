import React from 'react';
import { LayoutDashboard, Box, Rocket, Activity, Settings, Home, Layers, Image as ImageIcon } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onBackToHome: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, onBackToHome }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: '总览', icon: LayoutDashboard },
    { id: 'hub', label: '模型大厅', icon: Box },
    { id: 'images', label: '镜像管理', icon: ImageIcon },
    { id: 'services', label: '服务列表', icon: Layers },
    { id: 'deploy', label: '部署配置', icon: Rocket },
    { id: 'monitor', label: '服务监控', icon: Activity },
  ];

  return (
    <aside className="w-64 h-screen border-r border-[var(--color-surface-border)] bg-[var(--color-bg-main)]/80 backdrop-blur-xl flex flex-col pt-8 pb-6 px-4 z-40 fixed left-0 top-0">
      <div 
        className="flex items-center gap-3 px-2 mb-12 cursor-pointer hover:opacity-80 transition-opacity group"
        onClick={onBackToHome}
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-accent-start)] to-[var(--color-accent-end)] flex items-center justify-center neon-breathe-blue">
          <Box className="w-5 h-5 text-white" />
        </div>
        <span className="font-semibold text-lg tracking-tight group-hover:neon-text-blue transition-all duration-300">BitaHub PaaS</span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-[var(--color-surface)] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] border border-white/10 neon-breathe-blue'
                  : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[var(--color-accent-start)] neon-text-blue' : ''}`} />
              <span className={`font-medium text-sm ${isActive ? 'neon-text-blue' : ''}`}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto space-y-2">
        <button 
          onClick={onBackToHome}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5 transition-all duration-300"
        >
          <Home className="w-5 h-5" />
          <span className="font-medium text-sm">返回首页</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5 transition-all duration-300">
          <Settings className="w-5 h-5" />
          <span className="font-medium text-sm">设置</span>
        </button>
      </div>
    </aside>
  );
}
