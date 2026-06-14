import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './ui/AppLayout.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { ResourcePage } from './pages/ResourcePage.jsx';
import { CustomerDetailPage } from './pages/CustomerDetailPage.jsx';
import { EmailPage } from './pages/EmailPage.jsx';
import { AIControlPage } from './pages/AIControlPage.jsx';
import { ReportsPage } from './pages/ReportsPage.jsx';
import { WorkflowsPage } from './pages/WorkflowsPage.jsx';
import { SettingsPage } from './pages/SettingsPage.jsx';
import { useAuthStore } from './stores/authStore.js';

function Protected({ children }) {
  const user = useAuthStore((state) => state.user);
  return user ? children : <Navigate to="/login" replace />;
}

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    path: '/',
    element: (
      <Protected>
        <AppLayout />
      </Protected>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'users', element: <ResourcePage resource="users" /> },
      { path: 'customers', element: <ResourcePage resource="customers" /> },
      { path: 'customers/:id', element: <CustomerDetailPage /> },
      { path: 'emails', element: <EmailPage /> },
      { path: 'meetings', element: <ResourcePage resource="meetings" /> },
      { path: 'invoices', element: <ResourcePage resource="invoices" /> },
      { path: 'tickets', element: <ResourcePage resource="tickets" /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'crm', element: <ResourcePage resource="crm" /> },
      { path: 'workflows', element: <WorkflowsPage /> },
      { path: 'ai-control', element: <AIControlPage /> },
      { path: 'settings', element: <SettingsPage /> }
    ]
  }
]);
