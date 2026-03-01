import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    Home,
    Video,
    Calendar,
    Settings,
    Shield,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Users,
    BarChart3,
    Film,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const navItems = [
    { icon: Home, label: 'Dashboard', path: '/admin' },
    { icon: Video, label: 'Meetings', path: '/admin/meetings' },
    { icon: Film, label: 'Recordings', path: '/admin/recordings' },
    { icon: Calendar, label: 'Scheduled', path: '/admin/scheduled' },
    { icon: Users, label: 'Participants', path: '/admin/participants' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const userName = localStorage.getItem('nexus_user_name') || 'Admin';

    return (
        <div className="h-screen bg-brand-bg text-white flex overflow-hidden">
            {/* Sidebar */}
            <motion.aside
                animate={{ width: collapsed ? 72 : 260 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="h-full border-r border-white/5 bg-brand-card/50 backdrop-blur-xl flex flex-col overflow-hidden shrink-0"
            >
                {/* Logo */}
                <div className="p-4 flex items-center gap-3 border-b border-white/5 h-16 shrink-0">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 shrink-0">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    {!collapsed && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-lg font-bold tracking-tight whitespace-nowrap"
                        >
                            Nexus Admin
                        </motion.span>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path ||
                            (item.path !== '/admin' && location.pathname.startsWith(item.path));
                        return (
                            <motion.button
                                key={item.path}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate(item.path)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium",
                                    isActive
                                        ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                                        : "text-white/50 hover:text-white/80 hover:bg-white/5"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5 shrink-0", isActive && "text-blue-400")} />
                                {!collapsed && (
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

                {/* Bottom section */}
                <div className="p-3 border-t border-white/5 space-y-2">
                    {/* User info */}
                    <div className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5",
                        collapsed && "justify-center"
                    )}>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold shrink-0">
                            {userName.charAt(0).toUpperCase()}
                        </div>
                        {!collapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold truncate">{userName}</p>
                                <p className="text-[10px] text-white/30 uppercase tracking-wider">Administrator</p>
                            </div>
                        )}
                    </div>

                    {/* Collapse toggle */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors text-xs"
                    >
                        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                        {!collapsed && <span>Collapse</span>}
                    </button>

                    {/* Go to meeting */}
                    <button
                        onClick={() => navigate('/')}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors text-xs"
                    >
                        <LogOut className="w-4 h-4" />
                        {!collapsed && <span>Back to App</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};
