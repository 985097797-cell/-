import React, { useState, useEffect } from 'react';
import { Users, ChevronDown, Crown } from 'lucide-react';
import PlayerCard from './PlayerCard';
import { Team, PlayerConfig, ROLE_DATA } from '../types';

interface TeamSectionProps {
  team: Team;
  onUpdateTeam: (teamId: number, playerIndex: number, updatedPlayer: PlayerConfig) => void;
  onUpdateMetadata: (metadata: Partial<Pick<Team, 'name' | 'teamNickname'>>) => void;
  onClearPlayer: (teamId: number, playerIndex: number) => void;
  defaultExpanded?: boolean;
}

const TeamSection: React.FC<TeamSectionProps> = ({ team, onUpdateTeam, onUpdateMetadata, onClearPlayer, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // 当外部强制展开/收起变化时更新
  useEffect(() => {
    setIsExpanded(defaultExpanded);
  }, [defaultExpanded]);

  // 计算已填写的玩家数量
  const filledCount = team.players.filter(p => p.name.trim() !== '' || p.role !== '').length;

  const handleNicknameChange = (val: string) => {
    onUpdateMetadata({ 
      teamNickname: val, 
      name: val.trim() ? val : `傲视第 ${team.id} 纵队` 
    });
  };

  return (
    <div className={`mb-4 transition-all duration-300 rounded-2xl border ${isExpanded ? 'bg-slate-900/40 border-yellow-500/30 shadow-lg' : 'bg-slate-900/10 border-slate-800 hover:border-slate-700'}`}>
      {/* 纵队头部 - 点击可折叠 */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between p-4 cursor-pointer group select-none"
      >
        <div className="flex items-center gap-4 flex-1">
          <div className={`p-2 rounded-lg transition-colors ${isExpanded ? 'bg-yellow-500 text-slate-950 shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'bg-slate-800 text-slate-500'}`}>
            <Users className="w-5 h-5" />
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 flex-1">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={team.name}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => onUpdateMetadata({ name: e.target.value })}
                className={`bg-transparent border-none focus:ring-0 p-0 text-lg font-bold font-title tracking-widest transition-colors w-48 ${isExpanded ? 'text-yellow-500' : 'text-slate-400'}`}
                placeholder="纵队名称"
              />
            </div>
            
            <div className="flex items-center gap-2 bg-slate-950/30 px-3 py-1 rounded-lg border border-slate-800/50 group-hover:border-yellow-500/20 transition-all">
              <Crown className={`w-3.5 h-3.5 ${team.teamNickname ? 'text-yellow-500' : 'text-slate-600'}`} />
              <input
                type="text"
                value={team.teamNickname || ''}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => handleNicknameChange(e.target.value)}
                className="bg-transparent border-none focus:ring-0 p-0 text-xs font-black text-slate-200 placeholder:text-slate-700 w-32 uppercase tracking-tighter"
                placeholder="小队昵称..."
              />
              <span className="text-[9px] font-black text-slate-600 uppercase ml-1">组</span>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded border ${filledCount > 0 ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-slate-800 border-slate-700 text-slate-600'}`}>
                就位率: {filledCount} / 5
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* 折叠时的成员缩略图预览 */}
          {!isExpanded && filledCount > 0 && (
            <div className="hidden lg:flex -space-x-2">
              {team.players.map((p, i) => {
                const role = ROLE_DATA.find(r => r.name === p.role);
                if (!role) return null;
                return (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#020617] bg-slate-800 flex items-center justify-center text-xs shadow-lg" title={`${p.name || '待定'}`}>
                    {role.icon}
                  </div>
                );
              })}
            </div>
          )}
          <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-yellow-500' : 'text-slate-600'}`}>
            <ChevronDown className="w-6 h-6" />
          </div>
        </div>
      </div>
      
      {/* 展开后的成员卡片 */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-4 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-2">
            {team.players.map((player, idx) => (
              <PlayerCard 
                key={player.id}
                player={player}
                onUpdate={(updated) => onUpdateTeam(team.id, idx, updated)}
                onClear={() => onClearPlayer(team.id, idx)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamSection;
