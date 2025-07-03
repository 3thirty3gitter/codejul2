import React, { useEffect } from "react";

export default function Notification({ message, onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-2xl z-50 animate-fade-in">
      {message}
    </div>
  );
}
