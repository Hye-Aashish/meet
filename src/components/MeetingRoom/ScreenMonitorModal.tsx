import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Eye, EyeOff, Monitor, RefreshCw, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ScreenCapture {
    userId: string;
    userName: string;
    screenshot: string;
    timestamp: number;
}

interface ScreenMonitorModalProps {
    show: boolean;
    onClose: () => void;
    captures: ScreenCapture[];
    isMonitoring: boolean;
    onStartMonitoring: () => void;
    onStopMonitoring: () => void;
    participantCount: number;
}

export const ScreenMonitorModal: React.FC<ScreenMonitorModalProps> = ({
    show,
    onClose,
    captures,
    isMonitoring,
    onStartMonitoring,
    onStopMonitoring,
    participantCount,
}) => {
    const [selectedCapture, setSelectedCapture] = React.useState<ScreenCapture | null>(null);

    const getTimeSince = (timestamp: number) => {
        const diff = Math.floor((Date.now() - timestamp) / 1000);
        if (diff < 5) return 'Just now';
        if (diff < 60) return `${diff}s ago`;
        return `${Math.floor(diff / 60)}m ago`;
    };

    // Auto-refresh time display
    const [, setTick] = React.useState(0);
    useEffect(() => {
        if (!isMonitoring) return;
        const timer = setInterval(() => setTick(t => t + 1), 1000);
        return () => clearInterval(timer);
    }, [isMonitoring]);

    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        transition={{ type: 'spring', damping: 28, stiffness: 350 }}
                        className="relative w-full max-w-5xl max-h-[85vh] bg-[#0e1018] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-white/[0.05] shrink-0">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center shadow-lg",
                                    isMonitoring
                                        ? "bg-gradient-to-br from-red-500 to-orange-600 shadow-red-600/25"
                                        : "bg-gradient-to-br from-violet-500 to-indigo-600 shadow-violet-600/25"
                                )}>
                                    <Eye className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                                        Screen Monitoring
                                        {isMonitoring && (
                                            <span className="flex items-center gap-1.5 px-2 py-0.5 bg-red-500/15 text-red-400 text-[9px] font-bold uppercase tracking-widest rounded-full border border-red-500/20">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                                Live
                                            </span>
                                        )}
                                    </h2>
                                    <p className="text-[11px] text-white/25">
                                        {isMonitoring
                                            ? `Monitoring ${captures.length} participant screens — updates every 3s`
                                            : `${participantCount - 1} participants available to monitor`
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {isMonitoring ? (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={onStopMonitoring}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-600/15 hover:bg-red-600/25 text-red-400 text-xs font-bold rounded-lg border border-red-500/20 transition-colors"
                                    >
                                        <EyeOff className="w-3.5 h-3.5" />
                                        Stop Monitoring
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={onStartMonitoring}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-violet-600/25 transition-all"
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                        Start Monitoring
                                    </motion.button>
                                )}
                                <button onClick={onClose} className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-lg transition-colors">
                                    <X className="w-4 h-4 text-white/30" />
                                </button>
                            </div>
                        </div>

                        {/* Screen Grid */}
                        <div className="flex-1 overflow-y-auto p-5">
                            {!isMonitoring ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <div className="w-20 h-20 bg-violet-500/10 rounded-2xl flex items-center justify-center mb-4 border border-violet-500/20">
                                        <Monitor className="w-10 h-10 text-violet-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">Screen Monitoring</h3>
                                    <p className="text-sm text-white/30 text-center max-w-md mb-6">
                                        View real-time screenshots of participant screens. Only works for participants using the desktop app.
                                    </p>
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={onStartMonitoring}
                                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-violet-600/25 transition-all"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Start Monitoring All Screens
                                    </motion.button>
                                </div>
                            ) : captures.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <RefreshCw className="w-8 h-8 text-white/20 animate-spin mb-4" />
                                    <p className="text-sm text-white/30">Waiting for participant screens...</p>
                                    <p className="text-[10px] text-white/15 mt-1">Only desktop app users' screens can be monitored</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                        {captures.map((capture) => (
                                            <motion.div
                                                key={capture.userId}
                                                layout
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="group rounded-xl overflow-hidden border border-white/[0.06] hover:border-violet-500/30 transition-all cursor-pointer bg-black/30"
                                                onClick={() => setSelectedCapture(capture)}
                                            >
                                                <div className="aspect-video relative overflow-hidden">
                                                    <img
                                                        src={`data:image/jpeg;base64,${capture.screenshot}`}
                                                        alt={`${capture.userName}'s screen`}
                                                        className="w-full h-full object-contain"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-[10px] text-white/70 font-medium">Click to enlarge</span>
                                                    </div>
                                                </div>
                                                <div className="px-3 py-2 flex items-center justify-between bg-white/[0.02]">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-[10px] font-bold text-violet-400">
                                                            {capture.userName.charAt(0)}
                                                        </div>
                                                        <span className="text-xs font-medium text-white/60 truncate max-w-[120px]">{capture.userName}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3 text-white/15" />
                                                        <span className="text-[9px] text-white/20">{getTimeSince(capture.timestamp)}</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        {isMonitoring && captures.length > 0 && (
                            <div className="px-6 py-3 bg-white/[0.015] border-t border-white/[0.05] flex items-center justify-between shrink-0">
                                <p className="text-[10px] text-white/15">
                                    {captures.length} screen{captures.length !== 1 ? 's' : ''} being monitored • Auto-refreshing every 3 seconds
                                </p>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[10px] text-green-500/60 font-bold uppercase tracking-widest">Active</span>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Fullscreen Preview */}
                    <AnimatePresence>
                        {selectedCapture && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-lg p-8"
                                onClick={() => setSelectedCapture(null)}
                            >
                                <motion.div
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0.8 }}
                                    className="relative max-w-full max-h-full"
                                    onClick={e => e.stopPropagation()}
                                >
                                    <img
                                        src={`data:image/jpeg;base64,${selectedCapture.screenshot}`}
                                        alt={`${selectedCapture.userName}'s screen`}
                                        className="max-w-full max-h-[85vh] object-contain rounded-xl border border-white/10 shadow-2xl"
                                    />
                                    <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/80 backdrop-blur-md rounded-lg border border-white/10">
                                        <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-[10px] font-bold text-violet-400">
                                            {selectedCapture.userName.charAt(0)}
                                        </div>
                                        <span className="text-xs font-medium text-white">{selectedCapture.userName}'s Screen</span>
                                    </div>
                                    <button
                                        onClick={() => setSelectedCapture(null)}
                                        className="absolute top-4 right-4 w-8 h-8 bg-black/80 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors"
                                    >
                                        <X className="w-4 h-4 text-white/60" />
                                    </button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </AnimatePresence>
    );
};
