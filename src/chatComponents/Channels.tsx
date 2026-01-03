import { useState } from 'react';
import { useAuth } from '../../firebase/AuthContext';
import { usePresence } from '../../firebase/usePresence';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import addGroupImg from '../img/add-group.png';
import AddRoomModal from './AddRoomModal';
import { set } from 'firebase/database';

type ChannelsProps = {
  selectedChannel: string;
  setSelectedChannel: (channel: string) => void;
};

function Channels({ selectedChannel, setSelectedChannel }: ChannelsProps) {
  const [groups, setGroups] = useState<string[]>([
    'general',
    'random',
    'help',
    'announcements',
  ]);

  const { user } = useAuth();
  const status = usePresence(user?.uid);
  const auth = getAuth();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroup, setNewGroup] = useState('');
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isAreYouSureModalOpen, setAreYouSureModalOpen] = useState(false);

  // ---- Drag reorder ----
  const handleDragStart = (index: number) => setDraggedIndex(index);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;

    setGroups((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(draggedIndex, 1);
      updated.splice(index, 0, moved);
      return updated;
    });

    setDraggedIndex(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Optionally redirect user to login page
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // ---- Modal logic ----
  const normalizedName = (name: string) =>
    name.toLowerCase().trim().replace(/\s+/g, '-');

  const handleSaveGroup = () => {
    const name = normalizedName(newGroup);
    if (!name) return;

    setGroups((prev) => {
      if (editingGroup) {
        if (prev.includes(name) && name !== editingGroup) return prev;
        return prev.map((g) => (g === editingGroup ? name : g));
      }

      if (prev.includes(name)) return prev;
      return [...prev, name];
    });

    if (editingGroup === selectedChannel) {
      setSelectedChannel(name);
    }

    if (!editingGroup) {
      setSelectedChannel(name);
    }

    setNewGroup('');
    setEditingGroup(null);
    setIsModalOpen(false);
  };

  const openAddModal = () => {
    setEditingGroup(null);
    setNewGroup('');
    setIsModalOpen(true);
  };

  const openEditModal = (group: string) => {
    setEditingGroup(group);
    setNewGroup(group);
    setIsModalOpen(true);
  };

  const onCloseAreYouSureModal = () => {
    setAreYouSureModalOpen(false);
  }

  return (
    <aside className='hidden sm:flex w-60 bg-[#2b2d31] flex-col'>
      {/* Header */}
      <div className='flex h-16 p-4 font-bold border-b border-black/30 items-center justify-between'>
        <div>Server Name</div>
        <img
          src={addGroupImg}
          alt='Add Group'
          className='h-6 cursor-pointer'
          onClick={openAddModal}
        />
      </div>

      {/* Channels */}
      <div className='flex flex-1 flex-col'>
        {groups.map((channel, index) => (
          <div
            key={channel}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
            onContextMenu={(e) => {
              e.preventDefault();
              openEditModal(channel);
            }}
            className={`mx-2 rounded cursor-move
            ${
              selectedChannel === channel
                ? 'bg-[#3f4147]'
                : 'hover:bg-[#3f4147]'
            }`}
          >
            <button
              draggable={false}
              onClick={() => setSelectedChannel(channel)}
              className='w-full text-left px-4 py-2 cursor-pointer'
            >
              # {channel}
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AddRoomModal
        isOpen={isModalOpen}
        value={newGroup}
        isEditing={!!editingGroup}
        onChange={setNewGroup}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveGroup}
      />
      {/* user status and settings */}
      <div className='flex w-full justify-between p-2 items-center border-t'>
        <div className='flex gap-2 items-center'>
          <img
            src={user?.photoURL ?? '/avatar.png'}
            alt='avatar'
            className='w-8 h-8 rounded-full'
          />
          <div className='flex flex-col'>
            <span className='text-sm'>{user?.displayName ?? 'Guest'}</span>
            <span className='text-xs text-green-400'>{status}</span>
          </div>
        </div>

        {/* Settings / Logout */}
        <button
          className='text-xs opacity-70 hover:opacity-100'
          onClick={() => setAreYouSureModalOpen(true)}
        >
          Logout
        </button>
        {isAreYouSureModalOpen && (
          <div
            className='fixed inset-0 bg-black/60 flex items-center justify-center z-50'
            onClick={onCloseAreYouSureModal}
          >
            <div
              className='bg-[#1e1f22] text-white w-96 rounded-xl p-6 shadow-xl'
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className='text-xl font-semibold text-center mb-4'>Are you sure?</h2>
              <div className='flex'>
                <button
                  className='bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2 flex-1'
                  onClick={handleLogout}
                >
                  Yes, Exit
                  </button>
                <div className='flex-1' />
                <button
                  className='bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex-1'
                  onClick={onCloseAreYouSureModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Channels;
