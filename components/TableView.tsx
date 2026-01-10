import React from 'react';
import { Team } from '../types';
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
              <th className="px-6 py-4 border-b border-slate-700">纵队</th>
              <th className="px-6 py-4 border-b border-slate-700">阵位</th>
              <th className="px-6 py-4 border-b border-slate-700">昵称</th>
              <th className="px-6 py-4 border-b border-slate-700">等级</th>
              <th className="px-6 py-4 border-b border-slate-700">职业</th>
              <th className="px-6 py-4 border-b border-slate-700">定位</th>
            </tr>
          </thead>
          <tbody className="text-slate-300 font-bold text-sm">
            {teams.map(team => (
              team.players.map((player, pIdx) => (
                <tr key={player.id} className="hover:bg-slate-800/30 transition-colors border-b border-slate-800/50">
                  <td className="px-6 py-4 text-slate-500 text-xs">{team.name}</td>
                  <td className="px-6 py-4 text-slate-500 text-xs">{pIdx + 1}号位</td>
                  <td className="px-6 py-4 text-yellow-500/90">{player.name || '-'}</td>
                  <td className="px-6 py-4">{player.level ? `Lv.${player.level}` : '-'}</td>
                  <td className="px-6 py-4 text-blue-400">{player.role || '未定'}</td>
                  <td className="px-6 py-4 text-xs text-slate-400 italic font-medium">
                    {player.positions?.length > 0 ? player.positions.join(' / ') : '待分配'}
                  </td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableView;