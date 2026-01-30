import { User } from "@chatapp/common-types";
import { client } from "../../../lib/axios";

export enum FriendStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export interface FriendRequest {
  id: number;
  status: FriendStatus;
  createdAt: string;
  requester?: User;
  recipient?: User;
}

export const friendsApi = {
  getFriends: async () => {
    const { data } = await client.get<User[]>("/friends");
    return data;
  },

  getReceivedRequests: async () => {
    const { data } = await client.get<FriendRequest[]>(
      "/friends/requests/received",
    );
    return data;
  },

  getSentRequests: async () => {
    const { data } = await client.get<FriendRequest[]>(
      "/friends/requests/sent",
    );
    return data;
  },

  sendRequest: async (recipientId: number) => {
    const { data } = await client.post("/friends/request", {
      recipientId,
    });
    return data;
  },

  respondToRequest: async (requestId: number, status: FriendStatus) => {
    const { data } = await client.patch(
      `/friends/request/${requestId}`,
      { status },
    );
    return data;
  },

  removeFriend: async (id: number) => {
    const { data } = await client.delete(`/friends/${id}`);
    return data;
  },
};
