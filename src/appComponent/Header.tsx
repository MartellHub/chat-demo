import React from 'react';

function header() {
    const userName = "John Doe";
  return (
    <div>
      <header className=' sticky flex justify-between border-b p-4 bg-gray-500/30'>
        <div className='flex gap-3 items-center'>
            <img src="/logo.png" alt="Logo" />
            <div>{userName}</div>
        </div>
        <button> Sing in </button>
      </header>
    </div>
  );
}

export default header;
