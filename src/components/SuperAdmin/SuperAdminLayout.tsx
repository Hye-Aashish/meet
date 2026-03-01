import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
    LayoutDashboard,
    Users,
    CreditCard,
    ShieldAlert,
    ChevronLeft,
    ChevronRight,
    LogOut,
    BrainCircuit,
    Settings,
    Bell,
    ExternalLink,
    Menu,
    X,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SuperAdminLayoutProps {
    children: React.ReactNode;
}

const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/nexus-super-portal' },
    { icon: Users, label: 'Manage Users', path: '/nexus-super-portal/users' },
    { icon: CreditCard, label: 'Subscription Plans', path: '/nexus-super-portal/plans' },
    { icon: BrainCircuit, label: 'System Analytics', path: '/nexus-super-portal/analytics' },
    { icon: ShieldAlert, label: 'Security Logs', path: '/nexus-super-portal/logs' },
    { icon: Settings, label: 'Global Config', path: '/nexus-super-portal/config' },
];

export const SuperAdminLayout: React.FC<SuperAdminLayoutProps> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const userStr = localStorage.getItem('nexus_user');
    const user = userStr ? JSON.parse(userStr) : null;

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
        }
    }, [user, navigate]);

    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    if (!user || user.role !== 'admin') return null;

    const SidebarContent = () => (
        <div className="h-full border-r border-red-500/10 bg-[#080303]/80 backdrop-blur-3xl flex flex-col overflow-hidden shrink-0">
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-red-500/10 h-24 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-600/30 shrink-0">
                        <ShieldAlert className="w-6 h-6 text-white" />
                    </div>
                    {(!collapsed || mobileOpen) && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col"
                        >
                            <span className="text-lg font-black tracking-tighter uppercase leading-none">Nexus <span className="text-red-500">Core</span></span>
                            <span className="text-[8px] font-bold text-red-500 uppercase tracking-widest mt-1">Super Authority</span>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <motion.button
                            key={item.path}
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(item.path)}
                            className={cn(
                                "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all text-sm font-black uppercase tracking-widest",
                                isActive
                                    ? "bg-red-600/10 text-red-500 border border-red-500/20 shadow-[0_0_20px_rgba(220,38,38,0.1)]"
                                    : "text-white/30 hover:text-white/60 hover:bg-white/5"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5 shrink-0", isActive && "text-red-500")} />
                            {(!collapsed || mobileOpen) && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="whitespace-nowrap"
                                >
                                    {item.label}
                                </motion.span>
                            )}
                        </motion.button>
                    );
                })}
            </nav>

            {/* Footer section */}
            <div className="p-4 border-t border-white/5 space-y-3">
                <div className={cn(
                    "flex items-center gap-3 p-3 rounded-2xl bg-white/5",
                    (collapsed && !mobileOpen) && "justify-center"
                )}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-black flex items-center justify-center text-xs font-black shadow-lg shadow-red-600/20 shrink-0">
                        {user.name.charAt(0)}
                    </div>
                    {(!collapsed || mobileOpen) && (
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-black truncate uppercase tracking-tighter">{user.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-[10px] text-red-500 uppercase font-bold tracking-widest">Root Status</span>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => {
                        localStorage.removeItem('nexus_user');
                        localStorage.removeItem('nexus_user_name');
                        localStorage.removeItem('nexus_user_id');
                        navigate('/login');
                    }}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
                >
                    <LogOut className="w-4 h-4" />
                    {(!collapsed || mobileOpen) && <span>Secure Logout</span>}
                </button>

                <button
                    onClick={() => navigate('/')}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white/40 hover:bg-white/5 transition-all"
                >
                    <ExternalLink className="w-4 h-4" />
                    {(!collapsed || mobileOpen) && <span>Exit to Public</span>}
                </button>
            </div>
        </div>
    );

    return (
        <div className="h-screen bg-[#050101] text-white flex flex-col lg:flex-row overflow-hidden selection:bg-red-500/30 selection:text-white">
            {/* Mobile Top Nav */}
            <div className="lg:hidden h-20 px-6 flex items-center justify-between border-b border-red-500/10 bg-black/50 backdrop-blur-2xl shrink-0 z-50">
                <div className="flex items-center gap-3">
                    <ShieldAlert className="w-8 h-8 text-red-600" />
                    <span className="font-black uppercase tracking-tighter text-xl">Nexus <span className="text-red-600">Core</span></span>
                </div>
                <button onClick={() => setMobileOpen(true)} className="p-3 bg-red-600/10 rounded-2xl text-red-500">
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: collapsed ? 96 : 300 }}
                transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                className="hidden lg:block h-full shrink-0 relative z-[90]"
            >
                <SidebarContent />
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center border border-black shadow-xl z-[100] hover:scale-110 transition-transform"
                >
                    {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
            </motion.aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-[300px] z-[101] lg:hidden"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative p-6 lg:p-10 custom-scrollbar pb-24 lg:pb-10">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
                <div className="absolute top-0 right-0 w-[50%] h-[500px] bg-red-600/5 blur-[150px] rounded-full pointer-events-none" />

                <div className="relative z-10 max-w-7xl mx-auto">
                    {children}
                </div>

                {/* Mobile Bottom Nav Bar (Compact) */}
                <div className="lg:hidden fixed bottom-6 left-6 right-6 h-16 bg-red-950/80 backdrop-blur-2xl border border-red-500/20 rounded-[2rem] px-8 flex items-center justify-around z-50">
                    {navItems.slice(0, 4).map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={cn(
                                    "p-2 rounded-xl transition-all",
                                    isActive ? "text-red-500 scale-125 bg-red-500/10" : "text-white/20"
                                )}
                            >
                                <item.icon className="w-6 h-6" />
                            </button>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};
