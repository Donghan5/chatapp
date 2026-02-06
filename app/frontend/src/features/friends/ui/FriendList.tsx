import { useState } from "react";
import { useFriends } from "../hooks/useFriends";
import { Avatar } from "../../../components/atoms/Avatar";
import { FriendRequestItem } from "./FriendRequestItem";

interface FriendListProps {
  onStartChat?: (userId: number) => void;
  isUserOnline?: (userId: number) => boolean;
}

type Tab = "friends" | "received" | "sent";

export const FriendList = ({ onStartChat, isUserOnline }: FriendListProps) => {
  const {
    friends,
    receivedRequests,
    sentRequests,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    isLoading
  } = useFriends();

  const [activeTab, setActiveTab] = useState<Tab>("friends");

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Tabs */}
      <div className="flex border-b border-gray-100 px-2 pt-2">
        <button
          onClick={() => setActiveTab("friends")}
          className={`flex-1 pb-2 text-xs font-semibold uppercase relative ${activeTab === "friends" ? "text-green-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          Friends <span className="ml-1 text-[10px] bg-gray-100 px-1.5 py-0.5 rounded-full">{friends.length}</span>
          {activeTab === "friends" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500" />}
        </button>
        <button
          onClick={() => setActiveTab("received")}
          className={`flex-1 pb-2 text-xs font-semibold uppercase relative ${activeTab === "received" ? "text-green-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          Received
          {receivedRequests.length > 0 && (
            <span className="ml-1 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">{receivedRequests.length}</span>
          )}
          {activeTab === "received" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500" />}
        </button>
        <button
          onClick={() => setActiveTab("sent")}
          className={`flex-1 pb-2 text-xs font-semibold uppercase relative ${activeTab === "sent" ? "text-green-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          Sent
          {activeTab === "sent" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {activeTab === "friends" && (
          <div className="flex flex-col">
            {friends.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500 mb-2">No friends yet.</p>
                <p className="text-xs text-gray-400">Search for users to add them!</p>
              </div>
            ) : (
              friends.map((friend) => (
                <div
                  key={friend.id}
                  onClick={() => onStartChat && onStartChat(Number(friend.id))}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg group transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative">
                      <Avatar
                        src={friend.avatarUrl || null}
                        name={friend.username || "?"}
                        size="md"
                      />
                      {isUserOnline && isUserOnline(Number(friend.id)) && <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-300 border-2 border-white rounded-full"></div>}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {friend.username}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">
                        Click to chat
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "received" && (
          <div className="flex flex-col gap-1">
            {receivedRequests.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-500">
                No friend requests received.
              </div>
            ) : (
              receivedRequests.map((req) => (
                <FriendRequestItem
                  key={req.id}
                  user={req.requester!}
                  type="received"
                  onAccept={() => acceptRequest(req.id)}
                  onReject={() => rejectRequest(req.id)}
                />
              ))
            )}
          </div>
        )}

        {activeTab === "sent" && (
          <div className="flex flex-col gap-1">
            {sentRequests.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-500">
                No pending sent requests.
              </div>
            ) : (
              sentRequests.map((req) => (
                <FriendRequestItem
                  key={req.id}
                  user={req.recipient!}
                  type="sent"
                  onCancel={() => cancelRequest(req.id)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
