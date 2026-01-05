import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Image as ImageIcon, Shield, ImagePlus, Camera, X, Maximize2, Trash2 } from 'lucide-react';
import { PlayerConfig, ROLE_DATA, CONFIG_CATEGORIES } from '../types';

interface PlayerCardProps {
  player: PlayerConfig;
  onUpdate: (updated: PlayerConfig) => void;
  onClear: () => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, onUpdate, onClear }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const selectedRole = ROLE_DATA.find(r => r.name === player.role);
  const totalImages: number = (Object.values(player.configs) as string[][]).reduce((acc: number, curr: string[]) => acc + curr.length, 0);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ ...player, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImage = (category: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const currentImages = player.configs[category] || [];
        const updatedConfigs = {
          ...player.configs,
          [category]: [...currentImages, reader.result as string]
        };
        onUpdate({ ...player, configs: updatedConfigs });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (category: string, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedImages = [...(player.configs[category] || [])];
    updatedImages.splice(index, 1);
    onUpdate({
      ...player,
      configs: { ...player.configs, [category]: updatedImages }
    });
  };

  return (
    <div className={`relative flex flex-col bg-[#0f172a]/90 rounded-xl border-2 transition-all duration-500 overflow-hidden ${isExpanded ? 'border-yellow-600 shadow-[0_0_30px_rgba(202,138,4,0.2)]' : 'border-slate-800 hover:border-slate-700 shadow-xl'}`}>
      
      {previewUrl && (
        <div 
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 backdrop-blur-md animate-fadeIn cursor-zoom-out"
          onClick={() => setPreviewUrl(null)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh] group">
            <img src={previewUrl} className="w-full h-full object-contain rounded-lg border-2 border-yellow-500/50 shadow-2xl" alt="Preview" />
            <button className="absolute -top-12 right-0 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white" onClick={() => setPreviewUrl(null)}>
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <label className={`relative w-14 h-14 rounded-full border-[3px] shadow-lg flex items-center justify-center overflow-hidden transition-all duration-500 cursor-pointer ${
              player.avatar || selectedRole ? 'border-yellow-500 scale-105' : 'border-[#475569]'
            }`}>
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              {player.avatar ? (
                <img src={player.avatar} className="relative z-10 w-full h-full object-cover" alt="Avatar" />
              ) : selectedRole ? (
                <div className="relative z-10 w-full h-full flex items-center justify-center bg-slate-800">
                  <img src={selectedRole.avatarUrl} className="w-full h-full object-cover opacity-30" alt={selectedRole.name} />
                  <span className="absolute inset-0 flex items-center justify-center text-white text-lg">{selectedRole.icon}</span>
                </div>
              ) : (
                <Shield className="relative z-10 w-6 h-6 text-slate-400" />
              )}
            </label>
          </div>

          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <div className="text-[9px] font-black text-slate-500 tracking-widest uppercase truncate">
              {player.role ? `傲视 · ${player.role}` : '尚未就位'}
            </div>
            {/* 布局优化：限制等级列宽度并确保 Lv. 标签不收缩 */}
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
              <div className="shrink-0 w-16 flex items-center border-b border-slate-700 bg-slate-800/20 px-1 rounded-t-sm">
                <span className="shrink-0 text-[9px] font-black text-yellow-600/60 mr-1">Lv.</span>
                <input
                  type="text"
                  placeholder="150"
                  value={player.level}
                  onChange={(e) => onUpdate({ ...player, level: e.target.value })}
                  className="min-w-0 w-full bg-transparent focus:outline-none text-sm font-black text-yellow-500"
                />
              </div>
            </div>
          </div>
        </div>

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

        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${
            totalImages > 0 
            ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 shadow-inner' 
            : 'bg-slate-900/80 text-slate-500 border border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>军备库录入 ({totalImages})</span>
          </div>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="px-4 pb-6 animate-fadeIn bg-black/40 rounded-b-xl border-t border-slate-800/50">
          <div className="grid grid-cols-1 gap-5 pt-6">
            {CONFIG_CATEGORIES.map(cat => {
              const images = player.configs[cat] || [];
              return (
                <div key={cat} className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-black text-slate-400 tracking-[0.3em] uppercase">{cat}</span>
                    {images.length > 0 && (
                      <label className="cursor-pointer flex items-center gap-1 text-[10px] text-yellow-600 hover:text-yellow-400 font-bold bg-yellow-500/5 px-2 py-0.5 rounded-full border border-yellow-500/20">
                        <Plus className="w-3 h-3" /> 续传
                        <input type="file" accept="image/*" onChange={(e) => handleAddImage(cat, e)} className="hidden" />
                      </label>
                    )}
                  </div>
                  
                  <div className="relative">
                    {images.length === 0 ? (
                      <label className="flex flex-col items-center justify-center gap-2 w-full h-16 border-2 border-dashed border-slate-800 hover:border-yellow-500/40 rounded-xl cursor-pointer transition-all">
                        <ImagePlus className="w-4 h-4 text-slate-600" />
                        <span className="text-[9px] font-black text-slate-600 uppercase">录入 {cat} 截图</span>
                        <input type="file" accept="image/*" onChange={(e) => handleAddImage(cat, e)} className="hidden" />
                      </label>
                    ) : (
                      <div className="flex flex-wrap gap-2 p-2 bg-[#0a0f1d] rounded-xl border border-slate-800">
                        {images.map((img, idx) => (
                          <div 
                            key={idx} 
                            className="relative w-12 h-12 group/img rounded-lg overflow-hidden border-2 border-slate-800 hover:border-yellow-500 transition-all cursor-zoom-in"
                            onClick={() => setPreviewUrl(img)}
                          >
                            <img src={img} className="w-full h-full object-cover" alt="item" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                              <Maximize2 className="w-3 h-3 text-white" />
                            </div>
                            <button 
                              onClick={(e) => removeImage(cat, idx, e)}
                              className="absolute top-0 right-0 p-1 bg-red-600/90 text-white opacity-0 group-hover/img:opacity-100 hover:bg-red-500 transition-all z-20 rounded-bl-lg"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        <label className="w-12 h-12 flex items-center justify-center border-2 border-dashed border-slate-800 rounded-lg cursor-pointer hover:border-yellow-500/40 transition-all">
                          <Plus className="w-4 h-4 text-slate-700" />
                          <input type="file" accept="image/*" onChange={(e) => handleAddImage(cat, e)} className="hidden" />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-8 pt-6 border-t border-slate-800/50">
            <button onClick={onClear} className="w-full py-2 flex items-center justify-center gap-2 text-[10px] font-black text-red-900/50 hover:text-red-500 transition-all border border-dashed border-red-900/20 rounded-lg">
              <Trash2 className="w-3 h-3" /> 清空打手数据
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerCard;