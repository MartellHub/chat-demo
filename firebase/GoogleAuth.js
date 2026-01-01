// googleAuth.js
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase';

const provider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, provider);

  const user = result.user;
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const token = credential.accessToken;

  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    avatar: user.photoURL,
    token,
  };
}
