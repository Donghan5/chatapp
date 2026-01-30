import { useState, useEffect } from "react";
import { Button } from "../../atoms/Button";
import { Input } from "../../atoms/Input";
import { ChatRoom } from "../../../features/chat/types";
import { chatApi } from "../../../features/chat/api/chatApi";

interface GroupSettingsPanelProps {
  room: ChatRoom;
  onUpdate: () => void;
}

export const GroupSettingsPanel = ({ room, onUpdate }: GroupSettingsPanelProps) => {
  const [roomName, setRoomName] = useState(room.name);

  useEffect(() => {
    setRoomName(room.name);
  }, [room]);

  const handleUpdateName = async () => {
    if (!roomName.trim()) return;
    try {
      await chatApi.updateRoomName(room.id, roomName);
      onUpdate();
      alert("Room name updated!");
    } catch (e) {
      console.error(e);
      alert("Failed to update name");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Group Name
        </label>
        <div className="flex gap-2">
          <Input
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <Button onClick={handleUpdateName} size="sm">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};