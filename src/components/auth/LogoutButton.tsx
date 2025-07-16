import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { clearAuth } from '@/utils/auth';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/unauthorized');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="text-gray-500 hover:text-gray-900"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </Button>
  );
};

export default LogoutButton; 