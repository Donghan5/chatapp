import { useState } from "react";
import { Avatar } from "../../atoms/Avatar";
import { Input } from "../../atoms/Input";
import { ChatRoom } from "../../../features/chat/types";
import { User } from "@chatapp/common-types";
import { chatApi } from "../../../features/chat/api/chatApi";
import { userApi } from "../../../features/users/api/userApi";

interface GroupMembersPanelProps {
  room: ChatRoom;
  currentUser: User;
  onUpdate: () => void;
  isAdmin: boolean;
}

export const GroupMembersPanel = ({
  room,
  currentUser,
  onUpdate,
  isAdmin,
}: GroupMembersPanelProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const users = await userApi.searchByUsername(query);
      const existingIds = new Set(room.participants?.map((p) => p.user.id));
      setSearchResults(users.filter((u) => !existingIds.has(u.id)));
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddMember = async (userId: number) => {
    try {
      await chatApi.addParticipant(room.id, userId);
      onUpdate();
      setSearchQuery("");
      setSearchResults([]);
    } catch (e) {
      alert("Failed to add member");
    }
  };

  const handleRemoveMember = async (userId: number) => {
    if (!confirm("Are you sure you want to remove this user?")) return;
    try {
      await chatApi.removeParticipant(room.id, userId);
      onUpdate();
    } catch (e) {
      alert("Failed to remove member");
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Add Member */}
      <div className="relative">
        <Input
          placeholder="Add new member..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border shadow-lg rounded-b-lg mt-1 z-10 max-h-40 overflow-y-auto">
            {searchResults.map((user) => (
              <div
                key={user.id}
                onClick={() => handleAddMember(Number(user.id))}
                className="p-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
              >
                <Avatar src={user.avatarUrl} name={user.username} size="sm" />
                <span className="text-sm">{user.username}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Members List */}
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {room.participants?.length || 0} Participants
      </h3>
      <div className="space-y-2">
        {room.participants?.map((p) => {
          const isCreator = room.createdBy?.id === p.user.id;
          return (
            <div key={p.user.id} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <Avatar src={p.user.avatarUrl} name={p.user.username} size="sm" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {p.user.username} {p.user.id === currentUser.id && "(You)"}
                  </p>
                  {isCreator && (
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                      Admin
                    </span>
                  )}
                </div>
              </div>

              {isAdmin && p.user.id !== currentUser.id && (
                <button
                  onClick={() => handleRemoveMember(Number(p.user.id))}
                  className="text-red-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};