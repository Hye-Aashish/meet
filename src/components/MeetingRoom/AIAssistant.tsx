import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, MessageSquare, History, X, Brain, Zap, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { api } from '../../lib/api';

interface AIAssistantProps {
    roomId: string;
    messages: any[];
    onClose: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ roomId, messages, onClose }) => {
    const [input, setInput] = useState('');
    const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
        { role: 'ai', text: "Namaste! I am Nexus AI. I'm listening to your meeting. You can ask me to summarize the discussion or answer specific questions about what was said." }
    ]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [aiMessages, loading]);

    const handleAsk = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim() || loading) return;

        const userText = input;
        setInput('');
        setAiMessages(prev => [...prev, { role: 'user', text: userText }]);
        setLoading(true);

        try {
            const res = await api.post('/api/ai/ask', {
                roomId,
                question: userText,
                context: messages.map(m => `${m.name}: ${m.text}`).join('\n')
            });
            const data = await res.json();
            setAiMessages(prev => [...prev, { role: 'ai', text: data.answer || "I'm sorry, I couldn't process that request." }]);
        } catch (err) {
            setAiMessages(prev => [...prev, { role: 'ai', text: "Error connecting to Nexus Neural Core. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    const generateSummary = async () => {
        if (loading) return;
        setLoading(true);
        setAiMessages(prev => [...prev, { role: 'user', text: "Generate a summary of this meeting." }]);

        try {
            const res = await api.post('/api/ai/summarize', {
                roomId,
                context: messages.map(m => `${m.name}: ${m.text}`).join('\n')
            });
            const data = await res.json();
            setAiMessages(prev => [...prev, { role: 'ai', text: data.summary || "I couldn't generate a summary at this moment." }]);
        } catch (err) {
            setAiMessages(prev => [...prev, { role: 'ai', text: "Neural link interrupted while summarizing." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="flex flex-col h-full bg-[#0a0505] border-l border-red-500/10 w-96 relative overflow-hidden"
        >
            {/* AI Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[100px] pointer-events-none" />

            {/* Header */}
            <div className="p-6 border-b border-red-500/10 flex items-center justify-between bg-black/40 backdrop-blur-xl relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-600/20 border border-red-500/20 rounded-xl flex items-center justify-center">
                        <Brain className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest">AI <span className="text-red-500">Nexus.</span></h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[8px] text-white/30 font-black uppercase tracking-widest">Neural Link Active</span>
                        </div>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                    <X className="w-4 h-4 text-white/20" />
                </button>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative z-10">
                {aiMessages.map((msg, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "flex flex-col max-w-[85%] gap-2",
                            msg.role === 'user' ? "ml-auto" : "mr-auto"
                        )}
                    >
                        <div className={cn(
                            "px-4 py-3 rounded-2xl text-xs leading-relaxed",
                            msg.role === 'user'
                                ? "bg-red-600 text-white font-bold"
                                : "bg-white/5 border border-white/5 text-white/70"
                        )}>
                            {msg.text}
                        </div>
                        {msg.role === 'ai' && (
                            <span className="text-[8px] font-black uppercase text-red-500/40 tracking-widest flex items-center gap-1">
                                <Bot className="w-3 h-3" /> System Intelligence
                            </span>
                        )}
                    </motion.div>
                ))}
                {loading && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-2xl w-fit animate-pulse">
                        <Zap className="w-3 h-3 text-red-600" />
                        <span className="text-[10px] font-black uppercase text-white/20 tracking-widest">Processing Neural Signal...</span>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="px-6 py-4 flex gap-2 border-t border-white/5 bg-black/20">
                <button
                    onClick={generateSummary}
                    className="flex-1 py-2.5 bg-white/5 hover:bg-red-600/10 border border-white/5 hover:border-red-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group"
                >
                    <Sparkles className="w-3 h-3 text-red-500 group-hover:scale-125 transition-transform" />
                    Summarize Meeting
                </button>
            </div>

            {/* Input Area */}
            <div className="p-6 bg-black/40 backdrop-blur-xl border-t border-red-500/10">
                <form onSubmit={handleAsk} className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="ASK AI ANYTHING..."
                        className="w-full bg-white/5 border border-white/5 focus:border-red-600/50 rounded-2xl py-4 pl-5 pr-14 text-[10px] font-black uppercase tracking-widest outline-none transition-all placeholder:text-white/10"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-red-600 hover:bg-red-500 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:grayscale"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
                <p className="text-[8px] text-center text-white/10 mt-4 uppercase font-bold tracking-widest">Powered by Nexus Hybrid-Sovereign LLM</p>
            </div>
        </motion.div>
    );
};
