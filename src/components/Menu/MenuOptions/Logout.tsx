import React, { useState } from 'react';
import LogoutIcon from '@icon/LogoutIcon';

const Logout = () => {
  const defaultApi = new URL(import.meta.env.VITE_DEFAULT_API_ENDPOINT)
  const [isLoading, setIsLoading] = useState(false);
  const handleOnClick = () => {
    setIsLoading(true);
    defaultApi.pathname = defaultApi.hostname.startsWith('api.')
      ? '/logout'
      : '/api/logout'
    window.location.href = defaultApi.toString();
  };

  return (
    <a 
      className='flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm'
      onClick={handleOnClick}
    >
      <LogoutIcon />
      {isLoading ? 'Logging out...' : 'Log out'}
    </a>
  );
};

export default Logout;
