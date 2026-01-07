import { useState, useEffect, useCallback } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth , db } from '../../firebase/firebase';
import { doc , setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

type SignUpModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
};

export default function SignUpModal({
  isOpen,
  onClose,
  onSwitchToLogin,
}: SignUpModalProps) {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSignUp = useCallback(async () => {
    if (!username || !email || !password) {
      setError('All fields are required');
      setSuccess('');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: username,
      });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        displayName: username,
        email: email,
        createdAt: new Date(),
      });

      await setDoc(doc(db, 'userChats', userCredential.user.uid), {
        chats : [], 
      });

      setSuccess('Account created successfully!'); // ✅ set success message

      setUsername('');
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  }, [username, email, password, navigate, onClose]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter') handleSignUp();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, handleSignUp]);

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 bg-black/60 flex items-center justify-center z-50'
      onClick={onClose}
    >
      <div
        className='bg-[#1e1f22] text-white w-96 rounded-xl p-6 shadow-xl'
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className='text-xl font-semibold text-center mb-4'>
          Create Account
        </h2>

        <div className='space-y-3'>
          <input
            type='text'
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='w-full px-3 py-2 rounded bg-[#2b2d31] focus:outline-none focus:ring-2 focus:ring-indigo-500'
          />

          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full px-3 py-2 rounded bg-[#2b2d31] focus:outline-none focus:ring-2 focus:ring-indigo-500'
          />

          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full px-3 py-2 rounded bg-[#2b2d31] focus:outline-none focus:ring-2 focus:ring-indigo-500'
          />

          {error && <p className='text-red-500 text-sm text-center'>{error}</p>}
          {success && (
            <p className='text-green-500 text-sm text-center'>{success}</p>
          )}

          <button
            onClick={handleSignUp}
            disabled={loading}
            className='w-full bg-indigo-600 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50'
          >
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </div>

        <p className='text-xs text-gray-400 text-center mt-4'>
          Already have an account?{' '}
          <span
            className='hover:text-white cursor-pointer'
            onClick={(e) => {
              e.stopPropagation(); // prevent backdrop from closing everything
              onClose(); // close current modal
              onSwitchToLogin?.(); // open login
            }}
          >
            Log in
          </span>
        </p>

        <button
          onClick={onClose}
          className='mt-4 w-full text-sm text-gray-400 hover:text-white'
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
