import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    MoreVertical,
    Trash2,
    Edit,
    Mail,
    Calendar,
    Crown,
    UserCircle,
    CheckCircle2,
    ShieldAlert,
    ExternalLink,
    X,
    Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { api } from '../../lib/api';

export const SuperAdminUsers: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState<any>(null);
    const [updateLoading, setUpdateLoading] = useState(false);

    const currentUser = JSON.parse(localStorage.getItem('nexus_user') || '{}');

    const fetchUsers = async () => {
        try {
            const res = await api.get('/api/super/users');
            const data = await res.json();
            if (res.ok) setUsers(data);
        } catch (err) {
            console.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUpdateUser = async (userId: string, updates: any) => {
        setUpdateLoading(true);
        try {
            const res = await api.put(`/api/super/users/${userId}`, updates);
            if (res.ok) {
                await fetchUsers();
                setEditingUser(null);
            }
        } catch (err) {
            console.error("Update failed");
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm("FATAL ACTION: Permanently delete this user node?")) return;
        try {
            const res = await api.delete(`/api/super/users/${userId}`);
            if (res.ok) fetchUsers();
        } catch (err) {
            console.error("Deletion failed");
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-96 gap-6">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-red-500 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Scanning Nexus Identity Grid</span>
        </div>
    );

    return (
        <div className="space-y-12 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h1 className="text-6xl font-black tracking-tighter uppercase italic">Identity <span className="text-red-600">Control.</span></h1>
                    <p className="text-white/30 text-lg mt-3 font-medium uppercase tracking-tight">Manage all global user permissions and subscription tiers.</p>
                </div>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="SEARCH CORE IDENTITY (NAME/EMAIL)..."
                        className="w-full bg-white/[0.02] border border-white/5 focus:border-red-600/30 rounded-3xl py-5 pl-16 pr-6 text-xs font-black uppercase tracking-widest outline-none transition-all placeholder:text-white/10"
                    />
                </div>
            </div>

            {/* User Grid/Table */}
            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[3.5rem] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="px-6 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Identifer & Status</th>
                                <th className="px-6 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Email & Authority</th>
                                <th className="px-6 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Plan Tier</th>
                                <th className="px-6 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Creation Node</th>
                                <th className="px-6 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 text-right">Alpha Controls</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {filteredUsers.map((user, i) => (
                                <motion.tr
                                    key={user._id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group hover:bg-white/[0.01] transition-all"
                                >
                                    <td className="px-6 py-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-black flex items-center justify-center text-xs font-black shadow-lg shadow-red-600/10 group-hover:scale-110 transition-transform">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black uppercase tracking-widest">{user.name}</p>
                                                <div className="flex items-center gap-2 mt-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                                    <div className={cn("w-1.5 h-1.5 rounded-full", user.role === 'admin' ? "bg-red-500" : "bg-emerald-500")} />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">{user.role === 'admin' ? "System Admin" : "User Portal"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-10">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2 text-white/40 group-hover:text-white/60 transition-colors">
                                                <Mail className="w-3.5 h-3.5" />
                                                <span className="text-xs font-medium tracking-tight uppercase">{user.email}</span>
                                            </div>
                                            <span className="text-[9px] font-black text-red-500/20 uppercase tracking-[0.2em]">Validated Encryption: AES-256</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-10">
                                        <div className={cn(
                                            "inline-flex items-center gap-3 px-5 py-2.5 rounded-full border text-[10px] font-black uppercase tracking-widest",
                                            user.plan === 'Enterprise' ? "bg-orange-500/10 border-orange-500/20 text-orange-400" :
                                                user.plan === 'Nexus Pro' ? "bg-red-600/10 border-red-600/20 text-red-500" :
                                                    "bg-white/5 border-white/10 text-white/40"
                                        )}>
                                            {user.plan === 'Enterprise' ? <ShieldAlert className="w-3.5 h-3.5" /> : user.plan === 'Nexus Pro' ? <Crown className="w-3.5 h-3.5" /> : <UserCircle className="w-3.5 h-3.5" />}
                                            {user.plan}
                                        </div>
                                    </td>
                                    <td className="px-6 py-10">
                                        <div className="flex items-center gap-3 text-white/20 group-hover:text-white/40 transition-colors">
                                            <Calendar className="w-4 h-4" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{new Date(user.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-10 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                            <button
                                                onClick={() => setEditingUser(user)}
                                                className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-red-600/10 hover:border-red-600/20 hover:text-red-500 transition-all"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user._id)}
                                                className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-red-600/80 hover:border-red-600 text-white transition-all shadow-xl shadow-red-600/10"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit User Modal */}
            <AnimatePresence>
                {editingUser && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setEditingUser(null)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-2xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#0c0606] border border-red-500/20 p-10 rounded-[4rem] shadow-2xl shadow-red-600/20 max-w-2xl w-full relative z-[201] overflow-hidden group"
                        >
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-600/50 to-transparent" />

                            <div className="flex items-center justify-between mb-12">
                                <h4 className="text-3xl font-black uppercase tracking-widest italic">Target <span className="text-red-500">Override.</span></h4>
                                <button onClick={() => setEditingUser(null)} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                                    <X className="w-6 h-6 text-white/40" />
                                </button>
                            </div>

                            <div className="space-y-10">
                                <div className="p-8 bg-white/5 border border-white/5 rounded-3xl flex items-center gap-6">
                                    <div className="w-16 h-16 bg-red-600 rounded-3xl flex items-center justify-center text-xl font-black">{editingUser.name.charAt(0)}</div>
                                    <div>
                                        <p className="text-xl font-black uppercase tracking-widest">{editingUser.name}</p>
                                        <p className="text-sm font-medium text-white/30 uppercase tracking-widest mt-1">{editingUser.email}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 px-4">Subscription Alpha Tier</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {['Free Bharat', 'Nexus Pro', 'Enterprise'].map(plan => (
                                            <button
                                                key={plan}
                                                onClick={() => setEditingUser({ ...editingUser, plan })}
                                                className={cn(
                                                    "py-5 rounded-3xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                                    editingUser.plan === plan ? "bg-red-600/20 border-red-500/30 text-red-500 shadow-xl shadow-red-600/10" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                                                )}
                                            >
                                                {plan}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 px-4">Global Role Authority</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {['user', 'admin'].map(role => (
                                            <button
                                                key={role}
                                                onClick={() => setEditingUser({ ...editingUser, role })}
                                                className={cn(
                                                    "py-5 rounded-3xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-3",
                                                    editingUser.role === role ? "bg-red-600/20 border-red-500/30 text-red-500 shadow-xl shadow-red-600/10" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                                                )}
                                            >
                                                {role === 'admin' ? <ShieldAlert className="w-4 h-4" /> : <UserCircle className="w-4 h-4" />}
                                                {role === 'admin' ? "CORE ADMIN" : "PORTAL USER"}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    disabled={updateLoading}
                                    onClick={() => handleUpdateUser(editingUser._id, { plan: editingUser.plan, role: editingUser.role })}
                                    className="w-full py-8 bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-widest rounded-[2.5rem] shadow-2xl shadow-red-600/30 transition-all flex items-center justify-center gap-4 group"
                                >
                                    {updateLoading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>Deploy Configuration <Check className="w-5 h-5 group-hover:scale-125 transition-transform" /></>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
