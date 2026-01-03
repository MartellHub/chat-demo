import { useState } from 'react';
import UserImg from '../img/user-img.png';

import LoginModal from './LoginModal';
import SignUpModal from './SingUpModal';

function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  const companyName = 'Company Name';

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };
  const openSingUpModal = () => {
    setIsSignUpModalOpen(true);
  };

  const closeAllModals = () => {
    setIsLoginModalOpen(false);
    setIsSignUpModalOpen(false);
  };

  return (
    <div>
      <header className='sticky top-0 z-50 flex justify-between border-b py-4 px-8 bg-gray-500/30 items-center'>
        <img
          src={UserImg}
          alt='Logo'
          className='h-10 cursor-pointer'
          onClick={closeAllModals}
        />

        <div className='text-2xl font-bold'>{companyName}</div>

        <div className='flex gap-5'>
          <button
            className='border rounded-2xl px-3 hover:shadow-md'
            onClick={openLoginModal}
          >
            Sign in
          </button>
        </div>
      </header>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onOpenSignup={() => {
          setIsLoginModalOpen(false);
          setIsSignUpModalOpen(true);
        }}
      />

      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        onSwitchToLogin={() => {
          setIsSignUpModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </div>
  );
}

export default Header;
