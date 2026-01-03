import { useAuth } from '../../firebase/AuthContext';
import { usePresence } from '../../firebase/usePresence';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function UserWindow() {
    const { user } = useAuth();
      const status = usePresence(user?.uid);
      const auth = getAuth();
      const navigate = useNavigate();
  const [isAreYouSureModalOpen, setAreYouSureModalOpen] = useState(false);


  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Optionally redirect user to login page
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

const onCloseAreYouSureModal = () => {
    setAreYouSureModalOpen(false);
  }
  return (
    <div>
        <div className='flex w-full justify-between p-2 items-center border-t'>
        <div className='flex gap-2 items-center'>
          <img
            src={user?.photoURL ?? '/avatar.png'}
            alt='avatar'
            className='w-8 h-8 rounded-full'
          />
          <div className='flex flex-col'>
            <span className='text-sm'>{user?.displayName ?? 'Guest'}</span>
            <span className='text-xs text-green-400'>{status}</span>
          </div>
        </div>

        {/* Settings / Logout */}
        <button
          className='text-xs opacity-70 hover:opacity-100'
          onClick={() => setAreYouSureModalOpen(true)}
        >
          Logout
        </button>
        {isAreYouSureModalOpen && (
          <div
            className='fixed inset-0 bg-black/60 flex items-center justify-center z-50'
            onClick={onCloseAreYouSureModal}
          >
            <div
              className='bg-[#1e1f22] text-white w-96 rounded-xl p-6 shadow-xl'
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className='text-xl font-semibold text-center mb-4'>Are you sure?</h2>
              <div className='flex'>
                <button
                  className='bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2 flex-1'
                  onClick={handleLogout}
                >
                  Yes, Exit
                  </button>
                <div className='flex-1' />
                <button
                  className='bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex-1'
                  onClick={onCloseAreYouSureModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>        

    </div>
  )
}

export default UserWindow