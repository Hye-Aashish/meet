import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Camera,
  Mic,
  Volume2,
  Monitor,
  Shield,
  Bell,
  Palette,
  Keyboard,
  Info,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SettingsModalProps {
  show: boolean;
  onClose: () => void;
  devices: MediaDeviceInfo[];
  selectedVideoDevice: string;
  selectedAudioDevice: string;
  onVideoDeviceChange: (id: string) => void;
  onAudioDeviceChange: (id: string) => void;
}

type SettingsTab = 'audio' | 'video' | 'general' | 'notifications' | 'shortcuts' | 'about';

const tabItems: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: 'audio', label: 'Audio', icon: Volume2 },
  { id: 'video', label: 'Video', icon: Camera },
  { id: 'general', label: 'General', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: Keyboard },
  { id: 'about', label: 'About', icon: Info },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  show,
  onClose,
  devices,
  selectedVideoDevice,
  selectedAudioDevice,
  onVideoDeviceChange,
  onAudioDeviceChange,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('audio');

  // General settings (stored in localStorage)
  const [mirrorVideo, setMirrorVideo] = useState(() => localStorage.getItem('nexus_mirror_video') !== 'false');
  const [hdVideo, setHdVideo] = useState(() => localStorage.getItem('nexus_hd_video') !== 'false');
  const [noiseSuppression, setNoiseSuppression] = useState(() => localStorage.getItem('nexus_noise_suppression') !== 'false');
  const [autoGainControl, setAutoGainControl] = useState(() => localStorage.getItem('nexus_auto_gain') !== 'false');
  const [echoCancellation, setEchoCancellation] = useState(() => localStorage.getItem('nexus_echo_cancel') !== 'false');
  const [muteOnJoin, setMuteOnJoin] = useState(() => localStorage.getItem('nexus_mute_join') === 'true');
  const [cameraOffOnJoin, setCameraOffOnJoin] = useState(() => localStorage.getItem('nexus_camera_off_join') === 'true');
  const [darkMode, setDarkMode] = useState(true);
  const [notifyJoin, setNotifyJoin] = useState(() => localStorage.getItem('nexus_notify_join') !== 'false');
  const [notifyChat, setNotifyChat] = useState(() => localStorage.getItem('nexus_notify_chat') !== 'false');
  const [notifyHand, setNotifyHand] = useState(() => localStorage.getItem('nexus_notify_hand') !== 'false');
  const [soundEffects, setSoundEffects] = useState(() => localStorage.getItem('nexus_sound_fx') !== 'false');

  // Save to localStorage when settings change
  useEffect(() => {
    localStorage.setItem('nexus_mirror_video', String(mirrorVideo));
    localStorage.setItem('nexus_hd_video', String(hdVideo));
    localStorage.setItem('nexus_noise_suppression', String(noiseSuppression));
    localStorage.setItem('nexus_auto_gain', String(autoGainControl));
    localStorage.setItem('nexus_echo_cancel', String(echoCancellation));
    localStorage.setItem('nexus_mute_join', String(muteOnJoin));
    localStorage.setItem('nexus_camera_off_join', String(cameraOffOnJoin));
    localStorage.setItem('nexus_notify_join', String(notifyJoin));
    localStorage.setItem('nexus_notify_chat', String(notifyChat));
    localStorage.setItem('nexus_notify_hand', String(notifyHand));
    localStorage.setItem('nexus_sound_fx', String(soundEffects));
  }, [mirrorVideo, hdVideo, noiseSuppression, autoGainControl, echoCancellation, muteOnJoin, cameraOffOnJoin, notifyJoin, notifyChat, notifyHand, soundEffects]);

  const videoDevices = devices.filter(d => d.kind === 'videoinput');
  const audioInputDevices = devices.filter(d => d.kind === 'audioinput');
  const audioOutputDevices = devices.filter(d => d.kind === 'audiooutput');

  const Toggle: React.FC<{ value: boolean; onChange: (v: boolean) => void }> = ({ value, onChange }) => (
    <button
      onClick={() => onChange(!value)}
      className={cn(
        "w-10 h-[22px] rounded-full transition-all relative shrink-0",
        value ? "bg-blue-600" : "bg-white/10"
      )}
    >
      <div className={cn(
        "absolute top-[3px] w-4 h-4 rounded-full bg-white shadow transition-all",
        value ? "left-[calc(100%-1.2rem)]" : "left-[3px]"
      )} />
    </button>
  );

  const SettingRow: React.FC<{ label: string; desc?: string; children: React.ReactNode }> = ({ label, desc, children }) => (
    <div className="flex items-center justify-between py-3 px-1">
      <div className="min-w-0 pr-4">
        <p className="text-sm font-medium">{label}</p>
        {desc && <p className="text-[11px] text-white/25 mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'audio':
        return (
          <div className="space-y-6">
            {/* Microphone Selection */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                <Mic className="w-3.5 h-3.5" />
                Microphone
              </label>
              <select
                value={selectedAudioDevice}
                onChange={(e) => onAudioDeviceChange(e.target.value)}
                className="w-full bg-brand-accent/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
              >
                {audioInputDevices.map(d => (
                  <option key={d.deviceId} value={d.deviceId}>{d.label || `Microphone ${d.deviceId.slice(0, 5)}`}</option>
                ))}
              </select>
            </div>

            {/* Speaker Selection */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                <Volume2 className="w-3.5 h-3.5" />
                Speaker / Output
              </label>
              <select
                className="w-full bg-brand-accent/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
              >
                {audioOutputDevices.length > 0 ? (
                  audioOutputDevices.map(d => (
                    <option key={d.deviceId} value={d.deviceId}>{d.label || `Speaker ${d.deviceId.slice(0, 5)}`}</option>
                  ))
                ) : (
                  <option>Default Speaker</option>
                )}
              </select>
            </div>

            {/* Audio Settings */}
            <div className="space-y-1 pt-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Audio Processing</label>
              <div className="bg-brand-accent/30 rounded-xl border border-white/5 divide-y divide-white/5">
                <SettingRow label="Noise Suppression" desc="Reduce background noise from your microphone">
                  <Toggle value={noiseSuppression} onChange={setNoiseSuppression} />
                </SettingRow>
                <SettingRow label="Echo Cancellation" desc="Prevent echo and feedback loops">
                  <Toggle value={echoCancellation} onChange={setEchoCancellation} />
                </SettingRow>
                <SettingRow label="Auto Gain Control" desc="Automatically adjust microphone volume">
                  <Toggle value={autoGainControl} onChange={setAutoGainControl} />
                </SettingRow>
                <SettingRow label="Mute on Join" desc="Start with mic muted when joining a meeting">
                  <Toggle value={muteOnJoin} onChange={setMuteOnJoin} />
                </SettingRow>
              </div>
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-6">
            {/* Camera Selection */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                <Camera className="w-3.5 h-3.5" />
                Camera
              </label>
              <select
                value={selectedVideoDevice}
                onChange={(e) => onVideoDeviceChange(e.target.value)}
                className="w-full bg-brand-accent/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
              >
                {videoDevices.map(d => (
                  <option key={d.deviceId} value={d.deviceId}>{d.label || `Camera ${d.deviceId.slice(0, 5)}`}</option>
                ))}
              </select>
            </div>

            {/* Video Preview */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Preview</label>
              <div className="w-full aspect-video bg-brand-accent/50 rounded-xl border border-white/5 flex items-center justify-center overflow-hidden">
                <div className="text-white/10 text-xs font-bold">Camera Preview</div>
              </div>
            </div>

            {/* Video Settings */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Video Options</label>
              <div className="bg-brand-accent/30 rounded-xl border border-white/5 divide-y divide-white/5">
                <SettingRow label="Mirror My Video" desc="Flip your video horizontally (only affects your preview)">
                  <Toggle value={mirrorVideo} onChange={setMirrorVideo} />
                </SettingRow>
                <SettingRow label="HD Video" desc="Send video in high definition (uses more bandwidth)">
                  <Toggle value={hdVideo} onChange={setHdVideo} />
                </SettingRow>
                <SettingRow label="Camera Off on Join" desc="Start with camera off when joining a meeting">
                  <Toggle value={cameraOffOnJoin} onChange={setCameraOffOnJoin} />
                </SettingRow>
              </div>
            </div>
          </div>
        );

      case 'general':
        return (
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Appearance</label>
              <div className="bg-brand-accent/30 rounded-xl border border-white/5 divide-y divide-white/5">
                <SettingRow label="Dark Mode" desc="Use dark theme for the interface">
                  <Toggle value={darkMode} onChange={setDarkMode} />
                </SettingRow>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Meeting Defaults</label>
              <div className="bg-brand-accent/30 rounded-xl border border-white/5 divide-y divide-white/5">
                <SettingRow label="Mute on Join" desc="Always start meetings with mic muted">
                  <Toggle value={muteOnJoin} onChange={setMuteOnJoin} />
                </SettingRow>
                <SettingRow label="Camera Off on Join" desc="Always start meetings with camera off">
                  <Toggle value={cameraOffOnJoin} onChange={setCameraOffOnJoin} />
                </SettingRow>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Display Name</label>
              <input
                type="text"
                defaultValue={localStorage.getItem('nexus_user_name') || ''}
                onChange={(e) => localStorage.setItem('nexus_user_name', e.target.value)}
                className="w-full bg-brand-accent/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="Your display name"
              />
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Meeting Notifications</label>
              <div className="bg-brand-accent/30 rounded-xl border border-white/5 divide-y divide-white/5">
                <SettingRow label="Participant Joins" desc="Show notification when someone joins the meeting">
                  <Toggle value={notifyJoin} onChange={setNotifyJoin} />
                </SettingRow>
                <SettingRow label="New Chat Message" desc="Show notification for new chat messages">
                  <Toggle value={notifyChat} onChange={setNotifyChat} />
                </SettingRow>
                <SettingRow label="Hand Raised" desc="Show notification when someone raises their hand">
                  <Toggle value={notifyHand} onChange={setNotifyHand} />
                </SettingRow>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Sound</label>
              <div className="bg-brand-accent/30 rounded-xl border border-white/5 divide-y divide-white/5">
                <SettingRow label="Sound Effects" desc="Play sounds for join/leave, messages, and alerts">
                  <Toggle value={soundEffects} onChange={setSoundEffects} />
                </SettingRow>
              </div>
            </div>
          </div>
        );

      case 'shortcuts':
        return (
          <div className="space-y-4">
            <p className="text-xs text-white/30">Use these keyboard shortcuts during meetings for quick actions.</p>
            <div className="bg-brand-accent/30 rounded-xl border border-white/5 divide-y divide-white/5">
              {[
                { action: 'Toggle Mute', keys: ['Alt', 'M'] },
                { action: 'Toggle Camera', keys: ['Alt', 'V'] },
                { action: 'Toggle Screen Share', keys: ['Alt', 'S'] },
                { action: 'Toggle Chat', keys: ['Alt', 'C'] },
                { action: 'Toggle Participants', keys: ['Alt', 'P'] },
                { action: 'Raise / Lower Hand', keys: ['Alt', 'H'] },
                { action: 'Toggle Recording', keys: ['Alt', 'R'] },
                { action: 'Toggle Fullscreen', keys: ['Alt', 'F'] },
                { action: 'Leave Meeting', keys: ['Alt', 'Q'] },
              ].map((shortcut) => (
                <div key={shortcut.action} className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm">{shortcut.action}</span>
                  <div className="flex items-center gap-1.5">
                    {shortcut.keys.map((key, i) => (
                      <React.Fragment key={key}>
                        {i > 0 && <span className="text-white/15 text-xs">+</span>}
                        <kbd className="px-2 py-1 bg-brand-accent/60 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-wider text-white/60 min-w-[28px] text-center">
                          {key}
                        </kbd>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6">
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold">Nexus Meeting</h3>
              <p className="text-white/30 text-xs mt-1">Version 1.0.0</p>
            </div>

            <div className="bg-brand-accent/30 rounded-xl border border-white/5 divide-y divide-white/5 text-sm">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-white/40">Platform</span>
                <span className="font-medium">Web Browser</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-white/40">Encryption</span>
                <span className="font-medium text-emerald-400">End-to-End (WebRTC)</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-white/40">Protocol</span>
                <span className="font-medium">WebRTC + Socket.IO</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-white/40">Video Codec</span>
                <span className="font-medium">VP9 / VP8</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-white/40">Audio Codec</span>
                <span className="font-medium">Opus</span>
              </div>
            </div>

            <p className="text-center text-[10px] text-white/15 uppercase tracking-wider">
              Built with React • TypeScript • WebRTC
            </p>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl h-[560px] bg-brand-card border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex"
          >
            {/* Sidebar */}
            <div className="w-52 border-r border-white/5 bg-brand-accent/20 p-3 flex flex-col shrink-0">
              <h2 className="text-lg font-bold px-3 py-3 mb-1">Settings</h2>
              <nav className="space-y-0.5 flex-1">
                {tabItems.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                      activeTab === tab.id
                        ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                        : "text-white/40 hover:text-white/70 hover:bg-white/5"
                    )}
                  >
                    <tab.icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                ))}
              </nav>

              <button
                onClick={onClose}
                className="mt-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-600/20 text-center"
              >
                Done
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-white/5">
                <h3 className="text-base font-bold capitalize">{tabItems.find(t => t.id === activeTab)?.label}</h3>
                <button onClick={onClose} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
                  <X className="w-4 h-4 text-white/30" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {renderContent()}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
