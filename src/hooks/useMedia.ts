import { useState, useCallback, useEffect } from 'react';

export const useMedia = () => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>('');
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>('');

  const getDevices = useCallback(async () => {
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      setDevices(allDevices);

      const videoDevice = allDevices.find(d => d.kind === 'videoinput');
      const audioDevice = allDevices.find(d => d.kind === 'audioinput');

      if (videoDevice && !selectedVideoDevice) setSelectedVideoDevice(videoDevice.deviceId);
      if (audioDevice && !selectedAudioDevice) setSelectedAudioDevice(audioDevice.deviceId);
    } catch (err) {
      console.error('Error enumerating devices:', err);
    }
  }, [selectedVideoDevice, selectedAudioDevice]);

  const startLocalStream = useCallback(async (videoDeviceId?: string, audioDeviceId?: string) => {
    try {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoDeviceId ? { deviceId: { exact: videoDeviceId } } : true,
        audio: audioDeviceId ? { deviceId: { exact: audioDeviceId } } : true,
      });

      // Apply current mute/camera states to the new stream
      stream.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
      stream.getVideoTracks().forEach(track => {
        track.enabled = !isCameraOff;
      });

      setLocalStream(stream);
      return stream;
    } catch (err) {
      console.error('Error accessing media devices:', err);
      throw err;
    }
  }, [localStream, isMuted, isCameraOff]);

  const toggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !nextMuted;
      });
    }
    setIsMuted(nextMuted);
    return nextMuted;
  }, [localStream, isMuted]);

  const toggleCamera = useCallback(() => {
    const nextCameraOff = !isCameraOff;
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !nextCameraOff;
      });
    }
    setIsCameraOff(nextCameraOff);
    return nextCameraOff;
  }, [localStream, isCameraOff]);

  const startScreenShare = useCallback(async (options?: { shareAudio?: boolean; optimizeForVideo?: boolean }) => {
    try {
      const isElectron = !!(window as any).electronAPI?.isElectron;

      // Electron needs simple options - extra options cause failures
      const displayMediaOptions: any = isElectron
        ? { video: true, audio: false }
        : {
          video: {
            displaySurface: 'monitor',
            ...(options?.optimizeForVideo ? { frameRate: { ideal: 30 }, width: { ideal: 1920 }, height: { ideal: 1080 } } : {}),
          },
          audio: options?.shareAudio ?? true,
          preferCurrentTab: false,
          selfBrowserSurface: 'exclude',
          surfaceSwitching: 'include',
          systemAudio: 'include',
        };

      console.log('📺 Requesting screen share...', isElectron ? '(Electron)' : '(Browser)');
      const stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
      console.log('✅ Screen share stream obtained!', stream.getVideoTracks().length, 'video tracks');
      setScreenStream(stream);
      return stream;
    } catch (err) {
      console.error('❌ Error starting screen share:', err);
      throw err;
    }
  }, []);

  // Electron-specific: use desktopCapturer source ID to bypass browser picker
  const startScreenShareElectron = useCallback(async (sourceId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: sourceId,
            maxWidth: 1920,
            maxHeight: 1080,
            maxFrameRate: 30,
          },
        } as any,
      });
      setScreenStream(stream);
      return stream;
    } catch (err) {
      console.error('Error starting Electron screen share:', err);
      throw err;
    }
  }, []);

  const stopScreenShare = useCallback(() => {
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
    }
  }, [screenStream]);

  useEffect(() => {
    getDevices();
    navigator.mediaDevices.addEventListener('devicechange', getDevices);
    return () => navigator.mediaDevices.removeEventListener('devicechange', getDevices);
  }, [getDevices]);

  return {
    localStream,
    screenStream,
    isMuted,
    isCameraOff,
    devices,
    selectedVideoDevice,
    selectedAudioDevice,
    setSelectedVideoDevice,
    setSelectedAudioDevice,
    startLocalStream,
    toggleMute,
    toggleCamera,
    startScreenShare,
    startScreenShareElectron,
    stopScreenShare,
  };
};
