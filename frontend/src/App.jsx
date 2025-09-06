import { ConfigProvider } from 'antd';
import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import DataCenterMenuPage from './System/DataCenterMenuPage';
import CoolingSystemPage from './System/cooling';
import CoolingSystemVancanhPage from './System/cooling-vancanh';
import ElectricSystemVancanhPage from './System/electric-vancanh';
import UPSHoalacPage from './System/ups-hoalac';
import { UPSSystemPage } from './System/ups-vancanh';
import VanCanhOverviewPage from './System/vancanh-overview';
import ShiftSelector from './components/ShiftSelector';
import AppLayout from './components/layout/AppLayout';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { SidebarProvider } from './contexts/SidebarContext';
import CreateHandoverPage from './pages/CreateHandoverPage';
import DatacenterFAQ from './pages/DatacenterFAQ.jsx';
import DeviceCheckFormPage from './pages/DeviceCheckFormPage';
import DevicePage from './pages/DevicePage';
import ExportCheckPage from './pages/ExportCheckPage';
import HandoverDetailPage from './pages/HandoverDetailPage';
import HandoverPage from './pages/HandoverPage';
import Login from './pages/Login';
import MyShiftsPage from './pages/MyShiftsPage';
import PartnerPage from './pages/PartnerPage';
import ShiftScheduleDemo from './pages/ShiftScheduleDemo';
import ShiftSchedulePage from './pages/ShiftSchedulePage';
import SystemInfoEditPage from './pages/SystemInfoEditPage';
import SystemInfoManagerPage from './pages/SystemInfoManagerPage';
import SystemInfoPage from './pages/SystemInfoPage';
import TapePage from './pages/TapePage';
import TaskPage from './pages/TaskPage';
import UserProfile from './pages/UserProfile';
import ManagerOverview from './pages/manager/ManagerOverview';
import SettingsPage from './pages/manager/SettingsPage';
import UserManagementPage from './pages/manager/UserManagementPage';
import './styles/TimePicker.css';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token || !user) {
    // Xóa dữ liệu không hợp lệ
    localStorage.clear();
    return <Navigate to='/login' />;
  }

  try {
    // Kiểm tra user data có hợp lệ không
    const userData = JSON.parse(user);

    // Kiểm tra quyền truy cập theo path
    const path = window.location.pathname;
    const role = userData.role.toLowerCase();

    if (path.startsWith('/manager') && role !== 'manager' && role !== 'admin') {
      return <Navigate to='/login' />;
    }

    if (path.startsWith('/dc') && role !== 'datacenter') {
      return <Navigate to='/login' />;
    }

    if (path.startsWith('/be') && role !== 'be') {
      return <Navigate to='/login' />;
    }

    return children;
  } catch (err) {
    console.error('Invalid user data:', err);
    localStorage.clear();
    return <Navigate to='/login' />;
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
              <Route path='/login' element={<Login />} />

              {/* Protected layout dùng chung */}
              <Route
                path='/'
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to='/dc/shifts' />} />

                {/* Routes cho DataCenter */}
                <Route path='dc'>
                  <Route path='shifts' element={<ShiftSelector />} />
                  <Route path='handover' element={<HandoverPage />} />
                  <Route path='handover/create' element={<CreateHandoverPage />} />
                  <Route path='handover/edit/:id' element={<CreateHandoverPage />} />
                  <Route path='handover/:id' element={<HandoverDetailPage />} />
                  <Route path='devices' element={<DevicePage />} />
                  <Route path='tasks' element={<TaskPage />} />
                  <Route path='partners' element={<PartnerPage />} />
                  <Route path='my-shifts' element={<MyShiftsPage />} />
                  <Route path='my-shifts/create' element={<DeviceCheckFormPage />} />
                  <Route path='my-shifts/:id' element={<DeviceCheckFormPage />} />
                  <Route path='my-shifts/edit/:id' element={<DeviceCheckFormPage />} />
                  <Route path='tape' element={<TapePage />} />
                  <Route path='export-check' element={<ExportCheckPage />} />
                  <Route path='system-info' element={<SystemInfoPage />} />
                  <Route path='system-info/:systemType' element={<SystemInfoPage />} />
                  <Route path='system-info-manager' element={<SystemInfoManagerPage />} />
                  <Route path='system-info/edit/:id' element={<SystemInfoEditPage />} />
                  <Route path='faq' element={<DatacenterFAQ />} />
                  <Route path='cooling-system' element={<CoolingSystemPage />} />
                  <Route path='cooling-system-vancanh' element={<CoolingSystemVancanhPage />} />
                  <Route path='ups-vancanh' element={<UPSSystemPage />} />
                  <Route path='ups-hoalac' element={<UPSHoalacPage />} />
                  <Route path='electric-vancanh' element={<ElectricSystemVancanhPage />} />
                  <Route path='vancanh-overview' element={<VanCanhOverviewPage />} />
                  <Route path='datacenter-menu' element={<DataCenterMenuPage />} />
                  <Route path='shift-schedule' element={<ShiftSchedulePage />} />
                </Route>

                {/* Routes cho Manager */}
                <Route path='manager'>
                  <Route path='overview' element={<ManagerOverview />} />
                  <Route path='shifts' element={<ShiftSelector />} />
                  <Route path='handovers' element={<HandoverPage />} />
                  <Route path='handovers/:id' element={<HandoverDetailPage />} />
                  <Route path='users' element={<UserManagementPage />} />
                  <Route path='settings' element={<SettingsPage />} />
                  <Route path='tasks' element={<TaskPage />} />
                  <Route path='devices' element={<DevicePage />} />
                  <Route path='partners' element={<PartnerPage />} />
                  <Route path='tape' element={<TapePage />} />
                  <Route path='system-info' element={<SystemInfoPage />} />
                  <Route path='system-info/:systemType' element={<SystemInfoPage />} />
                  <Route path='system-info-manager' element={<SystemInfoManagerPage />} />
                  <Route path='system-info/edit/:id' element={<SystemInfoEditPage />} />
                  <Route path='cooling-system' element={<CoolingSystemPage />} />
                  <Route path='cooling-system-vancanh' element={<CoolingSystemVancanhPage />} />
                  <Route path='ups-vancanh' element={<UPSSystemPage />} />
                  <Route path='ups-hoalac' element={<UPSHoalacPage />} />
                  <Route path='electric-vancanh' element={<ElectricSystemVancanhPage />} />
                  <Route path='vancanh-overview' element={<VanCanhOverviewPage />} />
                  <Route path='datacenter-menu' element={<DataCenterMenuPage />} />
                  <Route path='shift-schedule' element={<ShiftSchedulePage />} />
                </Route>

                {/* Routes cho BE */}
                <Route path='be'>
                  <Route path='shifts' element={<ShiftSelector />} />
                  <Route path='my-shifts' element={<MyShiftsPage />} />
                  <Route path='handover' element={<HandoverPage />} />
                  <Route path='partners' element={<PartnerPage />} />
                  <Route path='system-info' element={<SystemInfoPage />} />
                  <Route path='system-info/:systemType' element={<SystemInfoPage />} />
                  <Route path='system-info-manager' element={<SystemInfoManagerPage />} />
                  <Route path='system-info/edit/:id' element={<SystemInfoEditPage />} />
                  <Route path='cooling-system' element={<CoolingSystemPage />} />
                  <Route path='cooling-system-vancanh' element={<CoolingSystemVancanhPage />} />
                  <Route path='ups-vancanh' element={<UPSSystemPage />} />
                  <Route path='ups-hoalac' element={<UPSHoalacPage />} />
                  <Route path='electric-vancanh' element={<ElectricSystemVancanhPage />} />
                  <Route path='vancanh-overview' element={<VanCanhOverviewPage />} />
                  <Route path='datacenter-menu' element={<DataCenterMenuPage />} />
                  <Route path='shift-schedule' element={<ShiftSchedulePage />} />
                </Route>

                <Route path='profile' element={<UserProfile />} />
              </Route>

              {/* Demo route */}
              <Route path='demo/shift-schedule' element={<ShiftScheduleDemo />} />

              {/* Fallback */}
              <Route path='*' element={<Navigate to='/login' />} />
            </Routes>
          </SidebarProvider>
        </Router>
      </ConfigProvider>
    </AuthProvider>
  );
}

export default App;
