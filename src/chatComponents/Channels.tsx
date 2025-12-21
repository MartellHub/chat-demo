import { useState } from 'react';
import addGroupImg from '../img/add-group.png';

type ChannelsProps = {
  selectedChannel: string;
  setSelectedChannel: (channel: string) => void;
};

function Channels({ selectedChannel, setSelectedChannel }: ChannelsProps) {
  const [groups, setGroups] = useState([
    'general',
    'random',
    'help',
    'announcements',
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroup, setNewGroup] = useState('');
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);


  // switch by dragging
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // required to allow drop
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

  //add a new group
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

    if (editingGroup === selectedChannel || !editingGroup) {
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
    <aside className="hidden sm:flex w-60 bg-[#2b2d31] flex-col">
      <div className="flex h-16 p-4 font-bold border-b border-black/30 items-center justify-between">
        <div>Server Name</div>

        <img
          src={addGroupImg}
          alt="Add Group"
          className="h-6 hover:cursor-pointer"
          onClick={openAddModal}
        />
      </div>

      {groups.map((channel, index) => (
        <div
          key={channel}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(index)}
          className={`mx-2 rounded cursor-move
            ${selectedChannel === channel ? 'bg-[#3f4147]' : 'hover:bg-[#3f4147]'}`}
        >
          <button
            onClick={() => setSelectedChannel(channel)}
            className="w-full text-left px-4 py-2"
          >
            # {channel}
          </button>
        </div>
      ))}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#313338] rounded-lg w-96 p-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingGroup ? 'Rename Channel' : 'Create Channel'}
            </h2>

            <input
              autoFocus
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#1e1f22] text-white outline-none"
              placeholder="channel-name"
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded text-gray-300 hover:bg-[#3f4147]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveGroup}
                className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500"
              >
                {editingGroup ? 'Save' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Channels;
