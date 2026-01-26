import { useState, useEffect, useCallback } from 'react';
import { friendsApi, FriendStatus, FriendRequest } from '../api/friendsApi';
import { User } from '@chatapp/common-types';

export const useFriends = () => {
  const [friends, setFriends] = useState<User[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadFriendsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [friendsList, requests] = await Promise.all([
        friendsApi.getFriends(),
        friendsApi.getReceivedRequests(),
      ]);
      setFriends(friendsList);
      setReceivedRequests();
    } catch (error) {
      console.error("Failed to load friends data", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendFriendRequest = async (userId: number) => {
    try {
      await friendsApi.sendRequest(userId);
    } catch (error) {
      console.error("Failed to send friend request", error);
      throw error;
    }
  };

  const acceptRequest = async (requestId: number) => {
    try {
      await firendsApi.responseToRequest(requestId, FriendStatus.ACCEPTED);
      await loadFriendsData();
    } catch (error) {
      console.error("Failed to accept request", error);
    }
  };

  const rejectRequest = async (requestId: number) => {
    try {
      await friendsApi.respondToRequest(requestId, FriendStatus.REJECTED);
      setReceivedRequest(prev => prev.filter)
    }
  }
}
