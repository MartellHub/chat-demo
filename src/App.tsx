
// import React from 'react';
import './App.css';

import Chat from './chatComponents/Chat';
import Home from './appComponent/Home';
import Header from './appComponent/Header';
import Footer from './appComponent/Footer';


function App() {
  const isLoggedIn = false;

  return (
    <div className="min-h-screen flex flex-col">
      {!isLoggedIn && <Header />}

      <div className="flex flex-1 overflow-hidden">
        {isLoggedIn ? <Chat /> : <Home />}
      </div>

      {!isLoggedIn && (
        <div className="border-t">
          <Footer />
        </div>
      )}
    </div>
  );
}

export default App;
