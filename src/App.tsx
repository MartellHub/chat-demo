import { useState } from 'react'

import './App.css'
import Home from './appComponent/Home';
import Chat from './chatComponents/Chat';

function App() {

  const isLoggedIn = true;

  return (
    <div className="min-h-screen flex flex-col">
      <header className=" sticky flex justify-between border-b p-4">
        <div>Logo</div>
      <button> Sing in </button>
      </header>
      {isLoggedIn ? <Chat /> : <Home />}
    </div>
  )
}

export default App
