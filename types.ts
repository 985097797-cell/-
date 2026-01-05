export interface PlayerConfig {
  id: string;
  name: string;
  level: string;
  role: string;
  avatar?: string; // 用于存储自定义头像 Base64
  configs: {
    [key: string]: string[];
  };
}

export interface Team {
  id: number;
  name: string;
  players: PlayerConfig[];
}

export interface RoleInfo {
  name: string;
  weapon: string;
  color: string;
  icon: string;
  avatarUrl: string;
}

export const ROLE_DATA: RoleInfo[] = [
  { 
    name: "剑侍", 
    weapon: "剑", 
    color: "#f59e0b", 
    icon: "⚔️",
    avatarUrl: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=swordmaster&backgroundColor=f59e0b" 
  },
  { 
    name: "豪杰", 
    weapon: "斧", 
    color: "#ef4444", 
    icon: "🪓",
    avatarUrl: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=hero&backgroundColor=ef4444" 
  },
  { 
    name: "阴阳士", 
    weapon: "杖", 
    color: "#8b5cf6", 
    icon: "🪄",
    avatarUrl: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=yinyang&backgroundColor=8b5cf6" 
  },
  { 
    name: "仙术师", 
    weapon: "扇", 
    color: "#10b981", 
    icon: "🪭",
    avatarUrl: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=sage&backgroundColor=10b981" 
  },
  { 
    name: "游侠", 
    weapon: "弓", 
    color: "#3b82f6", 
    icon: "🏹",
    avatarUrl: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=ranger&backgroundColor=3b82f6" 
  },
  { 
    name: "唤灵", 
    weapon: "铃", 
    color: "#ec4899", 
    icon: "🔔",
    avatarUrl: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=summoner&backgroundColor=ec4899" 
  }
];

export const CONFIG_CATEGORIES = [
  "F1",
  "F2",
  "奥义",
  "元神",
  "灵珠",
  "子女",
  "灵兽",
  "天书",
  "经络"
];