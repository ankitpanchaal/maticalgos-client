import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export const useLogout = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const logout = async () => {
    if(isLoading) return;
    setIsLoading(true);
    
    return toast.promise(
      (async () => {
        try {
          const response = await fetch('/api/user/login', {
            method: 'DELETE',
            credentials: 'include',
          });

          if (!response.ok) {
            throw new Error('Logout failed');
          }

          router.push('/');
        } catch (error) {
          console.error('Logout error:', error);
          throw error; // Re-throw the error so toast can catch it
        } finally {
          setIsLoading(false);
        }
      })(),
      {
        loading: 'Logging out...',
        success: 'Logged out successfully',
        error: 'Failed to logout',
      }
    );
  };

  return { logout, isLoading };
};