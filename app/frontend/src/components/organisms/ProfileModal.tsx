import { useState } from "react";
import { User } from "@chatapp/common-types";
import { Avatar } from "../atoms/Avatar";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import { AvatarUploadModal } from "./AvatarUploadModal";

interface ProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updates: Partial<User>) => void;
}

export const ProfileModal = ({
  user,
  isOpen,
  onClose,
  onUpdate,
}: ProfileModalProps) => {
  const [name, setName] = useState(user.name);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl flex flex-col gap-6">
        
        <h2 className="text-xl font-bold text-gray-900">My Profile</h2>
      
        <div className="flex justify-center relative">
          <div className="cursor-pointer group relative">
            <Avatar src={user.avatarUrl} name={user.name} size="xl"/>
            <Button variant="ghost" className="absolute bottom-0 left-1/2 -translate-x-1/2 group-hover:opacity-100 opacity-0">
              Change Photo
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
            <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded">{user.email}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
              placeholder="Enter your name"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={() => onUpdate({ name })}>Save Changes</Button>
        </div>
      </div>
      <AvatarUploadModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        user={user}
        onUploadSuccess={(avatarUrl) => {
          onUpdate({ avatarUrl });
          setIsAvatarModalOpen(false);
        }}
      />
    </div>
  );
};