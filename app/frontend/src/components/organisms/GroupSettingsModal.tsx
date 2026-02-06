import { useState, useEffect } from "react";
import { User } from "@chatapp/common-types";
import { ChatRoom } from "../../features/chat/types";
import { chatApi } from "../../features/chat/api/chatApi";

interface GroupSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: ChatRoom;
  currentUser: User;
  onUpdateRoom: () => void;
}

export const GroupSettingsModal = ({
  isOpen,
  onClose,
  room,
  currentUser,
  onUpdateRoom
}: GroupSettingsModalProps) => {
  const [members, setMembers] = useState<(User & { role?: string })[]>([]);
  const [newName, setNewName] = useState(room.name);
  const [memberRoles, setMemberRoles] = useState<{ [userId: number]: 'admin' | 'user' }>({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [inviteUsername, setInviteUsername] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);

  useEffect(() => {
    if (isOpen) {
      chatApi.getRoom(room.id.toString()).then((fetchedRoom) => {
        const users = fetchedRoom.participants?.map(p => ({
          ...p.user,
          role: p.role
        })) || [];
        setMembers(users);

        const rolesMap: { [userId: number]: 'admin' | 'user' } = {};
        fetchedRoom.participants?.forEach(p => {
          rolesMap[p.userId] = p.role;
        });
        setMemberRoles(rolesMap);

        const currentParticipant = fetchedRoom.participants?.find(
          p => Number(p.userId) === Number(currentUser.id)
        );
        setIsAdmin(currentParticipant?.role === 'admin');
      });
    }
  }, [isOpen, room.id, currentUser.id]);

  const handleSaveName = async () => {
    if (newName.trim() && newName !== room.name) {
      await chatApi.updateRoomName(room.id, newName.trim());
      onUpdateRoom();
    }
  };

  const handleRemoveMember = async (userId: number) => {
    if (!confirm("Remove this member?")) return;
    await chatApi.removeParticipant(room.id, userId);
    setMembers(prev => prev.filter(m => Number(m.id) !== userId));
  };

  const handleUpdateRole = async (userId: number, role: 'admin' | 'user') => {
    await chatApi.updateParticipantRole(room.id, userId, role);
    setMemberRoles(prev => ({ ...prev, [userId]: role }));
  };

  const handleLeaveGroup = async () => {
    if (!confirm("Leave this group?")) return;
    await chatApi.leaveChatRoom(room.id, Number(currentUser.id));
    onClose();
    onUpdateRoom();
  };

  const handleSearchUsers = async () => {
    if (inviteUsername.trim().length < 2) return;
    const results = await chatApi.searchUsers(inviteUsername);
    const memberIds = members.map(m => Number(m.id));
    setSearchResults(results.filter(u => !memberIds.includes(Number(u.id))));
  };

  const handleInviteUser = async (userId: number) => {
    await chatApi.inviteUser(room.id, userId);
    setSearchResults([]);
    setInviteUsername("");
    const fetchedRoom = await chatApi.getRoom(room.id.toString());
    setMembers(fetchedRoom.participants?.map(p => ({ ...p.user, role: p.role })) || []);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Group Settings</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>

        {/* Rename */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Group Name</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              disabled={!isAdmin}
              className="flex-1 px-3 py-2 border rounded-md disabled:bg-gray-100"
            />
            {isAdmin && (
              <button onClick={handleSaveName} className="px-4 py-2 bg-blue-500 text-white rounded-md">
                Save
              </button>
            )}
          </div>
        </div>

        {/* Invite (Admin only) */}
        {isAdmin && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Invite Member</h3>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={inviteUsername}
                onChange={(e) => setInviteUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchUsers()}
                placeholder="Search username..."
                className="flex-1 px-3 py-2 border rounded-md"
              />
              <button onClick={handleSearchUsers} className="px-3 py-2 bg-gray-100 rounded-md">🔍</button>
            </div>
            {searchResults.length > 0 && (
              <div className="border rounded-md max-h-32 overflow-y-auto">
                {searchResults.map(user => (
                  <div key={user.id} className="flex justify-between p-2 hover:bg-gray-50">
                    <span>{user.username}</span>
                    <button onClick={() => handleInviteUser(Number(user.id))} className="text-blue-500 text-sm">+ Add</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Members */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Members ({members.length})</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    {member.avatarUrl ? (
                      <img src={member.avatarUrl} alt="" className="w-full h-full object-cover rounded-full" />
                    ) : member.username?.[0] || '?'}
                  </div>
                  <span className="text-sm">{member.username}</span>
                  {memberRoles[Number(member.id)] === 'admin' && (
                    <span className="text-xs text-blue-500">Admin</span>
                  )}
                </div>
                {isAdmin && Number(member.id) !== Number(currentUser.id) && (
                  <div className="flex gap-2">
                    <select
                      value={memberRoles[Number(member.id)] || 'user'}
                      onChange={(e) => handleUpdateRole(Number(member.id), e.target.value as 'admin' | 'user')}
                      className="text-xs px-2 py-1 border rounded"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button onClick={() => handleRemoveMember(Number(member.id))} className="text-red-500 text-sm">Remove</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Leave */}
        <button onClick={handleLeaveGroup} className="w-full py-2 bg-red-500 text-white rounded-md">
          Leave Group
        </button>
      </div>
    </div>
  );
};