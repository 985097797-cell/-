
import React, { useState, useEffect, useCallback } from 'react';
import { Sword, Trash2, Crown, ShieldAlert, Target, Cloud, Globe, Link, RefreshCw, Zap } from 'lucide-react';
import TeamSection from './components/TeamSection';
import { Team, PlayerConfig, CONFIG_CATEGORIES } from './types';

const createEmptyConfigs = () => {
  const configs: { [key: string]: string[] } = {};
  CONFIG_CATEGORIES.forEach(cat => {
    configs[cat] = [];
  });
  return configs;
};

const INITIAL_TEAMS: Team[] = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  name: `傲视第 ${i + 1} 纵队`,
  players: Array.from({ length: 5 }, (_, j) => ({
    id: `team-${i + 1}-player-${j + 1}`,
    name: '',
    level: '',
    role: '',
    configs: createEmptyConfigs(),
  }))
}));

const App: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [hostileLegions, setHostileLegions] = useState(['', '', '']);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedData = params.get('data');
    if (sharedData) {
      try {
        const decoded = JSON.parse(atob(sharedData));
        setTeams(decoded.teams);
        setHostileLegions(decoded.hostileLegions);
        setLastSynced(new Date().toLocaleTimeString());
        return;
      } catch (e) {
        console.error("Shared data corrupted");
      }
    }
    const saved = localStorage.getItem('asqq_legion_cloud_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTeams(parsed.teams || INITIAL_TEAMS);
        setHostileLegions(parsed.hostileLegions || ['', '', '']);
      } catch (e) {
        console.error("Load failed");
      }
    }
  }, []);

  const handleUpdateTeam = useCallback((teamId: number, playerIndex: number, updatedPlayer: PlayerConfig) => {
    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        const newPlayers = [...t.players];
        newPlayers[playerIndex] = updatedPlayer;
        return { ...t, players: newPlayers };
      }
      return t;
    }));
  }, []);

  const handleClearPlayer = (teamId: number, playerIndex: number) => {
    handleUpdateTeam(teamId, playerIndex, {
      id: `team-${teamId}-player-${playerIndex + 1}`,
      name: '',
      level: '',
      role: '',
      configs: createEmptyConfigs(),
    });
  };

  const saveToCloud = async () => {
    setIsSyncing(true);
    await new Promise(r => setTimeout(r, 800));
    localStorage.setItem('asqq_legion_cloud_v2', JSON.stringify({ teams, hostileLegions }));
    setLastSynced(new Date().toLocaleTimeString());
    setIsSyncing(false);
  };

  const generateShareLink = () => {
    const data = btoa(JSON.stringify({ teams, hostileLegions }));
    const url = `${window.location.origin}${window.location.pathname}?data=${data}`;
    navigator.clipboard.writeText(url).then(() => alert('协作链接已生成到剪贴板'));
  };

  const clearAll = () => {
    if (confirm('确认清空全军战备数据？')) {
      setTeams(INITIAL_TEAMS);
      setHostileLegions(['', '', '']);
      localStorage.removeItem('asqq_legion_cloud_v2');
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  return (
    <div className="relative min-h-screen bg-transparent text-slate-200">
      <nav className="sticky top-0 z-50 glass-panel border-b border-yellow-500/20 px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Zap className={`w-4 h-4 ${isSyncing ? 'text-yellow-400 animate-spin' : 'text-green-500'}`} />
          <span className="text-[10px] font-black uppercase text-slate-400">
            {isSyncing ? '同步中' : lastSynced ? `已同步 ${lastSynced}` : '在线'}
          </span>
        </div>
        <button onClick={generateShareLink} className="flex items-center gap-2 text-[10px] font-black text-yellow-500 hover:text-white transition-colors">
          <Link className="w-3 h-3" /> 分享协作链接
        </button>
      </nav>

      <header className="relative py-24 px-4 text-center overflow-hidden border-b-4 border-red-900/50">
        <div className="relative z-10 flex flex-col items-center">
          <Crown className="w-20 h-20 text-yellow-500 mb-6 drop-shadow-lg" />
          <h1 className="text-6xl md:text-8xl font-title tracking-[0.3em] text-yellow-500 mb-4 drop-shadow-2xl">傲视千秋</h1>
          <p className="text-slate-500 text-xs font-black tracking-[1em] mb-12 uppercase">战 略 指 挥 中 心</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl px-6">
            {hostileLegions.map((name, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 bg-red-950/20 border border-red-900/30 rounded-xl">
                <Target className="w-4 h-4 text-red-600" />
                <input 
                  type="text" 
                  placeholder="录入敌情"
                  value={name}
                  onChange={(e) => {
                    const next = [...hostileLegions];
                    next[i] = e.target.value;
                    setHostileLegions(next);
                  }}
                  className="bg-transparent border-none focus:ring-0 text-xs font-black text-red-100 w-full"
                />
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 mt-16 pb-32">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-3xl font-black font-title tracking-widest text-slate-100">纵队战备沙盘</h2>
            <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase">AOSHI LEGION STRATEGIC BOARD</p>
          </div>
          <div className="flex gap-4">
            <button onClick={saveToCloud} className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-slate-900 font-black text-xs rounded-xl hover:bg-yellow-400 transition-all">
              <Cloud className="w-4 h-4" /> 同步数据
            </button>
            <button onClick={clearAll} className="px-6 py-3 bg-red-950/30 text-red-500 font-black text-xs rounded-xl border border-red-900/30 hover:bg-red-600 hover:text-white transition-all">
              重置
            </button>
          </div>
        </div>

        <div className="space-y-24">
          {teams.map(team => (
            <TeamSection 
              key={team.id}
              team={team}
              onUpdateTeam={handleUpdateTeam}
              onClearPlayer={handleClearPlayer}
            />
          ))}
        </div>
      </main>

      <footer className="py-24 border-t border-slate-900 bg-[#010409]">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <div className="mb-12">
            <p className="text-yellow-600 font-black font-title text-4xl tracking-[0.4em]">傲视千秋</p>
          </div>
          <div className="mb-8">
            <div className="inline-block px-8 py-4 bg-slate-900/50 rounded-2xl border border-yellow-500/10">
              <p className="text-sm font-bold text-slate-400 leading-relaxed tracking-widest">
                本系统由<span className="text-yellow-500 mx-1">盘谷</span>制作，旨在协助彬总完善傲视内部统筹协调机制，
                为傲视团员更为直观地了解其他梯队成员的配置。
              </p>
            </div>
          </div>
          <p className="text-slate-600 text-[10px] uppercase font-black tracking-widest opacity-50">
            Internal Strategy System © 2025 PANGU
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
