import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MicOff, VideoOff, Hand } from 'lucide-react';
import { cn } from '../../lib/utils';

export const RemoteVideo: React.FC<{ stream?: MediaStream; name: string; raisedHand?: boolean; isCameraOff?: boolean; isMuted?: boolean; small?: boolean }> = ({ stream, name, raisedHand, isCameraOff, isMuted, small }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        borderColor: raisedHand ? 'rgba(234, 179, 8, 0.5)' : 'rgba(255, 255, 255, 0.05)',
        boxShadow: raisedHand ? '0 0 20px rgba(234, 179, 8, 0.2)' : 'none'
      }}
      className={cn(
        "relative bg-brand-card rounded-2xl overflow-hidden border transition-colors duration-500 h-full w-full min-h-0",
        raisedHand ? "border-yellow-500/50" : "border-white/5"
      )}
    >
      <AnimatePresence>
        {raisedHand && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-yellow-500 text-black rounded-full shadow-lg font-bold text-[10px] uppercase tracking-wider"
          >
            <motion.div
              animate={{ rotate: [0, -20, 20, -20, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <Hand className="w-3 h-3 fill-black" />
            </motion.div>
            Hand Raised
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <AnimatePresence>
          {isMuted && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-1.5 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-lg text-red-500"
            >
              <MicOff className={cn(small ? "w-3 h-3" : "w-4 h-4")} />
            </motion.div>
          )}
          {isCameraOff && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-1.5 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-lg text-red-500"
            >
              <VideoOff className={cn(small ? "w-3 h-3" : "w-4 h-4")} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {(stream && !isCameraOff) ? (
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-brand-accent">
          <div className={cn(
            "rounded-full bg-brand-card flex items-center justify-center font-bold border border-white/10",
            small ? "w-12 h-12 text-xl" : "w-24 h-24 text-3xl"
          )}>
            {name.charAt(0)}
          </div>
        </div>
      )}
      <div className={cn(
        "absolute z-20 flex items-center gap-2",
        small ? "bottom-2 left-2" : "bottom-4 left-4"
      )}>
        <div className={cn(
          "flex items-center gap-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 shadow-xl",
          small ? "px-2 py-1" : "px-3 py-1.5"
        )}>
          {!isMuted && (
            <div className="flex gap-0.5 items-end h-2">
              <motion.div 
                animate={{ height: [2, 6, 3, 8, 4] }} 
                transition={{ repeat: Infinity, duration: 0.5, delay: 0 }}
                className="w-0.5 bg-emerald-500 rounded-full" 
              />
              <motion.div 
                animate={{ height: [3, 8, 4, 6, 2] }} 
                transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }}
                className="w-0.5 bg-emerald-500 rounded-full" 
              />
              <motion.div 
                animate={{ height: [4, 3, 8, 2, 6] }} 
                transition={{ repeat: Infinity, duration: 0.4, delay: 0.2 }}
                className="w-0.5 bg-emerald-500 rounded-full" 
              />
            </div>
          )}
          <span className={cn(
            "font-semibold tracking-wide text-white/90 uppercase",
            small ? "text-[9px]" : "text-[11px]"
          )}>
            {name}
          </span>
          {raisedHand && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Hand className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const LocalVideo: React.FC<{ stream: MediaStream | null; userName: string; isCameraOff: boolean; isMuted: boolean; isHandRaised: boolean; small?: boolean; className?: string }> = ({ stream, userName, isCameraOff, isMuted, isHandRaised, small, className }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <motion.div 
      layout
      animate={{ 
        borderColor: isHandRaised ? 'rgba(234, 179, 8, 0.5)' : 'rgba(255, 255, 255, 0.05)',
        boxShadow: isHandRaised ? '0 0 20px rgba(234, 179, 8, 0.2)' : 'none'
      }}
      className={cn(
        "relative bg-brand-card rounded-2xl overflow-hidden border transition-colors duration-500 group h-full w-full min-h-0 flex items-center justify-center",
        isHandRaised ? "border-yellow-500/50" : "border-white/5",
        className
      )}
    >
      <AnimatePresence>
        {isHandRaised && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-yellow-500 text-black rounded-full shadow-lg font-bold text-[10px] uppercase tracking-wider"
          >
            <motion.div
              animate={{ rotate: [0, -20, 20, -20, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <Hand className="w-3 h-3 fill-black" />
            </motion.div>
            Hand Raised
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <AnimatePresence>
          {isMuted && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-1.5 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-lg text-red-500"
            >
              <MicOff className={cn(small ? "w-3 h-3" : "w-4 h-4")} />
            </motion.div>
          )}
          {isCameraOff && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-1.5 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-lg text-red-500"
            >
              <VideoOff className={cn(small ? "w-3 h-3" : "w-4 h-4")} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <video 
        ref={videoRef} 
        autoPlay 
        muted 
        playsInline 
        className={cn("w-full h-full object-cover", isCameraOff && "hidden")}
      />
      {isCameraOff && (
        <div className="absolute inset-0 flex items-center justify-center bg-brand-accent">
          <div className={cn(
            "rounded-full bg-brand-card flex items-center justify-center font-bold border border-white/10",
            small ? "w-12 h-12 text-xl" : "w-20 h-20 md:w-24 md:h-24 text-2xl md:text-3xl"
          )}>
            {userName.charAt(0)}
          </div>
        </div>
      )}
      <div className={cn(
        "absolute z-20 flex items-center gap-2",
        small ? "bottom-2 left-2" : "bottom-4 left-4"
      )}>
        <div className={cn(
          "flex items-center gap-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 shadow-xl",
          small ? "px-2 py-1" : "px-3 py-1.5"
        )}>
          {!isMuted && (
            <div className="flex gap-0.5 items-end h-2">
              <motion.div 
                animate={{ height: [2, 6, 3, 8, 4] }} 
                transition={{ repeat: Infinity, duration: 0.5, delay: 0 }}
                className="w-0.5 bg-emerald-500 rounded-full" 
              />
              <motion.div 
                animate={{ height: [3, 8, 4, 6, 2] }} 
                transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }}
                className="w-0.5 bg-emerald-500 rounded-full" 
              />
              <motion.div 
                animate={{ height: [4, 3, 8, 2, 6] }} 
                transition={{ repeat: Infinity, duration: 0.4, delay: 0.2 }}
                className="w-0.5 bg-emerald-500 rounded-full" 
              />
            </div>
          )}
          <span className={cn(
            "font-semibold tracking-wide text-white/90 uppercase",
            small ? "text-[9px]" : "text-[11px]"
          )}>
            {userName} {small ? '' : '(You)'}
          </span>
          {isHandRaised && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Hand className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
