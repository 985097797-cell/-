import React from 'react';
import { X, UserPlus, Image as ImageIcon, Trash2, Map, ShieldAlert, Plus, Layers } from 'lucide-react';
import { HostileLegion, KeyFigure, ROLE_DATA, MapIntelligence } from '../types';

interface WantedModalProps {
  legion: HostileLegion;
  onClose: () => void;
  onUpdate: (updates: Partial<HostileLegion>) => void;
}

const WantedModal: React.FC<WantedModalProps> = ({ legion, onClose, onUpdate }) => {
  const handleAddFigure = () => {
    const newFigure: KeyFigure = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      role: '',
      images: Array(15).fill('')
    };
    onUpdate({ keyFigures: [...legion.keyFigures, newFigure] });
  };

  const updateFigure = (id: string, updates: Partial<KeyFigure>) => {
    onUpdate({
      keyFigures: legion.keyFigures.map(f => f.id === id ? { ...f, ...updates } : f)
    });
  };

  const removeFigure = (id: string) => {
    onUpdate({ keyFigures: legion.keyFigures.filter(f => f.id !== id) });
  };

  const handleImageUpload = (figureId: string, imgIdx: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      const figure = legion.keyFigures.find(f => f.id === figureId);
      if (figure) {
        const newImages = [...figure.images];
        newImages[imgIdx] = base64;
        updateFigure(figureId, { images: newImages });
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleLine = (mapIdx: number, line: number) => {
    const newMaps = [...legion.maps];
    const currentLines = newMaps[mapIdx].lines;
    if (currentLines.includes(line)) {
      newMaps[mapIdx].lines = currentLines.filter(l => l !== line);
    } else {
      newMaps[mapIdx].lines = [...currentLines, line].sort((a, b) => a - b);
    }
    onUpdate({ maps: newMaps });
  };

  const updateMapNote = (mapIdx: number, note: string) => {
    const newMaps = [...legion.maps];
    newMaps[mapIdx].notes = note;
    onUpdate({ maps: newMaps });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className="relative w-full h-[85vh] md:w-[85%] md:h-[80vh] glass-panel rounded-3xl border-2 border-yellow-500/20 flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
              <ShieldAlert className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black font-title tracking-widest text-slate-100">
                {legion.name || '未知势力'} · 战略情报舱
              </h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Intelligence Target & Strategic Deployment</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-950/20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            
            {/* 关键人物列表 - 占据 3/5 宽度 */}
            <div className="lg:col-span-3 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-black text-yellow-500 font-title tracking-widest">
                  <UserPlus className="w-5 h-5" /> 关键人物情报
                </h3>
                <button 
                  onClick={handleAddFigure}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 rounded-lg text-xs font-black flex items-center gap-2 transition-all"
                >
                  <Plus className="w-4 h-4" /> 录入通缉目标
                </button>
              </div>

              {legion.keyFigures.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl opacity-40">
                  <ShieldAlert className="w-12 h-12 text-slate-600 mb-4" />
                  <p className="text-sm font-bold text-slate-500 tracking-widest uppercase">暂无活跃目标情报</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {legion.keyFigures.map((figure) => (
                    <div key={figure.id} className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 relative group/card hover:border-yellow-500/20 transition-all shadow-lg">
                      <button 
                        onClick={() => removeFigure(figure.id)}
                        className="absolute top-4 right-4 p-2 text-slate-600 hover:text-red-500 opacity-0 group-hover/card:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">昵称 / ID</label>
                          <input 
                            type="text"
                            value={figure.name}
                            onChange={(e) => updateFigure(figure.id, { name: e.target.value })}
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-yellow-500/50 focus:ring-0 transition-all"
                            placeholder="目标昵称..."
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">职业定位</label>
                          <select 
                            value={figure.role}
                            onChange={(e) => updateFigure(figure.id, { role: e.target.value })}
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-yellow-500/50 focus:ring-0 transition-all"
                          >
                            <option value="">选择职业</option>
                            {ROLE_DATA.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <ImageIcon className="w-3.5 h-3.5" /> 核心配置建档 (15位)
                          </span>
                        </div>
                        <div className="grid grid-cols-5 md:grid-cols-8 gap-2">
                          {figure.images.map((img, idx) => (
                            <label key={idx} className="aspect-square relative group cursor-pointer overflow-hidden rounded-lg border border-slate-800 bg-slate-950 hover:border-yellow-500/30 transition-all">
                              {img ? (
                                <img src={img} className="w-full h-full object-cover" alt="Intelligence" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-800 group-hover:text-slate-500 transition-colors">
                                  <Plus className="w-4 h-4" />
                                </div>
                              )}
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => e.target.files?.[0] && handleImageUpload(figure.id, idx, e.target.files[0])}
                              />
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 战略地图情报 - 占据 2/5 宽度 */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="flex items-center gap-2 text-lg font-black text-blue-500 font-title tracking-widest">
                <Map className="w-5 h-5" /> 敌团常驻地图分布
              </h3>
              <div className="space-y-4">
                {legion.maps.map((mapInfo, mapIdx) => (
                  <div key={mapInfo.name} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-black text-slate-200 tracking-widest">{mapInfo.name}</span>
                      </div>
                      <span className="text-[9px] font-black px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                        已选 {mapInfo.lines.length} 线
                      </span>
                    </div>

                    {/* 14条线路网格 */}
                    <div className="grid grid-cols-7 gap-1.5">
                      {Array.from({ length: 14 }, (_, i) => i + 1).map(lineNum => (
                        <button
                          key={lineNum}
                          onClick={() => toggleLine(mapIdx, lineNum)}
                          className={`py-1 rounded text-[10px] font-black transition-all border ${
                            mapInfo.lines.includes(lineNum)
                            ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_10px_rgba(37,99,235,0.3)] scale-105'
                            : 'bg-slate-950 border-slate-800 text-slate-600 hover:text-slate-300'
                          }`}
                        >
                          {lineNum}线
                        </button>
                      ))}
                    </div>

                    {/* 文字编辑栏 */}
                    <div className="pt-2">
                      <textarea
                        value={mapInfo.notes}
                        onChange={(e) => updateMapNote(mapIdx, e.target.value)}
                        placeholder="情报备注（如：常驻刷点、巡逻习惯等...）"
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-3 py-2 text-[11px] font-medium text-slate-400 focus:border-blue-500/50 focus:ring-0 transition-all resize-none h-16"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                 <p className="text-[10px] text-blue-400/80 font-medium italic leading-relaxed">
                   * 选中的线路将同步给所有在线指挥官，红色标注代表高风险区域。
                 </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default WantedModal;
