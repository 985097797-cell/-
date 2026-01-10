import React from 'react';
import { Shield, Trash2, Tag } from 'lucide-react';
import { PlayerConfig, ROLE_DATA, PLAYER_POSITIONS } from '../types';

interface PlayerCardProps {
  player: PlayerConfig;
  onUpdate: (updated: PlayerConfig) => void;
  onClear: () => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, onUpdate, onClear }) => {
  const selectedRole = ROLE_DATA.find(r => r.name === player.role);

  const togglePosition = (pos: string) => {
    const current = player.positions || [];
    if (current.includes(pos)) {
      onUpdate({ ...player, positions: current.filter(p => p !== pos) });
    } else if (current.length < 2) {
      onUpdate({ ...player, positions: [...current, pos] });
    }
  };

  return (
    <div className={`relative flex flex-col bg-[#0f172a]/90 rounded-xl border-2 border-slate-800 hover:border-slate-700 transition-all duration-300 shadow-xl overflow-hidden`}>
      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className={`relative w-14 h-14 rounded-full border-[3px] shadow-lg flex items-center justify-center overflow-hidden transition-all duration-500 ${
              selectedRole ? 'border-yellow-500 scale-105' : 'border-[#475569]'
            }`}>
              {selectedRole ? (
                <div className="relative z-10 w-full h-full flex items-center justify-center bg-slate-800">
                  <img src={selectedRole.avatarUrl} className="w-full h-full object-cover opacity-30" alt={selectedRole.name} />
                  <span className="absolute inset-0 flex items-center justify-center text-white text-lg">{selectedRole.icon}</span>
                </div>
              ) : (
                <Shield className="relative z-10 w-6 h-6 text-slate-400" />
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <div className="text-[9px] font-black text-slate-500 tracking-widest uppercase truncate">
              {player.role ? `傲视 · ${player.role}` : '尚未就位'}
            </div>
            <div className="flex gap-2 items-end overflow-hidden">
              <div className="flex-1 min-w-0 border-b border-slate-700">
                <input
                  type="text"
                  placeholder="昵称"
                  value={player.name}
                  onChange={(e) => onUpdate({ ...player, name: e.target.value })}
                  className="w-full bg-transparent py-0.5 text-sm font-black text-white focus:outline-none placeholder:text-slate-800"
                />
              </div>
              <div className="shrink-0 w-20 flex items-center border-b border-slate-700 bg-slate-800/20 px-1.5 rounded-t-sm transition-all">
                <span className="shrink-0 text-[9px] font-black text-yellow-600/60 mr-1">Lv.</span>
                <input
                  type="text"
                  placeholder=""
                  value={player.level}
                  onChange={(e) => onUpdate({ ...player, level: e.target.value })}
                  className="min-w-0 w-full bg-transparent focus:outline-none text-sm font-black text-yellow-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 职业选择 */}
        <div className="grid grid-cols-3 gap-1.5">
          {ROLE_DATA.map((role) => (
            <button
              key={role.name}
              onClick={() => onUpdate({ ...player, role: role.name })}
              className={`py-1.5 rounded-lg text-[9px] font-black transition-all border ${
                player.role === role.name 
                ? 'bg-yellow-500 text-slate-900 border-yellow-300 shadow-lg' 
                : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-slate-300'
              }`}
            >
              {role.name}
            </button>
          ))}
        </div>

        {/* 定位选择 */}
        <div className="flex flex-col gap-2 p-2 bg-slate-950/50 rounded-lg border border-slate-800/50">
          <div className="flex items-center justify-between px-1">
             <div className="flex items-center gap-1.5">
                <Tag className="w-3 h-3 text-slate-500" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">战场定位</span>
             </div>
             <span className={`text-[8px] font-bold ${player.positions?.length === 2 ? 'text-yellow-500' : 'text-slate-600'}`}>
               {player.positions?.length || 0} / 2
             </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {PLAYER_POSITIONS.map(pos => {
              const isSelected = player.positions?.includes(pos);
              const isDisabled = !isSelected && player.positions?.length >= 2;
              return (
                <button
                  key={pos}
                  onClick={() => togglePosition(pos)}
                  disabled={isDisabled}
                  className={`px-2 py-0.5 rounded text-[9px] font-black transition-all border ${
                    isSelected 
                    ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.1)]' 
                    : isDisabled 
                      ? 'bg-slate-900/20 border-slate-900 text-slate-800 cursor-not-allowed'
                      : 'bg-slate-900 border-slate-800 text-slate-600 hover:text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {pos}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/50">
          <button 
            onClick={onClear} 
            className="w-full py-1.5 flex items-center justify-center gap-2 text-[9px] font-black text-slate-600 hover:text-red-500 transition-all rounded-lg"
          >
            <Trash2 className="w-3 h-3" /> 重置阵位数据
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;