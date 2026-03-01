export interface DeviceInfo {
  videoDevices: MediaDeviceInfo[];
  audioDevices: MediaDeviceInfo[];
}

export interface Participant {
  id: string;
  name: string;
  stream?: MediaStream;
  isLocal?: boolean;
  raisedHand?: boolean;
  isCameraOff?: boolean;
  isMuted?: boolean;
  isHost?: boolean;
}

export interface ChatMessage {
  userId: string;
  name: string;
  text: string;
  timestamp: string;
}

export type SocketMessage = 
  | { type: 'join'; roomId: string; name: string; userId: string }
  | { type: 'user-joined'; userId: string; name: string; participants: Participant[] }
  | { type: 'room-state'; participants: Participant[] }
  | { type: 'chat'; userId: string; name: string; text: string; timestamp: string }
  | { type: 'user-left'; userId: string }
  | { type: 'signal'; senderId: string; targetId: string; signal: any }
  | { type: 'raise-hand'; userId: string; raised: boolean }
  | { type: 'toggle-media'; userId: string; mediaType: 'video' | 'audio'; enabled: boolean }
  | { type: 'kick-user'; targetId: string }
  | { type: 'mute-user'; targetId: string }
  | { type: 'end-meeting' };
