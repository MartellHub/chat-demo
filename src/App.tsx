import { useState } from 'react';
import './App.css';

type Message = {
  id: number;
  text: string;
  user: string;
};

function App() {
  const [rooms, setRooms] = useState<string[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const user = 'User' 

  const [messageInput, setMessageInput] = useState('');

  const [messagesByRoom, setMessagesByRoom] = useState<
    Record<string, Message[]>
  >({});

  const addChannel = () => {
    const channelName = prompt('Enter channel name:');
    if (!channelName) return;

    setRooms((prev) => [...prev, channelName]);
    setMessagesByRoom((prev) => ({
      ...prev,
      [channelName]: [],
    }));
  };

  const addMessage = (room: string, text: string, user: string) => {
    setMessagesByRoom((prev) => ({
      ...prev,
      [room]: [
        ...(prev[room] || []),
        { user, id: Date.now(), text },
      ],
    }));
  };

  const handleSend = () => {
    if (!currentRoom || !messageInput.trim()) return;

    addMessage(currentRoom, messageInput,user);
    setMessageInput('');
  };

  return (
    <div className="flex w-screen h-screen">
      {/* Channels */}
      <div className="flex flex-col w-72 border-r">
        <div className="flex justify-between p-5 border-b">
          <div>Channels</div>
          <button onClick={addChannel}>+ Add</button>
        </div>

        {rooms.map((channel) => (
          <div
            key={channel}
            className="px-3 py-2 hover:bg-gray-700 cursor-pointer"
            onClick={() => setCurrentRoom(channel)}
          >
            # {channel}
          </div>
        ))}
      </div>

      {/* Chat */}
      <div className="flex flex-col flex-1">
        <div className="border-b p-5">
          {currentRoom ?? 'Select a room'}
        </div>

        <div className="flex-1 overflow-y-auto">
          {currentRoom &&
            messagesByRoom[currentRoom]?.map((msg) => (
              <div key={msg.id} className="p-3 border-b">
                {msg.user}) {msg.text}
              </div>
            ))}
        </div>

        <div className="flex border-t">
          <input
            className="flex-1 p-3 outline-none"
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
