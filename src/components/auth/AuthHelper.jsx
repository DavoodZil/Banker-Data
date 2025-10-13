import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  setAuthToken,
  setBaseUrl,
  isAuthenticated,
  getBaseUrl,
} from '@/utils/auth';
import { CheckCircle, AlertCircle, Key, Globe } from 'lucide-react';

const AuthHelper = () => {
  const handleSetCredentials = () => {
    // Reload the page to apply the authentication
    window.location.reload();
  };

  const authenticated = isAuthenticated();
  const baseUrl = getBaseUrl();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {authenticated ? (
            <CheckCircle className="w-5 h-5 text-common-green" />
          ) : (
            <AlertCircle className="w-5 h-5 text-common-orange" />
          )}
          Authentication Helper
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-common-blue" />
            <span className="text-sm font-medium">Status:</span>
            <span
              className={`text-sm ${authenticated ? 'text-common-green' : 'text-common-orange'}`}
            >
              {authenticated ? 'Authenticated' : 'Not Authenticated'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium">Base URL:</span>
            <span className="text-sm text-common-gray-dark">{baseUrl}</span>
          </div>
        </div>

        {!authenticated && (
          <Button
            onClick={handleSetCredentials}
            className="w-full bg-common-green hover:bg-common-green-dark"
          >
            Set Credentials & Authenticate
          </Button>
        )}

        {authenticated && (
          <div className="text-sm text-common-green bg-common-green-secondary p-3 rounded-lg">
            ✓ Successfully authenticated! You can now access all protected
            routes.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthHelper;








