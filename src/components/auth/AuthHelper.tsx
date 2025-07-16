import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { setAuthToken, setBaseUrl, isAuthenticated } from '@/utils/auth';
import { CheckCircle, AlertCircle, Key, Globe } from 'lucide-react';

const AuthHelper = () => {
  const handleSetCredentials = () => {
        // Reload the page to apply the authentication
    window.location.reload();
  };

  const authenticated = isAuthenticated();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {authenticated ? (
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-orange-600" />
          )}
          Authentication Helper
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">Status:</span>
            <span className={`text-sm ${authenticated ? 'text-emerald-600' : 'text-orange-600'}`}>
              {authenticated ? 'Authenticated' : 'Not Authenticated'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium">Base URL:</span>
            <span className="text-sm text-gray-600">
              https://staging.api.ocw.sebipay.com/api/v4
            </span>
          </div>
        </div>
        
        {!authenticated && (
          <Button 
            onClick={handleSetCredentials}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            Set Credentials & Authenticate
          </Button>
        )}
        
        {authenticated && (
          <div className="text-sm text-emerald-600 bg-emerald-50 p-3 rounded-lg">
            ✓ Successfully authenticated! You can now access all protected routes.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthHelper; 