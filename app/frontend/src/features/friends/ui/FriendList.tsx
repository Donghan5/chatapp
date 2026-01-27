import { useFriends } from "../hooks/useFriends";
import { Avatar } from "../../../components/atoms/Avatar";

interface FriendListProps {
  onStartChat?: (userId: number) => void;
}

export const FriendList = ({ onStartChat }: FriendListProps) => {
  const { friends, receivedRequests, acceptRequest, rejectRequest, isLoading } =
    useFriends();

  if (isLoading) {
    return <div className="p-4 text-center text-gray-500">로딩 중...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto">
      {receivedRequests.length > 0 && (
        <div className="p-4 bg-gray-50 border-b border-gray-100">
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3 px-1">
            Received Requests ({receivedRequests.length})
          </h4>
          <div className="space-y-3">
            {receivedRequests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Avatar
                    src={req.requester?.avatarUrl || null}
                    name={req.requester?.name || "?"}
                    size="sm"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {req.requester?.name}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => acceptRequest(req.id)}
                    className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => rejectRequest(req.id)}
                    className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded hover:bg-gray-300 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-2">
        <h4 className="text-xs font-semibold text-gray-500 uppercase px-3 py-2">
          My Friends ({friends.length})
        </h4>
        {friends.length === 0 ? (
          <div className="py-10 text-center text-gray-400 text-sm">
            No friends yet.
          </div>
        ) : (
          <div className="flex flex-col">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg group transition-colors cursor-default"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    src={friend.avatarUrl || null}
                    name={friend.name || "?"}
                    size="md"
                  />
                  <span className="font-medium text-gray-800">
                    {friend.name}
                  </span>
                </div>
                <button
                  onClick={() => onStartChat && onStartChat(Number(friend.id))}
                  className="hidden group-hover:block text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  Start Chat
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

