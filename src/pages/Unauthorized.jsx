import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { isAuthenticated } from '@/utils/auth';
import AuthHelper from '@/components/auth/AuthHelper';

export default function Unauthorized() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-common-gray-light">
      <div className="max-w-md w-full space-y-6">
        <div className="p-6 bg-white rounded-lg shadow-lg text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-common-red" />
          <h2 className="text-2xl font-bold mb-4 text-common-gray-dark">
            Unauthorized Access
          </h2>
          <p className="text-common-gray-dark mb-6">
            You need a valid token to access this application.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-common-green hover:bg-common-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-common-green transition-colors"
          >
            Return to Home
          </Link>
        </div>

        <AuthHelper />
      </div>
    </div>
  );
}








