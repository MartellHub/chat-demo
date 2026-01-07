import { useState, useEffect } from "react";
import AddFriend from "../img/add-friend.png";

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";

type UserProps = {
  selectedUser: string;
  setSelectedUser: (user: string) => void;
};

function FriendsList({ selectedUser, setSelectedUser }: UserProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [friends, setFriends] = useState<string[]>([]);
  const [newFriend, setNewFriend] = useState("");
  const [editingFriend, setEditingFriend] = useState<string | null>(null);

  const sortAlphabetically = (list: string[]) =>
    [...list].sort((a, b) => a.localeCompare(b));

  const normalizeName = (name: string) => name.trim().replace(/\s+/g, " ");

  const openAddModal = () => {
    setEditingFriend(null);
    setNewFriend("");
    setIsModalOpen(true);
  };

  const handleAddFriend = async () => {
    if (!auth.currentUser) return;

    const name = newFriend.trim();
    if (!name) return;

    const friendsRef = collection(db, "users", auth.currentUser.uid, "friends");

    await addDoc(friendsRef, {
      name,
      createdAt: serverTimestamp(),
    });

    setSelectedUser(name);
    setNewFriend("");
    setIsModalOpen(false);
  };

  useEffect(() => {
  console.log("Current user:", auth.currentUser);
}, []);

  useEffect(() => {
    if (!auth.currentUser) return;

    const friendsRef = collection(db, "users", auth.currentUser.uid, "friends");

    const q = query(friendsRef, orderBy("name"));

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => doc.data().name);
      setFriends(list);
    });

    return () => unsub();
  }, []);

  return (
    <aside className="hidden md:flex w-60 bg-[#1e1f22]/30 flex-col">
      <div className="flex h-14 p-4 font-bold border-b border-black/30 items-center justify-between">
        <div>Friends</div>
        <img
          src={AddFriend}
          alt="addFriend"
          className="h-8 cursor-pointer"
          onClick={openAddModal}
        />
      </div>

      <div className="p-3 flex flex-col gap-1">
        {friends.map((friend) => {
          const isSelected = friend === selectedUser;

          return (
            <div
              key={friend}
              onClick={() => setSelectedUser(friend)}
              className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer
        ${isSelected ? "bg-[#404249]" : "hover:bg-[#313338]"}`}
            >
              <div className="bg-amber-200 rounded-full text-black w-7 h-7 flex items-center justify-center">
                {friend.charAt(0)}
              </div>
              <span className="truncate">{friend}</span>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#313338] rounded-lg w-96 p-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingFriend ? "Rename Friend" : "Add Friend"}
            </h2>

            <input
              autoFocus
              value={newFriend}
              onChange={(e) => setNewFriend(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#1e1f22] text-white outline-none"
              placeholder="Friend name"
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded text-gray-300 hover:bg-[#3f4147]"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFriend}
                className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500"
              >
                {editingFriend ? "Save" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default FriendsList;
