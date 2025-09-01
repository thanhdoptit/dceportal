import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import AppLayout from './components/layout/AppLayout';
import ShiftSelector from './components/ShiftSelector';
import TaskPage from './pages/TaskPage';
import ManagerOverview from './pages/manager/ManagerOverview';
import HandoverPage from './pages/HandoverPage';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { SidebarProvider } from './contexts/SidebarContext';
import HandoverDetailPage from './pages/HandoverDetailPage';
import CreateHandoverPage from './pages/CreateHandoverPage';
import DeviceCheckFormPage from './pages/DeviceCheckFormPage';
import MyShiftsPage from './pages/MyShiftsPage';
import UserManagementPage from './pages/manager/UserManagementPage';
import SettingsPage from './pages/manager/SettingsPage';
import './styles/TimePicker.css';
import DevicePage from './pages/DevicePage';
import TapePage from './pages/TapePage';
import ExportCheckPage from './pages/ExportCheckPage';
import PartnerPage from './pages/PartnerPage';
import SystemInfoPage from './pages/SystemInfoPage';
import SystemInfoManagerPage from './pages/SystemInfoManagerPage';
import SystemInfoEditPage from './pages/SystemInfoEditPage';
import DatacenterFAQ from './pages/DatacenterFAQ.jsx';
import { CoolingSystemPage } from './System/cooling';
import CoolingSystemVancanhPage from './System/cooling-vancanh';
import VanCanhOverviewPage from './System/vancanh-overview';
import DataCenterMenuPage from './System/DataCenterMenuPage';
import ShiftSchedulePage from './pages/ShiftSchedulePage';
import ShiftScheduleDemo from './pages/ShiftScheduleDemo';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  console.log('ProtectedRoute - Token:', !!token);
  console.log('ProtectedRoute - User:', !!user);
  console.log('ProtectedRoute - Current path:', window.location.pathname);

  if (!token || !user) {
    // Xóa dữ liệu không hợp lệ
    localStorage.clear();
    console.log('ProtectedRoute - Redirecting to login: No token or user');
    return <Navigate to="/login" />;
  }

  try {
    // Kiểm tra user data có hợp lệ không
    const userData = JSON.parse(user);
    console.log('ProtectedRoute - User data:', userData);
    
    // Kiểm tra quyền truy cập theo path
    const path = window.location.pathname;
    const role = userData.role.toLowerCase();
    console.log('ProtectedRoute - Path:', path, 'Role:', role);

    if (path.startsWith('/manager') && role !== 'manager' && role !== 'admin') {
      console.log('ProtectedRoute - Redirecting to login: Manager access denied');
      return <Navigate to="/login" />;
    }

    if (path.startsWith('/dc') && role !== 'datacenter') {
      console.log('ProtectedRoute - Redirecting to login: Datacenter access denied');
      return <Navigate to="/login" />;
    }

    if (path.startsWith('/be') && role !== 'be') {
      console.log('ProtectedRoute - Redirecting to login: BE access denied');
      return <Navigate to="/login" />;
    }

    console.log('ProtectedRoute - Access granted');
    return children;
  } catch (err) {
    console.error('Invalid user data:', err);
    localStorage.clear();
    return <Navigate to="/login" />;
  }
};

