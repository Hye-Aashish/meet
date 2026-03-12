import { useState, useRef, useCallback } from 'react';
import { api } from '../lib/api';

interface RecordingData {
    id: string;
    title: string;
    roomId: string;
    duration: number;
    size: number;
    createdAt: string;
    blobUrl: string;
}

export function useRecording() {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [recordings, setRecordings] = useState<RecordingData[]>([]);
    const [recordingError, setRecordingError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const startTimeRef = useRef<number>(0);
    const audioContextRef = useRef<AudioContext | null>(null);
    const recordingStreamRef = useRef<MediaStream | null>(null);

    const startRecording = useCallback(async (
        localStream: MediaStream | null,
        remoteStreams: MediaStream[],
        roomId: string,
        meetingTitle?: string
    ) => {
        if (isRecording) return;
        setRecordingError(null);

        try {
            const tracks: MediaStreamTrack[] = [];

            // Detect if we're recording a screen share
            const isScreenStream = localStream?.getVideoTracks().some(t =>
                t.label.toLowerCase().includes('screen') ||
                t.label.toLowerCase().includes('display') ||
                t.label.toLowerCase().includes('monitor') ||
                t.label.toLowerCase().includes('window') ||
                t.getSettings()?.displaySurface !== undefined
            );

            let recordingStream: MediaStream | null = null;

            if (isScreenStream && localStream) {
                // Screen share: use the screen stream directly (video tracks already active)
                recordingStream = localStream;
                recordingStreamRef.current = null; // Don't stop screen stream on cleanup
                console.log('🖥️ Recording screen share stream');

                // Get a separate audio stream for mic
                try {
                    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                    // We'll add this audio separately below
                    recordingStreamRef.current = audioStream;
                } catch (err) {
                    console.warn('Could not get mic audio for screen recording:', err);
                }
            } else {
                // Camera recording: get a fresh stream
                try {
                    recordingStream = await navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: true,
                    });
                    recordingStreamRef.current = recordingStream;
                } catch (err) {
                    console.warn('Could not get fresh recording stream, trying audio only:', err);
                    try {
                        recordingStream = await navigator.mediaDevices.getUserMedia({
                            video: false,
                            audio: true,
                        });
                        recordingStreamRef.current = recordingStream;
                    } catch (err2) {
                        console.warn('Could not get audio-only stream either:', err2);
                    }
                }
            }

            // Use the appropriate stream for video
            const streamToRecord = recordingStream || localStream;

            // Create AudioContext to mix all audio sources
            const audioContext = new AudioContext();
            audioContextRef.current = audioContext;
            const destination = audioContext.createMediaStreamDestination();
            let hasAudio = false;

            // Add LOCAL audio from fresh recording stream (always enabled)
            if (streamToRecord && streamToRecord.getAudioTracks().length > 0) {
                try {
                    const localAudioSource = audioContext.createMediaStreamSource(
                        new MediaStream(streamToRecord.getAudioTracks())
                    );
                    localAudioSource.connect(destination);
                    hasAudio = true;
                    console.log('✅ Local/screen audio added to recording');
                } catch (err) {
                    console.warn('Could not add local audio:', err);
                }
            }

            // Add mic audio from separate stream (used during screen share recording)
            if (isScreenStream && recordingStreamRef.current && recordingStreamRef.current !== recordingStream) {
                try {
                    const micSource = audioContext.createMediaStreamSource(
                        new MediaStream(recordingStreamRef.current.getAudioTracks())
                    );
                    micSource.connect(destination);
                    hasAudio = true;
                    console.log('🎤 Mic audio added to screen recording');
                } catch (err) {
                    console.warn('Could not add mic audio:', err);
                }
            }

            // Add REMOTE audio from all participants
            remoteStreams.forEach((stream, i) => {
                if (stream && stream.getAudioTracks().length > 0) {
                    try {
                        const remoteSource = audioContext.createMediaStreamSource(
                            new MediaStream(stream.getAudioTracks())
                        );
                        remoteSource.connect(destination);
                        hasAudio = true;
                        console.log(`✅ Remote audio ${i} added to recording`);
                    } catch (err) {
                        console.warn(`Could not add remote audio ${i}:`, err);
                    }
                }
            });

            // Add VIDEO from the fresh recording stream
            if (streamToRecord && streamToRecord.getVideoTracks().length > 0) {
                const videoTrack = streamToRecord.getVideoTracks()[0];
                if (videoTrack.readyState === 'live') {
                    tracks.push(videoTrack);
                    console.log('✅ Video track added to recording');
                }
            }

            // Add mixed audio
            if (hasAudio) {
                tracks.push(...destination.stream.getAudioTracks());
                console.log('✅ Mixed audio added to recording');
            }

            // Fallback: if no tracks, create silent audio
            if (tracks.length === 0) {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                gainNode.gain.value = 0;
                oscillator.connect(gainNode);
                gainNode.connect(destination);
                oscillator.start();
                tracks.push(...destination.stream.getAudioTracks());
                console.log('⚠️ Using fallback silent audio for recording');
            }

            const combinedStream = new MediaStream(tracks);
            const hasVideo = combinedStream.getVideoTracks().length > 0;

            // Determine MIME type
            let mimeType = '';
            if (hasVideo) {
                const videoTypes = [
                    'video/webm;codecs=vp9,opus',
                    'video/webm;codecs=vp8,opus',
                    'video/webm;codecs=h264,opus',
                    'video/webm',
                    'video/mp4',
                ];
                for (const type of videoTypes) {
                    if (MediaRecorder.isTypeSupported(type)) {
                        mimeType = type;
                        break;
                    }
                }
            } else {
                const audioTypes = [
                    'audio/webm;codecs=opus',
                    'audio/webm',
                    'audio/ogg;codecs=opus',
                ];
                for (const type of audioTypes) {
                    if (MediaRecorder.isTypeSupported(type)) {
                        mimeType = type;
                        break;
                    }
                }
            }

            const options: MediaRecorderOptions = {};
            if (mimeType) {
                options.mimeType = mimeType;
            }

            console.log(`🎬 Starting recording - mimeType: ${mimeType}, video: ${hasVideo}, tracks: ${tracks.length}`);

            const mediaRecorder = new MediaRecorder(combinedStream, options);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onerror = (event: any) => {
                console.error('❌ MediaRecorder error:', event);
                setRecordingError('Recording error occurred');
                setIsRecording(false);
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                }
            };

            mediaRecorder.onstop = () => {
                const finalMimeType = mediaRecorder.mimeType || mimeType || 'video/webm';
                const blob = new Blob(chunksRef.current, { type: finalMimeType });
                const blobUrl = URL.createObjectURL(blob);
                const duration = Math.round((Date.now() - startTimeRef.current) / 1000);

                console.log(`🎬 Recording stopped - Size: ${(blob.size / 1024 / 1024).toFixed(2)}MB, Duration: ${duration}s`);

                if (blob.size < 100) {
                    console.warn('⚠️ Recording too small, likely empty');
                    setRecordingError('Recording is empty. Make sure camera or mic is enabled.');
                    cleanupRecording();
                    return;
                }

                const rec: RecordingData = {
                    id: `rec_${Date.now()}`,
                    title: meetingTitle || `Recording - ${new Date().toLocaleString()}`,
                    roomId,
                    duration,
                    size: blob.size,
                    createdAt: new Date().toISOString(),
                    blobUrl,
                };

                setRecordings(prev => [rec, ...prev]);

                // Save metadata to server
                api.post('/api/recordings', {
                    title: rec.title,
                    roomId: rec.roomId,
                    duration: rec.duration,
                    size: rec.size,
                }).catch(err => console.warn('Failed to save recording metadata:', err));

                // Auto download
                const ext = hasVideo ? 'webm' : 'webm';
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = `nexus-recording-${roomId}-${Date.now()}.${ext}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                cleanupRecording();
            };

            // Start recording with timeslice of 1 second
            mediaRecorder.start(1000);
            startTimeRef.current = Date.now();
            setIsRecording(true);
            setRecordingDuration(0);

            // Duration timer
            timerRef.current = setInterval(() => {
                setRecordingDuration(Math.round((Date.now() - startTimeRef.current) / 1000));
            }, 1000);

        } catch (err) {
            console.error('❌ Failed to start recording:', err);
            setRecordingError(`Failed to start recording: ${(err as Error).message}`);
            cleanupRecording();
        }
    }, [isRecording]);

    const cleanupRecording = useCallback(() => {
        audioContextRef.current?.close();
        audioContextRef.current = null;
        // Stop the dedicated recording stream
        if (recordingStreamRef.current) {
            recordingStreamRef.current.getTracks().forEach(t => t.stop());
            recordingStreamRef.current = null;
        }
        setRecordingDuration(0);
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            try {
                mediaRecorderRef.current.stop();
                console.log('⏹️ Recording stop requested');
            } catch (err) {
                console.error('Error stopping recording:', err);
            }
            setIsRecording(false);
        }
    }, []);

    const formatDuration = useCallback((seconds: number): string => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hrs > 0) {
            return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, []);

    return {
        isRecording,
        recordingDuration,
        recordings,
        recordingError,
        startRecording,
        stopRecording,
        formatDuration,
    };
}
