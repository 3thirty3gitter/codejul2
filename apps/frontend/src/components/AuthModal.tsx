import React, { useState } from 'react';

export default function AuthModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const [isSignUp, setIsSignUp] = useState(false);

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
          {isSignUp ? 'Sign Up for CodePilot' : 'Sign In to CodePilot'}
        </h2>
        <form className='flex flex-col gap-4'>
          <input
            type='email'
            placeholder='Email'
            className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary'
            required
          />
          <input
            type='password'
            placeholder='Password'
            className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary'
            required
          />
          {isSignUp && (
            <input
              type='password'
              placeholder='Confirm Password'
              className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary'
              required
            />
          )}
          <button
            type='submit'
            className='bg-primary text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-700 transition'
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>
        <div className='text-center mt-4'>
          <button
            type='button'
            className='text-primary font-medium hover:underline'
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp
              ? 'Already have an account? Sign In'
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
