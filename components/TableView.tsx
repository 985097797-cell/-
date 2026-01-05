
import React from 'react';
import { Team, CONFIG_CATEGORIES } from '../types';
import { ClipboardCheck, FileSpreadsheet } from 'lucide-react';

interface TableViewProps {
  teams: Team[];
}

const TableView: React.FC<TableViewProps> = ({ teams }) => {
  const copyToClipboard = () => {
    const table = document.getElementById('aoshi-export-table');
    if (!table) return;

    const range = document.createRange();
    range.selectNode(table);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    try {
      document.execCommand('copy');
      alert('【表格已存入剪贴板】\n请打开腾讯文档，直接按下 Ctrl+V 即可完成导入！');
    } catch (err) {
      alert('复制失败，请手动选中表格复制。');
    }
    window.getSelection()?.removeAllRanges();
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <FileSpreadsheet className="w-6 h-6 text-yellow-500" />
          <h2 className="text-xl font-black font-title tracking-widest text-slate-100">腾讯文档协同表预览</h2>
        </div>
        <button 
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-sm tracking-widest transition-all shadow-lg shadow-blue-900/20"
        >
          <ClipboardCheck className="w-5 h-5" />
          复制整表粘贴到腾讯文档
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 shadow-2xl">
        <table id="aoshi-export-table" className="w-full text-left border-collapse bg-slate-900/50">
          <thead>
            <tr className="bg-slate-800/80 text-yellow-500 text-[10px] font-black uppercase tracking-[0.2em]">
              <th className="px-4 py-4 border-b border-slate-700">纵队</th>
              <th className="px-4 py-4 border-b border-slate-700">阵位</th>
              <th className="px-4 py-4 border-b border-slate-700">昵称</th>
              <th className="px-4 py-4 border-b border-slate-700">等级</th>
              <th className="px-4 py-4 border-b border-slate-700">职业</th>
              {CONFIG_CATEGORIES.map(cat => (
                <th key={cat} className="px-3 py-4 border-b border-slate-700 text-center">{cat}</th>
              ))}
              <th className="px-4 py-4 border-b border-slate-700 min-w-[200px]">AI 战力评价</th>
            </tr>
          </thead>
          <tbody className="text-slate-300 font-bold text-sm">
            {teams.map(team => (
              team.players.map((player, pIdx) => (
                <tr key={player.id} className="hover:bg-slate-800/30 transition-colors border-b border-slate-800/50">
                  <td className="px-4 py-3 text-slate-500 text-xs">{team.name}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{pIdx + 1}号位</td>
                  <td className="px-4 py-3 text-yellow-500/90">{player.name || '-'}</td>
                  <td className="px-4 py-3">{player.level ? `Lv.${player.level}` : '-'}</td>
                  <td className="px-4 py-3 text-blue-400">{player.role || '未定'}</td>
                  {CONFIG_CATEGORIES.map(cat => {
                    const count = player.configs[cat]?.length || 0;
                    return (
                      <td key={cat} className={`px-3 py-3 text-center text-xs ${count > 0 ? 'text-green-500' : 'text-slate-700'}`}>
                        {count > 0 ? `√ (${count}图)` : '×'}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-xs italic text-slate-400 font-normal">
                    {player.aiEvaluation || (player.name ? '等待评估...' : '-')}
                  </td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="bg-blue-900/10 border border-blue-900/30 p-4 rounded-xl">
        <p className="text-[10px] text-blue-400 font-bold leading-relaxed">
          💡 操作提示：点击上方按钮后，表格将带格式复制到剪贴板。在腾讯文档（或 Excel）中选择一个起始单元格按下 Ctrl+V，系统会自动识别列宽度并填充颜色。如果需要手动录入截图，请继续保持使用本系统的“战术沙盘”模式。
        </p>
      </div>
    </div>
  );
};

export default TableView;
