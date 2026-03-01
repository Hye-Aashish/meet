import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket';
import { useMedia } from '../hooks/useMedia';
import { useWebRTC } from '../hooks/useWebRTC';
import { useRecording } from '../hooks/useRecording';
import { useScreenMonitoring } from '../hooks/useScreenMonitoring';
import { ChatMessage, Participant } from '../types';
import { cn } from '../lib/utils';
import { Maximize2, Minimize2, LayoutGrid, Lock, Unlock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ControlBar } from './MeetingRoom/ControlBar';
import { Sidebar } from './MeetingRoom/Sidebar';
import { VideoGrid } from './MeetingRoom/VideoGrid';
import { SettingsModal } from './MeetingRoom/SettingsModal';
import { ElectronScreenPicker } from './MeetingRoom/ScreenShareModal';
import { ScreenMonitorModal } from './MeetingRoom/ScreenMonitorModal';
import { AIAssistant } from './MeetingRoom/AIAssistant';


export const MeetingRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [userName] = useState(() => localStorage.getItem('nexus_user_name') || `User_${Math.floor(Math.random() * 1000)}`);
  const [userId] = useState(() => localStorage.getItem('nexus_user_id') || `id_${Math.random().toString(36).substr(2, 9)}`);

  // Hooks
  const { socket } = useSocket(roomId || 'default', userId, userName);
  const media = useMedia();
  const webrtc = useWebRTC(socket, media.localStream, userId);
  const recording = useRecording();
  const [isHost, setIsHost] = useState(false);
  const monitoring = useScreenMonitoring(socket, userId, isHost);

  // UI State
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'chat' | 'participants'>('chat');
  const [showSettings, setShowSettings] = useState(false);
  const [showMonitor, setShowMonitor] = useState(false);
  const [showAI, setShowAI] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [layout, setLayout] = useState<'grid' | 'spotlight' | 'filmstrip'>('grid');
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [showScreenPicker, setShowScreenPicker] = useState(false);
  const isElectron = !!(window as any).electronAPI?.isElectron;


  // Toolbar auto-hide & lock state
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);
  const [isToolbarLocked, setIsToolbarLocked] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const screenVideoRef = useRef<HTMLVideoElement>(null);

  // Initialize Media
  useEffect(() => {
    media.startLocalStream().catch(err => {
      console.error("Failed to start local stream", err);
      alert("Could not access camera/microphone. Please check permissions.");
    });
  }, []);

  // Sync screen stream with video element whenever it changes
  useEffect(() => {
    if (isScreenSharing && media.screenStream) {
      const setStream = () => {
        if (screenVideoRef.current) {
          console.log('🖥️ Setting screen video srcObject');
          screenVideoRef.current.srcObject = media.screenStream;
        }
      };
      // Set immediately if ref is available
      setStream();
      // Retry after DOM re-render (video element might not be mounted yet)
      const timer = setTimeout(setStream, 100);
      const timer2 = setTimeout(setStream, 500);
      return () => { clearTimeout(timer); clearTimeout(timer2); };
    }
  }, [isScreenSharing, media.screenStream]);

  // Socket Event Handlers
  useEffect(() => {
    if (!socket) return;

    socket.on('room-state', ({ participants, isHost: hostStatus }: { participants: Participant[], isHost: boolean }) => {
      console.log('📦 Room state received. My Host status:', hostStatus);
      setIsHost(hostStatus);

      webrtc.setParticipants(participants.map(p => ({
        ...p,
        isLocal: p.id === userId
      })));

      // Initiate connections to existing participants
      const streamToShare = isScreenSharing && media.screenStream ?
        new MediaStream([...media.localStream!.getAudioTracks(), ...media.screenStream.getVideoTracks()]) :
        media.localStream;

      participants.forEach(p => {
        if (p.id !== userId && streamToShare) {
          webrtc.createPeer(p.id, streamToShare, true);
        }
      });
    });

    socket.on('user-joined', ({ userId: joinedUserId, name, participants }: { userId: string, name: string, participants: Participant[] }) => {
      console.log('👤 User joined:', name, joinedUserId);
      const me = participants.find(p => p.id === userId);
      if (me) setIsHost(!!me.isHost);

      webrtc.setParticipants(participants.map(p => ({
        ...p,
        isLocal: p.id === userId
      })));

      const streamToShare = isScreenSharing && media.screenStream ?
        new MediaStream([...media.localStream!.getAudioTracks(), ...media.screenStream.getVideoTracks()]) :
        media.localStream;

      if (joinedUserId !== userId && streamToShare) {
        webrtc.createPeer(joinedUserId, streamToShare, false);
      }
    });

    socket.on('user-left', ({ userId: leftUserId }: { userId: string }) => {
      webrtc.closePeer(leftUserId);
      webrtc.setParticipants(prev => prev.filter(p => p.id !== leftUserId));
    });

    socket.on('signal', ({ senderId, signal }: { senderId: string, signal: any }) => {
      const peer = webrtc.peers.get(senderId);
      if (peer) {
        if (signal.sdp) {
          peer.setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
            if (signal.sdp.type === 'offer') {
              peer.createAnswer().then(answer => {
                return peer.setLocalDescription(answer);
              }).then(() => {
                socket.emit('signal', {
                  targetId: senderId,
                  signal: { sdp: peer.localDescription }
                });
              });
            }
          });
        } else if (signal.candidate) {
          peer.addIceCandidate(new RTCIceCandidate(signal.candidate));
        }
      }
    });

    socket.on('chat', (msg: ChatMessage) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on('kick-user', ({ targetId }: { targetId: string }) => {
      if (targetId === userId) {
        alert("You have been removed from the meeting by the host.");
        navigate('/');
      }
    });

    socket.on('mute-user', ({ targetId }: { targetId: string }) => {
      if (targetId === userId) {
        if (!media.isMuted) {
          media.toggleMute();
          socket.emit('toggle-media', { mediaType: 'audio', enabled: false });
        }
      }
    });

    socket.on('end-meeting', () => {
      alert("The host has ended the meeting for everyone.");
      navigate('/');
    });

    socket.on('raise-hand', ({ userId: rId, raised }: { userId: string, raised: boolean }) => {
      webrtc.setParticipants(prev => prev.map(p => p.id === rId ? { ...p, raisedHand: raised } : p));
      if (rId === userId) setIsHandRaised(raised);
    });

    socket.on('toggle-media', ({ userId: tId, mediaType, enabled }: { userId: string, mediaType: 'video' | 'audio', enabled: boolean }) => {
      webrtc.setParticipants(prev => prev.map(p => {
        if (p.id === tId) {
          return mediaType === 'video' ? { ...p, isCameraOff: !enabled } : { ...p, isMuted: !enabled };
        }
        return p;
      }));
    });

    return () => {
      socket.off('room-state');
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('signal');
      socket.off('chat');
      socket.off('raise-hand');
      socket.off('toggle-media');
    };
  }, [socket, userId, media.localStream, media.screenStream, isScreenSharing, webrtc]);

  // Actions
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !socket) return;
    socket.emit('chat', { text: chatInput });
    setChatInput('');
  };

  const handleToggleMute = () => {
    const nextMuted = media.toggleMute();
    if (socket) {
      socket.emit('toggle-media', { mediaType: 'audio', enabled: !nextMuted });
    }
  };

  const handleToggleCamera = () => {
    const nextCameraOff = media.toggleCamera();
    if (socket) {
      socket.emit('toggle-media', { mediaType: 'video', enabled: !nextCameraOff });
    }
  };

  const handleToggleHand = () => {
    const nextRaised = !isHandRaised;
    socket?.emit('raise-hand', { raised: nextRaised });
  };

  // In Electron: listen for main process requesting screen picker
  useEffect(() => {
    if (!isElectron) return;
    const electronAPI = (window as any).electronAPI;
    const cleanup = electronAPI.onShowScreenPicker(() => {
      setShowScreenPicker(true);
    });
    return cleanup;
  }, [isElectron]);

  const handleToggleScreenShare = async () => {
    if (isScreenSharing) {
      media.stopScreenShare();
      setIsScreenSharing(false);
      if (media.localStream) {
        webrtc.replaceTrack(media.localStream);
      }
    } else {
      // Both Electron and Browser use getDisplayMedia
      // In Electron, this is intercepted by setDisplayMediaRequestHandler
      // which sends 'show-screen-picker' event → our custom picker shows
      // In Browser, the native Chrome picker shows
      try {
        const stream = await media.startScreenShare({
          shareAudio: true,
          optimizeForVideo: false,
        });
        setIsScreenSharing(true);
        webrtc.replaceTrack(stream);

        if (screenVideoRef.current) {
          screenVideoRef.current.srcObject = stream;
        }

        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.onended = () => {
            setIsScreenSharing(false);
            media.stopScreenShare();
            if (media.localStream) {
              webrtc.replaceTrack(media.localStream);
            }
          };
        }
      } catch (err) {
        console.error("Screen share failed", err);
        setIsScreenSharing(false);
      }
    }
  };

  // Electron: handle source selection from custom picker
  const handleElectronScreenSelect = async (sourceId: string) => {
    console.log('🖥️ Selected screen source:', sourceId);
    setShowScreenPicker(false);
    const electronAPI = (window as any).electronAPI;
    if (electronAPI) {
      const result = await electronAPI.selectScreenSource(sourceId);
      console.log('🖥️ Source selection result:', result);
    }
  };

  const handleScreenPickerClose = async () => {
    console.log('🖥️ Screen picker cancelled');
    setShowScreenPicker(false);
    const electronAPI = (window as any).electronAPI;
    if (electronAPI) {
      await electronAPI.cancelScreenShare();
    }
  };

  const handleCycleLayout = () => {
    const layouts: ('grid' | 'spotlight' | 'filmstrip')[] = ['grid', 'spotlight', 'filmstrip'];
    const nextIndex = (layouts.indexOf(layout) + 1) % layouts.length;
    setLayout(layouts[nextIndex]);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleLeave = () => {
    navigate('/');
  };

  const handleEndMeeting = () => {
    if (socket) {
      socket.emit('end-meeting');
    }
  };

  const handleKickUser = (targetId: string) => {
    if (socket) {
      socket.emit('kick-user', { targetId });
    }
  };

  const handleMuteUser = (targetId: string) => {
    if (socket) {
      socket.emit('mute-user', { targetId });
    }
  };



  // Recording handler
  const handleToggleRecording = useCallback(() => {
    if (recording.isRecording) {
      recording.stopRecording();
    } else {
      // Gather remote streams
      const remoteStreams: MediaStream[] = [];
      webrtc.participants.forEach(p => {
        if (!p.isLocal && p.stream) {
          remoteStreams.push(p.stream);
        }
      });
      // Use screen stream if screen sharing, otherwise use local camera stream
      const videoStream = isScreenSharing && media.screenStream ? media.screenStream : media.localStream;
      recording.startRecording(
        videoStream,
        remoteStreams,
        roomId || '',
        `Meeting ${roomId}`
      );
    }
  }, [recording, webrtc.participants, media.localStream, media.screenStream, isScreenSharing, roomId]);

  // Auto-hide toolbar logic
  const resetHideTimer = useCallback(() => {
    if (isToolbarLocked) return; // Don't show if locked
    setIsToolbarVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setIsToolbarVisible(false);
    }, 3000);
  }, [isToolbarLocked]);

  // Start the initial hide timer
  useEffect(() => {
    if (!isToolbarLocked) {
      resetHideTimer();
    }
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [isToolbarLocked, resetHideTimer]);

  // Mouse move handler
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isToolbarLocked) return;
    resetHideTimer();
  }, [isToolbarLocked, resetHideTimer]);

  // Lock/unlock handler
  const handleToggleLock = useCallback(() => {
    const nextLocked = !isToolbarLocked;
    setIsToolbarLocked(nextLocked);
    if (nextLocked) {
      // Lock: hide toolbar immediately
      setIsToolbarVisible(false);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    } else {
      // Unlock: show toolbar and start timer
      setIsToolbarVisible(true);
      resetHideTimer();
    }
  }, [isToolbarLocked, resetHideTimer]);

  // Determine if controls should show (visible and not locked)
  const showControls = isToolbarVisible && !isToolbarLocked;

  return (
    <div
      className={cn(
        "h-screen bg-brand-bg text-white flex flex-col overflow-hidden font-sans transition-all duration-500",
        isCompact ? "p-4" : "p-0"
      )}
      onMouseMove={handleMouseMove}
    >
      <main className={cn(
        "flex overflow-hidden gap-6 transition-all duration-500",
        showControls ? "flex-1" : "flex-1",
        isCompact ? "max-w-4xl mx-auto w-full" : "p-6"
      )}>
        <div className="flex-1 flex flex-col min-w-0 relative">
          <VideoGrid
            participants={webrtc.participants}
            localStream={media.localStream}
            screenStream={media.screenStream}
            isScreenSharing={isScreenSharing}
            layout={layout}
            userName={userName}
            isCameraOff={media.isCameraOff}
            isMuted={media.isMuted}
            isHandRaised={isHandRaised}
            screenVideoRef={screenVideoRef}
          />

          {/* Recording indicator */}
          <AnimatePresence>
            {recording.isRecording && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="absolute top-4 left-4 z-30 flex items-center gap-2 px-3 py-1.5 bg-red-600/90 backdrop-blur-md rounded-full shadow-lg border border-red-500/30"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                <span className="text-xs font-bold text-white tracking-wider">
                  REC {recording.formatDuration(recording.recordingDuration)}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Recording error notification */}
          <AnimatePresence>
            {recording.recordingError && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-2 bg-red-600/90 backdrop-blur-md rounded-xl shadow-lg border border-red-500/30"
              >
                <span className="text-xs font-semibold text-white">{recording.recordingError}</span>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Screen sharing indicator */}
          <AnimatePresence>
            {isScreenSharing && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-4 py-2 bg-blue-600/90 backdrop-blur-md rounded-full shadow-lg shadow-blue-600/20 border border-blue-500/30"
              >
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-xs font-bold text-white tracking-wide">You are sharing your screen</span>
                <button
                  onClick={handleToggleScreenShare}
                  className="px-3 py-1 bg-red-500 hover:bg-red-400 text-white text-[10px] font-bold rounded-full transition-colors"
                >
                  Stop
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Top-right floating view controls */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute top-4 right-4 z-30 flex items-center gap-2"
              >
                <motion.button
                  id="toggle-lock"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={handleToggleLock}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all backdrop-blur-md shadow-lg bg-black/50 hover:bg-black/70 text-white/80 border border-white/10"
                  title="Lock Controls (Hide Permanently)"
                >
                  <Lock className="w-4 h-4" />
                </motion.button>
                <div className="w-px h-6 bg-white/10" />
                <motion.button
                  id="cycle-layout"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={handleCycleLayout}
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all backdrop-blur-md shadow-lg",
                    layout !== 'grid'
                      ? "bg-blue-600/90 text-white border border-blue-400/30"
                      : "bg-black/50 hover:bg-black/70 text-white/80 border border-white/10"
                  )}
                  title="Change Layout"
                >
                  <LayoutGrid className="w-4 h-4" />
                </motion.button>
                <motion.button
                  id="toggle-compact"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setIsCompact(!isCompact)}
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all backdrop-blur-md shadow-lg",
                    isCompact
                      ? "bg-blue-600/90 text-white border border-blue-400/30"
                      : "bg-black/50 hover:bg-black/70 text-white/80 border border-white/10"
                  )}
                  title="Compact Mode"
                >
                  <Minimize2 className="w-4 h-4" />
                </motion.button>
                <motion.button
                  id="toggle-fullscreen"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={handleToggleFullscreen}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all backdrop-blur-md shadow-lg bg-black/50 hover:bg-black/70 text-white/80 border border-white/10"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!isCompact && (
          <Sidebar
            show={showChat || showParticipants}
            activeTab={activeSidebarTab}
            messages={messages}
            participants={webrtc.participants}
            userId={userId}
            chatInput={chatInput}
            onTabChange={setActiveSidebarTab}
            onClose={() => { setShowChat(false); setShowParticipants(false); }}
            onSendMessage={handleSendMessage}
            onChatInputChange={setChatInput}
            onKickUser={handleKickUser}
            onMuteUser={handleMuteUser}
          />
        )}

        <AnimatePresence>
          {showAI && (
            <AIAssistant
              roomId={roomId || ''}
              messages={messages}
              onClose={() => setShowAI(false)}
            />
          )}
        </AnimatePresence>

      </main>

      {/* Auto-hiding bottom toolbar */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <ControlBar
              isMuted={media.isMuted}
              isCameraOff={media.isCameraOff}
              isScreenSharing={isScreenSharing}
              isHandRaised={isHandRaised}
              showParticipants={showParticipants}
              showChat={showChat}
              isCompact={isCompact}
              participantCount={webrtc.participants.length}
              roomId={roomId || ''}
              isHost={isHost}
              onToggleMute={handleToggleMute}
              onToggleCamera={handleToggleCamera}
              onToggleScreenShare={handleToggleScreenShare}
              onToggleHand={handleToggleHand}
              onToggleParticipants={() => { setShowParticipants(!showParticipants); setShowChat(false); setShowAI(false); setActiveSidebarTab('participants'); }}
              onToggleChat={() => { setShowChat(!showChat); setShowParticipants(false); setShowAI(false); setActiveSidebarTab('chat'); }}
              onToggleAI={() => { setShowAI(!showAI); setShowChat(false); setShowParticipants(false); }}
              onToggleSettings={() => setShowSettings(true)}
              onToggleMonitor={() => setShowMonitor(true)}
              isMonitoring={monitoring.isMonitoring}
              showAI={showAI}
              isRecording={recording.isRecording}
              recordingDuration={recording.recordingDuration}
              onToggleRecording={handleToggleRecording}
              onLeave={handleLeave}
              onEndMeeting={handleEndMeeting}
            />

          </motion.div>
        )}
      </AnimatePresence>

      {/* Unlock pill when toolbar is locked */}
      <AnimatePresence>
        {isToolbarLocked && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
          >
            <motion.button
              id="unlock-toolbar"
              whileHover={{ scale: 1.05, opacity: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleLock}
              className="flex items-center gap-2 px-4 py-2 bg-brand-card/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl text-white/50 hover:text-white/90 transition-all opacity-40 hover:opacity-100"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Unlock Controls</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <SettingsModal
        show={showSettings}
        onClose={() => setShowSettings(false)}
        devices={media.devices}
        selectedVideoDevice={media.selectedVideoDevice}
        selectedAudioDevice={media.selectedAudioDevice}
        onVideoDeviceChange={(id) => { media.setSelectedVideoDevice(id); media.startLocalStream(id, media.selectedAudioDevice); }}
        onAudioDeviceChange={(id) => { media.setSelectedAudioDevice(id); media.startLocalStream(media.selectedVideoDevice, id); }}
      />

      <ElectronScreenPicker
        show={showScreenPicker}
        onClose={handleScreenPickerClose}
        onSelect={handleElectronScreenSelect}
      />

      <ScreenMonitorModal
        show={showMonitor}
        onClose={() => setShowMonitor(false)}
        captures={monitoring.captures}
        isMonitoring={monitoring.isMonitoring}
        onStartMonitoring={() => {
          monitoring.startMonitoring();
        }}
        onStopMonitoring={monitoring.stopMonitoring}
        participantCount={webrtc.participants.length}
      />
    </div>
  );
};
