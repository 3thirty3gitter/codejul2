import React, { useState, useEffect } from 'react';
import AIChat from './AIChat';
import { API_BASE_URL } from '@/config'; // <-- Import the correct URL

export default function WorkspaceLayout() {
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This effect now pings the CORRECT backend port from our config file.
    const checkBackendConnection = async () => {
      try {
        const response = await fetch(API_BASE_URL); // <-- Use the correct URL
        if (response.ok) {
          setIsBackendConnected(true);
        }
      } catch (error) {
        console.error("Backend connection check failed:", error);
        setIsBackendConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkBackendConnection();
  }, []);

  if (isLoading) {
    return <div className="p-4">Connecting to backend...</div>;
  }

  if (!isBackendConnected) {
    // This is the new, correct error message.
    return (
      <div className="p-4 text-red-600">
        <h2>Connection Issue</h2>
        <p>Could not connect to the CodePilot backend on <strong>{API_BASE_URL}</strong>.</p>
        <ol className="list-decimal list-inside ml-4 mt-2">
          <li>Ensure the backend server is running (`cd apps/backend` then `node server.cjs`).</li>
          <li>Check for port conflicts on port 3001.</li>
        </ol>
      </div>
    );
  }

  // If connected, render the AI Chat component.
  return (
    <div className="h-screen w-screen flex">
      <div className="flex-1 p-4">
        <AIChat />
      </div>
    </div>
  );
}
