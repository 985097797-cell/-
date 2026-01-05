
import React, { useState, useEffect, useRef } from 'react';
import { User, Trash2, ChevronDown, ChevronUp, Plus, Image as ImageIcon, Shield, ImagePlus, Sparkles, Camera, X, Maximize2 } from 'lucide-react';
import { PlayerConfig, ROLE_DATA, CONFIG_CATEGORIES } from '../types';
import { analyzePlayerPower } from '../services/geminiService';

interface PlayerCardProps {
  player: PlayerConfig;
  onUpdate: (updated: PlayerConfig) => void;
  onClear: () => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, onUpdate, onClear }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const prevTotalImages = useRef<number>(0);

  const selectedRole = ROLE_DATA.find(r => r.name === player.role);
  const totalImages: number = (Object.values(player.configs) as string[][]).reduce((acc: number, curr: string[]) => acc + curr.length, 0);

  useEffect(() => {
    if (totalImages > 0 && totalImages !== prevTotalImages.current && player.role && !isAnalyzing) {
      const timer = setTimeout(() => {
        triggerAIAnalysis();
        prevTotalImages.current = totalImages;
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [totalImages, player.role, player.name]);

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

  const triggerAIAnalysis = async () => {
    if (!player.role) return;
    setIsAnalyzing(true);
    const evaluation = await analyzePlayerPower(player);
    onUpdate({ ...player, aiEvaluation: evaluation });
    setIsAnalyzing(false);
  };

  return (
    <div className={`relative flex flex-col bg-[#0f172a]/90 rounded-xl border-2 transition-all duration-500 overflow-hidden ${isExpanded ? 'border-yellow-600 shadow-[0_0_30px_rgba(202,138,4,0.2)]' : 'border-slate-800 hover:border-slate-700 shadow-xl'}`}>
      
      {previewUrl && (
        <div 
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 backdrop-blur-md animate-fadeIn cursor-zoom-out"
          onClick={() => setPreviewUrl(null)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh] group">
            <img src={previewUrl} className="w-full h-full object-contain rounded-lg border-2 border-yellow-500/50" alt="Preview" />
            <button className="absolute -top-12 right-0 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white" onClick={() => setPreviewUrl(null)}>
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <label className={`relative w-16 h-16 rounded-full border-[3px] shadow-lg flex items-center justify-center overflow-hidden transition-all duration-500 cursor-pointer ${
              player.avatar || selectedRole ? 'border-yellow-500 scale-105' : 'border-[#475569]'
            }`}>
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              {player.avatar ? (
                <img src={player.avatar} className="relative z-10 w-full h-full object-cover" alt="Avatar" />
              ) : selectedRole ? (
                <div className="relative z-10 w-full h-full flex items-center justify-center bg-slate-800">
                  <img src={selectedRole.avatarUrl} className="w-full h-full object-cover opacity-20" alt={selectedRole.name} />
                  <span className="absolute inset-0 flex items-center justify-center text-white text-xl">{selectedRole.icon}</span>
                </div>
              ) : (
                <Shield className="relative z-10 w-8 h-8 text-slate-400" />
              )}
            </label>
          </div>

          <div className="flex-1 flex flex-col gap-1">
            <div className="text-[10px] font-black text-slate-500 tracking-widest uppercase">
              {player.role ? `傲视 · ${player.role}` : '准备就绪'}
            </div>
            <div className="flex gap-2 items-end">
              <input
                type="text"
                placeholder="昵称"
                value={player.name}
                onChange={(e) => onUpdate({ ...player, name: e.target.value })}
                className="flex-1 bg-transparent border-b border-slate-700 focus:border-yellow-500 py-1 text-sm font-black text-white focus:outline-none"
              />
              <div className="w-16 flex items-center border-b border-slate-700">
                <span className="text-[10px] font-black text-yellow-600/60 mr-1">Lv.</span>
                <input
                  type="text"
                  placeholder="150"
                  value={player.level}
                  onChange={(e) => onUpdate({ ...player, level: e.target.value })}
                  className="w-full bg-transparent focus:outline-none text-sm font-black text-yellow-500"
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
              className={`py-1.5 rounded-lg text-[10px] font-black transition-all border ${
                player.role === role.name 
                ? 'bg-yellow-500 text-slate-900 border-yellow-300' 
                : 'bg-slate-800/50 border-slate-700 text-slate-500'
              }`}
            >
              {role.name}
            </button>
          ))}
        </div>

        {/* 战力评估区块 */}
        <div className="mt-2 p-3 bg-black/30 rounded-xl border border-yellow-500/10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'text-yellow-400 animate-spin' : 'text-yellow-600'}`} />
            <span className="text-[11px] font-black text-slate-300 tracking-[0.2em] uppercase">战力评估</span>
          </div>
          <div className={`text-[12px] font-black text-yellow-500/90 italic leading-relaxed ${isAnalyzing ? 'animate-pulse' : ''}`}>
            {player.aiEvaluation ? `“ ${player.aiEvaluation} ”` : (player.role ? '军师正在审视战备...' : '暂无数据')}
          </div>
        </div>

        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${
            totalImages > 0 
            ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30' 
            : 'bg-slate-900/80 text-slate-500 border border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            <span>军备库录入 ({totalImages})</span>
          </div>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="px-4 pb-6 animate-fadeIn bg-black/40 border-t border-slate-800/50">
          <div className="grid grid-cols-1 gap-4 pt-5">
            {CONFIG_CATEGORIES.map(cat => {
              const images = player.configs[cat] || [];
              return (
                <div key={cat} className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">{cat}</span>
                    <label className="cursor-pointer text-[9px] text-yellow-600 hover:text-yellow-400 font-bold bg-yellow-500/5 px-2 py-0.5 rounded-full border border-yellow-500/10">
                      录入图片
                      <input type="file" accept="image/*" onChange={(e) => handleAddImage(cat, e)} className="hidden" />
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2 p-2 bg-slate-900/50 rounded-lg min-h-[40px]">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative w-12 h-12 group rounded overflow-hidden border border-slate-800">
                        <img src={img} className="w-full h-full object-cover cursor-zoom-in" onClick={() => setPreviewUrl(img)} alt="cfg" />
                        <button onClick={(e) => removeImage(cat, idx, e)} className="absolute top-0 right-0 p-0.5 bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={onClear} className="w-full mt-6 py-2 text-[10px] font-black text-red-900/50 hover:text-red-500 transition-all border border-dashed border-red-900/20 rounded-lg">
            清空打手数据
          </button>
        </div>
      )}
    </div>
  );
};

export default PlayerCard;
