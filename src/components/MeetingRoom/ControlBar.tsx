import React from 'react';
import { Mic, MicOff, Video, VideoOff, MonitorUp, MonitorOff, Hand, Users, MessageSquare, Settings, PhoneOff, Share2, Circle, Eye, Bot } from 'lucide-react';

import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ControlBarProps {
  isMuted: boolean;
  isCameraOff: boolean;
  isScreenSharing: boolean;
  isHandRaised: boolean;
  showParticipants: boolean;
  showChat: boolean;
  isCompact?: boolean;
  participantCount: number;
  roomId: string;
  isHost?: boolean;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onToggleScreenShare: () => void;
  onToggleHand: () => void;
  onToggleParticipants: () => void;
  onToggleChat: () => void;
  onToggleAI?: () => void;
  showAI?: boolean;
  isRecording?: boolean;

  recordingDuration?: number;
  onToggleRecording: () => void;
  onToggleSettings: () => void;
  onToggleMonitor?: () => void;
  isMonitoring?: boolean;
  onLeave: () => void;
  onEndMeeting?: () => void;
}

const ControlTooltip: React.FC<{ children: React.ReactNode; text: string }> = ({ children, text }) => {
  const [show, setShow] = React.useState(false);
  return (
    <div className="relative flex flex-col items-center group" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full mb-3 px-3 py-1.5 bg-brand-card border border-white/10 rounded-lg shadow-2xl z-50 whitespace-nowrap"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">{text}</span>
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-brand-card" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ControlBar: React.FC<ControlBarProps> = ({
  isMuted,
  isCameraOff,
  isScreenSharing,
  isHandRaised,
  showParticipants,
  showChat,
  isCompact,
  participantCount,
  roomId,
  isHost,
  onToggleMute,
  onToggleCamera,
  onToggleScreenShare,
  onToggleHand,
  onToggleParticipants,
  onToggleChat,
  onToggleAI,
  showAI,
  onToggleSettings,

  onToggleMonitor,
  isMonitoring,
  isRecording,
  recordingDuration,
  onToggleRecording,
  onLeave,
  onEndMeeting,

}) => {
  const [showLeaveOptions, setShowLeaveOptions] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <footer className="h-20 border-t border-white/5 flex items-center justify-between px-8 bg-brand-card/80 backdrop-blur-md z-10">
      <div className="flex items-center gap-2 text-white/40">
        <span className="text-xs font-mono">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        <span className="w-1 h-1 rounded-full bg-white/20" />
        <span className="text-xs font-medium uppercase tracking-widest">{roomId}</span>
        {isHost && (
          <span className="ml-1 px-2 py-0.5 bg-amber-500/15 text-amber-400 text-[9px] font-bold uppercase tracking-widest rounded-full border border-amber-500/20">Host</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* === BASIC CONTROLS (Everyone) === */}
        <ControlTooltip text={isMuted ? "Unmute Mic" : "Mute Mic"}>
          <motion.button
            id="toggle-mute"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleMute}
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
              isMuted ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-brand-accent hover:bg-brand-accent/80 text-white border border-white/5"
            )}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </motion.button>
        </ControlTooltip>

        <ControlTooltip text={isCameraOff ? "Turn On Camera" : "Turn Off Camera"}>
          <motion.button
            id="toggle-camera"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleCamera}
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
              isCameraOff ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-brand-accent hover:bg-brand-accent/80 text-white border border-white/5"
            )}
          >
            {isCameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </motion.button>
        </ControlTooltip>

        <div className="w-px h-8 bg-white/10 mx-2" />

        {/* === HOST-ONLY CONTROLS === */}
        {isHost && (
          <>
            <ControlTooltip text={isScreenSharing ? "Stop Sharing" : "Share Screen"}>
              <motion.button
                id="toggle-screen-share"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onToggleScreenShare}
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                  isScreenSharing ? "bg-blue-600 text-white" : "bg-brand-accent hover:bg-brand-accent/80 text-white border border-white/5"
                )}
              >
                {isScreenSharing ? <MonitorOff className="w-5 h-5" /> : <MonitorUp className="w-5 h-5" />}
              </motion.button>
            </ControlTooltip>

            <ControlTooltip text={isRecording ? `Recording ${recordingDuration ? Math.floor(recordingDuration / 60).toString().padStart(2, '0') + ':' + (recordingDuration % 60).toString().padStart(2, '0') : ''}` : "Record Meeting"}>
              <motion.button
                id="toggle-record"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onToggleRecording}
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all relative",
                  isRecording ? "bg-red-600 text-white border border-red-500/30" : "bg-brand-accent hover:bg-brand-accent/80 text-white border border-white/5"
                )}
              >
                {isRecording ? (
                  <>
                    <div className="w-3 h-3 rounded-sm bg-white" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  </>
                ) : (
                  <Circle className="w-5 h-5 fill-red-500 text-red-500" />
                )}
              </motion.button>
            </ControlTooltip>

            <ControlTooltip text={isMonitoring ? "Monitoring Active" : "Monitor Screens"}>
              <motion.button
                id="toggle-monitor"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onToggleMonitor}
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all relative",
                  isMonitoring ? "bg-violet-600 text-white border border-violet-500/30" : "bg-brand-accent hover:bg-brand-accent/80 text-white border border-white/5"
                )}
              >
                <Eye className="w-5 h-5" />
                {isMonitoring && <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-violet-500 animate-pulse" />}
              </motion.button>
            </ControlTooltip>
          </>
        )}

        {/* === COMMON CONTROLS (Everyone) === */}
        <ControlTooltip text={isHandRaised ? "Lower Hand" : "Raise Hand"}>
          <motion.button
            id="toggle-hand"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleHand}
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
              isHandRaised ? "bg-yellow-500 text-black" : "bg-brand-accent hover:bg-brand-accent/80 text-white border border-white/5"
            )}
          >
            <Hand className={cn("w-5 h-5", isHandRaised && "fill-black")} />
          </motion.button>
        </ControlTooltip>

        <ControlTooltip text={copied ? "Copied!" : "Share Meeting"}>
          <motion.button
            id="share-meeting"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
              copied ? "bg-green-500 text-white" : "bg-brand-accent hover:bg-brand-accent/80 text-white border border-white/5"
            )}
          >
            <Share2 className="w-5 h-5" />
          </motion.button>
        </ControlTooltip>

        <ControlTooltip text="Participants">
          <motion.button
            id="toggle-participants"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleParticipants}
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all relative",
              showParticipants ? "bg-blue-600 text-white" : "bg-brand-accent hover:bg-brand-accent/80 text-white border border-white/5"
            )}
          >
            <Users className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full text-[10px] flex items-center justify-center font-bold border-2 border-brand-bg">
              {participantCount}
            </span>
          </motion.button>
        </ControlTooltip>

        <ControlTooltip text="Chat">
          <motion.button
            id="toggle-chat"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleChat}
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
              showChat ? "bg-blue-600 text-white" : "bg-brand-accent hover:bg-brand-accent/80 text-white border border-white/5"
            )}
          >
            <MessageSquare className="w-5 h-5" />
          </motion.button>
        </ControlTooltip>

        <ControlTooltip text="Nexus AI">
          <motion.button
            id="toggle-ai"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleAI}
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
              showAI ? "bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]" : "bg-brand-accent hover:bg-brand-accent/80 text-white border border-white/5"
            )}
          >
            <Bot className="w-5 h-5" />
          </motion.button>
        </ControlTooltip>


        {/* Settings - Host only */}
        {isHost && (
          <ControlTooltip text="Settings">
            <motion.button
              id="toggle-settings"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleSettings}
              className="w-12 h-12 rounded-2xl bg-brand-accent hover:bg-brand-accent/80 text-white border border-white/5 flex items-center justify-center transition-all"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </ControlTooltip>
        )}

        {/* Leave / End Meeting */}
        <div className="relative">
          <ControlTooltip text="Leave Meeting">
            <motion.button
              id="leave-meeting"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => isHost ? setShowLeaveOptions(!showLeaveOptions) : onLeave()}
              className="ml-4 px-6 h-12 bg-red-600 hover:bg-red-700 text-white rounded-2xl flex items-center gap-2 font-semibold transition-all shadow-lg shadow-red-600/20"
            >
              <PhoneOff className="w-5 h-5" />
              <span>Leave</span>
            </motion.button>
          </ControlTooltip>

          <AnimatePresence>
            {showLeaveOptions && isHost && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full right-0 mb-3 w-48 bg-brand-card border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
              >
                <motion.button
                  id="leave-meeting-confirm"
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                  onClick={onLeave}
                  className="w-full px-4 py-3 text-left text-sm font-medium transition-colors border-b border-white/5"
                >
                  Leave Meeting
                </motion.button>
                <motion.button
                  id="end-meeting-all"
                  whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                  onClick={onEndMeeting}
                  className="w-full px-4 py-3 text-left text-sm font-bold text-red-500 transition-colors"
                >
                  End Meeting for All
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="w-32 flex justify-end">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-full border border-green-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">Secure</span>
        </div>
      </div>
    </footer>
  );
};
