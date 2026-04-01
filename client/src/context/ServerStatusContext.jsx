import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const ServerStatusContext = createContext(null);

export const ServerStatusProvider = ({ children }) => {
  const [isServerDown, setIsServerDown] = useState(false);

  useEffect(() => {
    const handleDown = () => setIsServerDown(true);
    const handleUp = () => setIsServerDown(false);

    window.addEventListener('server-down', handleDown);
    window.addEventListener('server-up', handleUp);

    // Initial simple ping to check server connection
    // this will hit the interceptor if it fails
    api.get('/').catch(() => {});

    return () => {
      window.removeEventListener('server-down', handleDown);
      window.removeEventListener('server-up', handleUp);
    };
  }, []);

  // Poll the server when it's down to automatically detect when it comes back up
  useEffect(() => {
    let interval;
    if (isServerDown) {
      // Check every 5 seconds
      interval = setInterval(() => {
        api.get('/').catch(() => {});
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isServerDown]);

  return (
    <ServerStatusContext.Provider value={{ isServerDown }}>
      {children}
    </ServerStatusContext.Provider>
  );
};

export const useServerStatus = () => useContext(ServerStatusContext);
