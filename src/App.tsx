/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import CursorParticles from './components/CursorParticles';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ModelHub from './components/ModelHub';
import Deployment from './components/Deployment';
import Monitoring from './components/Monitoring';
import LandingPage from './components/LandingPage';
import ServiceList from './components/ServiceList';
import ImageManager from './components/ImageManager';

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [deployedModels, setDeployedModels] = useState<string[]>([]);

  const handleEnter = (tab = 'dashboard', modelId?: string) => {
    setActiveTab(tab);
    if (modelId && !deployedModels.includes(modelId)) {
      setDeployedModels(prev => [...prev, modelId]);
    }
    setShowLanding(false);
  };

  const handleBackToHome = () => {
    setShowLanding(true);
  };

  if (showLanding) {
    return <LandingPage onEnter={handleEnter} />;
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] text-[var(--color-text-primary)] selection:bg-[var(--color-accent-start)]/30">
      <CursorParticles />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onBackToHome={handleBackToHome} />
      
      <main className="ml-64 min-h-screen p-8 relative">
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--color-accent-start)]/10 blur-[120px] rounded-full pointer-events-none neon-ambient" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'hub' && <ModelHub deployedModels={deployedModels} setDeployedModels={setDeployedModels} setActiveTab={setActiveTab} />}
          {activeTab === 'images' && <ImageManager setActiveTab={setActiveTab} />}
          {activeTab === 'services' && <ServiceList deployedModels={deployedModels} onStopService={(id) => setDeployedModels(prev => prev.filter(m => m !== id))} />}
          {activeTab === 'deploy' && <Deployment />}
          {activeTab === 'monitor' && <Monitoring />}
        </div>
      </main>
    </div>
  );
}
