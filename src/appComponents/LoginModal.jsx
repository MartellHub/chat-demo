import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { signInWithGoogle } from '../../firebase/GoogleAuth';

import SignUpModal from './SingUpModal';

// icons
import GoogleIcon from '../img/google-login-icon.png';
import FacebookIcon from '../img/facebook-login-icon.png';
import DiscordIcon from '../img/discord-login-icon.png';

export default function LoginModal({ isOpen, onClose, onOpenSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // ---- Login ----
  const handleLogin = useCallback(async () => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      setError('');
      await signInWithEmailAndPassword(auth, email, password);

      navigate('/chat');
      setEmail('');
      setPassword('');
      onClose();
    } catch {
      setError('Invalid email or password');
    }
  }, [email, password, navigate, onClose]);

  // ---- Keyboard shortcuts ----
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter') handleLogin();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = isOpen ? 'hidden' : '';

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleLogin]);

  if (!isOpen) return null;

  const handleForgotPassword = () => {
    console.log('Navigate to Forgot Password modal');
  };

  const handleRegister = () => {
    setIsSignUpModalOpen(true);
  };

  return (
    <div
      className='fixed inset-0 bg-black/60 flex items-center justify-center z-50'
      onClick={onClose}
    >
      <div
        className='bg-[#1e1f22] text-white w-96 rounded-xl p-6 shadow-xl'
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className='text-xl font-semibold text-center mb-4'>Log in</h2>

        {/* Email / Password */}
        <div className='space-y-3 mb-4'>
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

          <button
            onClick={handleLogin}
            className='w-full bg-indigo-600 py-2 rounded-lg hover:bg-indigo-700 transition'
          >
            Login
          </button>

          {error && <p className='text-red-500 text-sm'>{error}</p>}
        </div>

        {/* Forgot / Register */}
        <p className='text-xs text-gray-400 text-center'>
          <span
            className='hover:text-white cursor-pointer'
            onClick={handleForgotPassword}
          >
            Forgot your password?
          </span>{' '}
          |{' '}
          <span
            className='hover:text-white cursor-pointer'
            onClick={(e) => {
              e.stopPropagation();
              onClose();
              onOpenSignup();
            }}
          >
            Register
          </span>
        </p>

        {/* Divider */}
        <div className='flex items-center gap-2 text-xs text-gray-400 my-3'>
          <div className='flex-1 h-px bg-gray-700' />
          OR
          <div className='flex-1 h-px bg-gray-700' />
        </div>

        {/* Social logins */}
        <div className='flex justify-center gap-3'>
          <button
            onClick={async () => {
              await signInWithGoogle();
              navigate('/chat');
              onClose();
            }}
            className='p-2 rounded bg-white hover:bg-gray-200'
          >
            <img
              src={GoogleIcon}
              className='w-5 h-5'
            />
          </button>

          <button
            className='p-2 rounded bg-[#1877f2]'
            onClick={() => console.log('Facebook login')}
          >
            <img
              src={FacebookIcon}
              className='w-5 h-5'
            />
          </button>

          <button
            className='p-2 rounded bg-[#5865F2]'
            onClick={() => console.log('Discord login')}
          >
            <img
              src={DiscordIcon}
              className='w-5 h-5'
            />
          </button>
        </div>

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
