import React from 'react';
import { motion } from 'motion/react';
import { MonitorUp } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Participant } from '../../types';
import { RemoteVideo, LocalVideo } from './VideoTiles';

interface VideoGridProps {
  participants: Participant[];
  localStream: MediaStream | null;
  screenStream: MediaStream | null;
  isScreenSharing: boolean;
  layout: 'grid' | 'spotlight' | 'filmstrip';
  userName: string;
  isCameraOff: boolean;
  isMuted: boolean;
  isHandRaised: boolean;
  screenVideoRef: React.RefObject<HTMLVideoElement | null>;
}

export const VideoGrid: React.FC<VideoGridProps> = ({
  participants,
  localStream,
  screenStream,
  isScreenSharing,
  layout,
  userName,
  isCameraOff,
  isMuted,
  isHandRaised,
  screenVideoRef,
}) => {
  const getGridClass = () => {
    const count = participants.length;
    if (isScreenSharing || layout === 'spotlight') return "grid-cols-1 md:grid-cols-4";
    
    if (count <= 1) return "grid-cols-1";
    if (count <= 2) return "grid-cols-1 md:grid-cols-2";
    if (count <= 4) return "grid-cols-2";
    if (count <= 6) return "grid-cols-2 md:grid-cols-3";
    return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  };

  if (isScreenSharing || layout === 'spotlight') {
    return (
      <div className="flex flex-col md:flex-row h-full w-full gap-4 overflow-hidden">
        <div className="flex-1 min-h-0 relative h-full">
          {isScreenSharing ? (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full h-full bg-black rounded-2xl overflow-hidden border border-blue-500/30 shadow-2xl shadow-blue-500/10 relative"
            >
              <video 
                ref={screenVideoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-contain"
              />
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-blue-600 rounded-lg shadow-lg">
                <MonitorUp className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Your Screen</span>
              </div>
            </motion.div>
          ) : (
            <div className="w-full h-full">
              {participants[0]?.isLocal ? (
                <LocalVideo stream={localStream} userName={userName} isCameraOff={isCameraOff} isMuted={isMuted} isHandRaised={isHandRaised} />
              ) : (
                <RemoteVideo stream={participants[0]?.stream} name={participants[0]?.name} raisedHand={participants[0]?.raisedHand} isCameraOff={participants[0]?.isCameraOff} isMuted={participants[0]?.isMuted} />
              )}
            </div>
          )}
        </div>
        <div className="flex-1 min-h-0 overflow-x-auto md:overflow-y-auto scrollbar-hide flex md:flex-col gap-4 pb-2 md:pb-0 shrink-0">
          {participants.filter((_, i) => isScreenSharing || i !== 0).map(p => (
            <div key={p.id} className="w-48 md:w-full shrink-0 aspect-video">
              {p.isLocal ? (
                <LocalVideo stream={localStream} userName={userName} isCameraOff={isCameraOff} isMuted={isMuted} isHandRaised={isHandRaised} small />
              ) : (
                <RemoteVideo stream={p.stream} name={p.name} raisedHand={p.raisedHand} isCameraOff={p.isCameraOff} isMuted={p.isMuted} small />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (layout === 'filmstrip') {
    return (
      <div className="flex flex-col h-full w-full gap-4 overflow-hidden">
        <div className="flex-1 min-h-0 relative">
          {participants[0]?.isLocal ? (
            <LocalVideo stream={localStream} userName={userName} isCameraOff={isCameraOff} isMuted={isMuted} isHandRaised={isHandRaised} />
          ) : (
            <RemoteVideo stream={participants[0]?.stream} name={participants[0]?.name} raisedHand={participants[0]?.raisedHand} isCameraOff={participants[0]?.isCameraOff} isMuted={participants[0]?.isMuted} />
          )}
        </div>
        <div className="h-40 flex gap-4 overflow-x-auto pb-2 scrollbar-hide shrink-0">
          {participants.slice(1).map(p => (
            <div key={p.id} className="w-64 shrink-0 h-full">
              {p.isLocal ? (
                <LocalVideo stream={localStream} userName={userName} isCameraOff={isCameraOff} isMuted={isMuted} isHandRaised={isHandRaised} small />
              ) : (
                <RemoteVideo stream={p.stream} name={p.name} raisedHand={p.raisedHand} isCameraOff={p.isCameraOff} isMuted={p.isMuted} small />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "grid gap-4 w-full h-full max-h-full transition-all duration-500",
      getGridClass()
    )}>
      <LocalVideo 
        stream={localStream} 
        userName={userName} 
        isCameraOff={isCameraOff} 
        isMuted={isMuted} 
        isHandRaised={isHandRaised} 
        className={(isScreenSharing || layout === 'spotlight') ? "md:col-span-1" : ""}
      />
      {participants.filter(p => !p.isLocal).map((p) => (
        <RemoteVideo 
          key={p.id} 
          stream={p.stream} 
          name={p.name} 
          raisedHand={p.raisedHand} 
          isCameraOff={p.isCameraOff}
          isMuted={p.isMuted}
        />
      ))}
    </div>
  );
};
