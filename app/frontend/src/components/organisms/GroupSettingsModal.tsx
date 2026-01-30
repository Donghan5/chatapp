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
  if (!isOpen) return null;

  const [members, setMembers] = useState<User[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(room.name);

  // state for the members
  const [memberRoles, setMemberRoles] = useState<{ [userId: number]: 'admin' | 'user' }>({});

  // api calling to remove member
  const removeMember = (userId: number) => {
    chatApi.removeParticipant(room.id, userId);
    onUpdateRoom();
  }

  // api calling to update member role
  const updateMemberRole = (userId: number, role: 'admin' | 'user') => {
    chatApi.updateParticipantRole(room.id, userId, role);
    onUpdateRoom();
  }

  const leaveGroup = () => {
    const userId = Number(currentUser.id);
    chatApi.leaveChatRoom(room.id, userId);
    onClose();
  }

  useEffect(() => {
    if (isOpen) {
      chatApi.getRoom(room.id.toString()).then((fetchedRoom) => {
         const users = fetchedRoom.participants.map(p => ({
             ...p.user, 
             role: p.role
         }));
         setMembers(users);
         
         const rolesMap = {};
         fetchedRoom.participants.forEach(p => {
             rolesMap[p.userId] = p.role;
         });
         setMemberRoles(rolesMap);
      });
    }
  }, [isOpen, room.id]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="fext-xl font-bold mb-4">Group Settings</h2>
        {/* Rename */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Group Name</label>
          <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        {/* Member list */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Members</h3>
          <div className="space-y-2">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <img src={member.avatarUrl} alt={member.name} className="w-8 h-8 rounded-full mr-2" />
                  <span className="text-sm font-medium">{member.name}</span>
                </div>
                <select value={memberRoles[Number(member.id)]} onChange={(e) => updateMemberRole(Number(member.id), e.target.value as 'admin' | 'user')} className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            ))}
          </div>
        </div>
        {/* Remove member */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Remove Member</h3>
          <div className="space-y-2">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <img src={member.avatarUrl} alt={member.name} className="w-8 h-8 rounded-full mr-2" />
                  <span className="text-sm font-medium">{member.name}</span>
                </div>
                <button onClick={() => removeMember(Number(member.id))} className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">Remove</button>
              </div>
            ))}
          </div>
        </div>
        {/* Leave group */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Leave Group</h3>
          <button onClick={() => leaveGroup()} className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">Leave</button>
        </div>
      </div>
    </div>
  )
}