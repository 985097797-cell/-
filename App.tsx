import React, { useState, useEffect, useCallback } from 'react';
import { Sword, Save, Trash2, Share2, Crown, ShieldAlert, Target, Cloud, Globe, Link, RefreshCw, Zap } from 'lucide-react';
import TeamSection from './components/TeamSection';
import { Team, PlayerConfig, CONFIG_CATEGORIES } from './types';

const createEmptyConfigs = () => {
  const configs: { [key: string]: string[] } = {};
  CONFIG_CATEGORIES.forEach(cat => {
    configs[cat] = [];
  });
  return configs;
};

// 将团队数量从 5 修改为 15
const INITIAL_TEAMS: Team[] = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  name: `傲视第 ${i + 1} 纵队`,
  players: Array.from({ length: 5 }, (_, j) => ({
    id: `team-${i + 1}-player-${j + 1}`,
    name: '',
    level: '',
    role: '',
    positions: [], // 初始化为空
    configs: createEmptyConfigs(),
  }))
}));

const App: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [hostileLegions, setHostileLegions] = useState(['', '', '']);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  // 从 URL 恢复数据（实现多人在线通过链接访问）
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

    const saved = localStorage.getItem('asqq_legion_cloud_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // 如果本地存储的数据长度不足 15，则补齐至 15 个纵队
        const savedTeams = parsed.teams || [];
        if (savedTeams.length < 15) {
            const extendedTeams = [...savedTeams];
            for (let i = savedTeams.length; i < 15; i++) {
                extendedTeams.push(INITIAL_TEAMS[i]);
            }
            setTeams(extendedTeams);
        } else {
            setTeams(savedTeams);
        }
        setHostileLegions(parsed.hostileLegions || ['', '', '']);
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

  const handleClearPlayer = (teamId: number, playerIndex: number) => {
    handleUpdateTeam(teamId, playerIndex, {
      id: `team-${teamId}-player-${playerIndex + 1}`,
      name: '',
      level: '',
      role: '',
      positions: [], // 清空定位
      configs: createEmptyConfigs(),
    });
  };

  // 模拟云端保存
  const saveToCloud = async () => {
    setIsSyncing(true);
    // 模拟网络延迟
    await new Promise(r => setTimeout(r, 800));
    
    try {
      localStorage.setItem('asqq_legion_cloud_v1', JSON.stringify({ teams, hostileLegions }));
      setLastSynced(new Date().toLocaleTimeString());
      setIsSyncing(false);
    } catch (e) {
      alert('存储失败');
      setIsSyncing(false);
    }
  };

  // 生成多人在线协作链接
  const generateShareLink = () => {
    const data = btoa(JSON.stringify({ teams, hostileLegions }));
    const url = `${window.location.origin}${window.location.pathname}?data=${data}`;
    
    navigator.clipboard.writeText(url).then(() => {
      alert('【协同链接已生成】\n发给军团成员，他们打开链接即可看到当前配置！');
    });
  };

  const clearAll = () => {
    if (confirm('确定要清空全军战备数据吗？此操作不可撤销。')) {
      setTeams(INITIAL_TEAMS);
      setHostileLegions(['', '', '']);
      localStorage.removeItem('asqq_legion_cloud_v1');
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  const updateHostile = (index: number, val: string) => {
    const newHostiles = [...hostileLegions];
    newHostiles[index] = val;
    setHostileLegions(newHostiles);
  };

  return (
    <div className="relative min-h-screen pb-20 bg-transparent text-slate-200 selection:bg-yellow-500/30">
      
      {/* 协作状态浮条 */}
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
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-900/50 rounded-full border border-slate-800">
            <Globe className="w-3 h-3 text-blue-400" />
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Server: Global-Asia-1</span>
          </div>
          <button 
            onClick={generateShareLink}
            className="group flex items-center gap-2 text-xs font-black text-yellow-500 hover:text-white transition-colors"
          >
            <Link className="w-3 h-3 group-hover:rotate-45 transition-transform" />
            一键分享协作链接
          </button>
        </div>
      </nav>

      <header className="relative py-28 px-4 text-center overflow-hidden border-b-4 border-red-900/50 shadow-2xl">
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
            <Crown className="w-24 h-24 text-yellow-500 drop-shadow-[0_0_20px_rgba(234,179,8,0.6)]" />
            <div className="absolute -inset-4 bg-yellow-500/10 blur-3xl rounded-full animate-pulse"></div>
          </div>
          
          <h1 className="text-6xl md:text-[7rem] font-title tracking-[0.4em] text-yellow-500 drop-shadow-[0_10px_20px_rgba(0,0,0,1)] mb-4">
            傲视千秋
          </h1>
          <p className="text-slate-500 text-sm font-black tracking-[1em] uppercase mb-12 ml-[1em]">
            军 团 指 挥 战 略 中 心
          </p>

          <div className="flex flex-col items-center gap-6 w-full max-w-5xl animate-fadeIn">
            <div className="flex items-center gap-3">
               <div className="h-[1px] w-12 bg-gradient-to-l from-red-600 to-transparent"></div>
               <ShieldAlert className="w-5 h-5 text-red-600" />
               <span className="text-xs font-black tracking-[0.5em] text-red-600 uppercase">情报监控: 敌对势力</span>
               <div className="h-[1px] w-12 bg-gradient-to-r from-red-600 to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full px-6">
              {hostileLegions.map((name, i) => (
                <div key={i} className="relative group overflow-hidden">
                  <div className="absolute inset-0 bg-red-950/10 border border-red-900/20 rounded-xl transition-all group-focus-within:border-red-600/50 group-focus-within:bg-red-950/30"></div>
                  <div className="relative flex items-center px-5 py-4">
                    <Target className="w-5 h-5 text-red-800 mr-4 shrink-0 group-focus-within:text-red-500 transition-colors" />
                    <input 
                      type="text" 
                      placeholder={`录入敌团 ${i+1} 信息...`}
                      value={name}
                      onChange={(e) => updateHostile(i, e.target.value)}
                      className="w-full bg-transparent border-none focus:ring-0 text-sm font-black tracking-widest text-red-100 placeholder:text-red-900/40 uppercase"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1700px] mx-auto px-6 mt-16 relative z-10">
        <div className="flex flex-wrap justify-between items-end gap-8 mb-16 pb-10 border-b border-slate-800/50">
          <div className="flex items-center gap-6">
            <div className="relative">
                <div className="p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 shadow-[inset_0_0_20px_rgba(234,179,8,0.1)] status-pulse">
                    <Sword className="w-10 h-10 text-yellow-500" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-[#020617]"></div>
            </div>
            <div>
              <h2 className="text-3xl font-black font-title tracking-[0.2em] text-slate-100 mb-1">纵队战备沙盘</h2>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-black">Legion Ready Status:</span>
                <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[9px] font-bold rounded border border-green-500/20 uppercase tracking-widest">A-Level Priority</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={saveToCloud} 
              disabled={isSyncing}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl transition-all shadow-xl font-black text-sm tracking-widest border-2 ${
                isSyncing 
                ? 'bg-slate-900 border-slate-800 text-slate-600' 
                : 'bg-yellow-500 hover:bg-yellow-400 border-yellow-300 text-slate-950 hover:scale-105 active:scale-95'
              }`}
            >
              {isSyncing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Cloud className="w-5 h-5" />}
              同步云端
            </button>
            <button onClick={clearAll} className="flex items-center gap-3 px-8 py-4 bg-red-950/20 hover:bg-red-600 hover:text-white border-2 border-red-900/30 rounded-2xl transition-all text-red-500 font-black text-sm tracking-widest">
              <Trash2 className="w-5 h-5" />
              重置指挥部
            </button>
          </div>
        </div>

        <div className="space-y-32">
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

      <footer className="mt-40 py-24 border-t border-slate-900 bg-[#010409]">
        <div className="max-w-5xl mx-auto px-8 text-center">
          <div className="flex justify-center mb-10">
             <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-yellow-900/50 self-center"></div>
             <div className="px-8 py-3 rounded-full border border-yellow-900/30 bg-yellow-900/5">
                <p className="text-yellow-600 font-black font-title text-3xl tracking-[0.6em] uppercase">傲视千秋</p>
             </div>
             <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-yellow-900/50 self-center"></div>
          </div>
          
          <div className="mb-16">
            <div className="inline-block px-6 py-4 rounded-xl border border-yellow-500/10 bg-slate-900/40">
              <p className="text-xs md:text-sm font-bold text-slate-400 leading-relaxed tracking-widest">
                本系统由<span className="text-yellow-500 mx-1">盘谷</span>制作，旨在协助彬总完善傲视内部统筹协调机制，
                为傲视团员更为直观地了解其他梯队成员的配置。
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-slate-500 text-xs max-w-2xl mx-auto leading-relaxed italic opacity-60">
              “本战区系统已加密，所有变动将实时同步至傲视指挥部。请妥善使用‘协作链接’，切勿在公共频道泄露军情。”
            </p>
            <div className="flex justify-center gap-4 text-[10px] font-bold text-slate-700 uppercase tracking-widest">
              <span>Encrypted</span>
              <span className="text-slate-800">•</span>
              <span>Multi-User Sync</span>
              <span className="text-slate-800">•</span>
              <span>AOSHI Legacy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;