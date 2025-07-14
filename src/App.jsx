import './App.css'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from "@/components/ui/toaster"
import { useEffect } from 'react'
import { notifyReady, listenToParent } from '@/utils/iframeCommunication'
import { handleAuthParams } from '@/utils/auth'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import Layout from '@/pages/Layout'

// Import pages
import Dashboard from '@/pages/Dashboard'
import Accounts from '@/pages/Accounts'
import Transactions from '@/pages/Transactions'
import Categories from '@/pages/Categories'
import Rules from '@/pages/Rules'
import Entity from '@/pages/Entity'
import Import from '@/pages/Import'
import API from '@/pages/API'
import Unauthorized from '@/pages/Unauthorized'
import AuthTest from '@/pages/AuthTest'

function App() {
  const location = useLocation();

  useEffect(() => {
    // Handle authentication parameters from URL
    handleAuthParams(location.search);
    
    // Notify parent that iframe is ready
    notifyReady();
    
    // Listen for messages from parent
    const cleanup = listenToParent((message) => {
      console.log('Received message from parent:', message);
      // Handle parent messages here if needed
    });
    
    return cleanup;
  }, [location.search]);

  return (
    <>
      <Routes>
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/accounts"
          element={
            <ProtectedRoute>
              <Layout>
                <Accounts />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Layout>
                <Transactions />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Layout>
                <Categories />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/rules"
          element={
            <ProtectedRoute>
              <Layout>
                <Rules />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/entity"
          element={
            <ProtectedRoute>
              <Layout>
                <Entity />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/import"
          element={
            <ProtectedRoute>
              <Layout>
                <Import />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/api"
          element={
            <ProtectedRoute>
              <Layout>
                <API />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/auth-test"
          element={
            <ProtectedRoute>
              <Layout>
                <AuthTest />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App 