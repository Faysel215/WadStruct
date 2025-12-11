import React from 'react';
import { Activity, Disc, FileText, Settings, Hexagon } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  setActiveView: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView }) => {
  return (
    <div className="flex h-screen bg-islamic-dark text-slate-200 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 flex-shrink-0 border-r border-slate-700/50 bg-slate-900/50 flex flex-col">
        <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-slate-700/50">
          <Hexagon className="w-8 h-8 text-islamic-gold animate-pulse" />
          <span className="hidden md:block ml-3 font-bold text-lg tracking-tight text-white">
            Wa'd<span className="text-islamic-gold">Wizard</span>
          </span>
        </div>

        <nav className="flex-1 py-6 space-y-2 px-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Activity },
            { id: 'structurer', label: 'Structurer', icon: Disc },
            { id: 'terms', label: 'Term Sheets', icon: FileText },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group ${
                activeView === item.id
                  ? 'bg-islamic-gold/10 text-islamic-gold border border-islamic-gold/20'
                  : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeView === item.id ? 'text-islamic-gold' : 'group-hover:text-white'}`} />
              <span className="hidden md:block ml-3 font-medium">{item.label}</span>
              {activeView === item.id && (
                <div className="hidden md:block ml-auto w-1.5 h-1.5 rounded-full bg-islamic-gold shadow-[0_0_8px_#D4AF37]" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700/50">
          <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-slate-400">
            <p className="font-semibold text-islamic-gold mb-1">Quantum Core</p>
            <p>Status: <span className="text-green-400">Online</span></p>
            <p>Lat: 0.04ms</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-islamic-dark to-black">
        {children}
      </main>
    </div>
  );
};

export default Layout;