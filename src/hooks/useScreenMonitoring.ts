import { useState, useEffect, useRef, useCallback } from 'react';
import { Socket } from 'socket.io-client';

interface ScreenCapture {
    userId: string;
    userName: string;
    screenshot: string; // base64 JPEG
    timestamp: number;
}

export const useScreenMonitoring = (socket: Socket | null, userId: string, isHost: boolean) => {
    const [captures, setCaptures] = useState<Map<string, ScreenCapture>>(new Map());
    const [isMonitoring, setIsMonitoring] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Participant: listen for capture requests and respond
    useEffect(() => {
        if (!socket) return;

        const handleCaptureRequest = async (data: { requesterId: string; targetId?: string; broadcast?: boolean }) => {
            // Respond if: it targets us SPECIFICALLY, or it's a broadcast to EVERYONE else
            // Using socket.id instead of userId to correctly differentiate tabs during local testing
            const currentId = socket.id || userId;
            const isTargeted = data.targetId === currentId || data.targetId === userId;
            const isBroadcastForOthers = data.broadcast && data.requesterId !== currentId && data.requesterId !== userId;

            if (!isTargeted && !isBroadcastForOthers) return;

            // console.log('[Tracking] Capture request received:', data.broadcast ? 'Broadcast' : 'Targeted');
            const electronAPI = (window as any).electronAPI;
            if (electronAPI?.captureScreenshot) {
                try {
                    const screenshot = await electronAPI.captureScreenshot();
                    if (screenshot) {
                        console.log('[Tracking] Sending screenshot for monitor...');
                        socket.emit('screenshot-data', {
                            targetId: data.requesterId,
                            screenshot,
                        });
                    }
                } catch (err) {
                    console.error('[Tracking] Screenshot capture failed:', err);
                }
            } else {
                console.warn('[Tracking] Not in Electron app, cannot capture screen silently.');
            }
        };

        socket.on('capture-screen-request', handleCaptureRequest);
        return () => { socket.off('capture-screen-request', handleCaptureRequest); };
    }, [socket, userId]);

    // Host: listen for screenshot responses
    useEffect(() => {
        if (!socket || !isHost) return;

        console.log('[Tracking] Host mode active, listening for screenshots...');
        const handleScreenshot = (data: { userId: string; userName: string; screenshot: string }) => {
            console.log(`[Tracking] Host: Received screen from ${data.userName} (${data.userId})`);
            setCaptures(prev => {
                const next = new Map(prev);
                next.set(data.userId, {
                    userId: data.userId,
                    userName: data.userName,
                    screenshot: data.screenshot,
                    timestamp: Date.now(),
                });
                return next;
            });
        };

        socket.on('screenshot-response', handleScreenshot);
        return () => { socket.off('screenshot-response', handleScreenshot); };
    }, [socket, isHost]);

    // Host: monitor loop
    useEffect(() => {
        if (!socket || !isHost || !isMonitoring) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        const poll = () => {
            console.log('[Tracking] Polling screens from all participants...');
            socket.emit('request-screenshot-all', {
                requesterId: socket.id || userId
            });
        };

        poll();
        intervalRef.current = setInterval(poll, 3000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [socket, isHost, isMonitoring]);

    const startMonitoring = useCallback(() => {
        if (!socket || !isHost) return;
        setIsMonitoring(true);
        console.log('[Tracking] Monitoring started globally');
    }, [socket, isHost]);

    const stopMonitoring = useCallback(() => {
        console.log('[Tracking] Monitoring stopped');
        setIsMonitoring(false);
        setCaptures(new Map());
    }, []);

    return {
        captures: Array.from(captures.values()),
        isMonitoring,
        startMonitoring,
        stopMonitoring,
    };
};
