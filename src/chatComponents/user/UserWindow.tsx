import { useAuth } from '../../../firebase/AuthContext';
import { usePresence } from '../../../firebase/usePresence';
import { useState } from 'react';
import Avatar from '../../img/user-img.png'

import UserLogOutModal from './UserLogOutModal';
import CameraModal from './CameraModal';

function UserWindow() {
  const { user } = useAuth();
  const status = usePresence(user?.uid);

  const [isAreYouSureModalOpen, setAreYouSureModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);

  const onCloseAreYouSureModal = () => {
    setAreYouSureModalOpen(false);
  };

  return (
    <div>
      <div className='flex justify-between p-2 items-center w-60'>
        <div className='flex gap-2 items-center'>
          <img
            src={user?.photoURL ?? Avatar}
            alt='avatar'
            className='w-8 h-8 rounded-full'
          />
          <div className='flex flex-col '>
            <span className='text-sm'
              // onClick={logUserInfo}
            >{user?.displayName ?? 'Guest'}</span>
            <span className={`${status === 'online' ? 'text-green-400' : 'text-red-400'} text-xs`}>{status}</span>
          </div>
        </div>

        {/* Settings / Logout */}
        <div className='relative'>
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className='text-sm opacity-70 hover:opacity-100'
          >
            ⚙️
          </button>

          {isMenuOpen && (
            <div
              className='absolute top-10 right-0 w-40 bg-[#1e1f22] rounded-md shadow-lg border border-black/40 z-50'
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className='w-full text-left px-4 py-2 text-sm hover:bg-[#3f4147]'
                onClick={() => {
                  setIsMenuOpen(false);
                  // future: open settings modal
                }}
              >
                Settings
              </button>

              <button
                className='w-full text-left px-4 py-2 text-sm hover:bg-[#3f4147]'
                onClick={() => setIsCameraModalOpen(true)}
              >
                Camera
              </button>

              <button
                className='w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#3f4147]'
                onClick={() => {
                  setIsMenuOpen(false);
                  setAreYouSureModalOpen(true);
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Modals */}
        <UserLogOutModal
          isOpen={isAreYouSureModalOpen}
          onClose={onCloseAreYouSureModal}
        />

        <CameraModal
          isOpen={isCameraModalOpen}
          onClose={() => setIsCameraModalOpen(false)}
        />
      </div>
    </div>
  );
}

export default UserWindow;
