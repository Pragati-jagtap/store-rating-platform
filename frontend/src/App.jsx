import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Shared layout
import AppLayout from './components/AppLayout';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminStores from './pages/admin/AdminStores';
import AddStore from './pages/admin/AddStore';
import AddUser from './pages/admin/AddUser';
import UserDetail from './pages/admin/UserDetail';

// Normal user pages
import UserStores from './pages/user/UserStores';

// Store owner pages
import OwnerDashboard from './pages/owner/OwnerDashboard';

// Shared pages
import NotificationsPage from './pages/shared/NotificationsPage';
import SecurityPage from './pages/shared/SecurityPage';
import SettingsPage from './pages/shared/SettingsPage';

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/unauthorized" replace />;
  return children;
}

function RoleHome() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'STORE_OWNER') return <Navigate to="/owner/dashboard" replace />;
  return <Navigate to="/stores" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<RoleHome />} />

          {/* Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['ADMIN']}>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/add" element={<AddUser />} />
            <Route path="users/:id" element={<UserDetail />} />
            <Route path="stores" element={<AdminStores />} />
            <Route path="stores/add" element={<AddStore />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="security" element={<SecurityPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Normal user routes */}
          <Route path="/stores" element={
            <ProtectedRoute roles={['USER']}>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route index element={<UserStores />} />
          </Route>
          <Route path="/user" element={
            <ProtectedRoute roles={['USER']}>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="security" element={<SecurityPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Store owner routes */}
          <Route path="/owner" element={
            <ProtectedRoute roles={['STORE_OWNER']}>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<OwnerDashboard />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="security" element={<SecurityPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route path="/unauthorized" element={
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <h2>403 – Access Denied</h2>
              <p>You don't have permission to view this page.</p>
            </div>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
