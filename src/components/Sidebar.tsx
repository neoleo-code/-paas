import { LayoutDashboard, Box, Activity, Settings, Home, Layers, Image as ImageIcon, History, Cpu, Database } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onBackToHome: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, onBackToHome }: SidebarProps) {
  const sections = [
    {
      header: '核心系统',
      items: [
        { id: 'dashboard', label: '总览', icon: LayoutDashboard },
        { id: 'history', label: '历史记录', icon: History },
        { id: 'monitor', label: '服务监控', icon: Activity },
      ]
    },
    {
      header: '资源管理',
      items: [
        { id: 'images', label: '镜像管理', icon: ImageIcon },
        { id: 'services', label: '服务列表', icon: Layers },
      ]
    },
    {
      header: '数据中心',
      items: [
        { id: 'storage', label: '存储卷', icon: Database },
      ]
    }
  ];

  return (
    <aside className="glass-panel sidebar flex flex-col p-8 gap-8 z-40 h-full rounded-[24px]">
      {sections.map((section, idx) => (
        <div key={idx} className="flex flex-col gap-3">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] font-semibold mb-1 px-3">
            {section.header}
          </div>
          <div className="flex flex-col gap-1">
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all duration-200 ${
                    isActive
                      ? 'bg-white/10 text-[var(--color-text-primary)]'
                      : 'text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="mt-auto flex flex-col gap-1 pt-4 border-t border-white/5">
        <button 
          onClick={onBackToHome}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-[var(--color-text-primary)] transition-all duration-200"
        >
          <Home className="w-4 h-4" />
          <span>返回首页</span>
        </button>
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-[var(--color-text-primary)] transition-all duration-200">
          <Settings className="w-4 h-4" />
          <span>系统设置</span>
        </button>
      </div>
    </aside>
  );
}
