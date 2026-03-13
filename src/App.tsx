/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Monitoring from './components/Monitoring';
import LandingPage from './components/LandingPage';
import ServiceList from './components/ServiceList';
import ImageManager from './components/ImageManager';
import ServiceDeployment from './components/ServiceDeployment';
import ServiceDetail from './components/ServiceDetail';
import AuthPage from './components/AuthPage';
import ModelHub from './components/ModelHub';
import History from './components/History';
import StorageManager from './components/StorageManager';
import DeploymentSidebar from './components/DeploymentSidebar';

import { Server, Layout, Cpu } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState<'landing' | 'auth' | 'dashboard'>('landing');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [deployedModels, setDeployedModels] = useState<string[]>([]);
  const [selectedImageForDeployment, setSelectedImageForDeployment] = useState<any>(null);
  const [isDeploymentSidebarOpen, setIsDeploymentSidebarOpen] = useState(false);
  const [sidebarModel, setSidebarModel] = useState<any>(null);

  const handleQuickDeploy = (image: any = null) => {
    setSelectedImageForDeployment(image);
    setIsDeploymentSidebarOpen(true);
    setSidebarModel(null);
  };

  const handleModelDeploy = (model: any) => {
    setSidebarModel(model);
    setIsDeploymentSidebarOpen(true);
  };

  const handleEnter = (tab = 'dashboard', modelId?: string) => {
    setActiveTab(tab);
    if (modelId && !deployedModels.includes(modelId)) {
      setDeployedModels(prev => [...prev, modelId]);
    }
    setActivePage('dashboard');
  };

  const handleBackToHome = () => {
    setActivePage('landing');
  };

  if (activePage === 'landing') {
    return <LandingPage onEnter={handleEnter} onAuth={() => setActivePage('auth')} />;
  }

  if (activePage === 'auth') {
    return <AuthPage onBack={() => setActivePage('landing')} />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[var(--color-text-primary)] selection:bg-[var(--color-accent-start)]/30 overflow-hidden flex items-center justify-center relative">
      
      {/* Environment Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center filter blur-[25px] brightness-[0.2]"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=2500&auto=format&fit=crop')" }}
        />
      </div>

      <div className="workspace w-full max-w-[1400px] h-[90vh] grid grid-cols-[280px_1fr] gap-6 p-6 relative z-10">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onBackToHome={handleBackToHome} />
        
        <main className="main-content flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-hide">
          <div className="relative z-10">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'models' && <ModelHub onDeploy={handleModelDeploy} deployedModels={deployedModels} />}
            {activeTab === 'images' && <ImageManager setActiveTab={(tab, image) => {
              if (tab === 'deployment') {
                handleQuickDeploy(image);
              } else {
                setActiveTab(tab);
              }
            }} />}
            {activeTab === 'services' && <ServiceList deployedModels={deployedModels} onStopService={(id) => setDeployedModels(prev => prev.filter(m => m !== id))} onQuickDeploy={() => handleQuickDeploy()} />}
            {activeTab === 'deployment' && <ServiceDeployment 
              selectedImage={selectedImageForDeployment}
              onDeploy={() => setActiveTab('serviceDetail')} 
              onBack={() => setActiveTab('services')} 
            />}
            {activeTab === 'serviceDetail' && <ServiceDetail onBack={() => setActiveTab('services')} />}
            {activeTab === 'monitor' && <Monitoring />}
            {activeTab === 'history' && <History />}
            {activeTab === 'storage' && <StorageManager />}
          </div>
        </main>
      </div>

      <DeploymentSidebar 
        isOpen={isDeploymentSidebarOpen}
        onClose={() => setIsDeploymentSidebarOpen(false)}
        selectedModel={sidebarModel}
        preSelectedImage={selectedImageForDeployment}
        onDeploySuccess={(modelId) => {
          if (modelId && !deployedModels.includes(modelId)) {
            setDeployedModels(prev => [...prev, modelId]);
          }
        }}
      />
    </div>
  );
}
