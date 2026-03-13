import React, { useState } from 'react';
import { Github, Mail, Lock, Server, Radio, MessageCircle, Phone, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthPageProps {
  onBack: () => void;
}

export default function AuthPage({ onBack }: AuthPageProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  return (
    <div className="min-h-screen bg-[#0a080d] text-white flex items-center justify-center p-6 font-sans overflow-hidden relative">
      {/* Back to Home Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors z-20 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-mono uppercase tracking-widest">返回首页</span>
      </motion.button>

      {/* Pastel Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-amber-500/20 blur-[150px] rounded-full" 
        />
        <motion.div 
          animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[40%] bg-amber-600/20 blur-[150px] rounded-full" 
        />
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left Side: Branding with floating animation */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <Server className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">BitaHub</span>
          </div>
          
          <h1 className="text-6xl font-light leading-tight">
            连接创意<br />
            合成逻辑<br />
            加速构建
          </h1>
          
          <p className="text-gray-400 text-lg max-w-md leading-relaxed">
            统一的空间智能平台。映射您的架构，训练协作式 AI 智能体，并无缝编排知识图谱。
          </p>

          <div className="flex gap-4">
            <div className="px-4 py-2 rounded-lg border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-mono flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" /> 网络在线
            </div>
            <div className="px-4 py-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-mono flex items-center gap-2">
              <Radio className="w-3 h-3" /> 节点同步
            </div>
          </div>
        </motion.div>

        {/* Right Side: Auth Card with floating animation and glassmorphism */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-2xl"
        >
          <div className="flex gap-8 mb-8 border-b border-white/10 pb-4">
            <button 
              onClick={() => setActiveTab('signin')}
              className={`text-sm font-medium transition-colors ${activeTab === 'signin' ? 'text-white' : 'text-gray-500'}`}
            >
              登录
            </button>
            <button 
              onClick={() => setActiveTab('signup')}
              className={`text-sm font-medium transition-colors ${activeTab === 'signup' ? 'text-white' : 'text-gray-500'}`}
            >
              注册账号
            </button>
          </div>

          <h2 className="text-2xl font-semibold mb-2">{activeTab === 'signin' ? '欢迎回来' : '开启旅程'}</h2>
          <p className="text-gray-400 text-sm mb-8">{activeTab === 'signin' ? '初始化您的会话以访问工作区。' : '创建一个新账号以开始使用 BitaHub。'}</p>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">邮箱地址</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                <input type="email" placeholder="name@domain.com" className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-amber-500/50 transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">密码</label>
                <span className="text-[10px] text-gray-500 cursor-pointer hover:text-white">忘记密码？</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                <input type="password" placeholder="••••••••" className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-amber-500/50 transition-colors" />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-gray-400">
              <input type="checkbox" className="rounded border-white/10 bg-black/20 accent-amber-500" />
              记住我
            </label>

            <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-all flex items-center justify-center gap-2">
              {activeTab === 'signin' ? '验证并登录' : '立即注册'} <span className="text-lg">→</span>
            </button>
          </form>

          <div className="my-8 text-center text-[10px] uppercase tracking-widest text-gray-600 font-mono">其他登录方式</div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-all">
              <MessageCircle className="w-4 h-4 text-green-500" /> 微信登录
            </button>
            <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-all">
              <Phone className="w-4 h-4 text-amber-500" /> 手机号登录
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex justify-between text-[10px] text-gray-600 font-mono">
            <span>系统版本: 2.4.1</span>
            <span className="flex items-center gap-1 text-green-500"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> 安全连接</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
