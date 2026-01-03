import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

type UserLogOutModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function UserLogOutModal({ isOpen, onClose }: UserLogOutModalProps) {
  const navigate = useNavigate();
  const auth = getAuth();

  if (!isOpen) return null;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onClose();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#1e1f22] text-white w-96 rounded-xl p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-center mb-4">
          Are you sure?
        </h2>

        <div className="flex gap-3">
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex-1"
            onClick={handleLogout}
          >
            Yes, Exit
          </button>

          <button
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex-1"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserLogOutModal;
