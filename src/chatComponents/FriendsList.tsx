import { useState, useEffect } from "react";
import AddFriend from "../img/add-friend.png";
import BinImg from "../img/bin.png";
import { onAuthStateChanged } from "firebase/auth";

import {
  collection,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  deleteDoc,
  doc,
  getDocs,
  where,
} from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";

/* ================= TYPES ================= */

type UserProps = {
  selectedUserId: string;
  setSelectedUserId: (id: string) => void;
};

type Friend = {
  id: string;
  name: string;
};

type FoundUser = {
  uid: string;
  username: string;
};

/* ================= COMPONENT ================= */

function FriendsList({ selectedUserId, setSelectedUserId }: UserProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [newFriend, setNewFriend] = useState("");   
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  /* ================= AUTH + FRIENDS LISTENER ================= */

  useEffect(() => {
  const unsub = onAuthStateChanged(auth, (user) => {
    setCurrentUser(user);
  });

  return () => unsub();
}, []);

  /* ================= HELPERS ================= */

  const findUserByUsername = async (
    username: string
  ): Promise<FoundUser | null> => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const docSnap = snapshot.docs[0];

    return {
      uid: docSnap.id,
      username: docSnap.data().displayName,
    };
  };

  /* ================= ACTIONS ================= */

  const openAddModal = () => {
    setNewFriend("");
    setIsModalOpen(true);
  };

  const handleAddFriend = async () => {
    if (!currentUser) return;
    if (!newFriend.trim()) return;

    const foundUser = await findUserByUsername(newFriend.trim());

    if (!foundUser) {
      alert("User not found");
      return;
    }

    if (foundUser.uid === currentUser.uid) {
      alert("You can't add yourself");
      return;
    }

    const friendRef = doc(
      db,
      "users",
      currentUser.uid,
      "friends",
      foundUser.uid
    );

    await setDoc(friendRef, {
      name: foundUser.username,
      createdAt: serverTimestamp(),
    });

    setIsModalOpen(false);
    setNewFriend("");
  };

  const handleDeleteFriend = async (friendId: string) => {
    if (!currentUser) return;

    await deleteDoc(doc(db, "users", currentUser.uid, "friends", friendId));

    if (selectedUserId === friendId) {
      setSelectedUserId("");
    }
  };
 console.log(friends)
   
  /* ================= UI ================= */

  return (
    <aside className="hidden md:flex w-60 bg-[#1e1f22]/30 flex-col h-full">
      {/* Header */}
      <div className="flex h-14 p-4 font-bold border-b border-black/30 items-center justify-between">
        <div>Friends</div>
        <button
        // onClick={fetchFriends}
        >DB</button>
        <img
          src={AddFriend}
          alt="addFriend"
          className="h-8 cursor-pointer"
          onClick={openAddModal}
        />
      </div>

      {/* Friends List */}
      <div className="p-3 flex flex-col gap-1">
        {friends.map((friend) => {
          const isSelected = friend.id === selectedUserId;
          return (
            <div
              key={friend.id}
              className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer
              ${isSelected ? "bg-[#404249]" : "hover:bg-[#313338]"}`}
              onClick={() => setSelectedUserId(friend.id)}
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

      {/* Add Friend Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#313338] rounded-lg w-96 p-6">
            <h2 className="text-lg font-semibold mb-4">Add Friend</h2>

            <input
              autoFocus
              value={newFriend}
              onChange={(e) => setNewFriend(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddFriend()}
              className="w-full px-3 py-2 rounded bg-[#1e1f22] text-white outline-none"
              placeholder="Username"
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
