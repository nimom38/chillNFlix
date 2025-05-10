import { useState } from "react";
import { useMatchStore } from "../../store/tinder/useMatchStore";
import { useGroupStore } from "../../store/community/useGroupStore";

const CreateGroupModal = ({ onClose }) => {
  const { matches } = useMatchStore();
  const { createGroup } = useGroupStore();

  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const toggleUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (!groupName.trim() || selectedUsers.length === 0) return;

    await createGroup(groupName, selectedUsers);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-base-100 p-6 rounded-lg shadow-md w-full max-w-md space-y-4">
        <h3 className="font-bold text-lg">Create Group</h3>

        <input
          type="text"
          placeholder="Group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="input input-bordered w-full"
        />

        <div className="max-h-64 overflow-y-auto border p-2 rounded">
          {matches.map((user) => (
            <label key={user._id} className="flex gap-2 items-center py-1">
              <input
                type="checkbox"
                checked={selectedUsers.includes(user._id)}
                onChange={() => toggleUser(user._id)}
              />
              <span>{user.name}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
          <button onClick={handleCreate} className="btn btn-primary">
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
