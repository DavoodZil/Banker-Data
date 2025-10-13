import './App.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { useEffect } from 'react';
import { notifyReady, listenToParent } from '@/utils/iframeCommunication';
import { handleAuthParams, clearAuth } from '@/utils/auth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Layout from '@/pages/Layout';

// Import all pages
import Dashboard from '@/pages/Dashboard';
import Accounts from '@/pages/Accounts';
import Transactions from '@/pages/Transactions';
import Categories from '@/pages/Categories';
import Rules from '@/pages/Rules';
import RulesList from '@/pages/RulesList';
import Entity from '@/pages/Entity';
import Import from '@/pages/Import';
import API from '@/pages/API';
import Unauthorized from '@/pages/Unauthorized';
import AuthTest from '@/pages/AuthTest';
import Reports from '@/pages/Reports';
import Merchants from '@/pages/Merchants';
import Goals from '@/pages/Goals';
import GoalsList from '@/pages/GoalsList';
import CashFlow from '@/pages/CashFlow';
import Budget from '@/pages/Budget';
import Tag from '@/pages/Tag';
import TagsList from '@/pages/TagsList';
import Group from '@/pages/Group';

// Route configuration
const routes = [
  { path: '/', component: Dashboard },
  { path: '/dashboard', component: Dashboard },
  { path: '/accounts', component: Accounts },
  { path: '/transactions', component: Transactions },
  { path: '/categories', component: Categories },
  { path: '/rules', component: RulesList },
  { path: '/rules/create', component: Rules },
  { path: '/rules/edit/:id', component: Rules },
  { path: '/merchants', component: Merchants },
  { path: '/reports', component: Reports },
  { path: '/goals', component: GoalsList },
  { path: '/cashflow', component: CashFlow },
  { path: '/budget', component: Budget },
  { path: '/tag', component: Tag },
  { path: '/tags', component: TagsList },
  { path: '/entity', component: Entity },
  { path: '/group', component: Group },
  { path: '/import', component: Import },
  { path: '/api', component: API },
  { path: '/auth-test', component: AuthTest },
];

// Helper component for protected routes
const ProtectedRouteWrapper = ({ component: Component }) => (
  <ProtectedRoute>
    <Layout>
      <Component />
    </Layout>
  </ProtectedRoute>
);

function App() {
  const location = useLocation();

  useEffect(() => {
    handleAuthParams(location.search);

    notifyReady();

    const cleanup = listenToParent(message => {
      if (message.action === 'logout' || message.action === 'auth:logout') {
        clearAuth();
        window.location.href = '/unauthorized';
      }
    });

    return cleanup;
  }, [location.search]);

  return (
    <>
      <Routes>
        {/* Unauthorized route */}
        <Route path='/unauthorized' element={<Unauthorized />} />

        {/* Protected routes */}
        {routes.map(({ path, component }) => (
          <Route
            key={path}
            path={path}
            element={<ProtectedRouteWrapper component={component} />}
          />
        ))}

        {/* Catch-all route */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
