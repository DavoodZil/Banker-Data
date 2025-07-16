import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { isAuthenticated } from '@/utils/auth';
import AuthHelper from '@/components/auth/AuthHelper';

export default function Unauthorized() {
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-6">
        <div className="p-6 bg-white rounded-lg shadow-lg text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Unauthorized Access</h2>
          <p className="text-gray-600 mb-6">
            You need a valid token to access this application.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
          >
            Return to Home
          </Link>
        </div>
        
        <AuthHelper />
      </div>
    </div>
  );
}