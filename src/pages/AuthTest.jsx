import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAuthToken, getBaseUrl, isAuthenticated } from '@/utils/auth';
import { Shield, Key, Globe } from 'lucide-react';

export default function AuthTest() {
  const token = getAuthToken();
  const baseUrl = getBaseUrl();
  const authenticated = isAuthenticated();

  return (
    <div className='p-6 space-y-6 max-w-4xl mx-auto'>
      <div>
        <h1 className='text-3xl font-bold text-common-gray-dark'>
          Authentication Test
        </h1>
        <p className='text-common-gray-dark mt-1'>
          Test the authentication flow and token management
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Shield className='w-5 h-5 text-common-green' />
              Authentication Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-common-gray-dark'>Status:</span>
                <span
                  className={`text-sm font-medium ${authenticated ? 'text-common-green' : 'text-common-red'}`}
                >
                  {authenticated ? 'Authenticated' : 'Not Authenticated'}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-common-gray-dark'>
                  Token Present:
                </span>
                <span
                  className={`text-sm font-medium ${token ? 'text-common-green' : 'text-common-red'}`}
                >
                  {token ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Key className='w-5 h-5 text-common-blue' />
              Token Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-common-gray-dark'>
                  Token Length:
                </span>
                <span className='text-sm font-medium'>
                  {token ? token.length : 'N/A'}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-common-gray-dark'>
                  Token Preview:
                </span>
                <span className='text-sm font-medium font-mono'>
                  {token ? `${token.substring(0, 10)}...` : 'N/A'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Globe className='w-5 h-5 text-purple-600' />
              Base URL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-common-gray-dark'>Base URL:</span>
                <span className='text-sm font-medium'>
                  {baseUrl || 'Default'}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-common-gray-dark'>URL Set:</span>
                <span
                  className={`text-sm font-medium ${baseUrl ? 'text-common-green' : 'text-common-text-secondary'}`}
                >
                  {baseUrl ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Authentication Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div>
              <h3 className='text-lg font-medium mb-2'>How to Test:</h3>
              <ol className='list-decimal list-inside space-y-1 text-sm text-common-gray-dark'>
                <li>
                  Access the app without a token - you should be redirected to
                  /unauthorized
                </li>
                <li>
                  Add a token via URL parameter:{' '}
                  <code className='bg-common-gray-light px-1 rounded'>
                    ?token=your_token_here
                  </code>
                </li>
                <li>
                  You should now be able to access the dashboard and other pages
                </li>
                <li>Use the logout button to clear authentication</li>
              </ol>
            </div>

            <div>
              <h3 className='text-lg font-medium mb-2'>Example URLs:</h3>
              <div className='space-y-1 text-sm'>
                <div className='bg-common-gray-light p-2 rounded font-mono'>
                  http://localhost:5173/?token=test_token_123
                </div>
                <div className='bg-common-gray-light p-2 rounded font-mono'>
                  http://localhost:5173/dashboard?token=test_token_123&baseUrl=https://api.example.com
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
