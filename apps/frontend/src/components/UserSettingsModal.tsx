import React, { useState } from 'react';

export default function UserSettingsModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const [username, setUsername] = useState('Trent');
  const [email, setEmail] = useState('trent@example.com');
  const [darkMode, setDarkMode] = useState(true);

  if (!open) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-xl shadow-lg w-full max-w-md p-8 relative'>
        <button
          className='absolute top-3 right-3 text-gray-400 hover:text-gray-700'
          onClick={onClose}
          aria-label='Close'
        >
          <svg className='h-6 w-6' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
          </svg>
        </button>
        <h2 className='text-2xl font-bold text-gray-900 mb-6 text-center'>
          User Settings
        </h2>
        <form className='flex flex-col gap-4'>
          <input
            type='text'
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder='Username'
            className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary'
          />
          <input
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder='Email'
            className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary'
          />
          <label className='flex items-center gap-2'>
            <input
              type='checkbox'
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className='form-checkbox'
            />
            <span>Enable dark mode</span>
          </label>
          <button
            type='submit'
            className='bg-primary text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-700 transition'
            onClick={e => { e.preventDefault(); onClose(); }}
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
