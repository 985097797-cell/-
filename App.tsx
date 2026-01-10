import React, { useState, useEffect, useCallback } from 'react';
import { Sword, Trash2, Crown, ShieldAlert, Target, Cloud, Globe, Link, RefreshCw, Zap, Maximize2, Minimize2, Users } from 'lucide-react';
import TeamSection from './components/TeamSection';
import WantedModal from './components/WantedModal';
import { Team, PlayerConfig, HostileLegion, STRATEGIC_MAPS } from './types';

const createEmptyHostile = (): HostileLegion => ({
  name: '',
  keyFigures: [],
  maps: STRATEGIC_MAPS.map(name => ({ name, lines: [], notes: '' }))
});

const INITIAL_HOSTILES: HostileLegion[] = [
  createEmptyHostile(),
  createEmptyHostile(),
  createEmptyHostile(),
];

const INITIAL_TEAMS: Team[] = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  name: `傲视第 ${i + 1} 纵队`,
  teamNickname: '',
  players: Array.from({ length: 5 }, (_, j) => ({
    id: `team-${i + 1}-player-${j + 1}`,
    name: '',
    level: '',
    role: '',
    positions: [],
  }))
}));

const App: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [hostileLegions, setHostileLegions] = useState<HostileLegion[]>(INITIAL_HOSTILES);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [activeWantedIdx, setActiveWantedIdx] = useState<number | null>(null);
  
  // 全局折叠状态
  const [expandAll, setExpandAll] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedData = params.get('data');
    
    if (sharedData) {
      try {
        const decoded = JSON.parse(atob(sharedData));
        setTeams(decoded.teams);
        setHostileLegions(decoded.hostileLegions || INITIAL_HOSTILES);
        setLastSynced(new Date().toLocaleTimeString());
        return;
      } catch (e) {
        console.error("Shared data corrupted");
      }
    }

    const saved = localStorage.getItem('asqq_legion_cloud_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTeams(parsed.teams || INITIAL_TEAMS);
        setHostileLegions(parsed.hostileLegions || INITIAL_HOSTILES);
      } catch (e) {
        console.error("Failed to load local data");
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

  const handleUpdateMetadata = useCallback((teamId: number, metadata: Partial<Pick<Team, 'name' | 'teamNickname'>>) => {
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, ...metadata } : t));
  }, []);

  const handleClearPlayer = (teamId: number, playerIndex: number) => {
    handleUpdateTeam(teamId, playerIndex, {
      id: `team-${teamId}-player-${playerIndex + 1}`,
      name: '',
      level: '',
      role: '',
      positions: [],
    });
  };

  const saveToCloud = async () => {
    setIsSyncing(true);
    await new Promise(r => setTimeout(r, 800));
    
    try {
      localStorage.setItem('asqq_legion_cloud_v4', JSON.stringify({ teams, hostileLegions }));
      setLastSynced(new Date().toLocaleTimeString());
      setIsSyncing(false);
    } catch (e) {
      alert('存储失败');
      setIsSyncing(false);
    }
  };

  const generateShareLink = () => {
    const data = btoa(JSON.stringify({ teams, hostileLegions }));
    const url = `${window.location.origin}${window.location.pathname}?data=${data}`;
    
    navigator.clipboard.writeText(url).then(() => {
      alert('【协同链接已生成】\n已包含所有敌情录入，发给战友即可实时同步！');
    });
  };

  const clearAll = () => {
    if (confirm('确定要清空全军战备数据（包含通缉名单）吗？此操作不可撤销。')) {
      setTeams(INITIAL_TEAMS);
      setHostileLegions(INITIAL_HOSTILES);
      localStorage.removeItem('asqq_legion_cloud_v4');
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  const updateHostile = (index: number, updates: Partial<HostileLegion>) => {
    const newHostiles = [...hostileLegions];
    newHostiles[index] = { ...newHostiles[index], ...updates };
    setHostileLegions(newHostiles);
  };

  return (
    <div className="relative min-h-screen pb-20 bg-transparent text-slate-200 selection:bg-yellow-500/30">
      <nav className="sticky top-0 z-50 glass-panel border-b border-yellow-500/20 px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Zap className={`w-4 h-4 ${isSyncing ? 'text-yellow-400 animate-spin' : 'text-green-500'}`} />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400">
              {isSyncing ? '数据同步中...' : lastSynced ? `云端同步完成 ${lastSynced}` : '离线模式'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={generateShareLink}
            className="group flex items-center gap-2 text-xs font-black text-yellow-500 hover:text-white transition-colors"
          >
            <Link className="w-3 h-3 group-hover:rotate-45 transition-transform" />
            一键分享协作链接
          </button>
        </div>
      </nav>

      <header className="relative py-20 px-4 text-center overflow-hidden border-b-4 border-slate-900 shadow-2xl">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover grayscale brightness-50"
            alt="War Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617] to-[#020617]"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="relative mb-6">
            <Crown className="w-20 h-20 text-yellow-500 drop-shadow-[0_0_20px_rgba(234,179,8,0.6)]" />
          </div>
          
          <h1 className="text-5xl md:text-[6rem] font-title tracking-[0.4em] text-yellow-500 mb-4">
            傲视千秋
          </h1>
          <p className="text-slate-500 text-xs font-black tracking-[1em] uppercase mb-12 ml-[1em]">
            军 团 指 挥 战 略 中 心
          </p>

          <div className="flex flex-col items-center gap-6 w-full max-w-6xl animate-fadeIn px-6">
            <div className="flex items-center gap-3">
               <ShieldAlert className="w-5 h-5 text-red-600" />
               <span className="text-xs font-black tracking-[0.5em] text-red-600 uppercase">情报监控: 敌对势力录入</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {hostileLegions.map((legion, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="relative group bg-red-950/10 border border-red-900/20 rounded-xl transition-all flex items-center px-4 py-3">
                    <Target className="w-5 h-5 text-red-800 mr-3 shrink-0" />
                    <input 
                      type="text" 
                      placeholder={`敌团 ${i+1} 名称`}
                      value={legion.name}
                      onChange={(e) => updateHostile(i, { name: e.target.value })}
                      className="w-full bg-transparent border-none focus:ring-0 text-sm font-black tracking-widest text-red-100 placeholder:text-red-900/40 uppercase"
                    />
                  </div>
                  <button 
                    onClick={() => setActiveWantedIdx(i)}
                    className="w-full py-2.5 bg-slate-900/60 hover:bg-red-600 hover:text-white border border-slate-800 hover:border-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all flex items-center justify-center gap-2"
                  >
                    <Users className="w-3.5 h-3.5" />
                    情报舱 {legion.keyFigures.length > 0 && `(${legion.keyFigures.length})`}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* 弹窗渲染 */}
      {activeWantedIdx !== null && (
        <WantedModal 
          legion={hostileLegions[activeWantedIdx]} 
          onClose={() => setActiveWantedIdx(null)}
          onUpdate={(updates) => updateHostile(activeWantedIdx, updates)}
        />
      )}

      <main className="max-w-[1700px] mx-auto px-6 mt-16 relative z-10">
        <div className="flex flex-wrap justify-between items-end gap-8 mb-10 pb-8 border-b border-slate-800/50">
          <div className="flex items-center gap-6">
            <Sword className="w-10 h-10 text-yellow-500" />
            <div>
              <h2 className="text-3xl font-black font-title tracking-[0.2em] text-slate-100 mb-1">战备沙盘</h2>
              <span className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-black">Strategic Deployment View</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800 mr-4">
              <button onClick={() => setExpandAll(true)} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest ${expandAll === true ? 'bg-yellow-500 text-slate-950' : 'text-slate-500 hover:text-slate-300'}`}><Maximize2 className="w-3.5 h-3.5" />全部展开</button>
              <button onClick={() => setExpandAll(false)} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest ${expandAll === false ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}><Minimize2 className="w-3.5 h-3.5" />全部收起</button>
            </div>
            <button onClick={saveToCloud} className="flex items-center gap-3 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 border border-yellow-300 text-slate-950 rounded-xl transition-all font-black text-xs tracking-widest"><Cloud className="w-4 h-4" />保存配置</button>
            <button onClick={clearAll} className="flex items-center gap-3 px-6 py-3 bg-red-950/20 hover:bg-red-600 hover:text-white border border-red-900/30 rounded-xl transition-all text-red-500 font-black text-xs tracking-widest"><Trash2 className="w-4 h-4" />重置</button>
          </div>
        </div>

        <div className="space-y-4">
          {teams.map(team => (
            <TeamSection 
              key={team.id}
              team={team}
              onUpdateTeam={handleUpdateTeam}
              onUpdateMetadata={(meta) => handleUpdateMetadata(team.id, meta)}
              onClearPlayer={handleClearPlayer}
              defaultExpanded={expandAll}
            />
          ))}
        </div>
      </main>

      <footer className="mt-40 py-16 border-t border-slate-900 text-center">
        <p className="text-yellow-600 font-black font-title text-2xl tracking-[0.4em] uppercase mb-4">傲视千秋</p>
        <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Command Intelligence System v4.1</p>
      </footer>
    </div>
  );
};

export default App;
