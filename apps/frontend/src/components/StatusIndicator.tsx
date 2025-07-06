import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Wifi } from 'lucide-react';

export default function StatusIndicator() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/builder/plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            description: 'connection test',
            style: 'modern',
            target: 'web'
          })
        });
        
        if (response.ok) {
          setStatus('connected');
        } else {
          setStatus('disconnected');
        }
      } catch (error) {
        setStatus('disconnected');
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: CheckCircle,
          color: '#10B981',
          text: 'AI Builder Connected',
          bgColor: '#ECFDF5'
        };
      case 'disconnected':
        return {
          icon: AlertCircle,
          color: '#EF4444',
          text: 'Backend Disconnected',
          bgColor: '#FEF2F2'
        };
      default:
        return {
          icon: Wifi,
          color: '#6B7280',
          text: 'Checking Connection...',
          bgColor: '#F9FAFB'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div style={{
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      borderRadius: '1rem',
      backgroundColor: config.bgColor,
      color: config.color,
      fontSize: '0.8rem',
      fontWeight: '500',
      border: `1px solid ${config.color}20`,
      zIndex: 1000
    }}>
      <Icon size={14} />
      <span>{config.text}</span>
    </div>
  );
}
