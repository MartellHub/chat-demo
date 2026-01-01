import { useState } from 'react';
import { useAuth } from '../../firebase/AuthContext';
import { usePresence } from '../../firebase/usePresence';

import addGroupImg from '../img/add-group.png';
import AddRoomModal from './AddRoomModal';

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroup, setNewGroup] = useState('');
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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
            <span
              className={`text-xs ${
                status === 'online' ? 'text-green-400' : 'text-gray-400'
              }`}
            >
              {status}
            </span>{' '}
          </div>
        </div>

        <button className='text-xs opacity-70 hover:opacity-100'>⚙️</button>
      </div>
    </aside>
  );
}

export default Channels;
