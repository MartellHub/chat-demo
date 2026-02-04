import { useState } from 'react';


import addGroupImg from '../img/add-group.png';
import AddRoomModal from './Modals/AddRoomModal';

type ChannelsProps = {
  selectedChannel: string;
  setSelectedChannel: (channel: string) => void;
};

function Channels({ selectedChannel, setSelectedChannel }: ChannelsProps) {
  
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
    <aside className='hidden sm:flex w-60 bg-[#2b2d31] flex-col h-full'>
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
      
    </aside>
  );
}

export default Channels;
