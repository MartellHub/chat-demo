import { useState, useEffect } from "react";
import FriendsList from "./FriendsList";
import UserWindow from "./user/UserWindow";
import Channels from "./Channels";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";

type Message = {
  id: string;
  senderId: string;
  text: string;
};

function Chat() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");

  /* ================= LISTEN TO MESSAGES ================= */

  useEffect(() => {
    if (!auth.currentUser || !selectedUser) return;

    const chatId = [auth.currentUser.uid, selectedUser]
      .sort()
      .join("_");

    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];

      setMessages(msgs);
    });

    return () => unsub();
  }, [selectedUser]);

  /* ================= SEND MESSAGE ================= */

  const handleSendMessage = async () => {
    if (!message.trim() || !auth.currentUser || !selectedUser) return;

    const chatId = [auth.currentUser.uid, selectedUser]
      .sort()
      .join("_");

    const chatRef = doc(db, "chats", chatId);
    const messagesRef = collection(chatRef, "messages");

    await setDoc(
      chatRef,
      {
        participants: [auth.currentUser.uid, selectedUser],
        updatedAt: serverTimestamp(),
        lastMessage: message,
      },
      { merge: true }
    );

    await addDoc(messagesRef, {
      senderId: auth.currentUser.uid,
      text: message,
      createdAt: serverTimestamp(),
    });

    setMessage("");
  };

  /* ================= UI ================= */

  return (
    <div className="h-screen w-full bg-[#313338] text-white flex">
      {/* Sidebar */}
      <div className="flex flex-col">
        <UserWindow />
        <FriendsList
          selectedUserId={selectedUser || ""}
          setSelectedUserId={setSelectedUser}
        />
        <Channels />
      </div>

      

      {/* Chat Area */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-14 flex items-center px-4 border-b border-black/30">
          <span className="font-semibold">
            {selectedUser ? "Direct Message" : "Select a friend"}
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => {
            const isMe = msg.senderId === auth.currentUser?.uid;

            return (
              <div
                key={msg.id}
                className={`max-w-[70%] px-3 py-2 rounded-lg text-sm
                ${
                  isMe
                    ? "ml-auto bg-indigo-600 text-white"
                    : "mr-auto bg-[#2b2d31] text-white"
                }`}
              >
                {msg.text}
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-black/30">
          <div className="flex bg-[#383a40] rounded-lg px-3 py-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder={
                selectedUser
                  ? "Message user..."
                  : "Select a friend to chat"
              }
              disabled={!selectedUser}
              className="flex-1 bg-transparent outline-none text-white"
            />
            <button
              onClick={handleSendMessage}
              className="ml-3 text-indigo-400 hover:text-indigo-300"
            >
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Chat;
