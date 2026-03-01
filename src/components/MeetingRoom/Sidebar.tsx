import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, Mic, MicOff, Video, VideoOff, Hand, Shield, UserMinus, VolumeX } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Participant, ChatMessage } from '../../types';

interface SidebarProps {
  show: boolean;
  activeTab: 'chat' | 'participants';
  messages: ChatMessage[];
  participants: Participant[];
  userId: string;
  chatInput: string;
  onTabChange: (tab: 'chat' | 'participants') => void;
  onClose: () => void;
  onSendMessage: (e: React.FormEvent) => void;
  onChatInputChange: (value: string) => void;
  onKickUser?: (targetId: string) => void;
  onMuteUser?: (targetId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  show,
  activeTab,
  messages,
  participants,
  userId,
  chatInput,
  onTabChange,
  onClose,
  onSendMessage,
  onChatInputChange,
  onKickUser,
  onMuteUser,
}) => {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const localParticipant = participants.find(p => p.isLocal);
  const isLocalHost = localParticipant?.isHost;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <AnimatePresence>
      {show && (
        <motion.aside
          initial={{ x: 400 }}
          animate={{ x: 0 }}
          exit={{ x: 400 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-80 border-l border-white/5 bg-brand-card/30 backdrop-blur-xl flex flex-col"
        >
          <div className="p-4 border-b border-white/5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Meeting Details</h2>
              <button 
                onClick={onClose}
                className="p-1 hover:bg-white/5 rounded-md"
              >
                <Maximize2 className="w-4 h-4 text-white/40 rotate-45" />
              </button>
            </div>
            
            <div className="flex p-1 bg-brand-accent/30 rounded-xl border border-white/5">
              <button 
                onClick={() => onTabChange('chat')}
                className={cn(
                  "flex-1 py-1.5 text-xs font-medium rounded-lg transition-all",
                  activeTab === 'chat' ? "bg-brand-card text-white shadow-lg" : "text-white/40 hover:text-white/60"
                )}
              >
                Messages
              </button>
              <button 
                onClick={() => onTabChange('participants')}
                className={cn(
                  "flex-1 py-1.5 text-xs font-medium rounded-lg transition-all",
                  activeTab === 'participants' ? "bg-brand-card text-white shadow-lg" : "text-white/40 hover:text-white/60"
                )}
              >
                Participants
              </button>
            </div>
          </div>

          {activeTab === 'chat' ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={cn("flex flex-col", msg.userId === userId ? "items-end" : "items-start")}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-white/40">{msg.name}</span>
                      <span className="text-[10px] text-white/20">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className={cn(
                      "px-3 py-2 rounded-2xl text-sm max-w-[90%]",
                      msg.userId === userId ? "bg-blue-600 text-white rounded-tr-none" : "bg-brand-accent text-white/90 rounded-tl-none"
                    )}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={onSendMessage} className="p-4 border-t border-white/5">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => onChatInputChange(e.target.value)}
                  placeholder="Send a message..."
                  className="w-full bg-brand-accent/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </form>
            </>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {participants.map((p) => (
                <div key={p.id} className="group flex flex-col p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center text-xs font-bold border border-white/5 relative">
                        {p.name.charAt(0)}
                        {p.isHost && (
                          <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 border border-brand-bg">
                            <Shield className="w-2 h-2 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium">{p.name} {p.isLocal && '(You)'}</span>
                          {p.isHost && <span className="text-[8px] bg-emerald-500/20 text-emerald-500 px-1 rounded font-bold uppercase tracking-widest">Host</span>}
                        </div>
                        {p.raisedHand && <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-tighter">Hand Raised</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {p.raisedHand && <Hand className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />}
                      {p.isMuted ? <MicOff className="w-3.5 h-3.5 text-red-500" /> : <Mic className="w-3.5 h-3.5 text-white/40" />}
                      {p.isCameraOff ? <VideoOff className="w-3.5 h-3.5 text-red-500" /> : <Video className="w-3.5 h-3.5 text-white/40" />}
                    </div>
                  </div>
                  
                  {isLocalHost && !p.isLocal && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onMuteUser?.(p.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-white/5 hover:bg-red-500/10 hover:text-red-500 rounded transition-colors"
                      >
                        <VolumeX className="w-3 h-3" />
                        Mute
                      </button>
                      <button 
                        onClick={() => onKickUser?.(p.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-white/5 hover:bg-red-500/10 hover:text-red-500 rounded transition-colors"
                      >
                        <UserMinus className="w-3 h-3" />
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
