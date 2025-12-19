import { useState } from 'react';

import './App.css';
import Header from './appComponent/header';
import Home from './appComponent/Home';
import Chat from './chatComponents/Chat';
import Footer from './appComponent/Footer';

function App() {
  const isLoggedIn = true;

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <div className=' flex flex-1'>{isLoggedIn ? <Chat /> : <Home />}</div>
      <div className='flex border-t'>
        <Footer />
      </div>
    </div>
  );
}

export default App;
