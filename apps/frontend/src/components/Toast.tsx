import React from 'react';

export default function Toast({ message, show }: { message: string, show: boolean }) {
  if (!show) return null;
  return (
    <div className='fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50 border border-primary animate-fade-in'>
      {message}
    </div>
  );
}
