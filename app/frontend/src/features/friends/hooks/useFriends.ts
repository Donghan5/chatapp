import { useState, useEffect, useCallback } from "react";
import { friendsApi, FriendStatus, FriendRequest } from "../api/friendsApi";
import { User } from "@chatapp/common-types";

export const useFriends = () => {
  const [friends, setFriends] = useState<User[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadFriendsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [friendsList, received, sent] = await Promise.all([
        friendsApi.getFriends(),
        friendsApi.getReceivedRequests(),
        friendsApi.getSentRequests(),
      ]);
      setFriends(friendsList);
      setReceivedRequests(received);
      setSentRequests(sent);
    } catch (error) {
      console.error("Failed to load friends data", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendFriendRequest = async (userId: number) => {
    try {
      await friendsApi.sendRequest(userId);
      await loadFriendsData();
    } catch (error) {
      console.error("Failed to send friend request", error);
      throw error;
    }
  };

  const acceptRequest = async (requestId: number) => {
    try {
      await friendsApi.respondToRequest(requestId, FriendStatus.ACCEPTED);
      await loadFriendsData(); // List refresh
    } catch (error) {
      console.error("Failed to accept request", error);
    }
  };

  const rejectRequest = async (requestId: number) => {
    try {
      await friendsApi.respondToRequest(requestId, FriendStatus.REJECTED);
      setReceivedRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (error) {
      console.error("Failed to reject request", error);
    }
  };

  const cancelRequest = async (requestId: number) => {
    try {
      await friendsApi.removeFriend(requestId);
      setSentRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (error) {
      console.error("Failed to cancel request", error);
    }
  };

  const deleteFriendship = async (friendshipId: number) => {
    try {
      await friendsApi.removeFriend(friendshipId);
      await loadFriendsData();
    } catch (error) {
      console.error("Failed to remove friend", error);
    }
  };

  useEffect(() => {
    loadFriendsData();
  }, [loadFriendsData]);

  return {
    friends,
    receivedRequests,
    sentRequests,
    isLoading,
    sendFriendRequest,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    deleteFriendship,
    refreshFriends: loadFriendsData,
  };
};