function App() {
  return (
    <AuthProvider>
      <ConfigProvider>
        <Router>
          <SidebarProvider>
            <Routes>
            {/* Login page */}
            <Route path="/login" element={<Login />} />

            {/* Protected layout dùng chung */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dc/shifts" />} />
              
              {/* Routes cho DataCenter */}
              <Route path="dc">
                <Route path="shifts" element={<ShiftSelector />} />
                <Route path="handover" element={<HandoverPage />} />
                <Route path="handover/create" element={<CreateHandoverPage />} />
                <Route path="handover/edit/:id" element={<CreateHandoverPage />} />
                <Route path="handover/:id" element={<HandoverDetailPage />} />
                <Route path="devices" element={<DevicePage />} />
                <Route path="tasks" element={<TaskPage />} />
                <Route path="partners" element={<PartnerPage />} />
                <Route path="my-shifts" element={<MyShiftsPage />} />
                <Route path="my-shifts/create" element={<DeviceCheckFormPage />} />
                <Route path="my-shifts/:id" element={<DeviceCheckFormPage />} />
                <Route path="my-shifts/edit/:id" element={<DeviceCheckFormPage />} />
                <Route path="tape" element={<TapePage />} />
                <Route path="export-check" element={<ExportCheckPage />} />
                <Route path="system-info" element={<SystemInfoPage />} />
                <Route path="system-info/:systemType" element={<SystemInfoPage />} />
                <Route path="system-info-manager" element={<SystemInfoManagerPage />} />
                <Route path="system-info/edit/:id" element={<SystemInfoEditPage />} />
                <Route path="faq" element={<DatacenterFAQ />} />
                <Route path="cooling-system" element={<CoolingSystemPage />} />
                <Route path="cooling-system-vancanh" element={<CoolingSystemVancanhPage />} />
                <Route path="vancanh-overview" element={<VanCanhOverviewPage />} />
                <Route path="datacenter-menu" element={<DataCenterMenuPage />} />
                <Route path="shift-schedule" element={<ShiftSchedulePage />} />
              </Route>

              {/* Routes cho Manager */}
              <Route path="manager">
                <Route path="overview" element={<ManagerOverview />} />
                <Route path="shifts" element={<ShiftSelector />} />
                <Route path="handovers" element={<HandoverPage />} />
                <Route path="handovers/:id" element={<HandoverDetailPage />} />
                <Route path="users" element={<UserManagementPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="tasks" element={<TaskPage />} />
                <Route path="devices" element={<DevicePage />} />
                <Route path="partners" element={<PartnerPage />} />
                <Route path="tape" element={<TapePage />} />
                <Route path="system-info" element={<SystemInfoPage />} />
                <Route path="system-info/:systemType" element={<SystemInfoPage />} />
                <Route path="system-info-manager" element={<SystemInfoManagerPage />} />
                <Route path="system-info/edit/:id" element={<SystemInfoEditPage />} />
                <Route path="cooling-system" element={<CoolingSystemPage />} />
                <Route path="cooling-system-vancanh" element={<CoolingSystemVancanhPage />} />
                <Route path="vancanh-overview" element={<VanCanhOverviewPage />} />
                <Route path="datacenter-menu" element={<DataCenterMenuPage />} />
                <Route path="shift-schedule" element={<ShiftSchedulePage />} />
              </Route>

              {/* Routes cho BE */}
              <Route path="be">
                <Route path="shifts" element={<ShiftSelector />} />
                <Route path="my-shifts" element={<MyShiftsPage />} />
                <Route path="handover" element={<HandoverPage />} />
                <Route path="partners" element={<PartnerPage />} />
                <Route path="system-info" element={<SystemInfoPage />} />
                <Route path="system-info/:systemType" element={<SystemInfoPage />} />
                <Route path="system-info-manager" element={<SystemInfoManagerPage />} />
                <Route path="system-info/edit/:id" element={<SystemInfoEditPage />} />
                <Route path="cooling-system" element={<CoolingSystemPage />} />
                <Route path="cooling-system-vancanh" element={<CoolingSystemVancanhPage />} />
                <Route path="vancanh-overview" element={<VanCanhOverviewPage />} />
                <Route path="datacenter-menu" element={<DataCenterMenuPage />} />
                <Route path="shift-schedule" element={<ShiftSchedulePage />} />
              </Route>

              <Route path="profile" element={<UserProfile />} />
            </Route>

            {/* Demo route */}
            <Route path="demo/shift-schedule" element={<ShiftScheduleDemo />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
          </SidebarProvider>
        </Router>
      </ConfigProvider>
    </AuthProvider>
  );
}

export default App;
