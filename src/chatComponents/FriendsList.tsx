import { useState } from 'react';
import AddFriend from '../img/add-friend.png';

function FriendsList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [friends, setFriends] = useState(['Alice', 'Bob', 'Charlie', 'Diana']);
  const [newFriend, setNewFriend] = useState('');

  const [editingFriend, setEditingFriend] = useState<string | null>(null);

  const sortAlphabetically = (list: string[]) =>
    [...list].sort((a, b) => a.localeCompare(b));

  const addFriend = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    setFriends((prev) => sortAlphabetically([...prev, trimmed]));
  };

  const openAddModal = () => {
    setEditingFriend(null);
    setNewFriend('');
    setIsModalOpen(true);
  };

  const normalizedName = (name: string) =>
    name.toLowerCase().trim().replace(/\s+/g, '-');

  const handleAddFriend = () => {
    const name = normalizedName(newFriend);
    if (!name) return;

    setFriends((prev) => {
      if (editingFriend) {
        if (prev.includes(name) && name !== editingFriend) return prev;

        return prev.map((g) => (g === editingFriend ? name : g));
      }

      if (prev.includes(name)) return prev;
      return [...prev, name];
    });

    // if (editingFriend === selectedChannel || !editingFriend) {
    //   setSelectedChannel(name);
    // }

    setNewFriend('');
    setEditingFriend(null);
    setIsModalOpen(false);
  };
  return (
    <aside className='hidden md:flex w-60 bg-[#1e1f22]/30 flex-col '>
      <div className='flex h-14 p-4 font-bold border-b border-black/30 items-center justify-between w-full'>
        <div>Friends</div>
        <img
          src={AddFriend}
          alt='addFriend'
          className='h-8 hover:cursor-pointer'
          onClick={openAddModal}
        />
      </div>
      <div className='p-5 flex flex-col justify-start gap-2'>
        {friends.map((friend) => (
          <div
            key={friend}
            className='flex w-full px-3 py-2 hover:bg-[#313338] rounded cursor-pointer gap-5'
          >
            <div className='flex bg-amber-200 rounded-full text-black items-center justify-center text-center w-6'>{friend.charAt(0)}</div>
            {friend}
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'>
          <div className='bg-[#313338] rounded-lg w-96 p-6'>
            <h2 className='text-lg font-semibold mb-4'>
              {editingFriend ? 'Rename Friend' : 'Add Friend'}
            </h2>

            <input
              autoFocus
              value={newFriend}
              onChange={(e) => setNewFriend(e.target.value)}
              className='w-full px-3 py-2 rounded bg-[#1e1f22] text-white outline-none'
              placeholder='channel-name'
            />

            <div className='flex justify-end gap-3 mt-6'>
              <button
                onClick={() => setIsModalOpen(false)}
                className='px-4 py-2 rounded text-gray-300 hover:bg-[#3f4147]'
              >
                Cancel
              </button>
              <button
                onClick={handleAddFriend}
                className='px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500'
              >
                {editingFriend ? 'Save' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default FriendsList;
