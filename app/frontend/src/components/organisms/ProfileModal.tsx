import { useState } from "react";
import { User } from "@chatapp/common-types";
import { Avatar } from "../atoms/Avatar";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";

interface ProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (name: string) => void;
}

export const ProfileModal = ({
  user,
  isOpen,
  onClose,
  onUpdate,
}: ProfileModalProps) => {
  const [name, setName] = useState(user.name);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <h2 className="bg-white rounded-lg p-6 w-96 shadow-xl">My Profile</h2>
    
      <div className="flex justify-center mb-6">
        <Avatar src={user.avatarUrl} name={user.name} size="xl"/>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={() => onUpdate(name)}>Save</Button>
      </div>
    </div>
  )
}
