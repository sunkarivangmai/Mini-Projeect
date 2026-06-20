import { useState, useEffect } from 'react';
import { API_BASE_URL } from './config';
import { 
  Home as HomeIcon, 
  Database, 
  Cpu, 
  Play, 
  CheckCircle, 
  TrendingUp, 
  BookOpen, 
  Mail, 
  Wifi, 
  WifiOff, 
  AlertCircle, 
  X,
  Menu
} from 'lucide-react';
import Home from './pages/Home';
import DatasetUpload from './pages/DatasetUpload';
import VisionTransformer from './pages/VisionTransformer';
import GuidedDiffusion from './pages/GuidedDiffusion';
import Results from './pages/Results';
import PatternAnalysis from './pages/PatternAnalysis';
import ResearchInfo from './pages/ResearchInfo';
import Contact from './pages/Contact';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [uploadedDataset, setUploadedDataset] = useState({
    filename: 'No file loaded',
    sizeBytes: 0,
    total: 0,
    unique: 0,
    data: []
  });

  const [generatedTargets, setGeneratedTargets] = useState([]);
  const [generationStats, setGenerationStats] = useState(null); // real backend stats from last diffusion run
  const [vitCompleted, setVitCompleted] = useState(false); // tracks ViT training completion

  // Toast Notification System
  const addNotification = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { id, message, type }]);
    // Detect ViT training completion from notification message
    if (type === 'success' && message.toLowerCase().includes('vision transformer')) {
      setVitCompleted(true);
    }
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  // Wrapper for setGeneratedTargets that also captures backend stats
  const handleSetGeneratedTargets = (targets, stats = null) => {
    setGeneratedTargets(targets);
    if (stats) setGenerationStats(stats);
  };

  // Check Backend Connection Health
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/`);
        if (res.ok) {
          setBackendOnline(true);
        } else {
          setBackendOnline(false);
        }
      } catch (err) {
        setBackendOnline(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: HomeIcon },
    { id: 'upload', label: 'Dataset Upload', icon: Database },
    { id: 'vit', label: 'ViT Training', icon: Cpu },
    { id: 'diffusion', label: 'Guided Diffusion', icon: Play },
    { id: 'results', label: 'Results', icon: CheckCircle },
    { id: 'patterns', label: 'Pattern Analysis', icon: TrendingUp },
    { id: 'research', label: 'Research Info', icon: BookOpen },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} />;
      case 'upload':
        return (
          <DatasetUpload 
            uploadedDataset={uploadedDataset} 
            setUploadedDataset={setUploadedDataset} 
            addNotification={addNotification} 
          />
        );
      case 'vit':
        return <VisionTransformer addNotification={addNotification} />;
      case 'diffusion':
        return (
          <GuidedDiffusion 
            generatedTargets={generatedTargets} 
            setGeneratedTargets={handleSetGeneratedTargets} 
            addNotification={addNotification} 
            setActiveTab={setActiveTab}
            vitCompleted={vitCompleted}
          />
        );
      case 'results':
        return <Results generatedTargets={generatedTargets} generationStats={generationStats} addNotification={addNotification} />;
      case 'patterns':
        return <PatternAnalysis />;
      case 'research':
        return <ResearchInfo />;
      case 'contact':
        return <Contact addNotification={addNotification} />;
      default:
        return <Home setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-cream text-charcoal flex flex-col md:flex-row relative">
      {/* Top Mobile Bar */}
      <header className="md:hidden relative z-50 flex items-center justify-between px-6 py-4 bg-white border-b border-border-gray w-full shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-garnet rounded-full" />
          <span className="font-semibold text-sm tracking-tight text-charcoal" style={{ fontFamily: "'Instrument Serif', serif" }}>IPv6 GenEngine</span>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-1.5 px-3 py-1 text-[10px] font-semibold rounded-full ${
            backendOnline 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {backendOnline ? <Wifi size={10} /> : <WifiOff size={10} />}
            {backendOnline ? 'Online' : 'Offline'}
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-charcoal bg-cream rounded-xl border border-border-gray hover:bg-charcoal hover:text-white transition-all duration-300"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`fixed md:sticky top-0 left-0 h-full w-[280px] bg-white border-r border-border-gray p-6 flex flex-col justify-between z-40 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } shrink-0`}>
        <div>
          {/* Logo Title */}
          <div className="flex items-center gap-3 mb-10 pb-6 border-b border-border-gray">
            <div className="h-3 w-3 bg-garnet rounded-full shrink-0" />
            <div>
              <span className="text-lg tracking-tight text-charcoal block" style={{ fontFamily: "'Instrument Serif', serif" }}>IPv6 Target Gen</span>
              <span className="text-[9px] text-garnet uppercase tracking-[0.2em] font-semibold">Research Core v1.0</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium transition-all duration-300 cursor-pointer rounded-xl ${
                    isActive 
                      ? 'text-garnet bg-[#B23B48]/8' 
                      : 'text-warm-dark/80 hover:text-garnet hover:bg-cream'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-garnet' : 'text-muted'} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Server Connection Health Panel */}
        <div className="p-4 border border-border-gray bg-cream rounded-2xl mt-8">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-muted font-semibold text-[10px] uppercase tracking-wider">API Status</span>
            <span className={`flex items-center gap-1.5 font-semibold text-[10px] ${backendOnline ? 'text-emerald-600' : 'text-red-600'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${backendOnline ? 'bg-emerald-500 pulse-dot' : 'bg-red-500'}`} />
              {backendOnline ? 'Connected' : 'Offline'}
            </span>
          </div>
          <p className="text-[11px] text-muted leading-relaxed">
            {backendOnline 
              ? 'FastAPI pipeline active. All ML APIs reachable.' 
              : 'FastAPI offline. Restart dev environment.'}
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 relative z-10 flex flex-col">
        {/* Connection Offline Warning Bar */}
        {!backendOnline && (
          <div className="bg-red-50 border-b border-red-200 px-6 py-2.5 flex items-center gap-2.5 text-xs font-medium text-red-700 justify-center rounded-none">
            <AlertCircle size={14} /> Backend server offline. Restart dev environment to connect.
          </div>
        )}
        
        {/* Page Render Container */}
        <div className="flex-grow">
          {renderContent()}
        </div>
      </main>

      {/* Notifications Toast Overlay */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full">
        {notifications.map((n) => (
          <div 
            key={n.id} 
            className={`toast-notification p-4 flex items-start gap-3 text-sm font-medium rounded-2xl shadow-lg transition-all duration-350 ${
              n.type === 'success' 
                ? 'bg-white/90 text-emerald-700 border border-emerald-200' 
                : n.type === 'error' 
                ? 'bg-white/90 text-red-700 border border-red-200' 
                : 'bg-white/90 text-charcoal border border-border-gray'
            }`}
          >
            <div className="flex-1 text-[13px]">{n.message}</div>
            <button 
              onClick={() => setNotifications(prev => prev.filter(item => item.id !== n.id))}
              className="text-muted hover:text-charcoal transition-colors p-0.5"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;


