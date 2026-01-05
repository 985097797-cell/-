
import React from 'react';
import { Users } from 'lucide-react';
import PlayerCard from './PlayerCard';
import { Team, PlayerConfig } from '../types';

interface TeamSectionProps {
  team: Team;
  onUpdateTeam: (teamId: number, playerIndex: number, updatedPlayer: PlayerConfig) => void;
  onClearPlayer: (teamId: number, playerIndex: number) => void;
}

const TeamSection: React.FC<TeamSectionProps> = ({ team, onUpdateTeam, onClearPlayer }) => {
  return (
    <div className="mb-10 animate-fadeIn">
      <div className="flex items-center gap-3 mb-4 border-l-4 border-yellow-500 pl-4">
        <Users className="w-6 h-6 text-yellow-500" />
        <h2 className="text-xl font-bold font-title tracking-widest text-yellow-500">
          {team.name}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
  );
};

export default TeamSection;
