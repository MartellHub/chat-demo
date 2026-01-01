type AddRoomProps = {
  isOpen: boolean;
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
};

function AddRoomModal({
  isOpen,
  value,
  isEditing,
  onChange,
  onClose,
  onSave,
}: AddRoomProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#313338] rounded-lg w-96 p-6">
        <h2 className="text-lg font-semibold mb-4">
          {isEditing ? 'Rename Channel' : 'Create Channel'}
        </h2>

        <input
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSave();
            if (e.key === 'Escape') onClose();
          }}
          className="w-full px-3 py-2 rounded bg-[#1e1f22] text-white outline-none"
          placeholder="channel-name"
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-gray-300 hover:bg-[#3f4147]"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500"
          >
            {isEditing ? 'Save' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddRoomModal;
