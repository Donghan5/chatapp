import { axiosInstance } from "../../../lib/axios";
import { User } from "@chatapp/common-types";

export enum FriendStatus {
  PENDING = "PENGING",
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
    const { data } = await axiosInstance.get<User[]>("/friends");
    return data;
  },

  getReceivedRequests: async () => {
    const { data } = await axiosInstance.get<FriendRequest[]>(
      "/friends/requests/received",
    );
    return data;
  },

  sendRequest: async (recipientId: number) => {
    const { data } = await axiosInstance.post("/friends/request", {
      recipientId,
    });
    return data;
  },

  responseToRequest: async (requestId: number, status: FriendStatus) => {
    const { data } = await axiosInstance.patch(
      `/frineds/request/${requestId}`,
      { status },
    );
    return data;
  },

  removeFriend: async (id: number) => {
    const { data } = await axiosInstance.delete(`/friends/${id}`);
    return data;
  },
};
