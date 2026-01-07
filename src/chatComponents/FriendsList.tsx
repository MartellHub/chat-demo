import { useState, useEffect } from "react";
import AddFriend from "../img/add-friend.png";
import BinImg from "../img/bin.png";

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";

type UserProps = {
  selectedUser: string;
  setSelectedUser: (user: string) => void;
};

type Friend = {
  id: string;
  name: string;
};

function FriendsList({ selectedUser, setSelectedUser }: UserProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [newFriend, setNewFriend] = useState("");

  /* 🔥 AUTH + FIRESTORE LISTENER */
  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        setFriends([]);
        return;
      }

      const friendsRef = collection(db, "users", user.uid, "friends");
      const q = query(friendsRef, orderBy("name"));

      const unsubFriends = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map((d) => ({
          id: d.id,
          name: d.data().name,
        }));
        setFriends(list);
      });

      return () => unsubFriends();
    });

    return () => unsubAuth();
  }, []);

  const openAddModal = () => {
    setNewFriend("");
    setIsModalOpen(true);
  };

  const handleAddFriend = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const name = newFriend.trim();
    if (!name) return;

    if (friends.some((f) => f.name.toLowerCase() === name.toLowerCase())) {
      return;
    }

    await addDoc(collection(db, "users", user.uid, "friends"), {
      name,
      createdAt: serverTimestamp(),
    });

    setSelectedUser(name);
    setIsModalOpen(false);
  };

  const handleDeleteFriend = async (friendId: string) => {
    const user = auth.currentUser;
    if (!user) return;

    await deleteDoc(
      doc(db, "users", user.uid, "friends", friendId)
    );

    if (selectedUser === friends.find(f => f.id === friendId)?.name) {
      setSelectedUser("");
    }
  };

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
          const isSelected = friend.name === selectedUser;

          return (
            <div
              key={friend.id}
              className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer
              ${isSelected ? "bg-[#404249]" : "hover:bg-[#313338]"}`}
              onClick={() => setSelectedUser(friend.name)}
            >
              <div className="flex gap-2 items-center">
                <div className="bg-amber-200 rounded-full text-black w-7 h-7 flex items-center justify-center">
                  {friend.name.charAt(0).toUpperCase()}
                </div>
                <span>{friend.name}</span>
              </div>

              <img
                src={BinImg}
                alt="delete"
                className="h-5 cursor-pointer hover:opacity-70"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFriend(friend.id);
                }}
              />
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#313338] rounded-lg w-96 p-6">
            <h2 className="text-lg font-semibold mb-4">Add Friend</h2>

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
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default FriendsList;
