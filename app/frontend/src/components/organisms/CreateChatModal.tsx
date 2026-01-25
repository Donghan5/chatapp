import { useState } from "react";
import { User } from "@chatapp/common-types";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import { Avatar } from "../atoms/Avatar";
import { userApi } from "../../features/users/api/userApi";

interface CreateChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (roomName: string, inviteUserIds: number[]) => void;
}

export const CreateChatModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateChatModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError("");
    setSearchResults([]);
    setSelectedUser(null);

    try {
      const users = await userApi.searchByUsername(searchQuery);
      setSearchResults(users);
      if (users.length === 0) {
        setError("No users found.");
      }
    } catch (err) {
      console.error(err);
      setError("Error occurred while searching.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    if (!selectedUser) return;
    
    const userIdNumber = Number(selectedUser.id);
    if (isNaN(userIdNumber)) {
      setError("Invalid User ID format.");
      return;
    }

    // @ts-ignore: Type incorrect (Delete if required)
    const displayName = selectedUser.username || selectedUser.name || "Unknown";

    onCreate(displayName, [userIdNumber]);
    handleClose();
  };

  const handleClose = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSelectedUser(null);
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl flex flex-col max-h-[80vh]">
        <h2 className="text-xl font-bold text-gray-900 mb-4">New Chat</h2>

        {/* Search Input */}
        <div className="flex gap-2 mb-4">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by username"
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? "..." : "Search"}
          </Button>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* User List Area */}
        <div className="flex-1 overflow-y-auto min-h-[100px] mb-4 border border-gray-100 rounded-md">
           {searchResults.map((user) => {
             // @ts-ignore
             const displayName = user.username || user.name; 
             const isSelected = selectedUser?.id === user.id;

             return (
               <div
                 key={user.id}
                 onClick={() => setSelectedUser(user)}
                 className={`flex items-center gap-3 p-3 cursor-pointer transition-colors border-b border-gray-50 last:border-0
                   ${isSelected ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"}
                 `}
               >
                 <Avatar src={user.avatarUrl} name={displayName} size="md" />
                 <div className="flex-1">
                   <p className={`font-semibold ${isSelected ? "text-blue-700" : "text-gray-900"}`}>
                     {displayName}
                   </p>
                   <p className="text-xs text-gray-500">{user.email}</p>
                 </div>
                 {isSelected && (
                   <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                     <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                     </svg>
                   </div>
                 )}
               </div>
             );
           })}
           
           {!isLoading && searchResults.length === 0 && !error && (
             <div className="text-center text-gray-400 py-8 text-sm">
               Search for a user to start chatting
             </div>
           )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 mt-auto">
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleCreate}
            disabled={!selectedUser}
          >
            Start Chat
          </Button>
        </div>
      </div>
    </div>
  );
};