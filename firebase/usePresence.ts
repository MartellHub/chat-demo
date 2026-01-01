import { useEffect, useState } from 'react';
import { onDisconnect, ref, set, serverTimestamp } from 'firebase/database';
import { database } from './firebase';

export function usePresence(uid?: string) {
  const [status, setStatus] = useState<'online' | 'offline'>('offline');

  useEffect(() => {
    if (!uid) return;

    const userRef = ref(database, `/presence/${uid}`);

    set(userRef, {
      state: 'online',
      lastChanged: serverTimestamp(),
    });

    onDisconnect(userRef).set({
      state: 'offline',
      lastChanged: serverTimestamp(),
    });

    setStatus('online');

    return () => {
      set(userRef, {
        state: 'offline',
        lastChanged: serverTimestamp(),
      });
    };
  }, [uid]);

  return status;
}
