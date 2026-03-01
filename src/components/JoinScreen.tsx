import React, { useState } from 'react';
import { Video, Keyboard, Plus, ArrowRight, Shield, Globe, Zap, LayoutDashboard } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface JoinScreenProps {
  onJoin?: (roomId: string, name: string) => void;
}

export const JoinScreen: React.FC<JoinScreenProps> = (props) => {
  const { onJoin } = props;
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nexus_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [name, setName] = useState(user?.name || localStorage.getItem('nexus_user_name') || '');
  const [roomId, setRoomId] = useState('');
  const [isCreating, setIsCreating] = useState(!!user); // If logged in, prioritize "New Meeting" (the "Panel" feel)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // REQUIRE LOGIN FOR NEW MEETING
    if (isCreating && !user) {
      navigate('/login');
      return;
    }

    if (name && (roomId || isCreating)) {
      const finalRoomId = isCreating ? Math.random().toString(36).substring(2, 10).toUpperCase() : roomId;
      localStorage.setItem('nexus_user_name', name);
      if (onJoin) {
        onJoin(finalRoomId, name);
      } else {
        navigate(`/meeting/${finalRoomId}`);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('nexus_user');
    localStorage.removeItem('nexus_user_name');
    localStorage.removeItem('nexus_user_id');
    setUser(null);
    setName('');
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Top Bar Actions */}
      <div className="absolute top-6 right-6 z-20 flex gap-3">
        {user ? (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-500 transition-all text-xs font-bold backdrop-blur-sm"
          >
            Logout ({user.name})
          </motion.button>
        ) : (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl text-blue-500 transition-all text-xs font-bold backdrop-blur-sm"
          >
            Login
          </motion.button>
        )}

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 px-4 py-2 bg-brand-card/50 hover:bg-brand-card/80 border border-white/10 rounded-xl text-white/40 hover:text-white/70 transition-all text-xs font-bold backdrop-blur-sm"
        >
          <LayoutDashboard className="w-4 h-4" />
          Admin Panel
        </motion.button>
      </div>

      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="flex items-center gap-3 mb-12 justify-center">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/20">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Nexus</h1>
        </div>

        <div className="glass-panel p-8 rounded-[2rem] shadow-2xl">
          <h2 className="text-xl font-semibold mb-2">Welcome back</h2>
          <p className="text-white/40 text-sm mb-8">Enter your details to join or start a meeting.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Display Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="How should we call you?"
                className="w-full bg-brand-accent/50 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>

            <div className="flex gap-2 p-1 bg-brand-accent/30 rounded-2xl border border-white/5">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${!isCreating ? 'bg-brand-card text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
              >
                Join Meeting
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(true)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${isCreating ? 'bg-brand-card text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
              >
                New Meeting
              </button>
            </div>

            {!isCreating && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Meeting ID</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                    placeholder="e.g. ABC-123-XYZ"
                    className="w-full bg-brand-accent/50 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono"
                  />
                  <Keyboard className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-600/20 group"
            >
              {isCreating ? (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Create Meeting</span>
                </>
              ) : (
                <>
                  <span>Join Meeting</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 lg:mt-12 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <div className="flex flex-col items-center gap-2 p-3 bg-white/[0.02] rounded-2xl border border-white/5 md:bg-transparent md:border-none">
            <div className="w-10 h-10 rounded-xl bg-brand-accent/50 flex items-center justify-center border border-white/5">
              <Globe className="w-5 h-5 text-white/40" />
            </div>
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">Global Edge</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 bg-white/[0.02] rounded-2xl border border-white/5 md:bg-transparent md:border-none">
            <div className="w-10 h-10 rounded-xl bg-brand-accent/50 flex items-center justify-center border border-white/5">
              <Shield className="w-5 h-5 text-white/40" />
            </div>
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">End-to-End</span>
          </div>
          <div className="hidden md:flex flex-col items-center gap-2 p-3">
            <div className="w-10 h-10 rounded-xl bg-brand-accent/50 flex items-center justify-center border border-white/5">
              <Zap className="w-5 h-5 text-white/40" />
            </div>
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">Low Latency</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
