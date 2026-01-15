import { useState, useEffect } from "react";
import AddFriend from "../img/add-friend.png";
import BinImg from "../img/bin.png";

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
  id: string;   // friend UID
  name: string; // display name
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

  /* ================= AUTH + FRIENDS LISTENER ================= */

  useEffect(() => {
    let unsubFriends: (() => void) | null = null;

    const unsubAuth = auth.onAuthStateChanged((user) => {
      // Cleanup previous listener
      unsubFriends?.();

      if (!user) {
        setFriends([]);
        return;
      }

      const friendsRef = collection(db, "users", user.uid, "friends");
      const q = query(friendsRef, orderBy("name"));

      unsubFriends = onSnapshot(q, (snapshot) => {
        setFriends(
          snapshot.docs.map((d) => ({
            id: d.id,
            name: d.data().name,
          }))
        );
      });
    });

    return () => {
      unsubFriends?.();
      unsubAuth();
    };
  }, []);

  /* ================= HELPERS ================= */

  const findUserByName = async (name: string): Promise<FoundUser | null> => {
    const q = query(
      collection(db, "users"),
      where("username_lower", "==", name.toLowerCase())
    );

    const snap = await getDocs(q);
    if (snap.empty) return null;

    const d = snap.docs[0];
    return {
      uid: d.id,
      username: d.data().username,
    };
  };

  /* ================= ACTIONS ================= */

  const openAddModal = () => {
    setNewFriend("");
    setIsModalOpen(true);
  };

  const handleAddFriend = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const name = newFriend.trim();
    if (!name) return;

    const foundUser = await findUserByName(name);

    if (!foundUser) {
      alert("User does not exist");
      return;
    }

    if (foundUser.uid === currentUser.uid) {
      alert("You cannot add yourself");
      return;
    }

    if (friends.some((f) => f.id === foundUser.uid)) {
      alert("User already added");
      return;
    }

    // Add friend (one-sided, safe)
    await setDoc(
      doc(db, "users", currentUser.uid, "friends", foundUser.uid),
      {
        name: foundUser.username,
        createdAt: serverTimestamp(),
      }
    );

    setSelectedUserId(foundUser.uid);
    setIsModalOpen(false);
  };

  const handleDeleteFriend = async (friendId: string) => {
    const user = auth.currentUser;
    if (!user) return;

    await deleteDoc(doc(db, "users", user.uid, "friends", friendId));

    if (selectedUserId === friendId) {
      setSelectedUserId("");
    }
  };

  /* ================= UI ================= */

  return (
    <aside className="hidden md:flex w-60 bg-[#1e1f22]/30 flex-col h-full">
      {/* Header */}
      <div className="flex h-14 p-4 font-bold border-b border-black/30 items-center justify-between">
        <div>Friends</div>
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
