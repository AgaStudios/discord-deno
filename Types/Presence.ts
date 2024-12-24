export const enum ActivityType {
  GAME,
  STREAMING,
  LISTENING,
  WATCHING,
  CUSTOM,
  COMPETING,
}
export const enum ActivityFlag {
  INSTANCE = 1 << 0,
  JOIN = 1 << 1,
  SPECTATE = 1 << 2,
  JOIN_REQUEST = 1 << 3,
  SYNC = 1 << 4,
  PLAY = 1 << 5,
  PARTY_PRIVACY_FRIENDS = 1 << 6,
  PARTY_PRIVACY_VOICE_CHANNEL = 1 << 7,
  EMBEDDED = 1 << 8,
}
export interface Activity {
  name: string;
  type: ActivityType;
  url?: string;
  created_at?: number;
  timestamps?: {
    start?: number;
    end?: number;
  };
  application_id?: string;
  details?: string;
  state?: string;
  emoji?: {
    name: string;
    id?: string;
    animated?: boolean;
  };
  party?: {
    id?: string;
    size?: [number, number];
  };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  secrets?: {
    join?: string;
    spectate?: string;
    match?: string;
  };
  instance?: boolean;
  flags?: ActivityFlag;
  buttons?: {
    label: string;
    url: string;
  }[];
}
export const enum Status {
  ONLINE = 'online',
  IDLE = 'idle',
  DND = 'dnd',
  INVISIBLE = 'invisible',
  OFFLINE = 'offline',  
}

export interface Presence {
  activities?: Activity[];
  status?: Status;
  afk?: boolean;
  since?: number;
}