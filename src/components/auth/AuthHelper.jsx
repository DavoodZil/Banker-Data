import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { setAuthToken, setBaseUrl, isAuthenticated } from '@/utils/auth';
import { CheckCircle, AlertCircle, Key, Globe } from 'lucide-react';

const AuthHelper = () => {
  const handleSetCredentials = () => {
    // Set the provided token and base URL
    setAuthToken('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxMDE5IiwianRpIjoiOTM3YmEzMTZiZTQ3YWQ5NjhmMTFkMTkzMWEzNjc3Nzg0MDE4Yjg1ZDE1NTk0NjUxZWYzN2UxMTk4NmMyYmVmNzkxMzZiNDRkYWRhZDc4YWUiLCJpYXQiOjE3NTI0NzQ0MDcuNTQwOTkzLCJuYmYiOjE3NTI0NzQ0MDcuNTQwOTU1LCJleHAiOjE3NTI1MTA0MDcuNTM0MDY4LCJzdWIiOiIxMjAxMTEiLCJzY29wZXMiOltdfQ.ZpU8FW46KwKCuP8SfT39fGp7_qfd47w3UhT7Du5T1KjlvCtYFZBpQMhFq8M7mbJyBeY9DJw7mLU0FYm8HV-pJ6vitRmk8g47IsIEfcQVTm-TidyPx4PVy5nUDitosl1o3UpfbicmzaXPuUXOf24i0G8ZC_saUWCz1C_qUdXJ2gggWHPOsQsTRDIvqTouq9SuqlTHMSoGtLzHNL_B0c8LZrtzg2ZNXLxH-r97_rzixjJCJ2ecKTubH-kC3S_Qpbmj25ZRKVUF9RBh3B2evlmWHLZA2Il-mMhIltUsCgoqN8OuagXPphp8cKw_VB8GvdLHIxJJdV1dUorCbe103swHcJKDfesFIJDmyzXwHdou_WyODOQiFyTja2fyUbgRUHYdjx9USJhYwOtb5cj5V10x56M-z6uCVTr_TuT6cNu2NdX8pTGDZHZXLFMU85cq_6QyLPzxALnUUO7oJ6A_TpJ5Goa00pWzlhOSrfRdfKCRZmPFOpMAE4340uZE83lhFqmRzeE9_0ZgB0zqbV8c2tAeMmgXd9HBLHvXIg7VtJEczL3JDSgJ4UYioWWiAbp0dSMnAhzTA6dypWuZEnvIoKw66NLzZ7d797_zAbcOhe-dZxaN72BjkzRmAbpG513CAWiFF8BcRj3n4HbmrAx0Z3CqKpE-CdUVSy4BMbx08hnBJz8');
    setBaseUrl('https://staging.api.ocw.sebipay.com/api/v4');
    
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