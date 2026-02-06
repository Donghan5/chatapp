import { User } from "@chatapp/common-types";
import { Avatar } from "../../../components/atoms/Avatar";
import { Button } from "../../../components/atoms/Button";

interface FriendRequestItemProps {
  user: User;
  type: "received" | "sent";
  onAccept?: () => void;
  onReject?: () => void;
  onCancel?: () => void;
}

export const FriendRequestItem = ({
  user,
  type,
  onAccept,
  onReject,
  onCancel,
}: FriendRequestItemProps) => {
  return (
    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <Avatar src={user.avatarUrl} name={user.username || "?"} size="md" />
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">
          {user.username || "Unknown User"}
        </h3>
        <p className="text-xs text-gray-500 truncate">{user.email}</p>
      </div>
      <div className="flex gap-2">
        {type === "received" ? (
          <>
            <Button
              size="sm"
              variant="primary"
              onClick={(e) => {
                e.stopPropagation();
                onAccept?.();
              }}
            >
              Confirm
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                onReject?.();
              }}
            >
              Delete
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onCancel?.();
            }}
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};
