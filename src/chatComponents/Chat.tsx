import { useState } from "react";
import Channels from "./Channels";
import FriendsList from "./FriendsList";

function Chat() {
  const [message, setMessage] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("general");
  const [messages, setMessages] = useState([
    { id: 1, user: "Alex", text: "Welcome to #general" },
    { id: 2, user: "Bot", text: "Be nice and have fun!" },
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), user: "You", text: message },
    ]);
    setMessage("");
  };

  return (
    <div className="h-screen w-full bg-[#313338] text-white flex">
      {/* Channels */}
      <Channels
        selectedChannel={selectedChannel}
        setSelectedChannel={setSelectedChannel}
      />

      {/* Chat area */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-14 flex items-center px-4 border-b border-black/30">
          <span className="font-semibold"># {selectedChannel}</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id}>
              <span className="font-semibold">{msg.user}</span>{" "}
              <span className="text-gray-300">{msg.text}</span>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-black/30">
          <div className="flex bg-[#383a40] rounded-lg px-3 py-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder={`Message #${selectedChannel}`}
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

      {/* Friends */}
       <FriendsList />
    </div>
  );
}

export default Chat;
