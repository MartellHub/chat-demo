import { useState } from 'react';

import './App.css';
import Home from './appComponent/Home';
import Chat from './chatComponents/Chat';
import Footer from './Footer';

function App() {
  const isLoggedIn = false;

  return (
    <div className='min-h-screen flex flex-col'>
      <header className=' sticky flex justify-between border-b p-4'>
        <div>Logo</div>
        <button> Sing in </button>
      </header>
      <div className=' flex flex-1'>{isLoggedIn ? <Chat /> : <Home />}</div>
      <div className='flex border-t'>
        <Footer />
      </div>
    </div>
  );
}

export default App;
