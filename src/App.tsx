import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { JoinScreen } from './components/JoinScreen';
import { MeetingRoom } from './components/MeetingRoom';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { AdminLayout } from './components/AdminPanel/AdminLayout';
import { Dashboard } from './components/AdminPanel/Dashboard';
import { MeetingsPage } from './components/AdminPanel/MeetingsPage';
import { RecordingsPage } from './components/AdminPanel/RecordingsPage';
import { SettingsPage } from './components/AdminPanel/SettingsPage';

import { SuperAdminLayout } from './components/SuperAdmin/SuperAdminLayout';
import { SuperAdminDashboard } from './components/SuperAdmin/SuperAdminDashboard';
import { SuperAdminUsers } from './components/SuperAdmin/SuperAdminUsers';
import { SuperAdminPlans } from './components/SuperAdmin/SuperAdminPlans';
import { SuperAdminAnalytics } from './components/SuperAdmin/SuperAdminAnalytics';
import { SuperAdminLogs } from './components/SuperAdmin/SuperAdminLogs';
import { SuperAdminConfig } from './components/SuperAdmin/SuperAdminConfig';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/join" element={<JoinScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/meeting/:roomId" element={<MeetingRoom />} />

          {/* Admin Panel Routes */}
          <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path="/admin/meetings" element={<AdminLayout><MeetingsPage /></AdminLayout>} />
          <Route path="/admin/recordings" element={<AdminLayout><RecordingsPage /></AdminLayout>} />
          <Route path="/admin/scheduled" element={<AdminLayout><MeetingsPage /></AdminLayout>} />
          <Route path="/admin/participants" element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path="/admin/analytics" element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><SettingsPage /></AdminLayout>} />

          {/* Super Admin Routes */}
          <Route path="/nexus-super-portal" element={<SuperAdminLayout><SuperAdminDashboard /></SuperAdminLayout>} />
          <Route path="/nexus-super-portal/users" element={<SuperAdminLayout><SuperAdminUsers /></SuperAdminLayout>} />
          <Route path="/nexus-super-portal/plans" element={<SuperAdminLayout><SuperAdminPlans /></SuperAdminLayout>} />
          <Route path="/nexus-super-portal/analytics" element={<SuperAdminLayout><SuperAdminAnalytics /></SuperAdminLayout>} />
          <Route path="/nexus-super-portal/logs" element={<SuperAdminLayout><SuperAdminLogs /></SuperAdminLayout>} />
          <Route path="/nexus-super-portal/config" element={<SuperAdminLayout><SuperAdminConfig /></SuperAdminLayout>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter >
  );
}
