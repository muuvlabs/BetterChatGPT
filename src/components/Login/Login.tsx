import { useState } from 'react';

const Login = () => {
  const defaultApi = new URL(import.meta.env.VITE_DEFAULT_API_ENDPOINT)
  const welcomeMessage = import.meta.env.VITE_DEFAULT_WELCOME_MESSAGE
  const loginMessage = import.meta.env.VITE_DEFAULT_LOGIN_MESSAGE
  const [isLoading, setIsLoading] = useState(false);

  const handleOnClick = () => {
    setIsLoading(true);
    defaultApi.pathname = defaultApi.hostname.startsWith('api.')
      ? '/login'
      : '/api/login'
    window.location.href = defaultApi.toString();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-800">
      <img src="https://vi.co/wp-content/uploads/2019/04/cropped-vi-logo-black512.png" alt="Vi Logo" width={75} />
      <div className="mb-2 text-center">{welcomeMessage}</div>
      <div className="mb-4 text-center">{loginMessage}</div>
      <button
        onClick={handleOnClick}
        className="btn relative btn-primary px-4 py-2 rounded"
        disabled={isLoading}
      >
        {isLoading ? 'Logging in...' : 'Log In'}
      </button>
    </div>
  );
}

export default Login