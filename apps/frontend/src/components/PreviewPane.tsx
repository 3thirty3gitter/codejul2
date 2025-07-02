import React from 'react';

export default function PreviewPane() {
  return (
    <div className='bg-gray-900 border border-gray-800 rounded-lg h-full w-full flex flex-col'>
      <div className='px-4 py-2 bg-gray-800 text-white font-semibold rounded-t-lg'>
        Live Preview
      </div>
      <div className='flex-1 flex items-center justify-center text-gray-400'>
        {/* Replace this with an iframe or dynamic preview in the future */}
        <span>Preview output will appear here.</span>
      </div>
    </div>
  );
}
