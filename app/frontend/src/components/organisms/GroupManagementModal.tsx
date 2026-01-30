import { useState } from "react";
import { ChatRoom } from "../../features/chat/types";
import { User } from "@chatapp/common-types";
import { GroupMembersPanel } from "./group/GroupMembersPanel";
import { GroupSettingsPanel } from "./group/GroupSettingsPanel";

interface GroupManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: ChatRoom;
  currentUser: User;
  onUpdate: () => void;
}

export const GroupManagementModal = ({
  isOpen,
  onClose,
  room,
  currentUser,
  onUpdate,
}: GroupManagementModalProps) => {
  const [activeTab, setActiveTab] = useState<"members" | "settings">("members");

  if (!isOpen) return null;

  const isAdmin = room.createdBy?.id === currentUser.id;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md h-[500px] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b flex justify-between items-center bg-gray-50">
          <h2 className="font-semibold text-lg">Group Info</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === "members"
                ? "border-b-2 border-green-500 text-green-600"
                : "text-gray-500 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("members")}
          >
            Members
          </button>
          {isAdmin && (
            <button
              className={`flex-1 py-2 text-sm font-medium ${
                activeTab === "settings"
                  ? "border-b-2 border-green-500 text-green-600"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("settings")}
            >
              Settings
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "members" ? (
            <GroupMembersPanel
              room={room}
              currentUser={currentUser}
              onUpdate={onUpdate}
              isAdmin={isAdmin}
            />
          ) : (
            <GroupSettingsPanel room={room} onUpdate={onUpdate} />
          )}
        </div>
      </div>
    </div>
  );
};