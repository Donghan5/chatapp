import { useState, useRef } from "react";
import { Avatar } from "../atoms/Avatar";
import { Button } from "../atoms/Button";
import { client } from "../../lib/axios";
import { User } from "@chatapp/common-types";

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUploadSuccess: (avatarUrl: string) => void;
}

export const AvatarUploadModal = ({
  isOpen,
  onClose,
  user,
  onUploadSuccess,
}: AvatarUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const { data } = await client.post<{ avatarUrl: string}>(
        "/users/avatar",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      onUploadSuccess(data.avatarUrl);
      onClose();
    } catch (error) {
      console.error("Error uploading avatar:", error);
    } finally {
      setIsUploading(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl flex flex-col gap-6">
        <h2 className="text-xl font-bold text-gray-900 text-center">
          Change Profile Photo
        </h2>

        <div className="flex flex-col items-center gap-4">
          <Avatar
            src={previewUrl || user.avatarUrl}
            name={user.name || user.email?.split("@")[0] || "?"}
            size="xl"
          />

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="hidden"
          />

          {!selectedFile ? (
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
            >
             Select Image 
            </Button>
          ) : (
            <p className="text-sm text-gray-600 truncate max-w-[200px]">
              {selectedFile.name}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <Button variant="ghost" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}  
          >
            {isUploading ? "Uploading..." : "Save photo"}
          </Button>
        </div>
      </div>
    </div>
  );
};