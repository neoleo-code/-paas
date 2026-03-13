import React, { useState } from 'react';
import { Download, Star, Zap, X, Server, Cpu, HardDrive, Database, Terminal, Monitor, CreditCard, ChevronDown, CheckCircle2, Box, Image as ImageIcon, Plus } from 'lucide-react';
import { Model } from './ModelDetail';

export const models: Model[] = [
  { id: 'llama3', name: 'Llama 3 70B', type: 'LLM', size: '140GB', recommended: 'A100 x2', color: '#00C6FF' },
  { id: 'sdxl', name: 'Stable Diffusion XL', type: 'Image', size: '12GB', recommended: 'A100 x1', color: '#FF2D55' },
  { id: 'whisper', name: 'Whisper v3', type: 'Audio', size: '8GB', recommended: 'T4 x1', color: '#32D74B' },
  { id: 'mixtral', name: 'Mixtral 8x7B', type: 'LLM', size: '90GB', recommended: 'A100 x2', color: '#A855F7' },
  { id: 'qwen', name: 'Qwen 1.5 72B', type: 'LLM', size: '144GB', recommended: 'A100 x2', color: '#F59E0B' },
  { id: 'llama3-8b', name: 'Llama 3 8B', type: 'LLM', size: '16GB', recommended: 'A10G x1', color: '#00C6FF' },
];

interface ModelHubProps {
  onDeploy: (model: Model) => void;
  deployedModels: string[];
}

export default function ModelHub({ onDeploy, deployedModels }: ModelHubProps) {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      <header className="flex justify-between items-end px-2">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] font-semibold mb-1">
            模型资源 (Model Resources)
          </div>
          <h1 className="text-3xl font-light tracking-tight">模型大厅</h1>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <div 
            key={model.id} 
            onClick={() => { if (!deployedModels.includes(model.id)) onDeploy(model); }}
            className="glass-panel rounded-[2rem] p-8 group hover:-translate-y-1 transition-all duration-500 cursor-pointer relative overflow-hidden border border-white/5 hover:border-white/10"
            data-particle-color={model.color}
          >
            {/* Ambient Glow on Hover */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{ background: `radial-gradient(circle at 50% 100%, ${model.color}15 0%, transparent 70%)` }}
            />
            
            <div className="flex justify-between items-start mb-10 relative z-10">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 transition-all duration-500 group-hover:scale-110"
                style={{ boxShadow: `0 0 30px ${model.color}15` }}
              >
                <Box className="w-7 h-7" style={{ color: model.color }} />
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); /* handle star */ }}
                className="text-[var(--color-text-tertiary)] hover:text-white transition-colors p-2"
              >
                <Star className="w-5 h-5" />
              </button>
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-medium tracking-tight text-white">
                  {model.name}
                </h3>
                {deployedModels.includes(model.id) && (
                  <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full bg-white/5 text-[var(--color-status-complete)]">
                    <div className="w-1 h-1 rounded-full bg-[var(--color-status-complete)] shadow-[0_0_6px_var(--color-status-complete)]" />
                    运行中
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2 mb-8">
                <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-lg bg-white/5 text-[var(--color-text-tertiary)] border border-white/5">
                  {model.type}
                </span>
                <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-lg bg-white/5 text-[var(--color-text-tertiary)] border border-white/5">
                  {model.size}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-6">
                <div className="flex items-center gap-2 text-[11px] text-[var(--color-text-tertiary)] uppercase tracking-widest font-medium">
                  <Zap className="w-3.5 h-3.5" />
                  <span>推荐: {model.recommended}</span>
                </div>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if (!deployedModels.includes(model.id)) onDeploy(model); 
                  }}
                  className={`flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold px-4 py-2 rounded-xl transition-all ${
                    deployedModels.includes(model.id)
                      ? 'text-[var(--color-status-complete)] bg-[var(--color-status-complete)]/10 border border-[var(--color-status-complete)]/20 cursor-default'
                      : 'text-white bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10'
                  }`}
                >
                  {deployedModels.includes(model.id) ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                  {deployedModels.includes(model.id) ? '已部署' : '部署'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
