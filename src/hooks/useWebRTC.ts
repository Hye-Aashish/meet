import { useRef, useCallback, useState } from 'react';
import { Socket } from 'socket.io-client';
import { Participant } from '../types';

export const useWebRTC = (socket: Socket | null, localStream: MediaStream | null, userId: string) => {
  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const [participants, setParticipants] = useState<Participant[]>([]);

  const createPeer = useCallback((targetId: string, stream: MediaStream, initiator: boolean) => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    peersRef.current.set(targetId, peer);

    stream.getTracks().forEach(track => peer.addTrack(track, stream));

    peer.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('signal', {
          targetId,
          signal: { candidate: event.candidate }
        });
      }
    };

    peer.ontrack = (event) => {
      setParticipants(prev => prev.map(p => 
        p.id === targetId ? { ...p, stream: event.streams[0] } : p
      ));
    };

    if (initiator) {
      peer.createOffer().then(offer => {
        return peer.setLocalDescription(offer);
      }).then(() => {
        if (socket) {
          socket.emit('signal', {
            targetId,
            signal: { sdp: peer.localDescription }
          });
        }
      });
    }

    return peer;
  }, [socket]);

  const replaceTrack = useCallback((newStream: MediaStream) => {
    peersRef.current.forEach(peer => {
      const senders = peer.getSenders();
      newStream.getTracks().forEach(track => {
        const sender = senders.find(s => s.track?.kind === track.kind);
        if (sender) {
          sender.replaceTrack(track);
        }
      });
    });
  }, []);

  const closePeer = useCallback((targetId: string) => {
    const peer = peersRef.current.get(targetId);
    if (peer) {
      peer.close();
      peersRef.current.delete(targetId);
    }
  }, []);

  return {
    participants,
    setParticipants,
    createPeer,
    replaceTrack,
    closePeer,
    peers: peersRef.current
  };
};
